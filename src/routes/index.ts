import user from "./user";
import * as express from "express";
const app = express();

user(app);

export default app;
