import { useState, useRef, useEffect } from "react";

interface TextCellProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: string;
  maxLines?: number;
  error?: string | null;
  disabled?: boolean;
}

function placeCaretAtEnd(el: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function TextCell({
  value,
  onChange,
  placeholder,
  width,
  maxLines = 3,
  error,
  disabled = false,
}: TextCellProps) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef(value);
  const [maxHeight, setMaxHeight] = useState<string | number>("auto");

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // Calculate maxHeight based on maxLines
      const styles = window.getComputedStyle(ref.current);
      const lineHeight = Number.parseFloat(styles.lineHeight) || 20;
      const padding =
        Number.parseFloat(styles.paddingTop) +
        Number.parseFloat(styles.paddingBottom);
      const calculatedMaxHeight = lineHeight * maxLines + padding;
      setMaxHeight(calculatedMaxHeight);
    }
  }, [editing, maxLines]);

  useEffect(() => {
    if (!editing) draftRef.current = value;
  }, [editing, value]);

  const beginEditing = () => {
    if (disabled) return;
    draftRef.current = value;
    setEditing(true);
    requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.innerText = value;
      placeCaretAtEnd(ref.current);
    });
  };

  if (editing) {
    return (
      <div ref={containerRef} className="flex flex-col gap-1">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              draftRef.current = value;
              setEditing(false);
              return;
            }
          }}
          onInput={(e) => {
            const raw = e.currentTarget.innerText;
            draftRef.current = raw;
          }}
          onBlur={() => {
            setEditing(false);
            if (draftRef.current !== value) onChange(draftRef.current);
          }}
          className={`text-cell-scrollable w-full bg-void/50 text-sm text-near-white rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent-blue/50 border ${
            error ? "border-accent-red/50" : "border-accent-blue/30"
          } whitespace-pre-wrap wrap-break-word min-h-7.5`}
          style={
            width
              ? {
                  maxWidth: width,
                  overflowY: "auto",
                  maxHeight: maxHeight,
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--scrollbar-thumb) transparent",
                }
              : {
                  overflowY: "auto",
                  maxHeight: maxHeight,
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--scrollbar-thumb) transparent",
                }
          }
        />
        {error && (
          <span className="text-xs text-accent-red leading-tight">{error}</span>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={beginEditing}
      className={`rounded-md px-2 py-1 -mx-2 -my-1 min-h-7 ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-text hover:bg-frost/5 transition-colors"
      }`}
      style={width ? { maxWidth: width } : undefined}
    >
      <span
        className={
          value
            ? "text-sm text-near-white whitespace-pre-wrap wrap-break-word"
            : "text-sm text-dark-muted italic"
        }
        style={
          value
            ? {
                display: "-webkit-box",
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
      >
        {value || placeholder || "—"}
      </span>
    </div>
  );
}
