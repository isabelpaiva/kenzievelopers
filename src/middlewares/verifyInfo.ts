import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";

const verifyInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body = req.body;
  const id = req.params.id;

  const queryResultInfo: QueryResult = await client.query({
    text: "SELECT * FROM developer_infos WHERE id = $1",
    values: [id],
  });

  if (queryResultInfo.rowCount > 0) {
    return res.status(409).json({ message: "Developer infos already exists." });
  }

  if (
    body.preferredOS !== "Windows" &&
    body.preferredOS !== "Linux" &&
    body.preferredOS !== "MacOS"
  ) {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  return next();
};

export { verifyInfo };
