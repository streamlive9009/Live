import { SecureModeSetup } from "@/components/secure-mode-setup"

export default function SecureSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upgrade to Secure Mode</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Implement enterprise-grade security with token-based authentication for your live streaming platform. This
            guide will walk you through enabling Secure Mode and implementing automatic token management.
          </p>
        </div>

        <SecureModeSetup />
      </div>
    </div>
  )
}
