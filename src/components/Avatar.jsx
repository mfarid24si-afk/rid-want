import React from 'react';

export default function Avatar({ name, size = "md" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-lg" };
  return (
    <div className={`${sizes[size]} rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-sm`}>
      {name ? name.charAt(0).toUpperCase() : "A"}
    </div>
  );
}
