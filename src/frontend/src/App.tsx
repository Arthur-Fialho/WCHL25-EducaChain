import { ScholarFlowView } from "./views";
import { useState } from "react";

function App() {
  const [principalId, setPrincipalId] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ic && window.ic.plug) {
      try {
        const isConnected = await window.ic.plug.isConnected();
        if (!isConnected) {
          await window.ic.plug.requestConnect();
        }
        const principal = await window.ic.plug.agent.getPrincipal();
        setPrincipalId(principal.toText());
        alert("Plug Wallet connected! Principal: " + principal.toText());
      } catch (error) {
        console.error("Error connecting to Plug Wallet:", error);
        alert("Failed to connect to Plug Wallet.");
      }
    } else {
      alert("Plug Wallet is not installed. Please install it to connect.");
      window.open("https://plugwallet.ooo/", "_blank");
    }
  };

  const disconnectWallet = async () => {
    if (window.ic && window.ic.plug) {
      try {
        await window.ic.plug.disconnect();
        setPrincipalId(null);
        alert("Plug Wallet disconnected.");
      } catch (error) {
        console.error("Error disconnecting Plug Wallet:", error);
        alert("Failed to disconnect Plug Wallet.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8 text-center">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-blue-400">ScholarFlow</h1>
          {principalId ? (
            <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold">
                Connected: {principalId.substring(0, 8)}...
              </p>
              <button
                onClick={disconnectWallet}
                className="rounded-lg bg-red-600 px-4 py-2 text-lg font-semibold shadow-lg transition-colors hover:bg-red-700"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="rounded-lg bg-blue-600 px-4 py-2 text-lg font-semibold shadow-lg transition-colors hover:bg-blue-700"
            >
              Connect Plug Wallet
            </button>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* ScholarFlow Section */}
          <ScholarFlowView />
        </div>
      </div>
    </div>
  );
}

export default App;
