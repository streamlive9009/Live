import { AgoraSetupGuide } from "@/components/agora-setup-guide"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Live Streaming Setup</h1>
          <p className="text-gray-600">Configure Agora SDK to enable real-time video streaming</p>
        </div>

        <AgoraSetupGuide />
      </div>
    </div>
  )
}
