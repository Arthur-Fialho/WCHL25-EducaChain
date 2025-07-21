import React, { useState } from "react";
import { backend } from "../../../declarations/backend";

const RegisterStudent: React.FC = () => {
  const [btcAddress, setBtcAddress] = useState("");
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
      alert("Registration successful!");
    } catch (err) {
      setError("Failed to register. " + (err as Error).message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <h2 className="mb-4 text-2xl font-bold">Register as a Student</h2>
      {success ? (
        <p className="text-green-500">You have been registered successfully!</p>
      ) : (
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="btcAddress"
              className="mb-2 block text-sm font-medium"
            >
              Your Bitcoin Address
            </label>
            <input
              id="btcAddress"
              type="text"
              value={btcAddress}
              onChange={(e) => setBtcAddress(e.target.value)}
              className="w-full rounded border border-gray-600 bg-gray-700 p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default RegisterStudent;
