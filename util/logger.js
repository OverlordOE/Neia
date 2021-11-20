const winston = require('winston');

// Logger
module.exports = winston.createLogger(
	{
		format: winston.format.combine(
			winston.format.errors({ stack: true }),
			winston.format.timestamp({ format: 'MM-DD HH:mm:ss' }),
			winston.format.printf(log => {
				if (log.stack && log.level == 'error') return `${log.timestamp}) [${log.level}] - ${log.message}\n${log.stack}`;
				return `${log.timestamp}) [${log.level}] - ${log.message}`;
			}),
		),
		transports: [
			new winston.transports.Console({
				format: winston.format.colorize({
					all: true,
					colors: {
						error: 'red',
						info: 'cyan',
						warn: 'yellow',
						debug: 'green',
					},
				}),
			}),
			new winston.transports.File({
				filename: './logs/error.log',
				level: 'warn',
			}),
			new winston.transports.File({ filename: './logs/log.log' }),
		],
	});