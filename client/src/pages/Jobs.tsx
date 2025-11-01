import { Footer } from '@/components';

export const Jobs = () => {
  const openings = [
    {
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'Remote / Los Angeles',
      type: 'Full-time',
    },
    {
      title: 'Celebrity Relations Manager',
      department: 'Talent',
      location: 'Los Angeles',
      type: 'Full-time',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote / New York',
      type: 'Full-time',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Join StarryMeet
          </h1>
          <p className="text-xl text-gray-300">
            Help us create magical moments between fans and their icons
          </p>
        </div>
      </section>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why work with us?</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-3">Fast Growth</h3>
            <p className="text-gray-400">
              Join a rocket ship. We're growing 300% year-over-year.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-white mb-3">Impact</h3>
            <p className="text-gray-400">
              Your work directly affects millions of users and thousands of celebrities.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-white mb-3">Perks</h3>
            <p className="text-gray-400">
              Competitive salary, equity, health benefits, and meet celebrities.
            </p>
          </div>
        </div>

        {/* Open Positions */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Open positions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {openings.map((job, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#D4A574] transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <a
                  href={`mailto:jobs@starrymeet.com?subject=Application: ${job.title}`}
                  className="bg-[#D4A574] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#C49563] transition whitespace-nowrap text-center"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* General Application */}
        <div className="mt-16 text-center bg-gray-900 border border-gray-800 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-white mb-4">Don't see the right role?</h3>
          <p className="text-gray-400 mb-6">
            Send us your resume anyway. We're always looking for exceptional talent.
          </p>
          <a
            href="mailto:jobs@starrymeet.com"
            className="inline-flex items-center gap-2 bg-[#D4A574] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#C49563] transition"
          >
            Send Resume
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};
