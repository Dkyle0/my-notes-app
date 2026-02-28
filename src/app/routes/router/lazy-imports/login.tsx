import { lazy } from "react";

export const Login = lazy(() =>
  import("../../../../pages/login-page").then((module) => ({
    default: module.Login,
  }))
);
