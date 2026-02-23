const express = require("express");
const connectDb = require("./config/db");
const dotenv = require("dotenv")
const cors = require("cors");


const app= express();
const PORT= 4050

dotenv.config()

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://myportfolio-beryl-beta-52.vercel.app"],
  credentials: true
}));


const runServer = async () => {
    await connectDb()
	app.listen(PORT, () => {
            console.log(`App is listening on Port 4050 ${PORT}`)
        });


};

runServer()

app.use((req, res, next) => {
  console.log("🌍 GLOBAL REQUEST:", req.method, req.originalUrl);
  next();
});

const educationRoutes = require("./controllers/education")
const experienceRoutes = require("./controllers/experience")
const projectRoutes = require("./controllers/project")
const messageRoutes = require("./controllers/messages")

app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/project", projectRoutes)
app.use("/api/message", messageRoutes)

console.log("✅ Experience routes mounted");





