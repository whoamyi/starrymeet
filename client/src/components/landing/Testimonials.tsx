import { Link } from 'react-router-dom';

export const Testimonials = () => {
  const testimonials = [
    {
      stars: 5,
      quote:
        'Meeting Elon at Tesla HQ was surreal. He spent an extra 20 minutes discussing AI ethics. Worth every penny for the insights I gained.',
      author: {
        name: 'Michael C.',
        title: 'Tech Founder',
      },
      celebrity: 'Elon Musk',
    },
    {
      stars: 5,
      quote:
        'Virtual meeting with Taylor Swift was incredible. She was warm, authentic, and genuinely interested in my non-profit work.',
      author: {
        name: 'Sarah L.',
        title: 'Entrepreneur',
      },
      celebrity: 'Taylor Swift',
    },
    {
      stars: 5,
      quote:
        'Spending time with Serena Williams discussing resilience and leadership changed my perspective on business challenges.',
      author: {
        name: 'David P.',
        title: 'CEO',
      },
      celebrity: 'Serena Williams',
    },
  ];

  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experiences That Matter
          </h2>
          <p className="text-xl text-gray-400">Real stories from real members</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-[#D4A574] transition"
            >
              {/* Stars */}
              <div className="text-2xl text-[#D4A574] mb-4">
                {'★'.repeat(testimonial.stars)}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-300 leading-relaxed mb-6">
                {testimonial.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.author.title}
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-green-500">✓</span>
                <span>Verified meeting with {testimonial.celebrity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Join 1,247 members who've had transformative experiences
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-[#D4A574] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#C49563] transition text-lg"
          >
            <span>Start Your Journey</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
