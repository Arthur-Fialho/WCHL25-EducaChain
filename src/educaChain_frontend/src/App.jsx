
import * as React from 'react';
import { educaChain_backend } from '../../declarations/educaChain_backend';

const App = () => {
  const [btcAddress, setBtcAddress] = React.useState('');

  React.useEffect(() => {
    educaChain_backend.getBtcAddress().then(addr => {
      setBtcAddress(addr);
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>EducaChain: Decentralized Micro-Scholarships</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>For Donors</h2>
        <p>Donate BTC to support students:</p>
        <p><strong>{btcAddress}</strong></p>
        <button onClick={() => educaChain_backend.donate().then(alert)}>Donate</button>
      </div>

      <div>
        <h2>For Students</h2>
        <p>Request a micro-scholarship:</p>
        <button onClick={() => educaChain_backend.requestScholarship().then(alert)}>Request Scholarship</button>
      </div>
    </div>
  );
};

export default App;
