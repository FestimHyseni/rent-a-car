import React from "react";

const carBrands = ["toyota", "honda", "bmw", "mercedes-benz", "audi"];

const Brands = () => {
  return (
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
              src={`/logos/${brand}.svg`}
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
  );
};

export default Brands;
