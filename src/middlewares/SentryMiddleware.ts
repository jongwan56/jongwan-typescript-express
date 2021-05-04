import { Request, Response, NextFunction } from "express";
import {
  ExpressErrorMiddlewareInterface,
  ExpressMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { Handlers } from "@sentry/node";

@Middleware({ type: "before", priority: 2 })
export class SentryRequestHandler implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    Handlers.requestHandler({ user: true })(req, res, next);
  }
}

@Middleware({ type: "before", priority: 1 })
export class SentryTracingHandler implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    Handlers.tracingHandler()(req, res, next);
  }
}

@Middleware({ type: "after", priority: 2 })
export class SentryErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: Error, req: Request, res: Response, next: NextFunction): void {
    Handlers.errorHandler()(error, req, res, next);
  }
}
