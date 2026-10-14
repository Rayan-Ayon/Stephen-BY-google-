import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RayanMessageFormatterProps {
  content: string;
  onCitationClick?: (href: string) => void;
}

export const RayanMessageFormatter: React.FC<RayanMessageFormatterProps> = ({ content, onCitationClick }) => {
  // Clean up any repeated prefix artifacts
  const cleanContent = content ? content.trim() : '';

  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-lg font-bold text-white mt-4 mb-2 tracking-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base font-semibold text-white mt-3 mb-1.5 tracking-tight border-b border-zinc-800 pb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm font-semibold text-emerald-400 mt-2.5 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2.5 leading-relaxed text-zinc-300" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside pl-4 mb-3 space-y-1 text-zinc-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside pl-4 mb-3 space-y-1 text-zinc-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="pl-1" {...props} />
          ),
          hr: () => (
            <hr className="border-t border-zinc-800/80 my-4" />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-emerald-500/50 bg-[#14171F] pl-3 py-1.5 my-2.5 rounded-r text-zinc-300 italic" {...props} />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            return isInline ? (
              <code className="bg-[#1C202B] text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-[#12141A] p-3 rounded-xl border border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-200 my-2" {...props}>
                {children}
              </code>
            );
          },
          a: ({ node, href, children, ...props }) => {
            const isDeepLink = href?.startsWith('#attempt/') || href?.startsWith('#rewrite/');
            if (isDeepLink) {
              return (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (href && onCitationClick) {
                      onCitationClick(href);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60 hover:text-emerald-300 transition-all cursor-pointer mx-1 shadow-sm"
                >
                  <span>🔍</span>
                  <span>{children}</span>
                </button>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline hover:text-emerald-300"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};

export default RayanMessageFormatter;
