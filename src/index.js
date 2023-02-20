const loggerService = require('./services/logger.service');

setTimeout(() => {
  loggerService.error('Error message');
  loggerService.warn('Warn message');
}, 3000);
