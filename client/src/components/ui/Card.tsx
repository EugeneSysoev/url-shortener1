import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  const defaultStyles =
    "bg-white p-4 md:p-6 rounded-lg shadow-xl border border-gray-200";

  return (
    <div className={`${defaultStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
