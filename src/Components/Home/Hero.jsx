import React from 'react';
import bgImage from '../../assets/Bg image/pexels-tima-miroshnichenko-7202768.webp';

const Hero = () => {



  return (
    <section >
      {/* Background Image Layer */}
      <div className="hero min-h-143 relative overflow-hidden flex items-center justify-center">
        <div
          className="hero-overlay absolute inset-0 z-0 bg-opacity-60"
          style={{
            backgroundImage: `url("${bgImage}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        {/* Centered Content Container */}
        <div className="hero-content relative z-10 text-center text-neutral-content">
          <div className="max-w-2xl px-4">

            {/* Use text-5xl for small and text-7xl for medium+ to see a big difference */}
            <h3 className="mb-8 text-4xl sm:text-5xl md:text-5xl  text-gray-900 font-family ">
              Comfort that doesn't <br className="hidden md:block" /> cost the planet
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white">
              <button className="btn btn-primary w-full sm:w-auto px-7 transition-all hover:scale-105 bg-gray-800 h-10 rounded-[20px] text-[17px] opacity-90">
                Shop Men
              </button>
              <button className="btn btn-primary w-full sm:w-auto px-7 transition-all hover:scale-105 bg-gray-800 h-10 rounded-[20px] text-[17px] opacity-90">
                Shop Women
              </button>
            </div>
          </div>
        </div>
      </div>



     
    </section>
  );
};

export default Hero;


