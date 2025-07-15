const express = require("express");
require("dotenv").config();
const eventRoutes = require("./routes/eventRoute");
const userRoutes = require("./routes/userRoute");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
