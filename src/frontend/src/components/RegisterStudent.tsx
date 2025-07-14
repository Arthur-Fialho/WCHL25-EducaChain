
import React, { useState } from 'react';
import { backend } from '../../../declarations/backend';

const RegisterStudent: React.FC = () => {
  const [btcAddress, setBtcAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await backend.register_student(btcAddress);
      setSuccess(true);
      alert('Registration successful!');
    } catch (err) {
      setError('Failed to register. ' + (err as Error).message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Register as a Student</h2>
      {success ? (
        <p className="text-green-500">You have been registered successfully!</p>
      ) : (
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="btcAddress" className="block text-sm font-medium mb-2">Your Bitcoin Address</label>
            <input
              id="btcAddress"
              type="text"
              value={btcAddress}
              onChange={(e) => setBtcAddress(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default RegisterStudent;
