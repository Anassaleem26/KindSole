// HelpPage.jsx
import React, { useState } from 'react';
import { faqData } from './helpData';

const Help = () => {
    // State to track which unique FAQ item is open
    const [openId, setOpenId] = useState(null);
    // State for tracking search queries
    const [searchQuery, setSearchQuery] = useState("");

    const toggleAccordion = (id) => {
        setOpenId(openId === id ? null : id);
    };

    // Dynamic filter utility based on title, question, or answers
    const filteredFaqData = faqData.map(category => {
        const items = category.items.filter(item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { ...category, items };
    }).filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">

            {/* 1. Hero / Search Banner */}
            <div className="bg-gray-800 text-white py-14 px-4 text-center mt-15 ">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                    How can we help you?
                </h1>
                <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base">
                    Search our database for shipping, accounts, checkouts, and tracking answers.
                </p>
                <div className="max-w-xl mx-auto mt-8 relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for questions, keywords..."
                        className="w-full px-6 py-4 rounded-full text-white border border-transparent shadow-md ring-2 ring-gray-600 focus:outline-none  focus:ring-gray-400 text-base"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors text-sm font-medium"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Main FAQ Loop Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                {filteredFaqData.length > 0 ? (
                    filteredFaqData.map((section, catIndex) => (
                        <div key={catIndex} className="mb-12 last:mb-0">
                            {/* Category Header */}
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 border-b pb-3 tracking-tight">
                                {section.category}
                            </h2>

                            {/* Accordion Group */}
                            <div className="space-y-4">
                                {section.items.map((item) => {
                                    const isOpen = openId === item.id;
                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
                                        >
                                            {/* Accordion Header Trigger */}
                                            <button
                                                onClick={() => toggleAccordion(item.id)}
                                                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none"
                                            >
                                                <span className="font-semibold text-gray-900 pr-4 text-base md:text-lg">
                                                    {item.question}
                                                </span>
                                                <span className={`text-2xl font-light text-gray-400 transition-transform duration-200 transform ${isOpen ? 'rotate-45 text-black' : 'rotate-0'}`}>
                                                    ＋
                                                </span>
                                            </button>

                                            {/* Accordion Smooth Body */}
                                            <div
                                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 border-t border-gray-100 bg-gray-50/50' : 'max-h-0'
                                                    }`}
                                            >
                                                <div className="px-6 py-5 text-gray-600 text-sm md:text-base leading-relaxed">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    /* Empty Search Fallback State */
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg font-medium">No results found for "{searchQuery}"</p>
                        <p className="text-gray-400 text-sm mt-1">Try checking your spelling or look for general topics.</p>
                    </div>
                )}
            </div>

            {/* 3. Global Static Support Footer Banner */}
            <div className="max-w-4xl mx-auto px-4 pb-20 text-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Still can't find what you need?</h3>
                    <p className="text-gray-500 max-w-lg mx-auto mb-8 text-sm md:text-base">
                        Drop us a message and our support team will handle your query directly.
                    </p>
                    <button className="bg-gray-800 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-700 transition-colors tracking-wide shadow-md">
                        Contact Support
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Help;