import React from 'react'
import '../../App.css';

function AutoScroll() {

    // Scrolling items

    const items = [
        " SHOP MAN",
        " SHOP WOMAN",
        "NEW SEASON ARRIVALS",
        "SPRING SUMMER 2026",
        "SHOP SUSTAINABLE FOOTWEAR",
        "LIVE NOW",
    ];

    return (
        < section >
            <div className="hush-container py-1.5 bg-gray-800 ">
                <div className="hush-wrapper">

                    <div className="hush-content">
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                <p className="  uppercase text-sm tracking-widest text-white">{item}</p>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Set 2 (Identical Copy for Seamless Loop) */}
                    <div className="hush-content">
                        {items.map((item, index) => (
                            <React.Fragment key={`copy-${index}`}>
                                <p className=" uppercase text-sm tracking-widest text-white">{item}</p>
                            </React.Fragment>
                        ))}
                    </div>

                </div>
            </div>
        </section >
    )
}

export default AutoScroll