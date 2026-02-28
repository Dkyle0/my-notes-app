import { lazy } from "react";

export const Main = lazy(() =>
  import("../../../../pages/main").then((module) => ({
    default: module.Main,
  }))
);
