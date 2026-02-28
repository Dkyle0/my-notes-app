/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "prism-react-renderer" {
  import type { ComponentType, ReactNode } from "react";
  export const Highlight: ComponentType<{
    code: string;
    language: string;
    theme?: object;
    children: (props: unknown) => ReactNode;
  }>;
  export const themes: Record<string, object>;
}
