import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
import { env } from "../env";
import { logger } from "../utils/Logger";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: Error): void {
    logger.error((env.isDevelopment && error.stack) || error);
  }
}
