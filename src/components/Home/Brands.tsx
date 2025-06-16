import React from "react";
import { Shield, Users, Award } from "lucide-react";

const carBrands = ["toyota", "ferrari", "bmw", "mercedes-benz", "audi"];

const Brands = () => {
  return (
    <>
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-4">Premium Brands</h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Unveil the Finest Selection of High-End Vehicles
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-10 px-4">
          {carBrands.map((brand) => (
            <div>
              <img
                key={brand}
                src={`/logos/${brand}.png`}
                alt={`${brand} logo`}
                className="h-16 mb-4 mx-auto object-contain"
              />
              <span className="capitalize">{brand}</span>
            </div>
          ))}
        </div>

        <button className="mt-10 text-green-500 font-semibold">
          Show All Brands →
        </button>
      </section>
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fully Insured</h3>
              <p className="text-slate-300">
                Comprehensive insurance coverage for peace of mind
              </p>
            </div>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-slate-300">
                Round-the-clock customer service and roadside assistance
              </p>
            </div>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-slate-300">
                Latest models with regular maintenance and updates
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Brands;
