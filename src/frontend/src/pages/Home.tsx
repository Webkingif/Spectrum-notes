import { useNavigate } from 'react-router-dom';
import { Edit3, Lock, ChevronRight, Zap, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
	const navigate = useNavigate();
	const { user } = useAuth();

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans selection:bg-orange-500/30">

			{/* Background Decorative Gradients */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 dark:opacity-30 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
			</div>

			{/* Navbar (Simplified for Landing Page) */}
			<nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white-500 to-orange-600 flex items-center justify-center shadow-lg">

						<img src="favicon.ico" />
					</div>
					<span className="text-xl font-bold tracking-tight">Spectrum Notes</span>
				</div>
				<div className="flex items-center gap-4">
					<button onClick={() => navigate('/signin')} className="text-sm font-medium hover:text-orange-500 transition-colors">
						Log in
					</button>
					<button
						onClick={() => { if (user) { navigate("/notes") } else { navigate('/signup') } }}
						className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-sm"
					>
						Get Started
					</button>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center max-w-5xl mx-auto">

				{/* Headline */}
				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
					Write at the speed of <br className="hidden md:block" />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
						pure thought.
					</span>
				</h1>

				{/* Subheadline */}
				<p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed">
					The ultimate workspace combining a rich Markdown editor with real-time AI assistance. Organize your ideas, overcome writer's block, and sync securely across all your devices.
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
					<button
						onClick={() => navigate('/signup')}
						className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
					>
						Start Writing for Free
						<ChevronRight size={20} />
					</button>
					<button
						onClick={() => navigate('/pricing')}
						className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-lg transition-all shadow-sm"
					>
						<Zap size={20} className="text-purple-500" />
						View Premium Plans
					</button>
				</div>
			</main>

			{/* Feature Grid */}
			<section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
				<div className="grid md:grid-cols-3 gap-8">

					{/* Feature 1 */}
					<div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
						<div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
							<Edit3 size={24} className="text-orange-600 dark:text-orange-400" />
						</div>
						<h3 className="text-xl font-bold mb-3">Rich Markdown</h3>
						<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
							Format your thoughts effortlessly with our Tiptap-powered editor. Code blocks, bold headers, and lists exactly how you want them.
						</p>
					</div>

					{/* Feature 2 */}
					<div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
						<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
						<div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6 relative z-10">
							<Bot size={24} className="text-indigo-600 dark:text-indigo-400" />
						</div>
						<h3 className="text-xl font-bold mb-3 relative z-10">Real-Time AI</h3>
						<p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
							Stuck? Have Google's Gemini 2.5 stream ideas, summarize text, or rewrite paragraphs directly into your notes without breaking flow.
						</p>
					</div>

					{/* Feature 3 */}
					<div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
						<div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
							<Lock size={24} className="text-emerald-600 dark:text-emerald-400" />
						</div>
						<h3 className="text-xl font-bold mb-3">Secure & Synced</h3>
						<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
							Your data is secured with JWT authentication and instantly saved to the cloud. Start on your laptop, finish on your phone.
						</p>
					</div>

				</div>
			</section>

			{/* Footer minimal */}
			<footer className="border-t border-slate-200 dark:border-slate-800 mt-12 py-8 text-center text-slate-500 text-sm">
				<p>© {new Date().getFullYear()} Spectrum Notes. Designed by  <a href="https://webkingif.netlify.app" className='text-blue-800 hover:underline'>Idowu Femi</a>.</p>
			</footer>

		</div>
	);
}