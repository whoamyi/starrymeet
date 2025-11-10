import { Footer } from '@/components';

export const About = () => {
  const stats = [
    { number: '50K+', label: 'Meetings created' },
    { number: '10K+', label: 'Verified celebrities' },
    { number: '98%', label: 'Satisfaction rate' },
    { number: '2020', label: 'Founded' },
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Authenticity',
      description: 'Every celebrity is verified. Every meeting is real. No fakes, no scams.',
    },
    {
      icon: '⭐',
      title: 'Quality',
      description: 'Premium venues. Professional staff. Experiences you\'ll treasure forever.',
    },
    {
      icon: '🛡️',
      title: 'Trust',
      description: 'Secure payments. Clear policies. Your satisfaction guaranteed.',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Connecting fans<br />with their icons
          </h1>
          <p className="text-xl text-gray-300">
            We believe everyone deserves a moment with the people who inspire them
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Our mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            To create authentic, meaningful connections between celebrities and their fans through
            face-to-face meetings. We're building a platform where inspiration meets reality, and
            dreams become memories.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[rgba(255, 255, 255, 0.8)] mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What we value</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-[rgba(255, 255, 255, 0.8)] transition"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
