import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Particle effect background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Hero Media */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=1000&fit=crop&q=80"
            alt="Verified Celebrities"
            className="w-full rounded-3xl object-cover aspect-[4/5] shadow-2xl"
          />
          {/* Verification Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
              ✓
            </span>
            <span className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse delay-100">
              ✓
            </span>
            <span className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse delay-200">
              ✓
            </span>
          </div>
        </div>

        {/* Hero Text */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Private Access to{' '}
            <span className="bg-gradient-to-r from-[#D4A574] to-[#C49563] bg-clip-text text-transparent">
              The World's Icons
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Verified celebrities. Real meetings. Guaranteed experiences.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-8 flex-wrap">
            <div>
              <div className="text-3xl font-bold text-white">147</div>
              <div className="text-sm text-gray-400">Icons Available</div>
            </div>
            <div className="w-px bg-gray-800"></div>
            <div>
              <div className="text-3xl font-bold text-white">1,247</div>
              <div className="text-sm text-gray-400">Experiences Delivered</div>
            </div>
            <div className="w-px bg-gray-800"></div>
            <div>
              <div className="text-3xl font-bold text-white">4.9★</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap mb-6">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#C49563] transition text-lg"
            >
              <span>Browse Icons</span>
              <span>→</span>
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-gray-900 text-white border border-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition text-lg"
            >
              <span>How It Works</span>
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-gray-400">
            Trusted by members in 67 countries
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-sm">Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent"></div>
      </div>
    </section>
  );
};
