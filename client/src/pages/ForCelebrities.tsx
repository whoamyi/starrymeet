import { useState } from 'react';
import { Footer } from '@/components';
import { toastConfig } from '@/hooks/useToast';

export const ForCelebrities = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    followers: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toastConfig.success('Application submitted! We will review and contact you within 3-5 business days.');
    setFormData({ name: '', email: '', category: '', followers: '' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Join StarryMeet
          </h1>
          <p className="text-xl text-gray-300">
            Monetize your influence. Connect with your true fans.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-3">Earn More</h3>
            <p className="text-gray-400">
              Set your own rates. Keep 80% of every booking. Payments within 48 hours.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-3">Your Schedule</h3>
            <p className="text-gray-400">
              Full control over availability. Accept or decline any request. No obligations.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-white mb-3">Safe & Secure</h3>
            <p className="text-gray-400">
              Premium venues. Security staff. Verified fans only. Insurance covered.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Apply Now</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(255, 255, 255, 0.8)] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(255, 255, 255, 0.8)] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[rgba(255, 255, 255, 0.8)] transition"
              >
                <option value="">Select category...</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="entertainment">Entertainment</option>
                <option value="business">Business</option>
                <option value="influencer">Influencer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Social Media Followers *
              </label>
              <input
                type="text"
                value={formData.followers}
                onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                required
                placeholder="e.g. 100K on Instagram"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(255, 255, 255, 0.8)] transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[rgba(255, 255, 255, 0.8)] text-black font-semibold py-3 rounded-xl hover:bg-[rgba(255, 255, 255, 0.7)] transition"
            >
              Submit Application
            </button>

            <p className="text-sm text-gray-400 text-center">
              Applications reviewed within 3-5 business days
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};
