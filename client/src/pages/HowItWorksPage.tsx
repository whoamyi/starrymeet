import { Footer } from '@/components';
import { Link } from 'react-router-dom';

export const HowItWorksPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Browse & Discover',
      description: 'Explore our verified roster of 10,000+ celebrities across sports, entertainment, music, and business.',
      details: [
        'Real-time availability calendars',
        'See pricing and booking types',
        'Read authentic reviews from past meetings',
      ],
    },
    {
      number: '02',
      title: 'Request & Book',
      description: 'Choose your meeting type and submit your booking request with a personalized message.',
      details: [
        'Quick Meet (15 min) - $500-$2,000',
        'Standard Session (30 min) - $2,000-$10,000',
        'Premium Experience (1 hr) - $10,000+',
      ],
    },
    {
      number: '03',
      title: 'Get Approved',
      description: 'Celebrities review requests personally. Most respond within 24-48 hours.',
      details: [
        'Payment held in secure escrow',
        'Full refund if declined',
        'Confirmation with meeting details',
      ],
    },
    {
      number: '04',
      title: 'Meet Your Icon',
      description: 'Attend your confirmed meeting at a premium venue. Create memories that last forever.',
      details: [
        'Professional venues in city centers',
        'Take photos and videos',
        '100% money-back guarantee',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            How StarryMeet Works
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            From discovery to meeting in four simple steps
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-[#D4A574] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#C49563] transition text-lg"
          >
            <span>Start Browsing</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row gap-8 items-start ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:w-1/3">
                <div className="text-7xl font-bold text-gray-800 mb-4">{step.number}</div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-white mb-4">{step.title}</h2>
                <p className="text-lg text-gray-300 mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400">
                      <span className="text-[#D4A574] mt-1">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-gray-900 border border-gray-800 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to meet your icon?</h3>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of fans who've had life-changing experiences
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-[#D4A574] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#C49563] transition text-lg"
          >
            Browse Celebrities
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};
