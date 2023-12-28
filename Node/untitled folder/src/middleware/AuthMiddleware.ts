import jwt from "jsonwebtoken";
import Devices from "../models/Devices";
import config from "../config/config";

class AuthMiddleware {
  static async isLoggedIn(req, res, next) {
    const excludedPaths = ["/login", "/register"];
    if (excludedPaths.includes(req.path)) {
      return next();
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, config.jwtSecretKey, async (err, decoded) => {
      if (err) {
        return res.status(405).json({
          status: 405,
          success: false,
          message: "Unauthorized",
        });
      }

      const device = await Devices.findOne({
        _id: decoded.deviceId,
        user: decoded.userId,
      });
      if (!device) {
        return res.status(403).json({
          success: false,
          status: 403,
          message: "Unauthorized",
        });
      }

      req.deviceId = decoded.deviceId;
      req.userId = decoded.userId;
      next();
    });
  }
}

export default AuthMiddleware;
