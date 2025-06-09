import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-8 h-24 w-24 text-sky-400 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 20.25H15.75M12 16.5V20.25M4.5 12.75L6 6.75H18L19.5 12.75M4.5 12.75A2.25 2.25 0 002.25 15V18A2.25 2.25 0 004.5 20.25H5.25M19.5 12.75A2.25 2.25 0 0121.75 15V18A2.25 2.25 0 0119.5 20.25H18.75M4.5 12.75H19.5M15.75 6.75V5.25A1.5 1.5 0 0014.25 3.75H9.75A1.5 1.5 0 008.25 5.25V6.75"
          />
          <circle cx="7.5" cy="18" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </svg>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-sky-300 tracking-tighter">
          404
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-medium text-slate-300">
          Road Closed Ahead!
        </p>
        <p className="mt-2 text-md md:text-lg text-slate-400 max-w-md mx-auto">
          It seems the page you were looking for has veered off-course or is
          parked in another spot. Let's navigate you back to safety.
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-sky-400/50"
          >
            Return to Garage (Homepage)
          </Link>
        </div>

        <div className="mt-12 text-sm text-slate-500">
          <p>Ready for your next journey? Our fleet awaits!</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
