'use client';

import { useState } from 'react';
import { API_CONFIG } from '../../config/api';

export default function TestBackendPage() {
  const [status, setStatus] = useState<string>('Click to test');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`✅ Backend connected successfully! Message: ${data.msg}`);
      } else {
        setStatus(`❌ Backend error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Backend Connection Test
        </h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Backend URL:</h3>
            <p className="text-sm text-gray-600 font-mono break-all">
              {API_CONFIG.BASE_URL}
            </p>
          </div>
          
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          
          <div className="bg-gray-50 p-4 rounded-lg min-h-[60px]">
            <h3 className="font-semibold text-gray-700 mb-2">Status:</h3>
            <p className="text-sm text-gray-600">{status}</p>
          </div>
        </div>
        
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

