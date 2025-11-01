export const StatsBar = () => {
  const stats = [
    { number: '147', label: 'Verified Icons' },
    { number: '1,247', label: 'Meetings Delivered' },
    { number: '100%', label: 'Money-Back Guarantee' },
    { number: '4.9★', label: 'Average Rating' },
  ];

  return (
    <section className="bg-black py-16 border-y border-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-around items-center gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden md:block w-px h-16 bg-gray-800"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
