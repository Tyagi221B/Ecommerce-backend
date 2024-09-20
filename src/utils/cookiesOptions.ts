import { CookieOptions } from 'express';

export const getCookieOptions = (maxAge: number): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true, // Always true for security
    secure: isProduction, // true in production, false otherwise
    sameSite: 'strict', // Adjust as needed
    maxAge,
  };
};
