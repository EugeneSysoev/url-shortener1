import React from "react";
import { Link } from "lucide-react";

// Компонент для отображения состояния отсутствия данных
const EmptyState = ({
  title = "Нет ссылок",
  message = "У вас пока нет сокращённых ссылок.",
  actionText = "Создайте первую выше!",
  icon = <Link size={48} className="text-gray-400 mx-auto mb-4" />,
  className = "",
}) => {
  // Возвращаем разметку компонента EmptyState
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      {icon}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-4 max-w-md">{message}</p>
      {actionText && <p className="text-blue-600 font-medium">{actionText}</p>}
    </div>
  );
};

export default EmptyState;
