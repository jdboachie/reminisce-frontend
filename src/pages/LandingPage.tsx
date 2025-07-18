import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Landing page content will go here */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Welcome to Reminisce</h1>
          <p className="text-center text-gray-600">Landing page content will be added here</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage; 