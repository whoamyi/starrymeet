import { useState } from 'react';
import { Footer } from '@/components';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'booking', label: 'Booking' },
    { id: 'payment', label: 'Payment' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'account', label: 'Account' },
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'How do I book a meeting?',
      answer: 'Browse celebrities, click "Book now", choose your meeting type and time, complete the application form, and submit payment. You\'ll receive approval within 48 hours.',
      category: 'booking',
    },
    {
      question: 'How far in advance should I book?',
      answer: 'We recommend booking 2-4 weeks in advance for popular celebrities. However, last-minute slots are sometimes available—check their calendar regularly.',
      category: 'booking',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex, Discover), PayPal, and Apple Pay. All payments are processed securely.',
      category: 'payment',
    },
    {
      question: 'What\'s your cancellation policy?',
      answer: 'Full refund if you cancel 7+ days before. 50% refund for 3-6 days notice. No refund for cancellations within 3 days. All refunds processed in 5-7 business days.',
      category: 'payment',
    },
    {
      question: 'Where do meetings take place?',
      answer: 'Premium hotels or private event spaces in city centers. You\'ll receive venue details 24 hours before your meeting. Free parking or transit info provided.',
      category: 'meetings',
    },
    {
      question: 'Can I take photos and videos?',
      answer: 'Yes! Personal photos and videos are encouraged. Premium experiences include professional photography. Commercial use requires celebrity permission.',
      category: 'meetings',
    },
    {
      question: 'Can I bring a guest?',
      answer: 'Quick Meets are one-on-one. For Standard and Premium sessions, you can request one guest—subject to celebrity approval and additional fees. Minors must have a guardian present.',
      category: 'meetings',
    },
    {
      question: 'What if the celebrity cancels?',
      answer: 'You\'ll receive a full refund within 5-7 business days. We\'ll also offer priority rebooking or credits toward another celebrity meeting.',
      category: 'booking',
    },
    {
      question: 'How do I reschedule my meeting?',
      answer: 'Log into your dashboard and click "Reschedule" on your booking. Free if done 7+ days in advance. For changes within 7 days, contact support.',
      category: 'account',
    },
    {
      question: 'How do I know celebrities are authentic?',
      answer: 'Every celebrity goes through rigorous verification. We work directly with management teams and verify identities. Look for the "✓ Verified" badge on profiles.',
      category: 'account',
    },
  ];

  const filteredFAQs = faqItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            How can we help?
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Quick answers to your most common questions
          </p>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(255, 255, 255, 0.8)] transition"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition ${
                selectedCategory === category.id
                  ? 'bg-[rgba(255, 255, 255, 0.8)] text-black'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-white font-medium pr-4">{item.question}</span>
                  <span className="text-[rgba(255, 255, 255, 0.8)] text-2xl flex-shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No results found for "{searchQuery}
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-gray-400 mb-6">
            Our support team is here to help
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[rgba(255, 255, 255, 0.8)] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[rgba(255, 255, 255, 0.7)] transition"
          >
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};
