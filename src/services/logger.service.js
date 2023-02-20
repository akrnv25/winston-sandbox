// https://github.com/winstonjs/winston/blob/master/README.md

const winston = require('winston');

class LoggerService {
  constructor() {
    this._logger = winston.createLogger({
      level: 'warn',
      format: winston.format.json(),
      defaultMeta: { service: 'winston-sandbox' },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' })
      ]
    });
  }

  error(message) {
    this._logger.error(message);
  }

  warn(message) {
    this._logger.warn(message);
  }
}

module.exports = new LoggerService();
