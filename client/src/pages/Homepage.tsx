import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Mock celebrity data (replace with API call)
  const celebrities = [
    { id: 1, name: 'Taylor Swift', category: 'Music', location: 'New York', price: 10000, rating: 5.0, verified: true },
    { id: 2, name: 'Chris Hemsworth', category: 'Film', location: 'Los Angeles', price: 15000, rating: 4.9, verified: true },
    { id: 3, name: 'Serena Williams', category: 'Sports', location: 'Miami', price: 12000, rating: 5.0, verified: true },
    { id: 4, name: 'Elon Musk', category: 'Business', location: 'Austin', price: 50000, rating: 4.8, verified: true },
    { id: 5, name: 'Emma Watson', category: 'Film', location: 'London', price: 8000, rating: 4.9, verified: true },
    { id: 6, name: 'Lionel Messi', category: 'Sports', location: 'Paris', price: 20000, rating: 5.0, verified: true },
  ];

  const categories = ['all', 'music', 'film', 'sports', 'business'];

  const filteredCelebrities = celebrities.filter(celeb => {
    if (selectedCategory !== 'all' && celeb.category.toLowerCase() !== selectedCategory) return false;
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      'from-amber-500 to-orange-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-teal-600',
      'from-red-500 to-rose-600',
      'from-yellow-500 to-amber-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-white">Starry</span>
              <span className="text-[#D4A574]">Meet</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/browse" className="text-gray-400 hover:text-white transition-colors text-[15px]">
                Browse
              </Link>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-[15px]">
                How It Works
              </a>
              <Link to="/auth" className="px-6 py-2.5 bg-[#D4A574] text-black rounded-full font-medium hover:bg-[#C49563] transition-all text-[15px]">
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-[#1a1a1a]">
              <div className="flex flex-col gap-2">
                <Link
                  to="/browse"
                  className="px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse
                </Link>
                <a
                  href="#how-it-works"
                  className="px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <Link
                  to="/auth"
                  className="mt-4 px-6 py-3 bg-[#D4A574] text-black text-center rounded-full font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Meet Your Icons<br />In Person
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Book exclusive face-to-face meetings with world-class celebrities when they're in your city
          </p>

          {/* Search Container */}
          <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-2xl p-6 border border-[#262626]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City Select */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-3 bg-black border border-[#404040] rounded-xl text-white focus:outline-none focus:border-[#D4A574] transition-colors"
              >
                <option value="">Select Your City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="London">London</option>
                <option value="Tokyo">Tokyo</option>
                <option value="Paris">Paris</option>
                <option value="Seoul">Seoul</option>
                <option value="Dubai">Dubai</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Sydney">Sydney</option>
                <option value="Toronto">Toronto</option>
              </select>

              {/* Date Input */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 bg-black border border-[#404040] rounded-xl text-white focus:outline-none focus:border-[#D4A574] transition-colors"
              />

              {/* Explore Button */}
              <Link
                to="/browse"
                className="px-6 py-3 bg-[#D4A574] text-black rounded-xl font-semibold hover:bg-[#C49563] transition-all text-center"
              >
                Explore Celebrities
              </Link>
            </div>

            {/* Filter Info */}
            {(cityFilter || dateFilter) && (
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {cityFilter && `📍 ${cityFilter}`}
                  {cityFilter && dateFilter && ' • '}
                  {dateFilter && `📅 ${dateFilter}`}
                </span>
                <button
                  onClick={() => {
                    setCityFilter('');
                    setDateFilter('');
                  }}
                  className="text-[#D4A574] hover:text-[#C49563] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Celebrities */}
      <section className="py-20 px-6" id="celebrities">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Celebrities
            </h2>
            <p className="text-xl text-gray-400">
              Meet the stars available for exclusive meetups
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all text-[15px] ${
                  selectedCategory === category
                    ? 'bg-[#D4A574] text-black'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#404040] hover:border-[#606060]'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Celebrity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCelebrities.map((celeb, index) => (
              <div
                key={celeb.id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#262626] hover:border-[#404040] transition-all hover:-translate-y-2 cursor-pointer group"
              >
                {/* Celebrity Image */}
                <div className={`h-80 bg-gradient-to-br ${getGradientColor(index)} flex items-center justify-center relative`}>
                  <div className="text-white text-6xl font-black">
                    {getInitials(celeb.name)}
                  </div>

                  {/* Verified Badge */}
                  {celeb.verified && (
                    <div className="absolute top-4 left-4 bg-[#D4A574] text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M10.5 3L4.5 9L1.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      Verified
                    </div>
                  )}

                  {/* Watchlist Button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                    <span className="text-white text-xl">🤍</span>
                  </button>
                </div>

                {/* Celebrity Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {celeb.name}
                  </h3>
                  <p className="text-[#D4A574] text-sm font-medium mb-3">
                    {celeb.category}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <span>📍</span>
                    <span>{celeb.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white text-2xl font-bold">
                        ${celeb.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">from</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#D4A574]">⭐</span>
                      <span className="text-white font-medium">{celeb.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/browse"
              className="inline-block px-8 py-4 bg-transparent border-2 border-[#D4A574] text-[#D4A574] rounded-full font-semibold hover:bg-[#D4A574] hover:text-black transition-all"
            >
              View All Celebrities
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#0a0a0a]" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to meet your icon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4A574] rounded-2xl flex items-center justify-center text-black text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Browse & Choose
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Explore our roster of verified celebrities and find your favorite icon. Filter by category, location, and availability.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4A574] rounded-2xl flex items-center justify-center text-black text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Book Your Meeting
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Select a time slot when they're in your city. Choose from 15-minute meet & greet to full hour experiences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4A574] rounded-2xl flex items-center justify-center text-black text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Meet Your Icon
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Show up at the designated venue and have an unforgettable one-on-one experience with your celebrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Meet Your Icon?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of fans who've had unforgettable experiences
          </p>
          <Link
            to="/browse"
            className="inline-block px-10 py-4 bg-[#D4A574] text-black rounded-full font-bold text-lg hover:bg-[#C49563] transition-all hover:-translate-y-1"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">Starry</span>
                <span className="text-[#D4A574]">Meet</span>
              </div>
              <p className="text-gray-500 text-sm">
                Connect with your icons through authentic, unforgettable experiences.
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Press</a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-[#D4A574] transition-colors">IG</a>
                <a href="#" className="text-gray-400 hover:text-[#D4A574] transition-colors">X</a>
                <a href="#" className="text-gray-400 hover:text-[#D4A574] transition-colors">TT</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1a1a1a] text-center">
            <p className="text-gray-500 text-sm">
              © 2025 StarryMeet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
