import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Hero: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const intervalRef = useRef<number | null>(null);
  const userEmail = localStorage.getItem('userEmail');
  const location = useLocation(); // Gunakan useLocation untuk mendapatkan path

  const getRandomImage = () => {
    const isMobile = window.innerWidth < 640;
    const images = isMobile
      ? ["/herosection-m.webp", "/herosection-m-alt.webp"]  // Mobile images
      : ["/herosection-d.webp", "/herosection-d-alt.webp"]; // Desktop images

    return images[Math.floor(Math.random() * images.length)];
  };

  useEffect(() => {
    setBackgroundImage(getRandomImage());

    intervalRef.current = window.setInterval(() => {
      setBackgroundImage(getRandomImage());
    }, 1500);

    const updateBackgroundImage = () => {
      const currentImage = backgroundImage;
      const newImage = getRandomImage();

      if ((window.innerWidth < 640 && !currentImage.includes('m')) ||
        (window.innerWidth >= 640 && !currentImage.includes('d'))) {
        setBackgroundImage(newImage);
      }
    };

    window.addEventListener('resize', updateBackgroundImage);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('resize', updateBackgroundImage);
    };
  }, [backgroundImage]);

  const handleImageClick = () => {
    setBackgroundImage(getRandomImage());
  };

  const getGreeting = () => {
    if (userEmail === 'reiidev@gmail.com') {
      return 'HI, GUEST';
    } else if (userEmail === 'revanspstudy28@gmail.com') {
      return 'HI, REIIV';
    }
    return 'BOOKVERSE';
  };

  return (
    <div
      className={`hero min-h-screen ${location.pathname === '/dashboard' ? '' : 'border-b-2 border-neutral-content'} cursor-pointer`}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        transition: 'background-image 0.5s ease-in-out',
      }}
      onClick={handleImageClick}
    >
      <div className="hero-overlay bg-opacity-65 filter grayscale"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">
            {getGreeting()}
          </h1>
          <p className="mb-5">
            {location.pathname === '/dashboard'
              ? 'We are delighted to have you here! Step into the world of BOOKVERSE, where epic stories from across the realms of manga, manhwa, and manhua await.'
              : 'Step into the world of BOOKVERSE, where epic stories from across the realms of manga, manhwa, and manhua await. '}
            Discover captivating adventures, thrilling mysteries, and heartwarming tales in one immersive platform.
            Join millions of readers and dive into a universe of limitless imagination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
