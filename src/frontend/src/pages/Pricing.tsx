import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CheckoutButton from '../components/CheckoutButton'; // Adjust path if needed
import { Check, Sparkles, Zap, ArrowLeft } from 'lucide-react';

export default function PricingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-orange-500/30 pb-24">

            {/* Simple Navigation */}
            <nav className="p-6 max-w-6xl mx-auto flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                {!user && (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium hover:text-orange-500 transition-colors"
                    >
                        Log in
                    </button>
                )}
            </nav>

            {/* Header Section */}
            <div className="text-center max-w-3xl mx-auto px-4 mt-12 mb-16 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Simple pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">deep focus.</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Start for free, upgrade when you need more space or AI superpowers. No recurring subscriptions—just simple one-time payments.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-start">

                {/* FREE TIER */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Free</h3>
                    <p className="text-slate-500 text-sm h-10">Perfect for trying out the editor and jotting down quick ideas.</p>
                    <div className="my-6">
                        <span className="text-4xl font-bold">₦0</span>
                    </div>

                    <div className="mb-8 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> Up to 3 active notes</div>
                        <div className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> Rich Markdown Editor</div>
                        <div className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> Cloud Sync</div>
                    </div>

                    {!user ? (
                        <button onClick={() => navigate('/signup')} className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-colors">
                            Get Started
                        </button>
                    ) : user.tier === 'free' ? (
                        <button disabled className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed">
                            Current Plan
                        </button>
                    ) : (
                        <button disabled className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed">
                            Included
                        </button>
                    )}
                </div>

                {/* PLUS TIER */}
                <div className="bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/50 rounded-3xl p-8 shadow-md relative mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                        <Zap size={20} /> Plus
                    </h3>
                    <p className="text-slate-500 text-sm h-10">For active writers who need more workspace.</p>
                    <div className="my-6">
                        <span className="text-4xl font-bold">₦2,000</span>
                        <span className="text-slate-500 ml-2">one-time</span>
                    </div>

                    <div className="mb-8 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-3 font-medium text-indigo-700 dark:text-indigo-300"><Check size={18} className="text-indigo-500" /> Up to 6 active notes</div>
                        <div className="flex items-center gap-3"><Check size={18} className="text-indigo-500" /> Everything in Free</div>
                        <div className="flex items-center gap-3"><Check size={18} className="text-indigo-500" /> Priority Support</div>
                    </div>

                    {!user ? (
                        <button onClick={() => navigate('/signup')} className="w-full py-3 px-4 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                            Sign up to Upgrade
                        </button>
                    ) : user.tier === 'plus' ? (
                        <button disabled className="w-full py-3 px-4 rounded-xl font-semibold bg-indigo-100 text-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-600 cursor-not-allowed">
                            Current Plan
                        </button>
                    ) : user.tier === 'pro' ? (
                        <button disabled className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed">
                            Included in Pro
                        </button>
                    ) : (
                        <CheckoutButton tier="plus" amount={2000} />
                    )}
                </div>

                {/* PRO TIER */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl relative transform md:-translate-y-4">

                    {/* Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        Most Popular
                    </div>

                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                        <Sparkles size={20} className="text-pink-400" /> Pro
                    </h3>
                    <p className="text-slate-300 text-sm h-10">The ultimate AI-powered workspace for power users.</p>
                    <div className="my-6">
                        <span className="text-4xl font-bold text-white">₦5,000</span>
                        <span className="text-slate-400 ml-2">one-time</span>
                    </div>

                    <div className="mb-8 space-y-4 text-sm text-slate-200">
                        <div className="flex items-center gap-3 font-medium text-pink-400"><Check size={18} className="text-pink-500" /> Unlimited notes</div>
                        <div className="flex items-center gap-3 font-medium text-orange-400"><Check size={18} className="text-orange-500" /> Gemini 2.5 AI Assistant</div>
                        <div className="flex items-center gap-3"><Check size={18} className="text-emerald-400" /> Real-time text streaming</div>
                        <div className="flex items-center gap-3"><Check size={18} className="text-slate-400" /> Everything in Plus</div>
                    </div>

                    {!user ? (
                        <button onClick={() => navigate('/signup')} className="w-full py-3 px-4 rounded-xl font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-lg">
                            Sign up to Upgrade
                        </button>
                    ) : user.tier === 'pro' ? (
                        <button disabled className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700">
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