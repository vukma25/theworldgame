import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Games from './Games'
import Footer from './Footer'
import Navbar from '../../Components/Navbar/Navbar'
import GoToTop from '../../Components/GoTopBtn/GoTopBtn'
import '../../assets/styles/Home.css'

export default function Home() {
    return (
        <React.Fragment>
            <Navbar />
            <Hero />
            <Features />
            <Games />
            <Footer />
            <GoToTop />
        </React.Fragment>
    )
}