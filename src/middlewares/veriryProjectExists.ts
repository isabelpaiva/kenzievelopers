import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";

const verifyProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id;

  const queryResult: QueryResult = await client.query({
    text: "SELECT * FROM projects WHERE id = $1",
    values: [id],
  });

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Project not found." });
  }

  return next();
};

export { verifyProjectExists };
