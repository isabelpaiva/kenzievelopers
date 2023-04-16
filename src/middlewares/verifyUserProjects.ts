import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";

const verifyUserProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.body.developerId;

  const queryResult: QueryResult = await client.query({
    text: "SELECT * FROM developers WHERE id = $1",
    values: [id],
  });

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Developer not found." });
  }

  return next();
};

export { verifyUserProjects };
