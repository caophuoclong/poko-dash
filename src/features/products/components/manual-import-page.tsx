import * as React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { usePageHeader } from '#/components/ui/page-header-context'
import {
  SectionCard,
  SectionCardHeader,
  SectionCardBody,
} from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { useManualImport } from '../hooks/use-products'
import type { ShopeeProductData } from '../types/manual-import'
import { cn } from '#/shared/utils'
import {
  Check,
  ClipboardCopy,
  ArrowLeft,
  Upload,
  Loader2,
  RotateCcw,
} from 'lucide-react'

const EXTRACT_SCRIPT = `copy((() => {
  const result = {};
  result.info = {
    name: document.querySelector('h1.vR6K3w, ._44qnta span, h1[class*="product-name"]')?.innerText?.trim()
      || document.title.split('|')[0].trim(),
    price: document.querySelector('.IZPeQz.B67UQ0, ._3n5NQx, [class*="price"] ._3_ISdg')?.innerText?.trim() || '',
    rating: document.querySelector('.dQEiAI.jMXp4d, .F9RHbS.dQEiAI')?.innerText?.trim() || '',
    sold: document.querySelector('.AcmPRb')?.innerText?.trim() || '',
    stock: (() => {
      const els = [...document.querySelectorAll('.OaFP0p div')];
      const el = els.find(e => e.innerText?.includes('sản phẩm'));
      return el?.innerText?.trim() || '';
    })(),
    variants: [...document.querySelectorAll('.sApkZm .ZivAAW')].map(el => el.innerText.trim()),
    shipping: [...document.querySelectorAll('.O3NAB1 span')].map(el => el.innerText.trim()).filter(Boolean),
  };
  const videoEl = document.querySelector('video.tpgcVs, ._OguPS video');
  result.preview = {
    video: videoEl?.src || videoEl?.getAttribute('src') || '',
    images: [...document.querySelectorAll('._OguPS .YM40Nc img, .product-image__item img, ._3klkr8 img, .h5yFph img')]
      .map(img => img.src || img.dataset.src)
      .filter(Boolean)
      .map(src => src.replace(/@resize_w\\d+_nl(\\.\\w+)?/, '')),
  };
  result.details = {};
  const detailRows = document.querySelectorAll('.ybxj32');
  detailRows.forEach(row => {
    const key = row.querySelector('.VJOnTD')?.innerText?.trim();
    if (!key) return;
    if (key === 'Danh Mục') {
      const links = [...row.querySelectorAll('a.EtYbJs')];
      result.details[key] = links.map(a => a.innerText.trim()).filter(Boolean);
      return;
    }
    const linkVal = row.querySelector('a.Dgs_Bt');
    if (linkVal) { result.details[key] = linkVal.innerText.trim(); return; }
    const valEl = row.querySelector('.VJOnTD + div, .VJOnTD ~ div');
    if (valEl) { result.details[key] = valEl.innerText.trim(); }
  });
  const descSection = document.querySelector('.I_DV_3, [class*="product-detail"]');
  result.descriptions = {
    text: [...document.querySelectorAll('.QN2lPu')]
      .map(p => p.innerText.trim())
      .filter(t => t.length > 0)
      .join('\\n'),
    images: descSection
      ? [...descSection.querySelectorAll('img')]
          .map(img => img.src || img.dataset.src)
          .filter(Boolean)
          .map(src => src.replace(/@resize_w\\d+_nl(\\.\\w+)?/, ''))
      : [],
  };
  result.url = location.href;
  return JSON.stringify(result, null, 2);
})());`

type Step = 1 | 2

export default function ManualImportPage() {
  return <ManualImportInner />
}

function ManualImportInner() {
  const [step, setStep] = useState<Step>(1)
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [jsonText, setJsonText] = useState('')
  const [parsedProduct, setParsedProduct] = useState<ShopeeProductData | null>(
    null,
  )

  const affiliateInputRef = useRef<HTMLInputElement>(null)
  const jsonAreaRef = useRef<HTMLTextAreaElement>(null)

  const stepRef = useRef(step)
  const affiliateUrlRef = useRef(affiliateUrl)
  useEffect(() => {
    stepRef.current = step
  }, [step])
  useEffect(() => {
    affiliateUrlRef.current = affiliateUrl
  }, [affiliateUrl])

  const { mutate: runImport, isPending } = useManualImport()

  const parseJson = useCallback((raw: string): ShopeeProductData | null => {
    try {
      const data = JSON.parse(raw) as ShopeeProductData
      if (!data.url) return null
      return data
    } catch {
      return null
    }
  }, [])

  const copyScriptAndAdvance = useCallback(async (url: string) => {
    if (!url.trim()) return
    try {
      await navigator.clipboard.writeText(EXTRACT_SCRIPT)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = EXTRACT_SCRIPT
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    console.log(
      'Script đã copy vào clipboard! Mở trang Shopee → DevTools Console → Paste & Enter',
    )
    setStep(2)
    setTimeout(() => jsonAreaRef.current?.focus(), 100)
  }, [])

  const submit = useCallback(
    (product: ShopeeProductData, url: string) => {
      runImport(
        { affiliate_url: url, product_data: product },
        {
          onSuccess: (result) => {
            console.log(
              `Đã lưu "${result.product.canonical_title}"`,
              result.product.product_id,
            )
            reset()
          },
          onError: (err) => {
            console.error(`Lỗi: ${err.message}`)
          },
        },
      )
    },
    [runImport],
  )

  const reset = useCallback(() => {
    setAffiliateUrl('')
    setJsonText('')
    setParsedProduct(null)
    setStep(1)
    setTimeout(() => affiliateInputRef.current?.focus(), 100)
  }, [])

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const active = document.activeElement
      if (
        active === affiliateInputRef.current ||
        active === jsonAreaRef.current
      )
        return

      const text = e.clipboardData?.getData('text')?.trim() ?? ''
      if (!text) return
      e.preventDefault()

      if (stepRef.current === 1) {
        setAffiliateUrl(text)
        setTimeout(() => copyScriptAndAdvance(text), 50)
      } else {
        const product = parseJson(text)
        if (product) {
          setJsonText(text)
          setParsedProduct(product)
          submit(product, affiliateUrlRef.current)
        } else {
          setJsonText(text)
          jsonAreaRef.current?.focus()
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [copyScriptAndAdvance, parseJson, submit])

  const handleJsonChange = useCallback(
    (raw: string) => {
      setJsonText(raw)
      setParsedProduct(raw.trim() ? parseJson(raw) : null)
    },
    [parseJson],
  )

  const handleJsonPaste = useCallback(() => {
    setTimeout(() => {
      const raw = jsonAreaRef.current?.value ?? ''
      const product = parseJson(raw)
      if (product) {
        setParsedProduct(product)
        submit(product, affiliateUrlRef.current)
      }
    }, 50)
  }, [parseJson, submit])

  usePageHeader({
    title: 'Manual Import',
    subtitle: 'Import sản phẩm Shopee vào hệ thống qua 2 bước.',
    eyebrow: 'Sản phẩm',
    backHref: '/dash/products',
    backLabel: 'Sản phẩm',
    actions:
      affiliateUrl || jsonText ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="gap-1.5 text-muted-text"
        >
          <RotateCcw size={13} />
          Reset
        </Button>
      ) : undefined,
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <StepList step={step} />
      </div>

      {step === 1 ? (
        <Step1Card
          ref={affiliateInputRef}
          value={affiliateUrl}
          onChange={setAffiliateUrl}
          onPasteAndAdvance={copyScriptAndAdvance}
          onSubmit={() => copyScriptAndAdvance(affiliateUrl)}
        />
      ) : (
        <Step2Card
          ref={jsonAreaRef}
          value={jsonText}
          parsedProduct={parsedProduct}
          isPending={isPending}
          onChange={handleJsonChange}
          onPaste={handleJsonPaste}
          onBack={() => {
            setStep(1)
            setJsonText('')
            setParsedProduct(null)
          }}
          onSubmit={() => parsedProduct && submit(parsedProduct, affiliateUrl)}
        />
      )}

      <p className="mt-4 text-xs text-muted-text">
        <kbd className="px-1.5 py-0.5 rounded border border-frost bg-surface-2 font-mono text-[11px]">
          ⌘V
        </kbd>{' '}
        bất kỳ lúc nào để tự động điền và tiến lên bước tiếp theo.
      </p>
    </div>
  )
}

function StepList({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2">
      <StepPill
        number={1}
        label="Dán Affiliate Link"
        active={step === 1}
        done={step > 1}
      />
      <div className="h-px w-6 bg-frost shrink-0" />
      <StepPill
        number={2}
        label="Dán Product JSON"
        active={step === 2}
        done={false}
      />
    </div>
  )
}

function StepPill({
  number,
  label,
  active,
  done,
}: {
  number: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all',
        active && 'border-accent-blue/30 bg-accent-blue-dim text-near-white',
        done &&
          'border-accent-green-border bg-accent-green-dim text-accent-green',
        !active && !done && 'border-frost bg-surface text-muted-text',
      )}
    >
      <span
        className={cn(
          'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0',
          active && 'bg-accent-blue text-near-white',
          done && 'bg-accent-green text-near-white',
          !active && !done && 'bg-surface-2 text-muted-text',
        )}
      >
        {done ? <Check size={10} strokeWidth={3} /> : number}
      </span>
      {label}
    </div>
  )
}

interface Step1CardProps {
  value: string
  onChange: (v: string) => void
  onPasteAndAdvance: (url: string) => void
  onSubmit: () => void
}

const Step1Card = React.forwardRef<HTMLInputElement, Step1CardProps>(
  function Step1Card({ value, onChange, onPasteAndAdvance, onSubmit }, ref) {
    return (
      <SectionCard>
        <SectionCardHeader
          title="Bước 1: Dán Affiliate Link"
          description="Dán link affiliate Shopee. Script extract sẽ được copy vào clipboard để bạn chạy trên trang Shopee."
        />
        <SectionCardBody className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="affiliate-url"
              className="text-xs font-medium text-muted-text"
            >
              Affiliate URL
            </label>
            <Input
              ref={ref}
              id="affiliate-url"
              type="url"
              value={value}
              placeholder="https://s.shopee.vn/3B3SvP1eER"
              onChange={(e) => onChange(e.target.value)}
              onPaste={(e) => {
                const text = e.clipboardData.getData('text').trim()
                if (text) {
                  e.preventDefault()
                  onChange(text)
                  setTimeout(() => onPasteAndAdvance(text), 50)
                }
              }}
              autoFocus
            />
          </div>
          <Button
            disabled={!value.trim()}
            onClick={onSubmit}
            color="blue-dim"
            className="gap-2"
          >
            <ClipboardCopy size={14} />
            Copy Extract Script → Clipboard
          </Button>
        </SectionCardBody>
      </SectionCard>
    )
  },
)

interface Step2CardProps {
  value: string
  parsedProduct: ShopeeProductData | null
  isPending: boolean
  onChange: (v: string) => void
  onPaste: () => void
  onBack: () => void
  onSubmit: () => void
}

const Step2Card = React.forwardRef<HTMLTextAreaElement, Step2CardProps>(
  function Step2Card(
    { value, parsedProduct, isPending, onChange, onPaste, onBack, onSubmit },
    ref,
  ) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-accent-blue/20 bg-accent-blue-dim px-4 py-3 text-sm text-accent-blue">
          <ClipboardCopy size={14} className="mt-0.5 shrink-0" />
          <span>
            Script đã copy! Mở trang Shopee → DevTools Console → Paste &amp;
            Enter → quay lại đây paste kết quả.
          </span>
        </div>

        <SectionCard>
          <SectionCardHeader
            title="Bước 2: Dán Product JSON"
            description="Paste kết quả JSON từ DevTools Console Shopee vào đây."
          />
          <SectionCardBody className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="product-json"
                className="text-xs font-medium text-muted-text"
              >
                Product JSON
              </label>
              <Textarea
                ref={ref}
                id="product-json"
                value={value}
                placeholder={
                  '{ "info": { "name": "...", ... }, "url": "https://shopee.vn/...", ... }'
                }
                onChange={(e) => onChange(e.target.value)}
                onPaste={onPaste}
                rows={8}
                className="font-mono text-xs resize-y"
              />
            </div>

            {parsedProduct && <ProductPreview product={parsedProduct} />}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                size="sm"
                className="gap-2"
              >
                <ArrowLeft size={14} />
                Quay lại
              </Button>
              <Button
                disabled={!parsedProduct || isPending}
                onClick={onSubmit}
                color="blue-dim"
                size="sm"
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {isPending ? 'Đang lưu...' : 'Lưu vào hệ thống'}
              </Button>
            </div>
          </SectionCardBody>
        </SectionCard>
      </div>
    )
  },
)

function ProductPreview({ product }: { product: ShopeeProductData }) {
  const info = product.info
  const images = product.preview?.images ?? []
  const displayImages = images.slice(0, 6)
  const remaining = images.length - 6

  return (
    <div className="rounded-xl border border-frost bg-void p-4 space-y-1">
      <p className="text-[11px] font-medium text-muted-text uppercase tracking-wide mb-3">
        Xem trước
      </p>
      <PreviewRow label="Tên SP" value={info?.name} />
      <PreviewRow label="Giá" value={info?.price} />
      <PreviewRow label="Rating" value={info?.rating} />
      <PreviewRow label="Đã bán" value={info?.sold} />
      <PreviewRow label="URL" value={product.url} truncate />
      {displayImages.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-2">
          {displayImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              className="w-14 h-14 object-cover rounded-lg border border-frost"
            />
          ))}
          {remaining > 0 && (
            <div className="w-14 h-14 rounded-lg border border-frost bg-surface-2 flex items-center justify-center text-xs text-muted-text">
              +{remaining}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PreviewRow({
  label,
  value,
  truncate,
}: {
  label: string
  value?: string
  truncate?: boolean
}) {
  if (!value) return null
  return (
    <div className="flex gap-3 text-xs border-b border-frost py-1.5 last:border-0">
      <span className="text-muted-text shrink-0 w-16">{label}</span>
      <span className={cn('text-near-white', truncate && 'truncate min-w-0')}>
        {value}
      </span>
    </div>
  )
}
