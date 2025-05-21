import React, {useState} from 'react'
import { BadgeCheck, CalendarDays, MapPin } from "lucide-react";

const Hero = () => {
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropOffLocation, setDropOffLocation] = useState('');
  const [pickUpDate, setPickUpDate] = useState(new Date().toLocaleDateString());
const [returnDate, setReturnDate] = useState(new Date().toLocaleDateString());
  return (
     <section className="relative h-[90vh] flex items-center justify-center bg-[url('/background.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-left px-6 max-w-4xl">
          <p className="text-green-400 font-semibold text-sm mb-2">Find Your Perfect Car</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Looking for a vehicle?<br />You're in the perfect spot.
          </h1>
          <div className="flex flex-wrap gap-4 text-white">
            <span className="flex items-center gap-2"><BadgeCheck color="green"/> High quality at a low cost.</span>
            <span className="flex items-center gap-2"><BadgeCheck color="green"/> Premium services</span>
            <span className="flex items-center gap-2"><BadgeCheck color="green"/> 24/7 roadside support.</span>
          </div>
        </div>

        {/* Search Box */}
        <div className="absolute bottom-[-4rem] left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
          <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-wrap justify-between gap-4">
            <div className="flex gap-4">
              <button className="bg-green-500 text-white rounded-full px-4">All cars</button>
              <button variant="ghost">New cars</button>
              <button variant="ghost">Used cars</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
              <div>
                <label className="text-sm font-semibold mb-1 block">Pick Up Location</label>
                <div className="flex items-center border px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>New York, USA</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Drop Off Location</label>
                <div className="flex items-center border px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Delaware, USA</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Pick Up Date & Time</label>
                <div className="flex items-center border px-3 py-2 rounded-lg">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>{pickUpDate}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Return Date & Time</label>
                <div className="flex items-center border px-3 py-2 rounded-lg">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>{returnDate}</span>
                </div>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-green-500 text-white">Find a Vehicle</button>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero
