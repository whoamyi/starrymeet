import { Footer } from '@/components';

export const Team = () => {
  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Former talent agent with 15 years connecting fans and celebrities.',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO',
      bio: 'Built platforms serving 50M+ users at top tech companies.',
    },
    {
      name: 'Emily Park',
      role: 'Head of Talent',
      bio: '10+ years managing A-list celebrities and influencers.',
    },
    {
      name: 'David Kim',
      role: 'Head of Operations',
      bio: 'Scaled luxury concierge services across 40 cities globally.',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Meet the Team
          </h1>
          <p className="text-xl text-gray-300">
            Passionate people building the future of fan experiences
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center hover:border-[#D4A574] transition"
            >
              <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-sm text-[#D4A574] mb-3">{member.role}</p>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* Join CTA */}
        <div className="mt-20 text-center bg-gray-900 border border-gray-800 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">Want to join us?</h3>
          <p className="text-gray-400 mb-8 text-lg">
            We're always looking for talented people to join our team
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2 bg-[#D4A574] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#C49563] transition text-lg"
          >
            View Open Positions
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};
