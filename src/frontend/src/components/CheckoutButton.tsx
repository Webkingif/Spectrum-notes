import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../context/AuthContext';

interface CheckoutButtonProps {
  tier: 'plus' | 'pro'; 
  amount:number;
}

export default function CheckoutButton({ tier }: CheckoutButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
              // The easiest way to refresh the user's context/limits is to reload the page
              // Or if you have an update() function in AuthContext, call it here.
              window.location.reload(); 
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

  return (
    <button disabled={!user?.email || isLoading} onClick={handleUpgradeClick}>
      {isLoading ? 'Loading...' : `Upgrade to ${tier.toUpperCase()}`}
    </button>
  );
}