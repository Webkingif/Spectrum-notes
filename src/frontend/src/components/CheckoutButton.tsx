import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CheckoutButtonProps {
  tier: 'plus' | 'pro';
  amount: number;
}
interface User {
  _id: string;
  email: string;
  tier: 'free' | 'pro' | 'plus';
  noteCount: number;
  token: string;
}

export default function CheckoutButton({ tier }: CheckoutButtonProps) {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Setup the hook with required base props to satisfy TypeScript
  const initializePayment = usePaystackPayment({
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user?.email || "",
    amount: 0, // Dummy value, will be overridden
  });

  const handleUpgradeClick = async () => {
    setIsLoading(true);

    try {
      const initRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
        body: JSON.stringify({ tier })
      });

      if (!initRes.ok) throw new Error("Failed to initialize payment");

      const { reference, amount } = await initRes.json();

      // 2. Override the config with server data (omitting publicKey)
      initializePayment({
        config: {
          reference,
          amount, // Overrides the 0 from the base config
          email: user?.email || "",
        },
        onSuccess: async (response) => {
          try {
            // Send the reference to your backend for secure verification
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
              },
              body: JSON.stringify({ reference: response.reference })
            });

            const data = await verifyRes.json();

            if (verifyRes.ok && data.success) {
              alert(`Success! You are now on the ${data.tier.toUpperCase()} plan.`);
              navigate("/notes")
              if (user) {
                const newUser: User = { ...user, tier: data.tier as 'free' | 'pro' | 'plus' } as User;
                login(newUser);
              }


              // The easiest way to refresh the user's context/limits is to reload the page
              // Or if you have an update() function in AuthContext, call it here.
              //window.location.reload();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Network error during verification.");
          } finally {
            setIsLoading(false);
          }
        },
        onClose: () => {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const buttonColors = tier === 'plus'
    ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500';

  return (
    <button
      disabled={!user?.email || isLoading}
      onClick={handleUpgradeClick}
      className={`
        w-full py-2.5 px-4 rounded-lg font-semibold text-white shadow-sm
        transition-all duration-200 flex justify-center items-center gap-2
        focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900
        disabled:opacity-65 disabled:cursor-not-allowed
        ${buttonColors}
      `}
    >
      {isLoading ? (
        <>
          {/* SVG Spinner for loading state */}
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        `Upgrade to ${tier.toUpperCase()}`
      )}
    </button>
  );
}