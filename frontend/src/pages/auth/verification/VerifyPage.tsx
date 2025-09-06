import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../api";

export default function VerifyPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading"|"ok"|"fail">("loading");
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/verify_email", { params: { token } });
        if (res.data?.ok) {
          setStatus("ok");
          setMessage(res.data?.message || "Verification successful");
        } else {
          setStatus("fail");
          setMessage(res.data?.message || "Verification failed");
        }
      } catch (err: any) {
        setStatus("fail");
        setMessage(err?.response?.data?.message || "Verification failed");
      }
    };
    if (token) run();
    else { setStatus("fail"); setMessage("Invalid verification link"); }
  }, [token]);

  return (
    <div>
      {status === "loading" && <p>Verifying your email…</p>}
      {status === "ok" && (
        <>
          <h2>✅ Email Verified</h2>
          <p>{message}</p>
        </>
      )}
      {status === "fail" && (
        <>
          <h2>❌ Verification Failed</h2>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}
