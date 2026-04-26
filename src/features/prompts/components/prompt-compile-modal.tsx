import * as React from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { useCompilePrompt, useRecordPromptUsage } from "../hooks/use-prompts";
import type { Prompt } from '../types';

function decodeTemplate(raw: string): string {
  return raw.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

interface PromptCompileModalProps {
  prompt: Prompt | null;
  open: boolean;
  onClose: () => void;
}

export default function PromptCompileModal({
  prompt,
  open,
  onClose,
}: PromptCompileModalProps) {
  const [variables, setVariables] = React.useState<Record<string, string>>({});
  const [compiled, setCompiled] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const compilePrompt = useCompilePrompt();
  const recordUsage = useRecordPromptUsage();
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!prompt) return;
    const initial: Record<string, string> = {};
    (prompt.variables ?? []).forEach((v) => { initial[v] = ""; });
    setVariables(initial);
    setCompiled("");
  }, [prompt]);

  React.useEffect(() => {
    if (!prompt) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const allFilled = (prompt.variables ?? []).every((v) => variables[v]?.trim());
    if (!allFilled) {
      let preview = decodeTemplate(prompt.template);
      Object.entries(variables).forEach(([k, val]) => {
        if (val) preview = preview.replaceAll(`{{${k}}}`, val);
      });
      setCompiled(preview);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await compilePrompt.mutateAsync({
          promptId: prompt.promptId,
          data: { variables },
        });
        setCompiled(res.compiled);
      } catch {
        let preview = decodeTemplate(prompt.template);
        Object.entries(variables).forEach(([k, val]) => {
          preview = preview.replaceAll(`{{${k}}}`, val);
        });
        setCompiled(preview);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [variables, prompt]);

  async function handleUse() {
    if (!prompt) return;
    await recordUsage.mutateAsync(prompt.promptId);
    await handleCopy();
    onClose();
  }

  async function handleCopy() {
    if (!compiled) return;
    await navigator.clipboard.writeText(compiled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!prompt) return null;

  const vars = prompt.variables ?? [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-surface border-frost text-near-white">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-near-white">
            Use Prompt: <span className="text-accent-blue">{prompt.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-5 min-h-0 flex-1 overflow-hidden">
          {/* Left column: Template + Variables */}
          <div className="flex flex-col min-h-0">
            <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-2 shrink-0">
              Template &amp; Variables
            </p>
            <div className="bg-surface-2 border border-frost rounded-lg px-3 py-3 flex-1 min-h-[200px] overflow-y-auto">
              <p className="text-xs font-mono text-muted-text leading-relaxed whitespace-pre-wrap">
                {decodeTemplate(prompt.template)}
              </p>
              {vars.length > 0 && (
                <div className="mt-4 pt-4 border-t border-frost flex flex-col gap-2">
                  {vars.map((v) => (
                    <div key={v} className="flex items-center gap-3">
                      <label className="text-xs font-mono text-accent-blue w-28 shrink-0">
                        {`{{${v}}}`}
                      </label>
                      <Input
                        placeholder={`Enter ${v}…`}
                        value={variables[v] ?? ""}
                        onChange={(e) =>
                          setVariables((prev) => ({ ...prev, [v]: e.target.value }))
                        }
                        className="flex-1 bg-surface-2 border-frost text-near-white placeholder:text-muted-text text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Compiled Output */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <p className="text-xs font-semibold text-muted-text uppercase tracking-wider">
                Compiled Output
              </p>
              <Button
                size="xs"
                variant="ghost"
                onClick={handleCopy}
                disabled={!compiled}
                className="text-muted-text hover:text-near-white gap-1"
              >
                {copied ? (
                  <><Check className="size-3 text-accent-green" /> Copied</>
                ) : (
                  <><Copy className="size-3" /> Copy</>
                )}
              </Button>
            </div>
            <div className="bg-surface-2 border border-frost rounded-lg px-3 py-3 flex-1 min-h-[200px] overflow-y-auto relative">
              {compilePrompt.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-2/80 rounded-lg">
                  <Loader2 className="size-4 animate-spin text-accent-blue" />
                </div>
              )}
              <p className="text-sm text-near-white leading-relaxed whitespace-pre-wrap">
                {compiled || (
                  <span className="text-muted-text italic">
                    Fill in variables above to see the compiled prompt…
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={onClose} className="border-frost text-muted-text">
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={handleUse}
            disabled={recordUsage.isPending}
          >
            {recordUsage.isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Recording…</>
            ) : (
              "Use & Record Usage"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
