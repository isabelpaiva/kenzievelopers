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
    text: `SELECT * FROM developers LEFT JOIN developer_infos ON developers.id = "developer_infos.developerId" WHERE developers.id = $1`,
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

export {
  createDeveloper,
  createDeveloperInfo,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
};