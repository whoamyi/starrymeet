export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: '🔍',
      title: 'Browse & Choose',
      description:
        'Explore 147 verified celebrities. See real availability, pricing, and reviews from actual bookings.',
    },
    {
      number: '02',
      icon: '💬',
      title: 'Request & Confirm',
      description:
        'Submit your request with a personal message. Most celebrities respond within 6 hours. Payment secured in escrow.',
    },
    {
      number: '03',
      icon: '⭐',
      title: 'Meet & Experience',
      description:
        'Attend your confirmed meeting. 24/7 concierge support. 100% guarantee or full refund.',
    },
  ];

  const trustFeatures = [
    { icon: '🛡️', text: 'Payment in Escrow' },
    { icon: '✓', text: 'Identity Verified' },
    { icon: '🔒', text: 'Bank-Grade Security' },
    { icon: '🕐', text: '24/7 Support' },
  ];

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple. Secure. Guaranteed.
          </h2>
          <p className="text-xl text-gray-400">
            From discovery to meeting in three effortless steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-[#D4A574] transition"
            >
              <div className="text-6xl font-bold text-gray-800 mb-4">
                {step.number}
              </div>
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4"
            >
              <span className="text-3xl">{feature.icon}</span>
              <span className="text-sm text-gray-300 font-medium text-center">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
