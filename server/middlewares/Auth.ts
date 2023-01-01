import { NextFunction, Request } from "express";
import { Response } from "../typings/Response";
import { TimestampConverter } from "../utils/Converters";
import config from "config"
import logger from "../utils/Logger";
import { CreateRespond } from "../utils/Response";
import { VerifyToken } from "../utils/Session";

export const AuthUser = (
  stopIfNotAuth: true | false = true,
  dangerousAction: true | false = false
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = `${req.headers.authorization}`;

    let data;

    try {
      data = await VerifyToken(token);
    } catch (err) {
      logger.error(`${err}`)
      return stopIfNotAuth
        ? res.status(401).send(CreateRespond(`Invalid token`, 401))
        : next();
    }

    if (!data || !data.user || !data.session || !data.refreshSession)
      return stopIfNotAuth
        ? res.status(401).send(CreateRespond(`User not logged in`, 401))
        : next();

    // Verify Dangerous Actions;
    if (dangerousAction) {
      const { refreshSession, session: accessSession, user } = data;
      const dangerousActionsTime: any = config.get("backend.auth.dangerousActions");
      const accessSessionDifferentTime =
        Date.now() - TimestampConverter(accessSession.timestamp).getTime();
      const refreshSessionDifferentTime =
        Date.now() - TimestampConverter(refreshSession.timestamp).getTime();

      if (
        (accessSessionDifferentTime &&
          accessSessionDifferentTime >=
            parseInt(dangerousActionsTime.accessToken)) ||
        (refreshSessionDifferentTime &&
          refreshSessionDifferentTime >=
            parseInt(dangerousActionsTime.refreshToken))
      )
        return res
          .status(401)
          .send(
            CreateRespond(
              "You must be logged in for less than 1 hour to do this action",
              401
            )
          );
    }

    res.locals = data;
    next();
  };
};
