import React from 'react';

// 1. Chota Reusable Card Component
const InfoCard = ({ category, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-2xl flex flex-col justify-between text-center min-h-[380px] w-full transition-all duration-300 hover:shadow-md border border-transparent hover:border-gray-200">

      <div>

        <span className="text-[11px] font-bold uppercase tracking-[2px] text-gray-400 mb-6 block italic">
          {category}
        </span>

        <h2 className="text-2xl font-semibold text-[#212121] mb-4 leading-tight">
          {title}
        </h2>

        <p className="text-[#4A4A4A] text-base leading-relaxed px-2">
          {description}
        </p>
      </div>

      <div className="mt-8">
        <span className="text-xs font-bold uppercase tracking-[1.5px] border-b-2 border-black pb-1 cursor-pointer hover:text-gray-600 hover:border-gray-600 transition-colors">
          Learn More
        </span>
      </div>
    </div>
  );
};

// 2. Main Section Component
const CardSection = () => {

  const kindsoleData = [
    {
      category: "The Kindsole Way",
      title: "Made From Nature, For Nature.",
      description: "We craft our shoes with premium natural materials like sugarcane and eucalyptus, reducing impact without compromising comfort."
    },
    {
      category: "Sustainability",
      title: "Our Carbon Neutral Pledge",
      description: "We measure, reduce, and offset our entire carbon footprint to ensure our shoes are 100% carbon neutral from day one."
    },
    {
      category: "Innovation",
      title: "Renewable Materials",
      description: "From recycled plastic bottles to castor bean oil, we use materials that are better for you and much better for the planet."
    },
    {
      category: "Community",
      title: "Designed For Everyone",
      description: "Minimalist design meets maximum performance. Our footwear is made to fit your lifestyle, wherever the road takes you."
    }
  ];

  return (
    <section className="w-full  py-16 px-4 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kindsoleData.map((item, index) => (
            <InfoCard 
              key={index}
              category={item.category}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;