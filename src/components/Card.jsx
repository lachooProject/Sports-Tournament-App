import React from "react";
import { Link } from "react-router-dom";

function Card({ image, name, category, onClick }) {
  return (
    <div
      className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative h-96">
        {/* ✅ Player Image */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* ✅ Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* ✅ Player Info */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{name}</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-sunsecond rounded-full text-sm font-medium">
              {category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
