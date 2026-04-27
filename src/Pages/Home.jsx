import React from 'react'
import { AutoScroll, Hero, NewArrivals, MenHeroContainer, WomenHeroContainer, Videos, CardSection } from '../index'

function Home() {
    return (
        <>
            <Hero/>
            <AutoScroll />
            <NewArrivals />
            <MenHeroContainer />
            <WomenHeroContainer/>
            <Videos />
            <CardSection/>
        </>
    )
}

export default Home