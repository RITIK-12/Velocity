import React, { useState } from 'react';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import type { Provider } from '@supabase/supabase-js';

interface User {
  name: string;
}

interface AuthResponse {
  user?: User;
  error?: string;  // Correctly identifying that error is a string
}

async function authenticateUser(provider: string): Promise<AuthResponse> {
  return { user: { name: "John Doe" } };  // Simulated response
}

const providers = [
  {
    provider: 'google',
    label: 'Sign in with Google',
    Logo: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 70 72" style={{ width: '20px', height: '20px' }}>
        <path fill="#4285F4" d="m70 37-1-7H36v14h19c-1 4-3 8-7 10v9h11c7-6 11-15 11-26z" />
        <path fill="#34A853" d="M36 72c9 0 17-3 23-9l-11-9a21 21 0 0 1-32-11H4v9c6 12 18 20 32 20z" />
        <path fill="#FBBC05" d="M16 43a21 21 0 0 1 0-13V20H4a36 36 0 0 0 0 32l12-9z" />
        <path fill="#EA4335" d="M36 15c5 0 10 2 13 5l11-10A36.6 36.6 0 0 0 4 20l12 10c3-9 10-15 20-15z" />
      </svg>
    ),
  },
  {
    provider: 'github',
    label: 'Sign in with Github',
    Logo: () => (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
        <title>GitHub</title>
        <path fill="#181717" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2a4 4 0 0 1 1.3 3.2c0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/>
      </svg>
    ),
  },
  {
    provider: 'polkadot',
    label: 'Sign in with Polkadot',
    Logo: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="#E6007A" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="#E6007A" />
      </svg>
    ),
  },
];

export function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const signIn = async (provider: string) => {
    try {
      let result;
      if (provider === 'polkadot') {
        const extensions = await web3Enable('Your Game Name');
        if (extensions.length === 0) throw new Error('No Polkadot extension installed!');
        const accounts = await web3Accounts();
        if (accounts.length === 0) throw new Error('No accounts available!');
        setUser({ name: accounts[0].address });
      } else {
        result = await authenticateUser(provider);
        if (result.error) throw new Error(result.error);  // Directly using the string error
        if (result.user) setUser(result.user);
      }
      alert('Successfully signed in!');
    } catch (error: any) {
      console.error('SignIn error:', error);
      setErrorMessage(error.message || 'An error occurred during sign-in.');
    }
  };

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={() => setUser(null)}>Sign out</button>
        </>
      ) : (
        <>
          <h2 className="auth-header">Want to save your score?</h2>
          <div className="auth-providers">
            {providers.map(({ provider, label, Logo }, index) => (
              <button key={index} onClick={() => signIn(provider)} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Logo />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}