import * as React from 'react';
import { backendService } from '../services/backendService';

export const ScholarFlowView = () => {
  const [btcAddress, setBtcAddress] = React.useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-xl p-10 space-y-8">
        <h1 className="text-5xl font-extrabold text-center text-blue-400 mb-6">ScholarFlow</h1>
        
        <section className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Democratizing Education Through Decentralized Micro-Scholarships</h2>
          <p className="text-lg leading-relaxed mb-4">
            ScholarFlow is a revolutionary platform built on the Internet Computer Protocol (ICP) that aims to democratize access to education globally. 
            By leveraging Bitcoin for transparent and flexible micro-financing, we connect generous donors with aspiring students worldwide.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Our mission is to break down financial barriers to learning, enabling individuals to pursue their educational goals and unlock their full potential.
            This initiative will foster a more educated and equitable global society, empowering countless lives through accessible knowledge.
          </p>
          <h3 className="text-2xl font-semibold mb-3">Key Functionalities:</h3>
          <ul className="list-disc list-inside text-left mx-auto max-w-md space-y-2">
            <li>
              <strong>Donor Module:</strong> A simple interface for donors to contribute Bitcoin, with transparent transaction tracking on the blockchain.
            </li>
            <li>
              <strong>Student Module:</strong> A streamlined process for students to request and receive micro-scholarships in Bitcoin, based on clear criteria.
            </li>
            <li>
              <strong>Smart Contracts (Canisters):</strong> Securely manage and distribute funds, ensuring immutable transaction records on the ICP.
            </li>
          </ul>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center text-blue-300 mb-6">For Donors</h2>
            <p className="text-md leading-relaxed mb-4 text-center">Support a student's education by donating Bitcoin:</p>
            <div className="bg-gray-900 p-4 rounded-md flex items-center justify-between mb-6">
              <span className="font-mono text-sm break-all">{btcAddress || 'Loading BTC Address...'}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(btcAddress)}
                className="ml-4 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md text-xs transition-colors"
              >
                Copy
              </button>
            </div>
            <button 
              onClick={handleDonate}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Donate Now
            </button>
          </div>

          <div className="bg-gray-700 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center text-green-300 mb-6">For Students</h2>
            <p className="text-md leading-relaxed mb-4 text-center">Request a micro-scholarship to fund your studies:</p>
            <button 
              onClick={handleRequestScholarship}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Request Scholarship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};