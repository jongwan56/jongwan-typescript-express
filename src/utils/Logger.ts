import { existsSync, mkdirSync } from "fs";
import { Logger, createLogger, LoggerOptions, format, transports } from "winston";
import "winston-daily-rotate-file";
import { env } from "../env";

const { combine, timestamp, printf, prettyPrint, colorize, json, errors } = format;

const FILE_PATH = "logs";

if (!existsSync(FILE_PATH)) {
  mkdirSync(FILE_PATH);
}

const consoleOutputFormat = combine(
  colorize(),
  prettyPrint(),
  json(),
  printf((info) => `${info.timestamp as string} ${info.level}: ${info.message}`)
);

const fileOutputFormat = combine(
  printf((info) => {
    const stack = info.stack ? " | " + (info.stack as string) : "";
    return `${info.timestamp as string} ${info.level}: ${info.message}${stack}`;
  })
);

const options: LoggerOptions = {
  level: env.isProduction ? "info" : "debug",
  exitOnError: false,
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS Z" }), errors({ stack: true })),
  transports: [
    new transports.Console({
      handleExceptions: true,
      format: consoleOutputFormat,
    }),
    new transports.DailyRotateFile({
      handleExceptions: true,
      format: fileOutputFormat,
      filename: `${FILE_PATH}/app-%DATE%.log`,
    }),
  ],
};

export const logger: Logger = createLogger(options);
