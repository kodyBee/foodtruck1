import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Contact Us | Crown Majestic Kitchen",
  description: "Book Crown Majestic Kitchen for your next event. Weddings, parties, corporate events, and private catering available.",
  openGraph: {
    title: "Contact Us | Crown Majestic Kitchen",
    description: "Book Crown Majestic Kitchen for your next event. Weddings, parties, corporate events, and private catering available.",
    type: "website",
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen contact-page-bg">
      <Navigation />

      {/* Contact Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 contact-section-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl sm:text-6xl font-serif italic mb-4" style={{ fontFamily: 'cursive' }}>
              <span className="text-primary font-bold" style={{ fontFamily: 'var(--font-dancing-script)' }}>Contact Us</span>
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>
            <p className="text-muted text-lg">
              Ready to bring royal flavors to your event?
            </p>
          </div>

          <div className="contact-form-card border-4 border-yellow-600/30 p-8 sm:p-12 shadow-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-yellow-500 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 contact-input border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 hover:border-yellow-500/50 transition-all cursor-text"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-yellow-500 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 contact-input border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 hover:border-yellow-500/50 transition-all cursor-text"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-yellow-500 font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 contact-input border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 hover:border-yellow-500/50 transition-all cursor-text"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label htmlFor="event-date" className="block text-yellow-500 font-semibold mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  id="event-date"
                  name="event-date"
                  className="w-full px-4 py-3 contact-input border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 hover:border-yellow-500/50 transition-all cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-yellow-500 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 contact-input border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 hover:border-yellow-500/50 transition-all resize-none cursor-text"
                  placeholder="Tell us about your event..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold text-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-yellow-500/50 hover:shadow-2xl border-2 border-yellow-700 cursor-pointer"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
