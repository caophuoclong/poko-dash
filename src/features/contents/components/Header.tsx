type Props = {
  ideasLength?: number
  dirtyCount?: number
  draftCount?: number
  approvedCount?: number
}

export default function Header({
  dirtyCount = 0,
  draftCount = 0,
  approvedCount = 0,
  ideasLength = 0,
}: Props) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h1 className="font-display text-xl font-bold text-near-white tracking-tight">
          Nội dung
        </h1>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-muted-text">{ideasLength} ý tưởng</span>
          {draftCount > 0 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-accent-blue-dim text-accent-blue">
              {draftCount} nháp
            </span>
          )}
          {approvedCount > 0 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-accent-green-dim text-accent-green">
              {approvedCount} duyệt
            </span>
          )}
          {dirtyCount > 0 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-accent-yellow/10 text-accent-yellow">
              {dirtyCount} chưa lưu
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
