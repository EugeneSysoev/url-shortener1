import React from "react";

// Переиспользуемый компонент Input
const Input = ({ className = "", ...props }) => {
  const defaultStyles =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500";

  return <input className={`${defaultStyles} ${className}`} {...props} />;
};


export default Input;
