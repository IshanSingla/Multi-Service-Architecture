import winston from 'winston';
import 'winston-daily-rotate-file';

var transport = new winston.transports.DailyRotateFile({
    level: 'http',
    handleExceptions: true,
    filename: 'logs/requests/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

var transportError = new winston.transports.DailyRotateFile({
    level: 'error',
    handleExceptions: true,
    filename: 'logs/error/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

transport
    .on('error', (error) => {
        // log or handle errors here
    })
    .on('rotate', (oldFilename, newFilename) => {
        // do something fun
    });

transportError
    .on('error', (error) => {
        // log or handle errors here
    })
    .on('rotate', (oldFilename, newFilename) => {
        // do something fun
    });

export var logger = winston.createLogger({
    level: 'http',
    defaultMeta: { service: 'node[app]' },
    format: winston.format.combine(
        winston.format.colorize({ all: false }),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info) =>
            `[${new Date(info.timestamp)}] service=${
                info.service
            } level=${info.level} ${info.message}`.replace('\n', '')
        )
    ),
    transports: [
        // transportss,
        transport,
        transportError,
        // new winston.transports.Console(),
    ],
});
