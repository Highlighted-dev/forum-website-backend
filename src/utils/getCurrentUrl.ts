import dotenv from "dotenv";
dotenv.config();
export const getCurrentUrl = (): string => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }
  return process.env.API_URL_PROD || "";
};
