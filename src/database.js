import mongoose from "mongoose";

export class Database {
  async connect() {
    const DATABASE_URL = process.env.DATABASE_URL;
    mongoose.set("strictQuery", true);
    this.mongoose = await mongoose.connect(DATABASE_URL);
  }

  async disconnect() {
    await this.mongoose.disconnect();
  }
}
