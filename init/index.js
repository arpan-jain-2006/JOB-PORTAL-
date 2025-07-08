const mongoose = require("mongoose");
const initdata = require("./data.js");
const Jobs = require("../models/jobs.js");

const mongourl = "mongodb://127.0.0.1:27017/Naukri";
main()
.then(()=>{
    console.log("connection with DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongourl);
}

const initDB = async()=>{
    await Jobs.deleteMany({});
    await Jobs.insertMany(initdata.data);
    console.log("data init" );
}
initDB();