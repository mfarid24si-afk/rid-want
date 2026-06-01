import React from 'react';

export default function Button({ children, type = "primary", onClick, className = "" }) {
  const styles = {
    primary: "bg-sky-500 hover:bg-sky-600 text-zinc-950",
    secondary: "text-center text-sm text-sky-400 hover:text-sky-300 font-medium py-2 rounded-xl hover:bg-zinc-800 transition-colors",
    outline: "px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
  };

  return (
    <button onClick={onClick} className={`${styles[type]} ${className}`}>
      {children}
    </button>
  );
}
