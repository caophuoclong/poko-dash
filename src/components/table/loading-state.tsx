interface TableLoadingStateProps {
  message?: string;
}

export function TableLoadingState({ message = "Đang tải..." }: TableLoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center gap-3 text-muted-text">
        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path d="M12 2a10 10 0 019.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-xs">{message}</span>
      </div>
    </div>
  );
}
