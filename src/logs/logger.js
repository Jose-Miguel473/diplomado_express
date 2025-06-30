import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino({
 transport: {
   target: 'pino-pretty',
   options: {
     colorize: true,
     translateTime: 'SYS:standard',
   },
 },
});

export default logger;