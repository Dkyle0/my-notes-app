import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/auth-provider";
import { internalPaths } from "../../shared/constants/internal-paths";

export function useSignInAndRedirect() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (email: string, password: string, onError: (err: string) => void) => {
    auth?.signin(email, password, (error) => {
      if (error) { onError(error); return; }
      navigate(from || internalPaths.notes, { replace: true });
    });
  };
}
