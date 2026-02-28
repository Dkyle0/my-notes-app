import { Suspense } from "react";
import ErrorBoundary from "./error-boundary/errorBoundary";
import { internalPaths } from "../../../shared/constants/internal-paths";
import { Layout } from "../../../features/layout";
import { Loader } from "../../../shared/loader";
import { PrivateRoute } from "../../../entities/private-route";
import {
  ErrorPage,
  Main,
  Login,
  Notes,
} from "./lazy-imports/";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <Suspense fallback={<Loader />}>
        <ErrorPage title="Что-то пошло не так" />
      </Suspense>
    ),
    children: [
      {
        path: internalPaths.home,
        element: (
          <Suspense fallback={<Loader />}>
            <Main />
          </Suspense>
        ),
      },
      {
        path: internalPaths.login,
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/*",
        element: (
          <Suspense fallback={<Loader />}>
            <ErrorPage title="Такая страница не найдена." is404 />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: internalPaths.notes,
    element: (
      <PrivateRoute>
        <Suspense fallback={<Loader />}>
          <ErrorBoundary>
            <Notes />
          </ErrorBoundary>
        </Suspense>
      </PrivateRoute>
    ),
  },
];
