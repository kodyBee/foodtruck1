"use client";

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible with a small delay to allow for proper mounting
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-0"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <Image
              src="/truckpic2.jpg"
              alt="Crown Majestic Kitchen Food Truck"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          
          {/* Multi-layer Gradients */}
          <div className="absolute inset-0 home-hero-gradient-overlay"></div>
          <div className="absolute inset-0 home-hero-radial-overlay"></div>
          
          {/* Static Mesh Gradient Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-yellow-500/20 rounded-full filter blur-[120px]"></div>
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-yellow-600/20 rounded-full filtr blur-[120px]"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Headline */}
          <div className="mb-10 space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent animate-gradient font-bold" style={{ fontFamily: 'var(--font-dancing-script)' }}>
                Crown Majestic Kitchen
              </span>
            </h1>
            
    

            <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium hero-tagline">
              Elevating American food with gourmet ingredients and crown-worthy presentation
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
            <Link 
              href="/menu" 
              className="group relative px-10 py-4 bg-yellow-500 text-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50 min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Menu
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            
            <Link 
              href="/truck" 
              className="group relative px-10 py-4 bg-white/5 backdrop-blur-sm border-2 border-yellow-500 text-yellow-500 font-bold text-lg rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 hover:scale-105 min-w-[200px]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Find Us
              </span>
            </Link>
          </div>

          {/* Stats/Features */}
          <div className="hidden sm:grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-yellow-500/20">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">25+</p>
                  <p className="text-white text-sm">Years Experience</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-yellow-500/20">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">100%</p>
                  <p className="text-white text-sm">Fresh Ingredients</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-yellow-500/20">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">10k+</p>
                  <p className="text-white text-sm">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <p className="text-yellow-500/70 text-xs uppercase tracking-widest font-semibold">Discover More</p>
            <svg className="w-6 h-6 text-yellow-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 home-section-bg">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Get down with the <span className="text-yellow-500">Crown</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Experience the perfect blend of quality, convenience, and royal treatment
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Find Our Truck Card */}
            <Link href="/truck" className="group relative theme-card rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="mb-6 inline-block p-4 bg-yellow-500/10 rounded-2xl group-hover:bg-yellow-500/20 transition-colors">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-yellow-500 transition-colors">
                  Track Our Truck
                </h3>
                
                <p className="text-muted mb-4">
                  Real-time location updates and schedule. Never miss us in your area.
                </p>
                
                <div className="flex items-center text-yellow-500 font-semibold group-hover:gap-2 transition-all">
                  <span>Locate Now</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Menu Card */}
            <Link href="/menu" className="group relative theme-card rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="mb-6 inline-block p-4 bg-yellow-500/10 rounded-2xl group-hover:bg-yellow-500/20 transition-colors">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-yellow-500 transition-colors">
                  Gourmet Menu
                </h3>
                
                <p className="text-muted mb-4">
                  Curated dishes with premium ingredients. From classics to innovations.
                </p>
                
                <div className="flex items-center text-yellow-500 font-semibold group-hover:gap-2 transition-all">
                  <span>Explore Dishes</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Contact/Catering Card */}
            <Link href="/contact" className="group relative theme-card rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="mb-6 inline-block p-4 bg-yellow-500/10 rounded-2xl group-hover:bg-yellow-500/20 transition-colors">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-yellow-500 transition-colors">
                  Event Catering
                </h3>
                
                <p className="text-muted mb-4">
                  Book us for weddings, parties, and corporate events.
                </p>
                
                <div className="flex items-center text-yellow-500 font-semibold group-hover:gap-2 transition-all">
                  <span>Book Event</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-primary overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              What Our <span className="text-yellow-500">Customers Say</span>
            </h2>
            <p className="text-muted text-lg">
              Join thousands of satisfied food lovers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="theme-card rounded-2xl p-8 hover:border-yellow-500/40 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted mb-6 italic">
                &quot;Great food, great customer service. Treated me and my brother in law the same way he treated Travis Hunter in his vlog gave learned our names and gave us samples. Just a genuine guy, will definitely be coming back.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-500 font-bold text-lg">AP</span>
                </div>
                <div>
                  <p className="text-primary font-semibold">Aaron Pruett</p>
                  <p className="text-muted text-sm">Food Enthusiast</p>
                </div>
              </div>
            </div>

            {/* Video Testimonial */}
            <div className="theme-card rounded-2xl p-4 hover:border-yellow-500/40 transition-all">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/gtvaamRdPRA?start=445&end=571"
                  title="Crown Majestic Kitchen - Travis Hunter Review"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-yellow-500 font-bold text-lg">TH</span>
                  </div>
                  <div>
                    <p className="text-primary font-semibold">Travis Hunter</p>
                    <p className="text-muted mb-6 italic">&quot;These wings are 10 out of 10&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="theme-card rounded-2xl p-8 hover:border-yellow-500/40 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted mb-6 italic">
                &quot;I ordered the chicken and red velvet waffles, which were absolutely amazing!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-500 font-bold text-lg">CD</span>
                </div>
                <div>
                  <p className="text-primary font-semibold">Carmen Davenport</p>
                  <p className="text-muted text-sm">Food Critic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
