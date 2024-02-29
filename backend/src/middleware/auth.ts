import exp from "constants";
import { NextFunction ,Request,Response} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express{
        interface Request{
            userId:string;
            apartmentId:string;
        }
    }
}


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"];
  
    if (!token) {
      res.locals.message = "unauthorized";
      res.locals.error = "Missing authentication token.";
      return next(); // Continue to error handling middleware
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      req.userId = (decoded as JwtPayload).userId;
      next();
    } catch (error) {
      res.locals.message = "unauthorized";
      res.locals.error = "Invalid authentication token.";
      return next(); // Continue to error handling middleware
    }
  };
export default verifyToken;