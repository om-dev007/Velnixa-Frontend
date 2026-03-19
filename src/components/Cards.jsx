import React from "react";
import { Star } from "lucide-react";

const Cards = ({ data }) => {

  return (
    <div
      className="group w-full bg-white rounded-xl overflow-hidden
                 border border-gray-100
                 hover:shadow-md transition-all duration-300"
    >

      <div className="relative aspect-4/5 bg-gray-100 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          loading="lazy"
          className="w-full h-full object-cover
                     transition-transform duration-500
                     group-hover:scale-105"
        />

        <div
          className="absolute bottom-2 left-2 z-10
                     flex items-center gap-1
                     bg-white/95 backdrop-blur
                     px-2 py-1 rounded-md shadow-sm
                     text-xs font-semibold text-gray-800"
        >
          <Star
            className="text-green-600 fill-green-600 w-3.5 h-3.5"
          />
          {data.rating}
        </div>
      </div>

      <div className="px-3 py-2">
        <h3
          className="text-sm sm:text-[15px]
                     font-medium text-gray-900
                     leading-snug line-clamp-1"
        >
          {data.name}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-base sm:text-[15px] font-semibold text-[#1F3D2B]">
            ${data.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Cards;