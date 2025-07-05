import * as React from "react";
import { backendService } from "../services/backendService";

export const ScholarFlowView = () => {
  const [btcAddress, setBtcAddress] = React.useState("");

  const fetchBtcAddress = async () => {
    try {
      const addr = await backendService.getBtcAddress();
      setBtcAddress(addr);
    } catch (error) {
      console.error("Error fetching BTC address:", error);
    }
  };

  React.useEffect(() => {
    fetchBtcAddress();
  }, []);

  const handleDonate = async () => {
    try {
      const result = await backendService.donate();
      alert(result);
    } catch (error) {
      console.error("Error donating:", error);
      alert("Donation failed.");
    }
  };

  const handleRequestScholarship = async () => {
    try {
      const result = await backendService.requestScholarship();
      alert(result);
    } catch (error) {
      console.error("Error requesting scholarship:", error);
      alert("Scholarship request failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-8 text-white">
      <div className="w-full max-w-4xl space-y-8 rounded-lg bg-gray-800 p-10 shadow-xl">
        <h1 className="mb-6 text-center text-5xl font-extrabold text-blue-400">
          ScholarFlow
        </h1>

        <section className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Democratizing Education Through Decentralized Micro-Scholarships
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            ScholarFlow is a revolutionary platform built on the Internet
            Computer Protocol (ICP) that aims to democratize access to education
            globally. By leveraging Bitcoin for transparent and flexible
            micro-financing, we connect generous donors with aspiring students
            worldwide.
          </p>
          <p className="mb-6 text-lg leading-relaxed">
            Our mission is to break down financial barriers to learning,
            enabling individuals to pursue their educational goals and unlock
            their full potential. This initiative will foster a more educated
            and equitable global society, empowering countless lives through
            accessible knowledge.
          </p>
          <h3 className="mb-3 text-2xl font-semibold">Key Functionalities:</h3>
          <ul className="mx-auto max-w-md list-inside list-disc space-y-2 text-left">
            <li>
              <strong>Donor Module:</strong> A simple interface for donors to
              contribute Bitcoin, with transparent transaction tracking on the
              blockchain.
            </li>
            <li>
              <strong>Student Module:</strong> A streamlined process for
              students to request and receive micro-scholarships in Bitcoin,
              based on clear criteria.
            </li>
            <li>
              <strong>Smart Contracts (Canisters):</strong> Securely manage and
              distribute funds, ensuring immutable transaction records on the
              ICP.
            </li>
          </ul>
        </section>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-gray-700 p-8 shadow-md">
            <h2 className="mb-6 text-center text-3xl font-bold text-blue-300">
              For Donors
            </h2>
            <p className="text-md mb-4 text-center leading-relaxed">
              Support a student's education by donating Bitcoin:
            </p>
            <div className="mb-6 flex items-center justify-between rounded-md bg-gray-900 p-4">
              <span className="font-mono text-sm break-all">
                {btcAddress || "Loading BTC Address..."}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(btcAddress)}
                className="ml-4 rounded-md bg-gray-600 px-3 py-1 text-xs transition-colors hover:bg-gray-500"
              >
                Copy
              </button>
            </div>
            <button
              onClick={handleDonate}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold shadow-lg transition-colors hover:bg-blue-700"
            >
              Donate Now
            </button>
          </div>

          <div className="rounded-lg bg-gray-700 p-8 shadow-md">
            <h2 className="mb-6 text-center text-3xl font-bold text-green-300">
              For Students
            </h2>
            <p className="text-md mb-4 text-center leading-relaxed">
              Request a micro-scholarship to fund your studies:
            </p>
            <button
              onClick={handleRequestScholarship}
              className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold shadow-lg transition-colors hover:bg-green-700"
            >
              Request Scholarship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
