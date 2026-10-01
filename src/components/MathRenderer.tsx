import React, { useMemo } from 'react';
import katex from 'katex';

interface MathInlineProps {
  math: string;
  className?: string;
}

interface MathBlockProps {
  math: string;
  className?: string;
}

/**
 * Safely render inline LaTeX using KaTeX
 */
export const MathInline: React.FC<MathInlineProps> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <span
      className={`inline-math font-mono text-inherit ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Safely render display / block LaTeX using KaTeX
 */
export const MathBlock: React.FC<MathBlockProps> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <div
      className={`display-math my-2 text-center overflow-x-auto py-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Parse plain text or HTML string and replace inline $math$ and block $$math$$ with KaTeX
 */
export function renderMathInText(content: string): React.ReactNode {
  if (!content) return content;

  // Split on $$...$$ first, then $...$
  const blockParts = content.split(/(\$\$[\s\S]+?\$\$)/g);

  return blockParts.map((bPart, bIdx) => {
    if (bPart.startsWith('$$') && bPart.endsWith('$$')) {
      const expr = bPart.slice(2, -2).trim();
      return <MathBlock key={`b-${bIdx}`} math={expr} />;
    }

    // Now split on single $...$
    const inlineParts = bPart.split(/(\$[^$\n]+?\$)/g);
    return (
      <React.Fragment key={`b-frag-${bIdx}`}>
        {inlineParts.map((iPart, iIdx) => {
          if (iPart.startsWith('$') && iPart.endsWith('$') && iPart.length > 2) {
            const expr = iPart.slice(1, -1).trim();
            return <MathInline key={`i-${iIdx}`} math={expr} />;
          }

          // If contains HTML tags, render dangerously; otherwise as plain string
          if (/<[a-z][\s\S]*>/i.test(iPart)) {
            return (
              <span
                key={`h-${iIdx}`}
                dangerouslySetInnerHTML={{ __html: iPart }}
              />
            );
          }

          return iPart;
        })}
      </React.Fragment>
    );
  });
}
