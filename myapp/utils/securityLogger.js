const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
const securityLogPath = path.join(logDir, "security.log");

// Создаем директорию логов, если не существует
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Логгер безопасности
const securityLogger = {
  logAuthAttempt: (ip, username, success, reason = "") => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] AUTH ${
      success ? "SUCCESS" : "FAILED"
    } - IP: ${ip}, User: ${username} ${reason ? `Reason: ${reason}` : ""}\n`;

    fs.appendFile(securityLogPath, logEntry, (err) => {
      if (err) console.error("Ошибка записи лога безопасности:", err);
    });

    console.log(
      `🔐 ${
        success ? "✅" : "❌"
      } Auth attempt: ${username} from ${ip} ${reason}`
    );
  },

  // Логирование срабатываний rate limit
  logRateLimit: (ip, path, count) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] RATE_LIMIT - IP: ${ip}, Path: ${path}, Count: ${count}\n`;

    fs.appendFile(securityLogPath, logEntry, (err) => {
      if (err) console.error("Ошибка записи лога безопасности:", err);
    });
  },

  logSecurityEvent: (event, details) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${event} - ${JSON.stringify(details)}\n`;

    fs.appendFile(securityLogPath, logEntry, (err) => {
      if (err) console.error("Ошибка записи лога безопасности:", err);
    });
  },
};

module.exports = securityLogger;
