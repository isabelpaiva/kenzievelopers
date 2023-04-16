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
import { verifyDeleteTech } from "./middlewares/verifyDeleteTech";
import { verifyEmail } from "./middlewares/verifyEmail";
import { verifyInfo } from "./middlewares/verifyInfo";
import { verifyTech } from "./middlewares/verifyTech";
import { verifyUserExists } from "./middlewares/verifyUserExists";
import { verifyUserProjects } from "./middlewares/verifyUserProjects";
import { verifyProjectExists } from "./middlewares/veriryProjectExists";


const app: Application = express();

app.use(express.json());

//Rotas Developer

app.post("/developers", verifyEmail, createDeveloper);
app.get("/developers/:id", verifyUserExists, getDeveloperById);
app.patch("/developers/:id", verifyUserExists, verifyEmail, updateDeveloper);
app.delete("/developers/:id", verifyUserExists, deleteDeveloper);
app.post(
  "/developers/:id/infos",
  verifyUserExists,
  verifyInfo,
  createDeveloperInfo
);

//Rotas Projects

app.post("/projects", verifyUserProjects, createProjects);
app.get("/projects/:id", verifyProjectExists, getProjectsById);
app.patch(
  "/projects/:id",
  verifyUserExists,
  verifyUserProjects,
  updateProjects
);
app.delete("/projects/:id", verifyProjectExists, deleteProjects);
app.post("/projects/:id/technologies", verifyTech, createTech);
app.delete(
  "/projects/:id/technologies/:name",
  verifyDeleteTech,
  deleteTechProjects
);


export default app;