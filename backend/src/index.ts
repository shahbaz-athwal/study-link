import express from "express";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import userProfileRoutes from "./routes/userProfile.routes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL!,
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*", toNodeHandler(auth));
app.use("/profile", userProfileRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
