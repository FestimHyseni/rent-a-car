import Head from "next/head";
import React from "react";
import { 
  FaCar, FaMoneyBillWave, FaPhone, FaLaptop, FaExchangeAlt, 
  FaShieldAlt, FaUserFriends, FaAward, FaStar, 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCarSide
} from "react-icons/fa";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Alex started CarEnto with a vision to revolutionize car rentals. With 15+ years in the industry, he's committed to customer satisfaction.",
      icon: <FaUserFriends className="text-3xl text-green-500" />
    },
    {
      name: "Maria Garcia",
      role: "Head of Operations",
      bio: "Maria ensures our fleet is always in top condition and our service exceeds expectations. Her motto: 'Every customer deserves perfection.'",
      icon: <FaAward className="text-3xl text-green-500" />
    },
    {
      name: "Sam Lee",
      role: "Lead Developer",
      bio: "Sam builds the technology that makes renting effortless. His innovative solutions power our seamless booking platform.",
      icon: <FaLaptop className="text-3xl text-green-500" />
    },
    {
      name: "Emma Wilson",
      role: "Customer Support Manager",
      bio: "Emma leads our 24/7 support team, ensuring all customer inquiries are handled promptly and professionally.",
      icon: <FaPhone className="text-3xl text-green-500" />
    },
    {
      name: "David Kim",
      role: "Fleet Manager",
      bio: "David oversees our vehicle maintenance and ensures every car meets our rigorous safety standards.",
      icon: <FaCarSide className="text-3xl text-green-500" />
    },
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      bio: "Sarah crafts our brand message and develops campaigns that connect us with our customers.",
      icon: <FaUsers className="text-3xl text-green-500" />
    }
  ];

  const features = [
    {
      title: "Premium Fleet",
      description: "150+ well-maintained vehicles from economy to luxury class",
      icon: <FaCar className="text-3xl text-green-500" />
    },
    {
      title: "Best Prices",
      description: "Competitive rates with no hidden charges guaranteed",
      icon: <FaMoneyBillWave className="text-3xl text-green-500" />
    },
    {
      title: "24/7 Support",
      description: "Our team is always ready to assist you day and night",
      icon: <FaPhone className="text-3xl text-green-500" />
    },
    {
      title: "Easy Booking",
      description: "Reserve your perfect car in just 3 minutes online",
      icon: <FaLaptop className="text-3xl text-green-500" />
    },
    {
      title: "Flexible Options",
      description: "Hourly, daily, weekly or monthly rentals available",
      icon: <FaExchangeAlt className="text-3xl text-green-500" />
    },
    {
      title: "Safety First",
      description: "All vehicles sanitized and inspected before each rental",
      icon: <FaShieldAlt className="text-3xl text-green-500" />
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy Customers", icon: <FaUserFriends className="text-3xl text-green-500" /> },
    { value: "150+", label: "Vehicle Fleet", icon: <FaCar className="text-3xl text-green-500" /> },
    { value: "12", label: "Cities Served", icon: <FaMapMarkerAlt className="text-3xl text-green-500" /> },
    { value: "24/7", label: "Support Availability", icon: <FaPhone className="text-3xl text-green-500" /> }
  ];

  const milestones = [
    { year: "2015", event: "Founded with 3 vehicles in a single location", icon: <FaCalendarAlt className="text-2xl text-green-500" /> },
    { year: "2017", event: "Expanded to 3 cities with 25 vehicles", icon: <FaMapMarkerAlt className="text-2xl text-green-500" /> },
    { year: "2019", event: "Launched mobile app with instant booking", icon: <FaLaptop className="text-2xl text-green-500" /> },
    { year: "2021", event: "Reached 100+ vehicles in our fleet", icon: <FaCar className="text-2xl text-green-500" /> },
    { year: "2023", event: "Opened international branches", icon: <FaMapMarkerAlt className="text-2xl text-green-500" /> }
  ];

  const testimonials = [
    {
      quote: "The easiest car rental experience I've ever had. The car was clean, fuel full, and ready when I arrived.",
      author: "Michael Brown",
      role: "Frequent Customer",
      rating: 5
    },
    {
      quote: "When my flight was delayed, CarEnto adjusted my pickup time without any hassle. True customer service!",
      author: "Jessica Williams",
      role: "Business Traveler",
      rating: 5
    },
    {
      quote: "Their premium selection has the best luxury cars in town at reasonable prices. My go-to for special occasions.",
      author: "Robert Davis",
      role: "Loyal Customer",
      rating: 5
    }
  ];

  return (
    <div className="bg-gray-50">
      <Head>
        <title>About CarEnto - Premium Car Rental Service</title>
        <meta name="description" content="Discover CarEnto's story, mission, and the team behind your seamless car rental experience." />
        <meta name="keywords" content="car rental, about us, rent a car, vehicle hire, CarEnto team" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0e1a2b] to-[#1a365d] text-white py-32 px-6">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Driving <span className="text-green-400">Excellence</span> Since 2015
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Your journey begins with CarEnto - where quality meets affordability
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Book Your Car
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-[#0e1a2b] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="container mx-auto py-16 px-4 sm:px-6">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1a2b] mb-4">Our Mission</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-12">
            <div className="text-center mb-8">
              <FaCar className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#0e1a2b] mb-4">Redefining Car Rental Experiences</h3>
            </div>
            <p className="text-gray-700 text-lg mb-6 text-center">
              At CarEnto, we're transforming the car rental industry by combining cutting-edge technology with personalized service. 
              Our mission is to make mobility accessible, affordable, and enjoyable for everyone.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <FaShieldAlt className="text-3xl text-green-600 mx-auto mb-4" />
                <h4 className="font-bold text-lg text-[#0e1a2b] mb-2">Safety First</h4>
                <p className="text-gray-600">Rigorous vehicle inspections and sanitization</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <FaMoneyBillWave className="text-3xl text-green-600 mx-auto mb-4" />
                <h4 className="font-bold text-lg text-[#0e1a2b] mb-2">Transparent Pricing</h4>
                <p className="text-gray-600">No hidden fees or surprise charges</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <FaPhone className="text-3xl text-green-600 mx-auto mb-4" />
                <h4 className="font-bold text-lg text-[#0e1a2b] mb-2">24/7 Support</h4>
                <p className="text-gray-600">Always available when you need us</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 uppercase text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1a2b] mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2 flex justify-center">
                <div className="bg-green-100 p-10 rounded-full">
                  <FaCarSide className="text-8xl text-green-600" />
                </div>
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-2xl md:text-3xl font-semibold text-[#0e1a2b] mb-6">From Humble Beginnings to Industry Leader</h3>
                <p className="text-gray-600 mb-6">
                  Founded in 2015 with just 3 vehicles, CarEnto has grown into one of the most trusted names in car rentals. 
                  Our founder, Alex Johnson, started with a simple idea: make renting a car as easy as hailing a taxi.
                </p>
                <p className="text-gray-600 mb-6">
                  Today, we operate in 12 cities with a fleet of over 150 vehicles, but we've never lost sight of our core values: 
                  integrity, reliability, and putting customers first.
                </p>
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <p className="text-green-700 font-medium italic">
                    "Our success comes from happy customers who return to us time and again. We measure our growth not just in numbers, 
                    but in the relationships we've built along the way."
                  </p>
                  <p className="text-green-600 mt-2 font-semibold">— Alex Johnson, Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1a2b] mb-4">Our Journey</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="relative">
              <div className="absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className={`flex-shrink-0 z-10 ${index % 2 === 0 ? 'order-1 mr-8' : 'order-2 ml-8'}`}>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                        {milestone.icon}
                      </div>
                    </div>
                    <div className={`flex-grow ${index % 2 === 0 ? 'order-2 text-right' : 'order-1'}`}>
                      <div className={`p-6 rounded-lg shadow-md bg-white ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                        <h3 className="text-lg font-bold text-[#0e1a2b]">{milestone.year}</h3>
                        <p className="text-gray-600">{milestone.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1a2b] mb-4">Why Choose CarEnto?</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              We go the extra mile to ensure your rental experience is seamless and enjoyable
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#0e1a2b] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1a2b] mb-4">What Our Customers Say</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="mb-4 text-yellow-400 flex justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 text-center">"{testimonial.quote}"</p>
                <div className="text-center">
                  <div className="font-semibold text-[#0e1a2b]">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1a2b] mb-4">Meet The Team</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              The passionate people behind your seamless car rental experience
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden text-center transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="p-8">
                  <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {member.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#0e1a2b]">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e1a2b] mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaUserFriends className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#0e1a2b] mb-3">Customer First</h3>
              <p className="text-gray-600 text-center">
                We prioritize our customers' needs above all else, ensuring every interaction leaves them satisfied.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaAward className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#0e1a2b] mb-3">Excellence</h3>
              <p className="text-gray-600 text-center">
                We strive for perfection in every aspect of our service, from vehicle quality to customer support.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaShieldAlt className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#0e1a2b] mb-3">Integrity</h3>
              <p className="text-gray-600 text-center">
                We conduct our business with honesty and transparency, building trust with every customer.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#0e1a2b] to-[#1a365d] text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who trust CarEnto for their mobility needs
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Book Your Car Now
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-[#0e1a2b] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Contact Our Team
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;