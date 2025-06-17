import React from "react";

export default function Header() {
  return (
    <header className="bg-[#0e1a2b] text-sm py-2 hidden md:flex px-4 justify-between items-center">
      <div className="flex gap-6">
        <span>📞 +1 222-555-33-99</span>
        <span>✉️ sale@carento.com</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-green-500 px-3 py-1 rounded-full text-xs">
          More than 800+ special collection cars in this summer
        </span>
        <button className="text-sm bg-green-600 hover:bg-green-700 ml-2 px-3 py-1">
          Access Now
        </button>
      </div>
    </header>
  );
}
