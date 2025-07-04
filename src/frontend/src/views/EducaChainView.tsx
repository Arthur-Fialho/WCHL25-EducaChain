
import * as React from 'react';
import { backendService } from '../services/backendService';

export const EducaChainView = () => {
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
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">EducaChain</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">For Donors</h3>
        <p className="mb-2">Donate BTC to support students:</p>
        <p className="font-mono bg-gray-800 p-2 rounded">{btcAddress || 'Loading...'}</p>
        <button 
          onClick={handleDonate}
          className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
        >
          Donate
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">For Students</h3>
        <p className="mb-2">Request a micro-scholarship:</p>
        <button 
          onClick={handleRequestScholarship}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition-colors"
        >
          Request Scholarship
        </button>
      </div>
    </div>
  );
};
