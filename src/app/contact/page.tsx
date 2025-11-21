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
          
          <div className="contact-glass-card glass-card-border shadow-2xl rounded-3xl p-8 sm:p-12">
            {status === 'success' ? (
              <div className="text-center py-12">
                <h3 className="text-3xl font-bold glass-text-heading mb-4 flex items-center justify-center gap-2">
                  <span>Message Sent!</span>
                  <span className="text-4xl">👑</span>
                </h3>
                <p className="glass-text-muted mb-4">Thank you for contacting Crown Majestic Kitchen. We will get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="px-6 py-3 rounded-full glass-button text-black font-bold shadow-lg hover:scale-105 transition-all border border-yellow-400">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold contact-glass-label mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 contact-glass-input border-2 glass-card-border rounded-xl placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold contact-glass-label mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 contact-glass-input border-2 glass-card-border rounded-xl placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold contact-glass-label mb-2">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 contact-glass-input border-2 glass-card-border rounded-xl placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="eventDate" className="block text-sm font-bold contact-glass-label mb-2">
                    EVENT DATE (if applicable)
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    className="w-full px-4 py-3 contact-glass-input border-2 glass-card-border rounded-xl placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold contact-glass-label mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 contact-glass-input border-2 glass-card-border rounded-xl placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none resize-none transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-8 py-4 rounded-full glass-button text-black font-bold text-lg shadow-lg hover:scale-105 transition-all border border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
                
                {status === 'error' && (
                  <p className="text-red-400 text-center mt-4 font-semibold">Something went wrong. Please try again.</p>
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