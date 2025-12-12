import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  const defaultStyles =
    "w-full p-3 border border-gray-300 rounded-lg " +
    "focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500";

  return <input className={`${defaultStyles} ${className}`} {...props} />;
};

export default Input;
