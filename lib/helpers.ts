import { createElement, CSSProperties, JSX } from "react";
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";

interface IHTMLModifier {
  matcher: string;
  style?: CSSProperties;
  element: JSX.Element;
}

// Newline Parser
export const newLineToHTML = (str: string) => {
  return (str || "")?.replace(/\n/g, "<br />")?.replace(/\\n/g, "<br />");
};

// HTML Parse
export const html = (str?: string, modifier?: IHTMLModifier) => {
  if (!str) return str;
  const newLine = newLineToHTML(str);

  const options: HTMLReactParserOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replace(domNode: any) {
      // parse external links
      const target = domNode?.attribs?.["data-show"];
      if (target === "new") {
        domNode.attribs.target = "_blank";
      }

      // modifier
      if (modifier?.matcher && modifier?.element) {
        if (modifier?.matcher === domNode?.name) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const props: Record<string, any> = {};
          if (domNode.attribs) {
            Object.keys(domNode.attribs).forEach((key) => {
              props[key] = domNode.attribs[key];
            });
          }
          if (modifier?.style) props.style = modifier.style;
          return createElement(
            domNode.name,
            props,
            domToReact(domNode.children),
            modifier.element
          );
        }
      }

      return domNode;
    },
  };

  return parse(newLine, options);
};

export function formatDate(date: string | Date): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "Invalid date";

  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000; // seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
