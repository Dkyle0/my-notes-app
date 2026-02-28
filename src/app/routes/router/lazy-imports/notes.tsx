import { lazy } from "react";

export const Notes = lazy(() =>
  import("../../../../pages/notes").then((module) => ({
    default: module.Notes,
  }))
);
