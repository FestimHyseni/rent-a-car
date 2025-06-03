// pages/login.tsx
import React, { useState, FormEvent } from "react";
import {
  signIn,
  getCsrfToken,
  getProviders,
  useSession,
} from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { LockKeyhole, Mail, LogIn, Chrome } from "lucide-react"; // Example icons




interface LoginProps {
  csrfToken?: string;
  providers: Awaited<ReturnType<typeof getProviders>>;
}

const LoginPage: React.FC<LoginProps> = ({ csrfToken, providers }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false, // Handle redirect manually
      email,
      password,
      // callbackUrl: router.query.callbackUrl || '/', // Where to redirect after successful login
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      // Successful login
      router.push((router.query.callbackUrl as string) || "/dashboard"); // Redirect to dashboard or intended page
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (session) {
    // If already logged in, redirect
    router.replace((router.query.callbackUrl as string) || "/");
    return (
      <div className="flex justify-center items-center min-h-screen">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="text-black min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Welcome Back!
        </h1>
        <p className="text-center text-slate-500 mb-8">
          Login to access your account.
        </p>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CSRF Token - not strictly needed if you're only using Credentials for POST, but good practice for NextAuth forms */}
          {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-sky-600 hover:text-sky-500 transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              Sign In
            </button>
          </div>
        </form>

        {providers &&
          Object.values(providers).map((provider) => {
            if (provider.id === "credentials") return null; // Don't show button for credentials
            return (
              <div key={provider.name} className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl:
                          (router.query.callbackUrl as string) || "/",
                      })
                    }
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                  >
                    {provider.name === "Google" && (
                      <Chrome className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    Sign in with {provider.name}
                  </button>
                </div>
              </div>
            );
          })}

        <p className="mt-8 text-center text-sm text-slate-500">
          Not a member?{" "}
          <Link href="/signup" legacyBehavior>
            <a className="font-medium text-sky-600 hover:text-sky-500 transition-colors">
              Sign up now
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // It's generally recommended to handle redirects client-side with useSession for login/signup pages
  // to avoid flashing content if the session check is slow.
  // However, getting providers and CSRF token server-side is common.
  return {
    props: {
      // csrfToken: await getCsrfToken(context), // Only needed if you're using it in the form
      providers: (await getProviders()) ?? [], // Ensure providers is not null
    },
  };
}

export default LoginPage;
