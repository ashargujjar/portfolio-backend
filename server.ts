import "dotenv/config";
import app from "./app";
import { connectDb } from "./db/db";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDb(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
};

void startServer();
