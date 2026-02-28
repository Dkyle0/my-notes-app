import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../../shared/auth-provider/auth-provider";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth?.user === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
