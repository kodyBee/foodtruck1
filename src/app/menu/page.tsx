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
            <div className="mt-8 inline-block px-6 py-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg">
              <p className="text-yellow-500 font-bold text-lg uppercase tracking-wider">🚧 Under Construction 🚧</p>
              <p className="menu-construction-text text-sm mt-2">Menu items are being synced from Toast POS</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
