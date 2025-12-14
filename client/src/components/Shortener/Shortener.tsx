import { ChangeEvent, FormEvent } from "react";
import { useShortener } from "./useShortener";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

function Shortener() {
  const {
    longUrl,
    shortUrl,
    error,
    isLoading,
    setLongUrl,
    handleSubmit,
    handleCopy,
  } = useShortener();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLongUrl(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Card className="max-w-4xl mx-auto mb-6">
      <form onSubmit={handleFormSubmit} className="flex gap-3 mb-6">
        <Input
          type="url"
          name="url"
          value={longUrl}
          onChange={handleInputChange}
          placeholder="Введите длинный URL здесь..."
          required
          disabled={isLoading}
        />
        <Button type="submit" isLoading={isLoading}>
          Сократить
        </Button>
      </form>

      {error && (
        <p className="text-red-700 p-3 bg-red-100 border-l-4 border-red-500 rounded-md mb-4 text-sm">
          {error}
        </p>
      )}

      {shortUrl && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-blue-600 hover:underline wrap-break-words pr-4 mb-2 sm:mb-0"
          >
            {shortUrl}
          </a>
          <Button
            onClick={handleCopy}
            variant="secondary"
            className="py-2 px-4 whitespace-nowrap"
          >
            Копировать 📋
          </Button>
        </div>
      )}
    </Card>
  );
}

export default Shortener;
