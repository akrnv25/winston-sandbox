const loggerService = require('./services/logger.service');

setTimeout(() => {
  loggerService.error('Message', 1, 2, 3, true, false);
  loggerService.warn('Message', JSON.stringify({ name: 'Mike', lastName: 'Lilo' }));
  loggerService.info('Message', 1, 2, 3, true, false);
  loggerService.success('Message', 1, 2, 3, true, false);
  loggerService.highlight('Message', 1, 2, 3, true, false);
  loggerService.debug('Message', 1, 2, 3, true, false);
  loggerService.base('Message', 1, 2, 3, true, false);
}, 1000);
