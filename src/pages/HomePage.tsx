import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const actionCards = [
  {
    title: 'View Albums',
    description: 'Browse through our collection of memories and moments captured throughout the year.',
    href: '/photos',
    icon: '📸',
    gradient: 'from-rose-400 via-pink-400 to-purple-400',
    hoverGradient: 'from-rose-500 via-pink-500 to-purple-500',
  },
  {
    title: 'Explore Events',
    description: 'Relive the key moments and celebrations that made this year special.',
    href: '/events',
    icon: '🎉',
    gradient: 'from-blue-400 via-indigo-400 to-purple-400',
    hoverGradient: 'from-blue-500 via-indigo-500 to-purple-500',
  },
  {
    title: 'Meet Our Class',
    description: 'Connect with classmates and discover the amazing people in our community.',
    href: '/profiles',
    icon: '👥',
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    hoverGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  {
    title: 'About the Department',
    description: 'Learn about our department, faculty, and the academic journey we shared.',
    href: '/department',
    icon: '🏛️',
    gradient: 'from-amber-400 via-orange-400 to-red-400',
    hoverGradient: 'from-amber-500 via-orange-500 to-red-500',
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section with Subtle Background */}
      <main className="flex-grow relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 animate-watercolor-float"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="max-w-4xl mx-auto animate-gentle-fade-in">
            {/* Welcome Illustration */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white/50 flex items-center justify-center mb-8 mx-auto soft-shadow">
              <span className="text-6xl">📖</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl font-poppins font-bold mb-4 text-slate-800">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                REMINISCE
              </span>
            </h1>
            
            {/* Tagline */}
            <p className="text-2xl font-poppins font-light mb-8 text-slate-600 max-w-2xl mx-auto">
              Relive, Reflect, Remember
            </p>
            
            {/* Subtitle */}
            <p className="text-lg font-poppins text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Step into our digital yearbook where memories come alive. Every photo, every event, 
              every moment captured and preserved for you to cherish forever.
            </p>
          </div>
        </div>
        
        {/* Action Cards Section */}
        <section className="relative z-10 px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-poppins font-semibold text-center text-slate-800 mb-12">
              Begin Your Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {actionCards.map((card, index) => (
                <Link href={card.href} key={card.title}>
                  <div 
                    className={`group cursor-pointer rounded-2xl p-8 bg-gradient-to-br ${card.gradient} hover:${card.hoverGradient} soft-shadow transform transition-all duration-500 hover:scale-105 hover:soft-shadow-hover flex flex-col items-center justify-center min-h-[280px] text-white animate-soft-scale`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-5xl mb-4 group-hover:animate-gentle-bounce transition-all duration-300">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-poppins font-semibold mb-3 text-center">
                      {card.title}
                    </h3>
                    <p className="text-sm text-white/90 text-center leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage; 