const dotenv = require('dotenv').config();

let port = process.env.PORT || 6000;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


mongoose.set("strictQuery", true);

try {
  const connect = mongoose.connect(process.env.URL);
  console.log("db working");
} catch (error) {
  console.log(error);
}
const User = mongoose.model("User", {
  name:{ type:String,
        required:true},
  score: Number,
});

const Question = mongoose.model("Question", {
  question:{
    type:Object
  }
});

const app = express();
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Welcome to Meta");
});

app.get("/questions", async(req, res) => {
  const importData = await Question.find()
  res.send(importData);
});

app.post("/user", async (req, res) => {
  const { name, score } = req.body;
  
  try {
    const newUser = new User({
      name: name,
      score: score,
    });
    await newUser.save();
    console.log({ _id: newUser.id });
    res.status(200).send(newUser.id);
    return;
  } catch (error) {
    res.status(400).send(error);
  }
});
//add score
app.put("/updateUser", async (req, res) => {
  try {
    const { _id, score } = req.body;
    if(mongoose.Types.ObjectId.isValid(_id))
    {
      const updateUser = await User.findByIdAndUpdate(_id, { score: score });
      res.status(200).json(updateUser);
      return;
    }
    else
    {
      res.send("not a valid id. Contact WLUGian for scores")
        return ; 
    }
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
});


app.listen(port, () => {
  console.log(`app listening ${port}`);  
});
