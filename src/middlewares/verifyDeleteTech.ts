import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";

const verifyDeleteTech = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const techName: string = req.params.name;
  const id = req.params.id;

  const queryResultP: QueryResult = await client.query({
    text: "SELECT * FROM projects WHERE id = $1",
    values: [id],
  });

  if (queryResultP.rowCount === 0) {
    return res.status(404).json({ message: "Project not found." });
  }

  const queryResultTech: QueryResult = await client.query({
    text: "SELECT * FROM technologies",
  });

  const techId = queryResultTech.rows.findIndex(
    (tech) => tech.name === techName
  );

  const queryResultTechName: QueryResult = await client.query({
    text: "SELECT * FROM technologies WHERE name = $1",
    values: [techName],
  });

  if (queryResultTechName.rowCount === 0) {
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
    values: [id, techId + 1],
  });

  if (queryResultTechProjects.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  return next();
};

export { verifyDeleteTech };
