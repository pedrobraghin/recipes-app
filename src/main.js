import "dotenv/config";
import { app } from "./app.js";
import { Database } from "./database.js";

const port = process.env.PORT || 8080;

async function main() {
  const database = new Database();
  try {
    await database.connect();
    console.log("database connected");
    app.listen(port, () => console.log("Server is runnig on port " + port));
  } catch (e) {
    console.log(e);
    await database.disconnect();
  }
}

main();
