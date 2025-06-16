import Link from "next/link";

function BrandsCard(props: { name: string }) {
  return (
    <Link
      href={`/search?brand=${props.name.toLowerCase()}`}
      className="group flex items-center cursor-pointer justify-center p-6 bg-transparent/80 backdrop-blur-md rounded-xl  hover:bg-slate-800 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <img
        src={`/logos/${props.name.toLowerCase().replace(/\s+/g, "-")}.png`}
        alt={`${props.name} logo`}
        className="h-12 md:h-14 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = `https://placehold.co/120x60/e2e8f0/64748b?text=${props.name}`;
        }}
      />
    </Link>
  );
}
export default BrandsCard;
