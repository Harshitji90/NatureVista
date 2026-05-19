// import mongoose from "mongoose";

// const connectDB = async ()=>{
// // const URL=`mongodb+srv://user200:user12345@cluster0.kathlem.mongodb.net/?appName=Cluster0`
// const URL=`mongodb+srv://web:1234@cluster0.imaxmwx.mongodb.net/`
//     mongoose.connection.on(`connected`,()=>console.log("Database connected Sussfully😊"))
// // return mongoose.connect(uri, options , callback);
//     return mongoose.connect(URL);
//     useNewUrlParser:true;
//     useUnifiedTopology:true;
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  const URL = process.env.MONGO_URI;

  mongoose.connection.on("connected", () => {
    console.log("Database connected Successfully");
  });

  await mongoose.connect(URL);
};

export default connectDB;