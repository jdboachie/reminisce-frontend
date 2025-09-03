'use client';

import { useState } from 'react';
import { API_CONFIG } from '../../config/api';

export default function DebugAuthPage() {
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('testpass');
  const [endpoint, setEndpoint] = useState('/auth/signup');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [payloadFormat, setPayloadFormat] = useState('standard');

  const testEndpoint = async () => {
    setLoading(true);
    setResult('');

    try {
      let payload;
      
      switch (payloadFormat) {
        case 'standard':
          payload = { username, password };
          break;
        case 'withEmail':
          payload = { username, password, email: 'test@example.com' };
          break;
        case 'differentFields':
          payload = { user: username, pass: password };
          break;
        case 'nested':
          payload = { user: { name: username, pass: password } };
          break;
        default:
          payload = { username, password };
      }

      console.log('Sending payload:', payload);
      console.log('To endpoint:', `${API_CONFIG.BASE_URL}${endpoint}`);

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      setResult(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseData,
        url: `${API_CONFIG.BASE_URL}${endpoint}`,
        sentPayload: payload,
        payloadFormat
      }, null, 2));

    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Auth Endpoint Debug
        </h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint
            </label>
            <select
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="/auth/signup">/auth/signup</option>
              <option value="/auth/signin">/auth/signin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payload Format
            </label>
            <select
              value={payloadFormat}
              onChange={(e) => setPayloadFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard: {username: "test", password: "test"}</option>
              <option value="withEmail">With Email: {username: "test", password: "test", email: "test@example.com"}</option>
              <option value="differentFields">Different Fields: {user: "test", pass: "test"}</option>
              <option value="nested">Nested: {user: {name: "test", pass: "test"}}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={testEndpoint}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Endpoint'}
          </button>
        </div>
        
        {result && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Response:</h3>
            <pre className="text-xs text-gray-600 overflow-auto max-h-96">
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
