export const PressLogos = () => {
  const logos = ['Forbes', 'WSJ', 'TechCrunch', 'Bloomberg', 'FT', 'Fortune'];

  return (
    <section className="bg-black py-12 border-y border-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-500 text-sm mb-6">As featured in</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {logos.map((logo) => (
            <div key={logo} className="flex justify-center">
              <span className="text-2xl font-bold text-white opacity-60 hover:opacity-100 transition">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
