import React from 'react'

const Nav = () => {
  return (
       <nav className=" right-0 z-50 bg-white/30 backdrop-blur-md py-4 px-6 flex items-center justify-between shadow-md">
        <div className="text-2xl font-bold text-green-500">Carento</div>
        <ul className="hidden md:flex gap-6 text-sm">
          <li>Home</li>
          <li>Vehicles</li>
          <li>Dealers</li>
          <li>Shop</li>
          <li>Pages</li>
          <li>News</li>
          <li>Contact</li>
        </ul>
        <div className="flex gap-3 items-center">
          <button className="text-sm">Sign in</button>
          <button className="bg-black text-white text-sm px-4 py-2 rounded">Add Listing</button>
        </div>
      </nav>
  )
}

export default Nav
