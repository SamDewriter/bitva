import React, { useState } from "react";
import { AdminMenu } from "./components/AdminMenu";
import AdminSidebar from "./components/AdminSidebar";
import api from "../../api";

// TEMP auth hook — replace with your real auth
function useAuthUser() {
  const name = localStorage.getItem("bitva:name") || "Alex";
  const avatar = localStorage.getItem("bitva:avatar") || "";
  const access_token = localStorage.getItem("bitva:access_token");
  return { name, avatar, access_token };
}


export default function Broadcast() {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const { name, avatar, access_token } = useAuthUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const canSubmit = subject.trim().length > 0 && messageContent.trim().length > 0;

  const handleSendTest = async () => {
  setSubmitting(true);
  setError("");
  setSuccess("");

  const broadcast = {
    email,
    subject,
    message_content: messageContent,
  };
    try {
        await api.post(
        "/admin/send_test_broadcast/",
        broadcast,
        {
            headers: {
            Authorization: `Bearer ${access_token}`,
            },
        }
        );
        setSuccess("Test email sent successfully");
    } catch (error) {
        setError("Failed to send test email");
    } finally {
        setSubmitting(false);
    }
    };

  const handleSendBroadcast = async () => {
  setSubmitting(true);
  setError("");
  setSuccess("");
  const broadcast = {
    subject,
    message_content: messageContent,
  };

  try {
    await api.post(
      "/admin/send_broadcast/",
      broadcast,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    setSuccess("Broadcast sent successfully");
  } catch (error) {
    setError("Failed to send broadcast");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Dashboard Overview</h1>
          </div>
          <AdminMenu name={name} avatar={avatar} />
        </header>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Broadcast</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <div className="bg-white shadow rounded-lg p-6">
                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700">
                        Message Content
                      </label>
                      <textarea
                        id="messageContent"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        rows={4}
                        required
                      ></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                      <div className="flex-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Send Test To (your email)
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="your@email.com"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!canSubmit || !email || submitting}
                        onClick={handleSendTest}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          canSubmit && email
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {submitting ? "Sending..." : "Send Test Email"}
                      </button>
                      <button
                        type="button"
                        disabled={!canSubmit || submitting}
                        onClick={handleSendBroadcast}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          canSubmit
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                      >
                        {submitting ? "Sending..." : "Send Broadcast"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </main>
    </div>
  );
}