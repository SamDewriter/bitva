import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api";

export default function VerifyEmailGate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get("token");
    if (!token) {
      navigate("/verify/failed", { replace: true, state: { reason: "Missing token" } });
      return;
    }

    (async () => {
      // IMPORTANT: resolve all statuses so interceptors / validateStatus don't throw
      const res = await api.get(`/verify_email?token=${encodeURIComponent(token)}`, {
        validateStatus: () => true,
      });

      // log for sanity while debugging
      console.log("verify status:", res.status, "data:", res.data);

      // Treat any 2xx as success
      if (res.status >= 200 && res.status < 300) {
        navigate("/verify/success", { replace: true });
        return;
      }

      // Gracefully accept already-verified responses even if backend returns 4xx
      const msg = (res.data?.detail || res.data?.status || "").toString().toLowerCase();
      if (
        msg.includes("already verified") ||
        msg.includes("already-verified") ||
        msg.includes("verified already")
      ) {
        navigate("/verify/success", { replace: true });
        return;
      }

      navigate("/verify/failed", {
        replace: true,
        state: { reason: res.data?.detail || `Verification failed (HTTP ${res.status}).` },
      });
    })();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen grid place-content-center text-gray-600">
      Verifying your email…
    </div>
  );
}
