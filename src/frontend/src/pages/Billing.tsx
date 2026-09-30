// import { useAuth } from '../context/AuthContext';
// import CheckoutButton from '../components/CheckoutButton';

// export default function BillingPage() {
//   const { user } = useAuth();

//   // Safely get the tier or default to "Free"
//   const currentTier = user?.tier ? user.tier.toUpperCase() : 'FREE';

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-2">Subscription & Billing</h2>

//       {/* Dynamically display user.tier */}
//       <p className="text-gray-600 mb-6">
//         You are currently on the <span className="font-semibold text-primary">{currentTier}</span> tier.
//       </p>

//       <div className="flex flex-col sm:flex-row gap-4">
//         {/* Only show the Plus upgrade button if they aren't already on Plus or Pro */}
//         {user?.tier !== 'plus' && user?.tier !== 'pro' && (
//           <CheckoutButton tier="plus" amount={200000} />
//         )}

//         {/* Only show Pro if they aren't already on Pro */}
//         {user?.tier !== 'pro' && (
//           <CheckoutButton tier="pro" amount={500000} />
//         )}
//       </div>
//     </div>
//   );
// }



import CheckoutButton from '../components/CheckoutButton';
import { useAuth } from '../context/AuthContext';

export default function PricingPage() {
  // 1. Pull the user from context
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-8">
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
            <CheckoutButton tier="plus" amount={2000} /> // Note: I removed amount here assuming you handle it in the backend now
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