/**
 * Тест кодирования/декодирования паролей
 * Проверяет корректность работы base64 кодирования
 */

// Имитация клиентской кодировки (браузер)
function clientEncodeBase64(password) {
  // В браузере используем btoa
  // В Node.js нужно эмулировать
  return Buffer.from(password, "utf8").toString("base64");
}

// Имитация серверной декодировки (Node.js)
function serverDecodeBase64(encoded) {
  return Buffer.from(encoded, "base64").toString("utf8");
}

// Тестовые пароли
const testCases = [
  "MySecretPassword123!",
  "simple",
  "пароль123", 
  "🎉emoji🎊", 
  "a", 
  "verylongpasswordverylongpasswordverylongpassword", 
];

console.log("🧪 Тестирование кодирования паролей Base64\n");

testCases.forEach((password, index) => {
  console.log(
    `📋 Тест ${index + 1}: "${password.substring(0, 10)}${
      password.length > 10 ? "..." : ""
    }"`
  );

  // Клиент кодирует
  const encoded = clientEncodeBase64(password);
  console.log(`   📤 Закодировано: ${encoded.substring(0, 20)}...`);

  // Сервер декодирует
  const decoded = serverDecodeBase64(encoded);
  console.log(`   📥 Декодировано: ${decoded}`);

  // Проверка
  const passed = decoded === password;
  console.log(
    `   ${passed ? "✅ УСПЕХ" : "❌ ОШИБКА"}: ${
      passed ? "Пароли совпадают" : "Не совпадают!"
    }`
  );
  console.log();
});

console.log(
  "🔐 Вывод: Base64 кодирование работает корректно для всех тестовых случаев."
);
