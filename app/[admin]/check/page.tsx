'use client';

import { useUser } from '@clerk/nextjs';
import { checkIsAdmin, setUserAsAdmin } from '@/app/lib/actions';
import { useState } from 'react';

export default function AdminCheck() {
  const { user } = useUser();
  const [message, setMessage] = useState<string>('');

  const makeAdmin = async () => {
    if (!user) {
      setMessage('Please sign in first');
      return;
    }

    console.log('Setting as admin:', user.id);
    const result = await setUserAsAdmin(user.id, user.emailAddresses[0]?.emailAddress || '');
    if (result) {
      setMessage('Successfully set as admin');
    } else {
      setMessage('Failed to set as admin');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Status Check</h1>
      
      <div className="space-y-4">
        <div>
          <p>User ID: {user?.id || 'Not signed in'}</p>
          <p>Email: {user?.emailAddresses[0]?.emailAddress || 'No email'}</p>
        </div>

        <div className="space-x-4">          
          <button
            onClick={makeAdmin}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Make Admin
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 rounded bg-blue-100 text-blue-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
