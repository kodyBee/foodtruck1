"use client";

import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const menuData = {
  "Wings": [
    { name: "Lemon Pepper Wings", description: "Crispy wings tossed in our signature lemon pepper seasoning", price: "$12.99" },
    { name: "Hot Wings", description: "Classic buffalo hot wings with a kick", price: "$12.99" },
    { name: "BBQ Wings", description: "Sweet and tangy barbecue glazed wings", price: "$12.99" },
    { name: "Honey Hot Wings", description: "Perfect balance of sweet honey and spicy heat", price: "$12.99" },
    { name: "Garlic Parmesan Wings", description: "Savory garlic and parmesan cheese coating", price: "$12.99" },
    { name: "Teriyaki Wings", description: "Asian-inspired sweet teriyaki glaze", price: "$12.99" },
    { name: "Mango Habanero Wings", description: "Tropical sweetness meets fiery habanero", price: "$12.99" },
    { name: "Cajun Wings", description: "Bold Cajun spices with Louisiana flair", price: "$12.99" },
  ],
  "Sandwiches & Cheesesteaks": [
    { name: "Classic Philly Cheesesteak", description: "Thinly sliced ribeye, grilled onions, peppers, and melted cheese", price: "$14.99" },
    { name: "Chicken Cheesesteak", description: "Grilled chicken breast with peppers, onions, and cheese", price: "$13.99" },
    { name: "BBQ Chicken Sandwich", description: "Pulled BBQ chicken with coleslaw on a brioche bun", price: "$12.99" },
    { name: "Buffalo Chicken Sandwich", description: "Crispy chicken tossed in buffalo sauce with ranch", price: "$12.99" },
    { name: "Spicy Italian Sausage", description: "Grilled Italian sausage with peppers and onions", price: "$11.99" },
  ],
  "Mac & Cheese Bowls": [
    { name: "Classic Mac & Cheese", description: "Creamy three-cheese mac and cheese", price: "$8.99" },
    { name: "Buffalo Chicken Mac", description: "Mac and cheese topped with buffalo chicken", price: "$13.99" },
    { name: "BBQ Pulled Pork Mac", description: "Mac and cheese with slow-cooked BBQ pulled pork", price: "$14.99" },
    { name: "Lobster Mac & Cheese", description: "Premium lobster meat in creamy cheese sauce", price: "$18.99" },
    { name: "Bacon Jalapeño Mac", description: "Crispy bacon and jalapeños for a spicy kick", price: "$12.99" },
  ],
  "Loaded Fries": [
    { name: "Philly Cheese Fries", description: "Fries topped with steak, cheese, peppers, and onions", price: "$11.99" },
    { name: "Buffalo Chicken Fries", description: "Crispy fries with buffalo chicken and ranch drizzle", price: "$11.99" },
    { name: "Bacon Cheese Fries", description: "Loaded with crispy bacon and melted cheese", price: "$9.99" },
    { name: "Cajun Fries", description: "Seasoned fries with bold Cajun spices", price: "$7.99" },
    { name: "Truffle Parmesan Fries", description: "Gourmet fries with truffle oil and parmesan", price: "$10.99" },
  ],
  "Waffles & Sweets": [
    { name: "Red Velvet Waffles", description: "Rich red velvet waffles with cream cheese drizzle", price: "$9.99" },
    { name: "Chicken & Waffles", description: "Crispy fried chicken on golden Belgian waffles", price: "$15.99" },
    { name: "Churro Waffles", description: "Cinnamon sugar waffles with caramel sauce", price: "$8.99" },
    { name: "Banana Foster Waffles", description: "Caramelized bananas with rum sauce", price: "$10.99" },
    { name: "Funnel Cake Fries", description: "Crispy funnel cake strips dusted with powdered sugar", price: "$7.99" },
  ],
  "Sides": [
    { name: "French Fries", description: "Crispy golden french fries", price: "$4.99" },
    { name: "Onion Rings", description: "Beer-battered onion rings", price: "$5.99" },
    { name: "Coleslaw", description: "Creamy homemade coleslaw", price: "$3.99" },
    { name: "Corn on the Cob", description: "Grilled corn with butter and seasoning", price: "$4.99" },
    { name: "Side Salad", description: "Fresh mixed greens with choice of dressing", price: "$5.99" },
  ],
  "Beverages": [
    { name: "Soft Drinks", description: "Coke, Sprite, Dr Pepper, Fanta", price: "$2.99" },
    { name: "Sweet Tea", description: "Southern-style sweet tea", price: "$2.99" },
    { name: "Lemonade", description: "Freshly made lemonade", price: "$3.49" },
    { name: "Bottled Water", description: "Premium bottled water", price: "$1.99" },
    { name: "Energy Drinks", description: "Red Bull, Monster", price: "$3.99" },
  ],
};

export default function Menu() {
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ctaSectionRef.current) {
        const ctaRect = ctaSectionRef.current.getBoundingClientRect();
        const isCtaVisible = ctaRect.top < window.innerHeight && ctaRect.bottom > 0;
        setShowFloatingButton(!isCtaVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-primary" style={{ fontFamily: 'var(--font-dancing-script)' }}>
              Our Menu
            </span>
          </h1>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          </div>
          <p className="text-muted text-xl max-w-3xl mx-auto">
            Gourmet street food crafted with premium ingredients and crown-worthy presentation
          </p>
          <p className="text-muted text-lg mt-4 max-w-3xl mx-auto"> Order from our partner toast below</p>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {Object.entries(menuData).map(([category, items], categoryIndex) => (
            <div key={category} className="mb-20">
              {/* Category Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
                  {category}
                </h2>
                <div className="flex justify-center">
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, index) => (
                  <div 
                    key={index}
                    className="theme-card rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-yellow-500 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-yellow-500">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Order Now CTA - Desktop Bottom Section */}
          <div ref={ctaSectionRef} className="text-center mt-16 pt-16 border-t border-yellow-500/20">
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="text-3xl font-bold text-primary mb-4">
                Ready to <span className="text-yellow-500">Order?</span>
              </h3>
              <p className="text-muted text-lg mb-8">
                Place your order online for quick and easy pickup
              </p>
            </div>
            
            <Link 
              href="https://order.toasttab.com/online/crown-majestic-kitchen-foodtruck"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-12 py-5 bg-yellow-500 text-black font-bold text-xl rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50"
            >
              <span className="relative z-10">Order Now</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <p className="text-muted text-sm mt-6">
              Online ordering powered by Toast
            </p>
          </div>
        </div>
      </section>

      {/* Floating Order Button */}
      <Link 
        href="https://order.toasttab.com/online/crown-majestic-kitchen-foodtruck"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-8 right-8 z-50 group inline-flex items-center gap-3 px-8 py-4 bg-yellow-500 text-black font-bold text-lg rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-500 hover:scale-105 ${
          showFloatingButton ? 'translate-x-0 opacity-100' : 'translate-x-[200%] opacity-0'
        }`}
      >
        <span className="relative z-10">Order Now</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>

      <Footer />
    </div>
  );
}
