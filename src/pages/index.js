import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"
import Header from "./components/home/Header";
import Nav from "./components/home/Nav";
import Hero from "./components/home/Hero";
import Brands from "./components/home/Brands";

export default function CarentoLandingPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      <div className="fixed top-0 z-20 w-full text-white left-0">
        <Header />
        
        <Nav />
      </div>

      <Hero />

      {/* Spacer */}
      <div className="h-32" />

      <Brands />
    </div>
  );
}
