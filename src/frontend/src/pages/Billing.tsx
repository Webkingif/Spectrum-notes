// import { useAuth } from '../context/AuthContext';
// import CheckoutButton from '../components/CheckoutButton';

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


import CheckoutButton from '../components/CheckoutButton';

import { useAuth } from '../context/AuthContext';

export default function PricingPage() {
  // 1. Pull the user from context
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-8">

      {/* 1. Back to Notes Button */}
      <div className="mb-8 flex justify-start">
        <button
          onClick={() => navigate('/notes')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Notes
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Upgrade Your Workspace</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Plus Tier Card */}
        <div className={`border rounded-lg p-6 shadow-sm ${user?.tier === 'plus' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-200'}`}>
          <h2 className="text-xl font-semibold">Plus Plan</h2>
          <p className="text-slate-500 mt-2">Up to 6 active notes</p>
          <p className="text-3xl font-bold my-4">₦2,000 <span className="text-sm font-normal">/ one-time</span></p>

          {/* 2. Check if they already own Plus or Pro */}
          {user?.tier === 'plus' ? (
            <button disabled className="w-full bg-slate-200 text-slate-500 py-2 rounded font-medium cursor-not-allowed dark:bg-slate-800 dark:text-slate-400">
              Current Plan
            </button>
          ) : user?.tier === 'pro' ? (
            <button disabled className="w-full bg-slate-200 text-slate-500 py-2 rounded font-medium cursor-not-allowed dark:bg-slate-800 dark:text-slate-400">
              Included in Pro
            </button>
          ) : (
            <CheckoutButton tier="plus" amount={2000} />
          )}
        </div>

        {/* Pro Tier Card */}
        <div className={`border rounded-lg p-6 shadow-md ${user?.tier === 'pro' ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10'}`}>
          <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Pro Plan</h2>
          <p className="text-slate-500 mt-2">Unlimited notes + Priority AI</p>
          <p className="text-3xl font-bold my-4">₦5,000 <span className="text-sm font-normal">/ one-time</span></p>

          {/* 3. Check if they already own Pro */}
          {user?.tier === 'pro' ? (
            <button disabled className="w-full bg-emerald-200 text-emerald-700 py-2 rounded font-medium cursor-not-allowed dark:bg-emerald-900 dark:text-emerald-300">
              Current Plan
            </button>
          ) : (
            <CheckoutButton tier="pro" amount={5000} />
          )}
        </div>

      </div>
    </div>
  );
}