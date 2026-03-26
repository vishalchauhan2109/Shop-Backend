const app = require("./src/app");
const connectDB = require("./src/config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // wait for DB connection

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();