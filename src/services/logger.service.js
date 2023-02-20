// https://github.com/winstonjs/winston/blob/master/README.md

const winston = require('winston');
const jsonStringify = require('fast-safe-stringify');
const { format } = require('util');
const { combine, timestamp, printf, label } = winston.format;
const config = require('../config');

class LoggerService {
  constructor() {
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      success: 3,
      highlight: 4,
      debug: 5,
      base: 6
    };

    const colors = {
      error: '\u001b[1;31m',
      warn: '\u001b[1;35m',
      info: '\u001b[1;36m',
      success: '\u001b[1;32m',
      highlight: '\x1b[7m\u001b[1;33m',
      debug: '\u001b[1;33m',
      log: '\u001B[37m'
    };

    // improved from https://github.com/winstonjs/winston/issues/1427 nikitamendelbaum commented on Nov 21, 2019
    const myFormat = printf(
      ({ level, message, label, timestamp, [Symbol.for('splat')]: args = [] }) => {
        // let msg = `${timestamp} [${level}] : ${message} `;
        // let msg = `${colors[level] || ''}[${label.toUpperCase()}]\x1b[0m | ${timestamp} | ${colors[level] || ''}${JSON.stringify(message)}\x1b[0m `;
        let msg = `${colors[level] || ''}[${label.toUpperCase()}]\x1b[0m | ${timestamp} | ${
          colors[level] || ''
        }${format(message)}\x1b[0m`;
        if (args) {
          msg += ', ';
          msg += format(args);
        }
        return msg;
      }
    );

    // make formatting like console.log()
    // https://github.com/winstonjs/winston/issues/1427 pgorecki commented on Jul 4, 2019
    const logLikeFormat = {
      transform(info) {
        const { timestamp, label, message } = info;
        const level = info[Symbol.for('level')];
        const args = info[Symbol.for('splat')];
        const strArgs = args ? args.map(jsonStringify).join(' ') : '';
        info[Symbol.for('message')] = `${
          colors[level] || ''
        }[${label.toUpperCase()}]\x1b[0m | ${timestamp} | ${colors[level] || ''}${jsonStringify(
          message
        )}\x1b[0m ${strArgs}`;
        return info;
      }
    };

    const transports = [new winston.transports.Console()];
    if (config.logger.writeToFile) {
      const fileTransport = new winston.transports.File({
        filename: config.logger.fileName,
        level: config.logger.level
      });
      transports.push(fileTransport);
    }

    const logger = winston.createLogger({
      colorize: true,
      prettyPrint: true,
      levels: levels,
      level: config.logger.level,
      format: combine(
        label({ label: config.logger.service }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        config.logger.wideFormatting === true ? myFormat : logLikeFormat
      ),
      transports: transports
    });

    const levelKeys = Object.keys(levels);
    levelKeys.forEach(levelKey => (this[levelKey] = logger[levelKey].bind(logger)));
  }
}

module.exports = new LoggerService();
