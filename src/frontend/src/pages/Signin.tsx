import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const {login} = useAuth();

  // Get original page or default to /dashboard
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = async (e:React.FormEvent) => {
    e.preventDefault();
    setError("");
	setIsLoading(true);
	try{
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
			method: "POST",
			headers: {
				"Content-Type":"application/json",
			},
			body: JSON.stringify({email, password})
		});
		const data = await response.json();
		if(!response.ok){
			throw new Error(data.message || "Failed to sign in");
		};
		
		login(data);
		navigate("/notes");
		
	}catch(error:any){
		console.error("Login error:", error);
		setError(error.message);
	}finally{
		setIsLoading(false);
	}
  };


  return (
    <main className="flex items-center justify-center py-4 px-1 md:px-8 lg:h-[90%]">
      <div className="max-w-6xl border border-slate-200 bg-white shadow-sm p-4 rounded-lg lg:p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="grid md:grid-cols-2 items-center gap-x-8 gap-y-12">
          <div className="max-w-md mx-auto w-full p-2 md:p-4">
            <div className="inline-block mb-10">
              <a href="/">
                <img
                  src="/android-chrome-192x192.png"
                  alt="logo"
                  className="w-40 block dark:invert dark:brightness-100"
                />
              </a>
            </div>

            <form className="space-y-6" onSubmit={handleSignIn}>
			{error && <div className= "text-red-500 text-sm bg-red-50 p-3 rounded">{errpr}</div>}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                >
                  Email
                </label>
                <input
				onChange={(e)=>setEmail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@readymadeui.com"
                  required
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                >
                  Password
                </label>

                <button
                  type="button"
                  id="togglePassword"
                  aria-label="Toggle password visibility"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1 right-2 p-0.5 flex cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-[18px] fill-slate-400 text-slate-400 overflow-visible"
                    viewBox="0 0 128 128"
                  >
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24-24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                    {!showPassword && (
                      <path
                        id="eyeStrike"
                        className="block"
                        d="M10.586 10.586l106.828 106.828"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </button>

                <input
				onChange={(e)=>setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
                />
              </div>

              <div className="flex items-start flex-wrap gap-2">
                

                <a
                  href="#"
                  className="ml-auto text-sm font-medium text-orange-700 dark:text-orange-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-orange-600 bg-orange-500 hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <hr className="w-full border-slate-300 dark:border-neutral-700" />
              <p className="text-sm text-slate-700 text-center dark:text-slate-300">
                or
              </p>
              <hr className="w-full border-slate-300 dark:border-neutral-700" />
            </div>

            <div>
              <a
                href="#"
                className="w-full flex items-center justify-center gap-2.5 py-2 px-3.5 text-sm rounded-md font-semibold text-slate-900 border border-slate-300 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-slate-50 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-[18px]"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                >
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                  />
                </svg>
                Sign in with Google
              </a>
            </div>

            <div className="mt-6 text-slate-900 text-sm text-center dark:text-slate-50">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-orange-700 hover:underline ml-1 font-medium dark:text-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="aspect-square bg-gray-50 relative before:absolute before:inset-0 before:bg-orange-600/70 rounded-md overflow-hidden w-full h-full">
            <img
              src="https://readymadeui.com/team-image.webp"
              className="w-full h-full object-cover"
              alt="login img"
            />
            <div className="absolute inset-0 m-auto max-w-sm p-6 flex items-center justify-center">
              <div>
                <h1 className="text-white text-3xl font-bold">Sign in</h1>
                <p className="text-slate-100 text-base font-medium mt-6 leading-relaxed">
                  Sign in to your account and explore a world of possibilities.
                  Your journey begins here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

