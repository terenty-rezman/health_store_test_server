import dotenv from "dotenv";
dotenv.config();

// Logging middleware
export const loggingMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// The API_KEY is passed when connecting
export const tokenVerificationMiddleware = (API_KEY) => {
  return (req, res, next) => {
    // root access without a token
    if (
      req.url === "/" ||
      req.headers[`${process.env.API_KEY_HEADER}`] === API_KEY
    ) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: Invalid API Key" });
    }
  };
};
