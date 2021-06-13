import { TransformableInfo } from 'logform';
import path from 'path';
import winston from 'winston';

const { createLogger, format, transports } = winston;
const { colorize, combine, printf, timestamp } = format;

const customLevels = {
  colors: {
    debug: 'yellow',
    error: 'red',
    info: 'cyan',
    silly: 'gray',
    warn: 'magenta'
  }
};

winston.addColors(customLevels.colors);

const wlogger = (appModule: { filename: string }): winston.Logger => {
  const appName = `${path.basename(appModule.filename)}/${process.pid}`;
  const customFormat = combine(
    timestamp({ format: 'DD/MM/YY HH:mm:ss:SSS' }),
    colorize({ all: true }),
    printf((info: TransformableInfo): string => {
      const stringifiedRest = JSON.stringify({
        ...info,
        level: undefined,
        message: undefined,
        splat: undefined,
        timestamp: undefined
      });
      if (stringifiedRest !== '{}' && stringifiedRest !== '{"meta":{}}') {
        return `${info.timestamp} ${info.level} (${appName}): ${info.message} ${stringifiedRest}`;
      }
      return `${info.timestamp} ${info.level} (${appName}): ${info.message}`;
    })
  );

  return createLogger({
    level: 'info',
    transports: [
      new transports.Console({
        format: customFormat,
        level: 'silly'
      }),
    ]
  });
};

export default wlogger;
