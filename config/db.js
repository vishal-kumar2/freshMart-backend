import mongoose from "mongoose";

const connectDB = ()=>{ mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "FreshStore_Grocery_Website",
  })
  .then(() => console.log("MongoDB Connected..!"))
  .catch((err) => console.log(err));
}

export default connectDB;
