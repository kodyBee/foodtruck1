import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Our Menu | Crown Majestic Kitchen",
  description: "Explore our gourmet food truck menu featuring wings, cheesesteaks, mac & cheese bowls, and more. Made with premium ingredients and crown-worthy presentation.",
  openGraph: {
    title: "Our Menu | Crown Majestic Kitchen",
    description: "Explore our gourmet food truck menu featuring wings, cheesesteaks, mac & cheese bowls, and more.",
    type: "website",
  },
};

export default function Menu() {
  return (
    <div className="min-h-screen menu-page-bg">
      <Navigation />

      {/* Menu Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 menu-section-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-serif italic mb-4" style={{ fontFamily: 'cursive' }}>
              <span className="text-primary font-bold" style={{ fontFamily: 'var(--font-dancing-script)' }}>Our Menu</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Menu Items */}
            <div className="theme-card p-6 hover:border-yellow-500 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20">
              <h3 className="text-2xl font-bold text-primary mb-3">8 or 6pc Wings w/Fries</h3>
              <p className="text-yellow-500 text-sm mb-2 uppercase tracking-wider">
                Crown Buffalo • Zesty Lemon Pepper • Garlic Parmesan<br/>
                Citrus BBQ • Gochujang Sweet & Spicy • Gucci Ranch
              </p>
            </div>

            <div className="border-2 border-yellow-600/30 bg-neutral-700/50 p-6 hover:border-yellow-500 hover:bg-neutral-700/70 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20">
              <h3 className="text-2xl font-bold text-white mb-3">Smoked Gouda Cheese Fries</h3>
              <p className="text-gray-400 text-sm mb-2">
                <span className="text-yellow-500 uppercase">Add:</span> Fried Chicken Tenders • Shawarma Chicken • Shaved Rib Eye
              </p>
              <p className="text-gray-400 text-sm uppercase">
                Topped with: Green Onions & Parsley
              </p>
            </div>

            <div className="border-2 border-yellow-600/30 bg-neutral-700/50 p-6 hover:border-yellow-500 hover:bg-neutral-700/70 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20">
              <h3 className="text-2xl font-bold text-white mb-3">Crown Cheesesteak w/Fries</h3>
              <p className="text-gray-400 text-sm uppercase">
                White American • Tri-Color Bell Peppers • Onions • Mushrooms
              </p>
            </div>

            <div className="border-2 border-yellow-600/30 bg-neutral-700/50 p-6 hover:border-yellow-500 hover:bg-neutral-700/70 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20">
              <h3 className="text-2xl font-bold text-white mb-3">Shawarma Chicken Cheesesteak w/Fries</h3>
              <p className="text-gray-400 text-sm uppercase">
                White American • Tri-Color Bell Peppers • Onions • Mushrooms
              </p>
            </div>

            <div className="border-2 border-yellow-600/30 bg-neutral-700/50 p-6 hover:border-yellow-500 hover:bg-neutral-700/70 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20">
              <h3 className="text-2xl font-bold text-white mb-3">Chicken Mac & Cheese Bowl</h3>
              <p className="text-gray-400 text-sm uppercase">
                Chicken Tenders • BBQ Drizzle • Green Onions
              </p>
            </div>

            <div className="border-2 border-yellow-600/30 bg-neutral-700/50 p-6 hover:border-yellow-500 hover:bg-neutral-700/70 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20">
              <h3 className="text-2xl font-bold text-white mb-3">Q&apos;s Loaded Steak & Mac Bowl</h3>
              <p className="text-gray-400 text-sm uppercase">
                Smoked Gouda Mac & Cheese • Shaved Rib-Eye Steak<br/>
                Crown Buffalo Sauce • Ranch • Green Onions
              </p>
            </div>

            <div className="border-2 border-yellow-600/30 bg-neutral-700/50 p-6 hover:border-yellow-500 hover:bg-neutral-700/70 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20">
              <h3 className="text-2xl font-bold text-white mb-3">Veggie Sub or Wrap w/Fries or Mac & Cheese</h3>
              <p className="text-gray-400 text-sm uppercase">
                White American • Tri-Color Bell Peppers • Onions • Mushrooms<br/>
                Gucci Ranch Sauce • Jalapeños
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
