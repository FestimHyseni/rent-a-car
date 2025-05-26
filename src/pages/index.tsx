import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"
import Hero from "@/components/Home/Hero";
import Brands from "@/components/Home/Brands";

export default function CarentoLandingPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      <Hero />

      {/* Spacer */}
      <div className="h-32" />

      <Brands />
    </div>
  );
}
