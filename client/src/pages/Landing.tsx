import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { celebrityApi } from '@/services/api';
import type { Celebrity } from '@/types';
import { BackgroundAnimation } from '@/components/common/BackgroundAnimation';
import { Footer } from '@/components';

export const Landing = () => {
  const { data: celebrities, isLoading } = useQuery({
    queryKey: ['featured-celebrities'],
    queryFn: () => celebrityApi.getFeatured(6),
  });

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Subtle background animation */}
      <BackgroundAnimation />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section - No image, clean text */}
        <section className="page-container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <div className="container-narrow text-center">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              147 verified icons available
            </div>

            {/* Main headline */}
            <h1 className="mb-4">
              Experiences That Matter
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Connect with the world's most influential celebrities for private meetings
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Browse Icons
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-lg font-medium hover:bg-white/5 transition-colors"
              >
                How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold mb-1">147</div>
                <div className="text-sm text-gray-500">Verified Icons</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">1,247</div>
                <div className="text-sm text-gray-500">Meetings</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">100%</div>
                <div className="text-sm text-gray-500">Guaranteed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Icons */}
        <section className="section page-container">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2>Meet The Icons</h2>
              <Link to="/browse" className="text-sm text-gray-400 hover:text-white transition-colors">
                View All →
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-900 rounded-xl aspect-[3/4] mb-3"></div>
                    <div className="h-4 bg-gray-900 rounded mb-1"></div>
                    <div className="h-3 bg-gray-900 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {celebrities && celebrities.map((celeb: Celebrity) => (
                  <Link
                    key={celeb.id}
                    to={`/celebrity/${celeb.slug}`}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] bg-gray-900">
                      {celeb.profile_image ? (
                        <img
                          src={celeb.profile_image}
                          alt={celeb.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          {celeb.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{celeb.name}</h4>
                    <p className="text-xs text-gray-500">{celeb.category}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="section page-container bg-gray-900/30">
          <div className="container-narrow">
            <h2 className="text-center mb-8">How StarryMeet Works</h2>

            <div className="space-y-6">
              <StepCard
                number="01"
                title="Browse & Discover"
                description="Explore verified celebrities across sports, entertainment, music, and business."
              />
              <StepCard
                number="02"
                title="Request & Book"
                description="Submit your booking request with a personalized message and preferred meeting type."
              />
              <StepCard
                number="03"
                title="Meet Your Icon"
                description="Attend your confirmed meeting at a premium venue or virtually."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section page-container">
          <div className="container">
            <h2 className="text-center mb-8">Experiences That Matter</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="Meeting Serena Williams was incredible. Her insights on resilience changed my perspective completely."
                author="David P."
                role="CEO"
              />
              <TestimonialCard
                quote="The experience exceeded my expectations. Professional, memorable, and truly inspiring."
                author="Sarah L."
                role="Entrepreneur"
              />
              <TestimonialCard
                quote="Worth every penny. The insights I gained were invaluable for my career development."
                author="Michael C."
                role="Tech Founder"
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section page-container">
          <div className="container-narrow text-center py-16 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
            <h2 className="mb-4">Your Icon Is Waiting</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              147 verified celebrities ready to meet. Start your journey today.
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Icons
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

// Step Card Component
const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="flex gap-4 p-6 rounded-xl bg-black/40 border border-white/5">
    <div className="text-3xl font-bold text-gray-700">{number}</div>
    <div className="flex-1">
      <h3 className="mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role }: { quote: string; author: string; role: string }) => (
  <div className="p-6 rounded-xl bg-gray-900/40 border border-white/5">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" fill="currentColor" className="text-yellow-400">
          <path d="M8 1l1.5 4.5L14 6l-3.5 3L11.5 14 8 11.5 4.5 14 5.5 9 2 6l4.5-.5z"/>
        </svg>
      ))}
    </div>
    <p className="text-sm text-gray-300 mb-4">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
        {author.charAt(0)}
      </div>
      <div>
        <div className="font-medium text-sm">{author}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
  </div>
);
