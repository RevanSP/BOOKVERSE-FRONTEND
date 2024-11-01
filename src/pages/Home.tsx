import React from 'react';
import ManhuaSection from '../sections/Manhua';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ManhwaSection from '../sections/Manhwa';
import MangaSection from '../sections/Manga';
const AlertManhua: React.FC = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <MangaSection />
            <br />
            <ManhuaSection />
            <br />
            <ManhwaSection />
            <Footer />
        </>
    );
};

export default AlertManhua;
