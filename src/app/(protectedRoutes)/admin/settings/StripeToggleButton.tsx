'use client';

import { useState } from 'react';
import { LucideArrowRight } from 'lucide-react';

export function StripeToggleButton({ initialConnected }: { initialConnected: boolean }) {
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/toggle-stripe', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setIsConnected(!!data.stripeConnectId);
      }
    } catch (err) {
      console.error('Toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-5 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
        isConnected
          ? 'bg-gray-200 hover:bg-gray-300 text-[#1D2A38] border-2 border-gray-400'
          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-2 border-purple-700'
      }`}
    >
      {loading ? 'Loading...' : isConnected ? 'Disconnect' : 'Connect with Stripe'}
      <LucideArrowRight size={16} />
    </button>
  );
}
