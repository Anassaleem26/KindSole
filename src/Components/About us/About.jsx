// AboutPage.jsx
import React from 'react';
import { aboutData } from './aboutData';

const About = () => {
  const { hero, story, values } = aboutData;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased mt-15">
      
      {/* 1. Minimal Hero Section */}
      <div className="bg-gray-800 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 block mb-3">
            Who We Are
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            {hero.title}
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Our Story / Narrative Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 sticky top-6">
              {story.heading}
            </h2>
          </div>
          <div className="md:col-span-2 space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
            {story.paragraphs.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Core Values Grid */}
      <div className="bg-white border-t border-b border-gray-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-12">
            Our Core Pillars
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {values.map((value, index) => (
              <div key={index} className="text-center md:text-left space-y-3">
                <div className="w-10 h-10 bg-gray-100 text-black font-bold flex items-center justify-center rounded-lg mx-auto md:mx-0 text-sm">
                  0{index + 1}
                </div>
                <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Call to Action (CTA) Banner */}
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="bg-gray-800 text-white rounded-2xl p-8 md:p-16 shadow-md relative overflow-hidden">
          <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to experience the collection?
          </h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm md:text-base">
            Explore our curated inventory designed to level up your everyday routine.
          </p>
          <button className="bg-white text-black px-8 py-3.5 rounded-lg font-medium hover:bg-gray-100 transition-colors tracking-wide shadow-md">
            Shop Latest Drop
          </button>
        </div>
      </div>

    </div>
  );
};

export default About;