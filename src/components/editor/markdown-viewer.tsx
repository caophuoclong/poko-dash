import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface MarkdownViewerProps {
  content: string
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="text-2xl font-bold text-near-white mb-4 mt-6 first:mt-0"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-xl font-semibold text-near-white mb-3 mt-5 first:mt-0"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-lg font-medium text-near-white mb-2 mt-4 first:mt-0"
              {...props}
            />
          ),
          h4: ({ ...props }) => (
            <h4
              className="text-base font-medium text-near-white mb-2 mt-3 first:mt-0"
              {...props}
            />
          ),
          h5: ({ ...props }) => (
            <h5
              className="text-sm font-medium text-near-white mb-2 mt-3 first:mt-0"
              {...props}
            />
          ),
          h6: ({ ...props }) => (
            <h6
              className="text-sm font-medium text-muted-text mb-2 mt-3 first:mt-0"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p className="text-near-white mb-3 leading-relaxed" {...props} />
          ),
          a: ({ ...props }) => (
            <a
              className="text-accent-blue hover:underline cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc pl-6 mb-3 text-near-white" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal pl-6 mb-3 text-near-white" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="my-1 leading-relaxed" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-frost pl-4 italic text-muted-text my-4"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  className="bg-surface-2 text-accent-blue px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className={`block bg-surface-2 text-near-white p-4 rounded-lg overflow-x-auto font-mono text-sm ${className || ''}`}
                {...props}
              >
                {children}
              </code>
            )
          },
          pre: ({ ...props }) => (
            <pre
              className="bg-surface-2 rounded-lg mb-4 overflow-hidden"
              {...props}
            />
          ),
          img: ({ ...props }) => (
            <img
              className="rounded-lg border border-frost max-w-full h-auto my-4"
              loading="lazy"
              {...props}
            />
          ),
          hr: ({ ...props }) => <hr className="border-frost my-6" {...props} />,
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full border border-frost rounded-lg"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-surface-2" {...props} />
          ),
          th: ({ ...props }) => (
            <th
              className="border border-frost px-4 py-2 text-left text-near-white font-semibold"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td
              className="border border-frost px-4 py-2 text-near-white"
              {...props}
            />
          ),
          strong: ({ ...props }) => (
            <strong className="font-semibold text-near-white" {...props} />
          ),
          em: ({ ...props }) => (
            <em className="italic text-near-white" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
