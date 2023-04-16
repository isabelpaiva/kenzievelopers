import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";

const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let email = req.body.email;

  const queryString = {
    text: "SELECT id FROM developers WHERE email = $1",
    values: [email],
  };

  const queryResult: QueryResult = await client.query(queryString);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({ message: "Email already exists." });
  }

  return next();
};

export { verifyEmail };
