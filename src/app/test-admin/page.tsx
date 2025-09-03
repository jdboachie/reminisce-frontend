'use client';

import { useState } from 'react';
import { authAPI } from '../../utils';

export default function TestAdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState<'signup' | 'signin'>('signup');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      if (action === 'signup') {
        const response = await authAPI.signup(username, password);
        setResult(`✅ Signup successful! Welcome ${response.username}`);
      } else {
        const response = await authAPI.signin(username, password);
        setResult(`✅ Signin successful! Token: ${response.token.substring(0, 50)}...`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Admin Authentication Test
        </h1>
        
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setAction('signup')}
              className={`flex-1 px-4 py-2 rounded-lg ${
                action === 'signup' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Test Signup
            </button>
            <button
              onClick={() => setAction('signin')}
              className={`flex-1 px-4 py-2 rounded-lg ${
                action === 'signin' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Test Signin
            </button>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            {action === 'signup' 
              ? 'Test creating a new admin account' 
              : 'Test signing in with existing credentials'
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
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
              placeholder="Enter password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : `Test ${action === 'signup' ? 'Signup' : 'Signin'}`}
          </button>
        </form>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Result:</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{result}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm underline"
          >
            ← Back to  Landing page
          </a>
        </div>
      </div>
    </div>
  );
}

