import { Navigate, useLocation } from "react-router-dom";

const isTokenExpired = (t?: string | null) => {
  if (!t) return true;
  try {
    const payload = JSON.parse(atob(t.split(".")[1]));
    const exp = payload?.exp;
    return typeof exp !== "number" || Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }  
  return children;
}
