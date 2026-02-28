import type { CSSProperties } from "react";
import { marked, lexer } from "marked";
import { Highlight, themes } from "prism-react-renderer";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content?.trim()) {
    return null;
  }

  const tokens = lexer(content);

  return (
    <div className="markdown-viewer">
      {tokens.map((token, i) => {
        const t = token as { type: string; text?: string; lang?: string; raw?: string };
        if (t.type === "code") {
          const { text = "", lang } = t;
          const language = (lang || "text").split(/[: ]/)[0];
          return (
            <Highlight
              key={`code-${i}`}
              theme={themes.vsDark}
              code={text}
              language={language}
            >
              {((props: unknown) => {
                const {
                  className,
                  style,
                  tokens: lineTokens,
                  getLineProps,
                  getTokenProps,
                } = props as {
                  className: string;
                  style: CSSProperties;
                  tokens: Array<Array<{ content: string }>>;
                  getLineProps: (opts: { line: unknown[]; key: number }) => object;
                  getTokenProps: (opts: { token: unknown; key: number }) => object;
                };
                return (
                <pre className={className} style={style}>
                  {lineTokens.map((line, lineIndex) => (
                    <div key={lineIndex} {...getLineProps({ line, key: lineIndex })}>
                      {line.map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token, key: tokenIndex })} />
                      ))}
                    </div>
                  ))}
                </pre>
                );
              })}
            </Highlight>
          );
        }
        const html = marked.parse(t.raw ?? "") as string;
        return (
          <div
            key={`block-${i}`}
            dangerouslySetInnerHTML={{ __html: html }}
            className="markdown-block"
          />
        );
      })}
    </div>
  );
}
