
import React from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import VoiceButton from '../components/VoiceButton';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroBanner />
      <FeaturedProducts />
      <VoiceButton />
      <Footer />
    </div>
  );
};

export default Index;
