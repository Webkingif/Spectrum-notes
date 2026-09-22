import { useAuth } from '../context/AuthContext';
import CheckoutButton from '../components/CheckoutButton';

export default function BillingPage() {
  const { user } = useAuth();

  // Safely get the tier or default to "Free"
  const currentTier = user?.tier ? user.tier.toUpperCase() : 'FREE';

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Subscription & Billing</h2>
      
      {/* Dynamically display user.tier */}
      <p className="text-gray-600 mb-6">
        You are currently on the <span className="font-semibold text-primary">{currentTier}</span> tier.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Only show the Plus upgrade button if they aren't already on Plus or Pro */}
        {user?.tier !== 'plus' && user?.tier !== 'pro' && (
          <CheckoutButton tier="plus" amount={200000} />
        )}

        {/* Only show Pro if they aren't already on Pro */}
        {user?.tier !== 'pro' && (
          <CheckoutButton tier="pro" amount={500000} />
        )}
      </div>
    </div>
  );
}