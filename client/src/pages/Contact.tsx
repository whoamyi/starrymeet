import { useState } from 'react';
import { Footer } from '@/components';
import { toastConfig } from '@/hooks/useToast';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    toastConfig.success('Message sent! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Get in touch</h1>
          <p className="text-xl text-gray-300">
            We're here to help. Reach out anytime, day or night.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Contact information</h2>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">📧 Email support</h3>
              <p className="text-gray-400">
                General inquiries:<br />
                <a href="mailto:hello@starrymeet.com" className="text-[#D4A574] hover:text-[#C49563] transition">
                  hello@starrymeet.com
                </a>
              </p>
              <p className="text-gray-400 mt-3">
                Celebrity applications:<br />
                <a href="mailto:apply@starrymeet.com" className="text-[#D4A574] hover:text-[#C49563] transition">
                  apply@starrymeet.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">📞 Phone support</h3>
              <p className="text-gray-400">
                Available 24/7 for urgent matters<br />
                <strong className="text-white">+1 (555) 123-4567</strong>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">💬 Live chat</h3>
              <p className="text-gray-400">
                Fastest response time. Click the chat icon in the bottom right corner for instant help.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">🏢 Office</h3>
              <p className="text-gray-400">
                StarryMeet Inc.<br />
                123 Celebrity Boulevard<br />
                Los Angeles, CA 90028<br />
                United States
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A574] transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A574] transition"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#D4A574] transition"
                >
                  <option value="">Choose a topic...</option>
                  <option value="booking">Booking question</option>
                  <option value="payment">Payment issue</option>
                  <option value="technical">Technical support</option>
                  <option value="celebrity">Celebrity application</option>
                  <option value="partnership">Partnership inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A574] transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4A574] text-black font-semibold py-3 rounded-xl hover:bg-[#C49563] transition"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
