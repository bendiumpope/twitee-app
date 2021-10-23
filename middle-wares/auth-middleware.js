import HttpError from "../utils/http-error";
import { decodeToken } from "../utils/jwt/Jwtoken";

//protecting route using a middleware function
export const protect = (Model) => {
  return async (req, res, next) => {
    try {
      if (req.method === "OPTIONS") {
        return next();
      }
      //Getting token and check if it's there
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(
          new HttpError(
            "You are not logged in! Please log in to get access",
            401
          )
        );
      }

      const decoded = decodeToken(token);
      const currentUser = await Model.findById(decoded._doc._id);
      if (!currentUser) {
        return next(
          new HttpError(
            "The user belongging to this token no longer exists",
            401
          )
        );
      }
      
      //Grant access to protected route
      req.user = currentUser;

      next();
    } catch (error) {
      const err = new HttpError("Authentication failed!", 403);
      return next(err);
    }
  };
};
