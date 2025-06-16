import BrandsCard from "@/components/Brand/Card";
import useFetch from "@/hooks/useFetch";
import { Car, ShieldCheck, Award, ThumbsUp, ChevronRight } from "lucide-react";

// Sample data for car brands. In a real application, this would likely come from a CMS or API.
interface Brand {
  name: string;
}
interface BrandsProps {
  brands: Brand[];
}

const Brands: React.FC<BrandsProps> = ({ brands }) => {
  return (
    <div className=" bg-gradient-to-br from-slate-900 to-slate-700 text-white font-sans">
      <main className="pt-24 md:pt-28">
        <div className="container mx-auto px-6">
          {/* --- Hero Section --- */}
          <section className="text-center py-16 md:py-24">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
              A Fleet for Every Journey
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
              We partner with the world's leading car manufacturers to bring you
              a diverse selection of reliable, stylish, and high-performance
              vehicles for any occasion.
            </p>
          </section>

          {/* --- Brands Grid --- */}
          <section className="pb-20 md:pb-32">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {brands.map((brand) => (
                <BrandsCard key={brand.name} name={brand.name} />
              ))}
            </div>
          </section>

          {/* --- Why Choose Us Section --- */}
          <section className="bg-gray-50 rounded-2xl p-8 md:p-12 lg:p-16 mb-20 md:mb-32">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                The EliteRide Advantage
              </h2>
              <div className="grid md:grid-cols-3 gap-10 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                    <ShieldCheck className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Top-Tier Safety
                  </h3>
                  <p className="text-gray-600">
                    Every vehicle is rigorously inspected and maintained to
                    ensure your safety and peace of mind.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Premium Selection
                  </h3>
                  <p className="text-gray-600">
                    From luxury sedans to rugged SUVs, our brand partnerships
                    offer unparalleled choice.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                    <ThumbsUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Exceptional Service
                  </h3>
                  <p className="text-gray-600">
                    Our commitment to quality extends to our customer service,
                    ensuring a seamless rental experience.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/brands`);
    const brands = await res.json();

    return { props: { brands } };
  } catch (error) {
    console.error("Failed to fetch data in getServerSideProps:", error);
    return { props: { cars: [], locations: [] } };
  }
}

export default Brands;
