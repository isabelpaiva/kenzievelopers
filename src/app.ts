import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createDeveloperInfo,
  deleteDeveloper,
  getDeveloperById,
  updateDeveloper,
} from "./logics/logic";
import { verifyEmail } from "./middlewares/verifyEmail";
import { verifyUserExists } from "./middlewares/verifyUserExists";
import { verifyInfo } from "./middlewares/verifyInfo";


const app: Application = express();

app.use(express.json());

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



export default app;