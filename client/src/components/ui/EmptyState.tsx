import { Link2 } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <Link2 className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        У вас пока нет ссылок
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Сократите свою первую ссылку, и она появится здесь.
      </p>
    </div>
  );
};

export default EmptyState;
