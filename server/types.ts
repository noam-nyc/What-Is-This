import { Request } from "express";
import { Session } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export interface AuthenticatedRequest extends Request {
  session: Session & { userId?: string };
}
