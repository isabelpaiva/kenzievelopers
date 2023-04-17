import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createDeveloperInfo,
  createProjects,
  createTech,
  deleteDeveloper,
  deleteProjects,
  deleteTechProjects,
  getDeveloperById,
  getProjectsById,
  updateDeveloper,
  updateProjects,
} from "./logics/logic";
import { ensureVerifyDeleteTechMiddleware } from "./middlewares/verifyDeleteTech";
import { ensureverifyEmailMiddleware } from "./middlewares/verifyEmail";
import { ensureVerifyInfoMiddleware } from "./middlewares/verifyInfo";
import { ensureVerifyTechMiddleware } from "./middlewares/verifyTech";
import { ensureVerifyUserExistsMiddleware } from "./middlewares/verifyUserExists";
import { ensureVerifyUserProjectsMiddleware } from "./middlewares/verifyUserProjects";
import { ensureVerifyProjectExistsMiddleware } from "./middlewares/veriryProjectExists";

const app: Application = express();

app.use(express.json());

app.post("/developers", ensureverifyEmailMiddleware, createDeveloper);
app.get("/developers/:id", ensureVerifyUserExistsMiddleware, getDeveloperById);
app.patch(
  "/developers/:id",
  ensureVerifyUserExistsMiddleware,
  ensureverifyEmailMiddleware,
  updateDeveloper
);
app.delete(
  "/developers/:id",
  ensureVerifyUserExistsMiddleware,
  deleteDeveloper
);
app.post(
  "/developers/:id/infos",
  ensureVerifyUserExistsMiddleware,
  ensureVerifyInfoMiddleware,
  createDeveloperInfo
);

app.post("/projects", ensureVerifyUserProjectsMiddleware, createProjects);
app.get("/projects/:id", ensureVerifyProjectExistsMiddleware, getProjectsById);
app.patch(
  "/projects/:id",
  ensureVerifyUserExistsMiddleware,
  ensureVerifyUserProjectsMiddleware,
  updateProjects
);
app.delete(
  "/projects/:id",
  ensureVerifyProjectExistsMiddleware,
  deleteProjects
);
app.post("/projects/:id/technologies", ensureVerifyTechMiddleware, createTech);
app.delete(
  "/projects/:id/technologies/:name",
  ensureVerifyDeleteTechMiddleware,
  deleteTechProjects
);

export default app;
