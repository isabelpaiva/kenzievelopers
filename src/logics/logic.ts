import { Request, Response } from "express";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDeveloper = async (req: Request, res: Response) => {
  const body = req.body;

  const queryString: string = format(
    `INSERT INTO
            developers(%I)
        VALUES
            (%L)
        RETURNING *;`,
    Object.keys(body),
    Object.values(body)
  );

  const queryResult: QueryResult = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const getDeveloperById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const queryResult: QueryResult = await client.query({
    text: `SELECT * FROM developers LEFT JOIN developer_infos ON developers.id = "developerId" WHERE developers.id = $1`,
    values: [id],
  });

  const { name, email, developerSince, preferredOS, developerId } =
    queryResult.rows[0];

  const resposta = {
    developerId: developerId,
    developerName: name,
    developerEmail: email,
    developerInfoDeveloperSince: developerSince,
    developerInfoPreferredOS: preferredOS,
  };

  return res.status(200).json(resposta);
};

const createDeveloperInfo = async (req: Request, res: Response) => {
  const body = req.body;
  const id = req.params.id;
  body.developerId = id;

  const queryString: string = format(
    `INSERT INTO
              developer_infos(%I)
          VALUES
              (%L)
          RETURNING *;`,
    Object.keys(body),
    Object.values(body)
  );

  const queryResult: QueryResult = await client.query(queryString);
  return res.status(201).json(queryResult.rows[0]);
};

const updateDeveloper = async (req: Request, res: Response) => {
  const body = req.body;
  const id = req.params.id;

  const queryString = format(
    `UPDATE developers SET(%I) = ROW(%L) WHERE developers.id = $1 RETURNING *;`,
    Object.keys(body),
    Object.values(body)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteDeveloper = async (req: Request, res: Response) => {
  const id = req.params.id;
  const queryResult: QueryResult = await client.query({
    text: `DELETE FROM developers WHERE developers.id = $1`,
    values: [id],
  });

  return res.status(204).json({});
};

const createProjects = async (req: Request, res: Response) => {
  const body = req.body;
  const queryString: string = format(
    `INSERT INTO
            projects(%I)
        VALUES
            (%L)
        RETURNING *;`,
    Object.keys(body),
    Object.values(body)
  );

  const queryResult: QueryResult = await client.query(queryString);

  queryResult.rows[0].startDate = new Date(body.startDate).toISOString();
  queryResult.rows[0].endDate = queryResult.rows[0].endDate
    ? new Date(body.endDate).toISOString()
    : null;

  return res.status(201).json(queryResult.rows[0]);
};

const getProjectsById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const queryResult: QueryResult = await client.query({
    text: `SELECT
    projects.id AS "projectId",
    projects.name AS "projectName", 
    description AS "projectDescription", 
    "estimatedTime" AS "projectEstimatedTime", 
    repository AS "projectRepository", 
    "startDate" AS "projectStartDate", 
    "endDate" AS "projectEndDate",
    technologies.name AS "technologyName",
    technologies.id AS "technologyId",
    "developerId" AS "projectDeveloperId"
    FROM projects 
    LEFT JOIN projects_technologies ON projects.id = "projectId"
    LEFT JOIN technologies ON projects_technologies."technologyId" = technologies.id
    WHERE projects.id = $1`,
    values: [id],
  });

  return res.status(200).json(queryResult.rows);
};

const updateProjects = async (req: Request, res: Response) => {
  const body = req.body;
  const id = req.params.id;

  const queryString = format(
    `UPDATE projects SET(%I) = ROW(%L) WHERE projects.id = $1 RETURNING *;`,
    Object.keys(body),
    Object.values(body)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteProjects = async (req: Request, res: Response) => {
  const id = req.params.id;
  const queryResult: QueryResult = await client.query({
    text: `DELETE FROM projects WHERE projects.id = $1`,
    values: [id],
  });

  return res.status(204).json({});
};

const createTech = async (req: Request, res: Response) => {
  const body = req.body;
  const id = req.params.id;

  const queryResultProjects: QueryResult = await client.query({
    text: `SELECT * FROM projects WHERE projects.id = $1`,
    values: [id],
  });

  const queryResultTech: QueryResult = await client.query({
    text: `SELECT * FROM technologies WHERE technologies.name = $1`,
    values: [req.body.name],
  });

  const bodyTech = {
    addedIn: new Date(),
    technologyId: queryResultTech.rows[0].id,
    projectId: queryResultProjects.rows[0].id,
  };

  const queryString: string = format(
    `INSERT INTO
            projects_technologies(%I)
        VALUES
            (%L)
        RETURNING *;`,
    Object.keys(bodyTech),
    Object.values(bodyTech)
  );

  const ProjectTech = {
    technologyId: queryResultTech.rows[0].id,
    technologyName: queryResultTech.rows[0].name,
    projectId: id,
    projectName: queryResultProjects.rows[0].name,
    projectDescription: queryResultProjects.rows[0].description,
    projectEstimatedTime: queryResultProjects.rows[0].estimatedTime,
    projectRepository: queryResultProjects.rows[0].repository,
    projectStartDate: queryResultProjects.rows[0].startDate,
    projectEndDate: queryResultProjects.rows[0].endDate,
  };

  const queryResult: QueryResult = await client.query(queryString);

  return res.status(201).json(ProjectTech);
};

const deleteTechProjects = async (req: Request, res: Response) => {
  const id = req.params.id;
  const tech = req.params.name;

  const queryResultTech: QueryResult = await client.query({
    text: `SELECT * FROM technologies WHERE name = $1`,
    values: [tech],
  });

  const queryResult: QueryResult = await client.query({
    text: `DELETE FROM projects_technologies WHERE "technologyId" = $1`,
    values: [queryResultTech.rows[0].id],
  });

  return res.status(204).json({});
};

export {
  createDeveloper,
  createDeveloperInfo,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
  createProjects,
  getProjectsById,
  updateProjects,
  deleteProjects,
  createTech,
  deleteTechProjects,
};