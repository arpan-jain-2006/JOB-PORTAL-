const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongourl = "mongodb://127.0.0.1:27017/Naukri"; 
const User = require("./models/user.js");
const Jobs = require("./models/jobs.js");
const Apply = require("./models/apply.js");
const path = require("path");
const Job = require("./models/jobs.js");
const methodOverride = require("method-override");
const multer = require("multer");
const ejsMate = require("ejs-mate");
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static('public'));

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes"); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });



app.get("/",async(req,res)=>{
  let {id} = req.params;
  let job = Jobs.findById(id);
    res.render("listings/home",{job});
})

app.get("/test",async(req,res)=>{
    let sample = new User({
        Name:"Arpan",
        Email:"arpanj8103@gmail.com",
        Password:"Arpan@2006",
    })
     await sample.save();
     console.log("sample was saved")
     res.send("succesfull testing")
    
})

app.get("/jobs", async(req,res)=>{
    const newJob = new Jobs({
  title: "Backend Developer",
  description: "Build and maintain APIs",
  company: "Arpan Tech",
  location: "Indore",
  salary: "6 LPA",
  type: "Full-time",
  skillsRequired: ["Node.js", "MongoDB", "Express.js"],
  experience: "0-2 years",
  contactEmail: "hr@arpantech.in"
});

 await newJob.save()
  .then(() => console.log("Job created successfully!"))
  .catch(err => console.log("Error creating job:", err));
  res.send("Data saved");
})

app.get("/job",async(req,res)=>{
    let alljobs = await Jobs.find({});
    res.render("listings/index",{alljobs})
})

app.get("/job/new",async(req,res)=>{
    res.render("listings/new");
})
app.post("/job",async(req,res)=>{
    const newListing = new Jobs(req.body.job)
    await newListing.save();
    res.redirect("/job");
})

app.get("/job/:id",async(req,res)=>{
    let{id}= req.params;
    let listing = await Jobs.findById(id);
    res.render("listings/show",{ listing});
})

app.get("/job/:id/edit",async(req,res)=>{
    let{id}= req.params;
    let listing = await Jobs.findById(id);
    res.render("listings/edit",{listing})
})

app.put("/job/:id",async(req,res)=>{
    let{id}= req.params;
    await Jobs.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/job/${id}`);
})

app.delete("/job/:id",async(req,res)=>{
    let{id}= req.params;
    await Jobs.findByIdAndDelete(id);
    res.redirect("/job");
})

app.get("/job/:id/apply",async(req,res)=>{
    let{id} = req.params;
    let apply = await Jobs.findById(id);
    res.render("listings/apply",{apply})
})




app.post("/job/:id/apply", upload.single("resume"), async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, phone, coverletter } = req.body;
    const resumePath = req.file ? req.file.path : null;

    if (!fullname || !email || !phone || !coverletter || !resumePath) {
      return res.status(400).send("All fields including resume are required.");
    }

    const newApplication = new Apply({
      FullName: fullname,
      Email: email,
      Phone: phone,
      Resume: resumePath,
      CoverLetter: coverletter,
      JobId: id,
    });

    await newApplication.save();
    console.log("✅ Application saved successfully!");
    res.redirect("/job");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Server error occurred.");
  }
});


app.get("/signup",async(req,res)=>{
  res.render("listings/signup")
})

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = new User({
      Name: name,
      Email: email,
      Password: password
    });

    await newUser.save();
    res.redirect("/login"); 
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(400).send("Signup failed. Try again.");
  }
});

app.get("/login",async(req,res)=>{
  res.render("listings/login");
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(401).send(" User not found. Please sign up first.");
    }
    if (user.Password !== password) {
      return res.status(401).send(" Incorrect password.");
    }
    res.redirect("/job"); 
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("🚨 Server error. Please try again later.");
  }
});

app.listen(8080,()=>{
    console.log("server is running at port 8080")
});











































// app.post("/job/:id/apply", async (req, res) => {
//   try {
//     const { id } = req.params;
// 
//     // Debugging logs to check incoming data
//     console.log("📩 Form Body:", req.body);
// 
//     // Basic validation (optional but helpful)
//     const { fullname, email, phone, resume, coverletter } = req.body;
// 
//     if (!fullname || !email || !phone || !resume || !coverletter) {
//       return res.status(400).send("All fields are required.");
//     }
// 
//     // Save to DB using Apply schema
//     const newApplication = new Apply({
//       FullName: fullname,
//       Email: email,
//       Phone: phone,
//       Resume: resume, // plain text (link or string)
//       CoverLetter: coverletter,
//       JobId: id
//     });
// 
//     await newApplication.save();
//     console.log("✅ Application saved successfully!");
// 
//     res.redirect("/job"); // redirect to job list or success page
//   } catch (err) {
//     console.error("❌ Error in job application:", err);
//     res.status(500).send("Server error occurred.");
//   }
// });
// 


