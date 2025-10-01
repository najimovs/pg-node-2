import express from "express";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import transfersRouter from "./routes/transfers.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/transfers", transfersRouter);
app.use("/users", usersRouter)

app.listen(3000, () => console.log("Server http://localhost:3000 da ishlayapti"));
