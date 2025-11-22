import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Merchandise | Crown Majestic Kitchen",
  description: "Shop exclusive Crown Majestic Kitchen merchandise. T-shirts, hats, hoodies, and more branded gear to show your loyalty.",
  openGraph: {
    title: "Merchandise | Crown Majestic Kitchen",
    description: "Shop exclusive Crown Majestic Kitchen merchandise. T-shirts, hats, hoodies, and more branded gear.",
    type: "website",
  },
};

export default function Merchandise() {
  return (
    <div className="min-h-screen menu-page-bg">
      <Navigation />

      {/* Merchandise Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 menu-section-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-serif italic mb-4" style={{ fontFamily: 'cursive' }}>
              <span className="text-primary font-bold" style={{ fontFamily: 'var(--font-dancing-script)' }}>Merchandise</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>
            <p className="text-muted text-lg">
              Rep the Crown with our exclusive gear
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Merchandise Item 1 */}
            <div className="theme-card p-6 hover:border-yellow-500 hover:scale-[1.03] transition-all group cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="aspect-square bg-secondary mb-4 flex items-center justify-center border border-theme">
                <span className="text-yellow-500 text-6xl">👕</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-yellow-500 transition-colors">
                Crown Majestic T-Shirt
              </h3>
              <p className="text-muted text-sm mb-4">
                Premium cotton tee with signature logo
              </p>
              <p className="text-yellow-500 font-bold text-lg">Coming Soon</p>
            </div>

            {/* Merchandise Item 2 */}
            <div className="theme-card p-6 hover:border-yellow-500 hover:scale-[1.03] transition-all group cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="aspect-square bg-secondary mb-4 flex items-center justify-center border border-theme">
                <span className="text-yellow-500 text-6xl">🧢</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-yellow-500 transition-colors">
                Snapback Hat
              </h3>
              <p className="text-muted text-sm mb-4">
                Adjustable cap with embroidered logo
              </p>
              <p className="text-yellow-500 font-bold text-lg">Coming Soon</p>
            </div>

            {/* Merchandise Item 3 */}
            <div className="theme-card p-6 hover:border-yellow-500 hover:scale-[1.03] transition-all group cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="aspect-square bg-secondary mb-4 flex items-center justify-center border border-theme">
                <span className="text-yellow-500 text-6xl">👔</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-yellow-500 transition-colors">
                Hoodie
              </h3>
              <p className="text-muted text-sm mb-4">
                Cozy hoodie with front pocket
              </p>
              <p className="text-yellow-500 font-bold text-lg">Coming Soon</p>
            </div>

            {/* Merchandise Item 4 */}
            <div className="theme-card p-6 hover:border-yellow-500 hover:scale-[1.03] transition-all group cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="aspect-square bg-secondary mb-4 flex items-center justify-center border border-theme">
                <span className="text-yellow-500 text-6xl">🥤</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-yellow-500 transition-colors">
                Tumbler
              </h3>
              <p className="text-muted text-sm mb-4">
                Insulated stainless steel tumbler
              </p>
              <p className="text-yellow-500 font-bold text-lg">Coming Soon</p>
            </div>

            {/* Merchandise Item 5 */}
            <div className="theme-card p-6 hover:border-yellow-500 hover:scale-[1.03] transition-all group cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="aspect-square bg-secondary mb-4 flex items-center justify-center border border-theme">
                <span className="text-yellow-500 text-6xl">🎒</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-yellow-500 transition-colors">
                Tote Bag
              </h3>
              <p className="text-muted text-sm mb-4">
                Durable canvas bag with handles
              </p>
              <p className="text-yellow-500 font-bold text-lg">Coming Soon</p>
            </div>

            {/* Merchandise Item 6 */}
            <div className="theme-card p-6 hover:border-yellow-500 hover:scale-[1.03] transition-all group cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="aspect-square bg-secondary mb-4 flex items-center justify-center border border-theme">
                <span className="text-yellow-500 text-6xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-yellow-500 transition-colors">
                Phone Case
              </h3>
              <p className="text-muted text-sm mb-4">
                Protective case with logo design
              </p>
              <p className="text-yellow-500 font-bold text-lg">Coming Soon</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
