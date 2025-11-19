'use client';
import { useState } from 'react';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen contact-page-bg">
      <Navigation />
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 contact-section-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-serif italic mb-4" style={{ fontFamily: 'cursive' }}>
              <span className="text-primary font-bold" style={{ fontFamily: 'var(--font-dancing-script)' }}>Contact Us</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Have questions about catering, events, or our menu? We&apos;d love to hear from you!
            </p>
          </div>
          
          <div className="contact-form-card border-4 border-yellow-600/30 p-8 sm:p-12 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-green-500 mb-4">Message Sent! 👑</h3>
                <p className="text-muted">Thank you for contacting Crown Majestic Kitchen. We will get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-yellow-500 hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-foreground mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-black/50 border-2 border-yellow-600/30 text-foreground focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-foreground mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-black/50 border-2 border-yellow-600/30 text-foreground focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-foreground mb-2">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-black/50 border-2 border-yellow-600/30 text-foreground focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="eventDate" className="block text-sm font-bold text-foreground mb-2">
                    EVENT DATE (if applicable)
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    className="w-full px-4 py-3 bg-black/50 border-2 border-yellow-600/30 text-foreground focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-foreground mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-yellow-600/30 text-foreground focus:border-yellow-500 focus:outline-none resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-8 py-4 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold text-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
                
                {status === 'error' && (
                  <p className="text-red-500 text-center mt-4">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}