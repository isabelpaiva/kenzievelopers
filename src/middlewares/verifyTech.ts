import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";

const verifyTech = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body = req.body;
  const id = req.params.id;

  const queryResultP: QueryResult = await client.query({
    text: "SELECT * FROM projects WHERE id = $1",
    values: [id],
  });

  if (queryResultP.rowCount === 0) {
    return res.status(404).json({ message: "Project not found." });
  }

  const queryResultTech: QueryResult = await client.query({
    text: "SELECT * FROM technologies WHERE technologies.name = $1",
    values: [body.name],
  });

  if (queryResultTech.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  const queryResultTechProjects: QueryResult = await client.query({
    text: `SELECT * FROM projects_technologies WHERE "projectId" = $1 AND "technologyId" = $2`,
    values: [id, queryResultTech.rows[0].id],
  });

  if (queryResultTechProjects.rowCount > 0) {
    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};

export { verifyTech };
