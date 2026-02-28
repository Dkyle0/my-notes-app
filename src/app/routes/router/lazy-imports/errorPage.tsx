import { lazy } from "react";

export const ErrorPage = lazy(() =>
  import("../../../../pages/error/error").then((module) => ({
    default: module.Error,
  }))
);
