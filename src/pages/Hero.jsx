import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";

import Hero1 from "../assets/heroImg.webp";
import Hero2 from "../assets/Hero2.webp";
import Hero8 from "../assets/HeroImg8.webp";

const heroImages = [Hero1, Hero2, Hero8];

const Hero = () => {
  return (
    <section className="relative w-full sm:min-h-[90vh] overflow-hidden">

      <Swiper
        modules={[Autoplay]}
        loop
        speed={1600}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        slidesPerView={1}
        className="w-full sm:min-h-[90vh]"
      >
        {heroImages.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt="Hero background"
              className="w-full sm:h-[90vh] object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchpriority={index === 0 ? "high" : "auto"}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/10 z-10" />

      <div className="absolute inset-0 z-20 flex items-center py-20 sm:py-0 px-4 sm:px-10 md:px-20">
        <div className="flex flex-col font-playfair gap-3 max-w-xl">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-extrabold text-[#f3f2f2ea]">
            Effortlessly Chic.
          </h1>

          <h2 className="text-sm sm:text-xl lg:text-3xl font-semibold text-[#f3f2f2ea]">
            Explore New Collections
          </h2>

          <p className="text-xs sm:text-sm lg:text-lg text-white max-w-md">
            Fashion that fits your life
          </p>

          <Link
            to="/mens"
            className="mt-5 w-fit px-6 py-2.5 bg-[#2F6B4F] hover:bg-[#24563F] transition-all text-white rounded-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;