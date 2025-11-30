import React from "react";
import { useLinks } from "../../hooks/useLinks";
import { useAuth } from "../../hooks/useAuth";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Trash2, Copy, ExternalLink } from "lucide-react";

// ФУНКЦИЯ ФОРМАТИРОВАНИЯ ВРЕМЕНИ
const formatTime = (dateString) => {
  if (!dateString) return "Неизвестно";
  return new Date(dateString).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
// ФУНКЦИЯ ФОРМАТИРОВАНИЯ ДАТЫ
const formatDate = (dateString) => {
  if (!dateString) return "Неизвестно";
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
// Компонент для отображения ссылок пользователя
function UserLinks() {
  const { links, isLoading, error, deleteLink } = useLinks();
  const { userId } = useAuth();
// Функция для копирования ссылки в буфер обмена
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };
// Обработка состояний загрузки и ошибок
  if (isLoading && links.length === 0) {
    return <p className="text-center text-gray-500 mt-8">Загрузка ссылок...</p>;
  }
// Обработка ошибок
  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg text-center">
        {error}
      </div>
    );
  }
// JSX таблицы ссылок пользователя
  return (
    <Card className="mt-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Ваши ссылки</h2>
        <span className="text-xs bg-gray-100 text-gray-500 py-1 px-2 rounded">
          ID: {userId}
        </span>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            У вас пока нет ссылок. Создайте первую выше!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Короткая ссылка
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Оригинал
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Дата создания
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {links.map((link) => (
                <tr
                  key={`${link.id}-${link.createdAt}`}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-600 hover:underline"
                      >
                        {link.shortUrl?.split("/").pop()}
                      </a>
                      <button
                        onClick={() => handleCopy(link.shortUrl)}
                        className="text-gray-400 hover:text-blue-500"
                        title="Копировать"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate hidden sm:table-cell">
                    <a
                      href={link.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      {link.longUrl}
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {/* ⭐️ БЛОК С ДАТОЙ И ВРЕМЕНЕМ */}
                    <div className="flex flex-col">
                      <span>{formatDate(link.createdAt)}</span>
                      <span className="text-xs text-gray-400">
                        {formatTime(link.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="danger"
                      className="py-1 px-3 text-xs"
                      onClick={() => {
                        if (window.confirm("Удалить эту ссылку?")) {
                          deleteLink(link.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default UserLinks;
