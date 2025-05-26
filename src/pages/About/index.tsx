// For pages directory: pages/about.js
// For app directory: app/about/page.js
import Head from "next/head";
import React from "react";
// You might want to import a shared Layout component if you have one
// import Layout from '../components/Layout'; // Example

// Placeholder for team member data - replace with actual data or remove
const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    imageUrl: "https://via.placeholder.com/150/3B82F6/FFFFFF?text=AJ", // Replace with actual image
    bio: "Alex started this company with a passion for travel and a vision to make car rentals seamless and enjoyable.",
  },
  {
    name: "Maria Garcia",
    role: "Head of Operations",
    imageUrl: "https://via.placeholder.com/150/10B981/FFFFFF?text=MG", // Replace with actual image
    bio: "Maria ensures that every vehicle is in top condition and that our customer service exceeds expectations.",
  },
  {
    name: "Sam Lee",
    role: "Lead Developer",
    imageUrl: "https://via.placeholder.com/150/F59E0B/FFFFFF?text=SL", // Replace with actual image
    bio: "Sam is the tech wizard behind our smooth booking platform and innovative features.",
  },
];

const AboutPage = () => {
  return (
    <div className="mt-11">
      <Head>
        <title>About Us | Your Car Rental</title>
        <meta
          name="description"
          content="Learn more about Your Car Rental, our mission, values, and the team dedicated to providing you with the best car rental experience."
        />
      </Head>

      {/* Wrap with Layout if you have one: <Layout> ... </Layout> */}
      <div className="bg-slate-50 min-h-screen">
        {/* Header Section */}
        <header className="bg-gradient-to-r  from-sky-600 to-cyan-500 text-white py-20 px-6 shadow-lg">
          <div className="pt-11"></div>
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              About <span className="text-sky-200">[Your Car Rental Name]</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-sky-100">
              Discover our story, our mission, and why we are your best choice
              for hitting the road.
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container mx-auto py-12 md:py-16 px-6">
          {/* Our Mission Section */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl font-semibold text-slate-800 mb-6 text-center">
              Our Mission
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                At [Your Car Rental Name], our mission is to provide an
                exceptional, hassle-free car rental experience. We strive to
                offer a diverse fleet of high-quality vehicles, transparent
                pricing, and outstanding customer service, enabling you to
                explore your world with confidence and ease.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                We believe that renting a car should be simple, convenient, and
                affordable. Whether you're traveling for business or leisure,
                we're committed to getting you on the road quickly and safely.
              </p>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl font-semibold text-slate-800 mb-6 text-center">
              Our Story
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Founded in [Year], [Your Car Rental Name] started with a simple
                idea: to make car rental better. Frustrated by complicated
                booking processes and hidden fees, our founders envisioned a
                service that puts the customer first. From a small fleet of just
                a few cars, we've grown into a trusted name in car rentals,
                serving thousands of happy travelers each year.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Our journey has been driven by a passion for innovation and a
                commitment to our core values of integrity, reliability, and
                customer satisfaction.
              </p>
            </div>
          </section>

          {/* Why Choose Us? Section */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl font-semibold text-slate-800 mb-6 text-center">
              Why Choose Us?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Wide Vehicle Selection",
                  description:
                    "From compact cars for city trips to spacious SUVs for family adventures, find the perfect vehicle for your needs.",
                  icon: "🚗",
                },
                {
                  title: "Transparent Pricing",
                  description:
                    "No hidden fees. What you see is what you pay. We believe in honest and clear pricing.",
                  icon: "💲",
                },
                {
                  title: "24/7 Customer Support",
                  description:
                    "Our dedicated support team is always here to help you, any time of day or night.",
                  icon: "📞",
                },
                {
                  title: "Easy Booking Process",
                  description:
                    "Book your car in minutes with our user-friendly online platform and mobile app.",
                  icon: "💻",
                },
                {
                  title: "Flexible Rental Options",
                  description:
                    "We offer daily, weekly, and monthly rentals, along with customizable options to suit your schedule.",
                  icon: "🔄",
                },
                {
                  title: "Commitment to Safety",
                  description:
                    "All our vehicles are regularly maintained and sanitized for your peace of mind.",
                  icon: "🛡️",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-sky-700 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Team Section (Optional) */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl font-semibold text-slate-800 mb-6 text-center">
              Meet Our Team
            </h2>
            <p className="text-center text-slate-600 mb-8 max-w-xl mx-auto">
              We are a group of passionate individuals dedicated to making your
              car rental experience the best it can be.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-sky-200 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-sky-700">
                    {member.name}
                  </h3>
                  <p className="text-sky-600 font-medium mb-2">{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 mt-8">
              ...and many more dedicated professionals working behind the
              scenes!
            </p>
          </section>
        </main>

        {/* You might want to include a shared Footer component here */}
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default AboutPage;
