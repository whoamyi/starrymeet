import { Link } from 'react-router-dom';

export const FinalCTA = () => {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-black py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Your Icon Is Waiting
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          147 verified celebrities ready to meet. Every meeting guaranteed or
          your money back. Start your journey today.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-[#D4A574] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#C49563] transition text-lg"
          >
            <span>Browse Icons</span>
            <span>→</span>
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 bg-gray-900 text-white border border-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:border-[#D4A574] transition text-lg"
          >
            <span>Learn More</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
