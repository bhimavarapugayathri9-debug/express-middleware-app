
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const Post = mongoose.model("Post", postSchema);

app.post("/api/v1/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();

    res.status(201).send({
      message: "Post created successfully",
      data: post
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).send({
      message: "Posts retrieved successfully",
      data: posts
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({
        message: "Post not found"
      });
    }

    res.status(200).send({
      message: "Post retrieved successfully",
      data: post
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.put("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).send({
        message: "Post not found"
      });
    }

    res.status(200).send({
      message: "Post updated successfully",
      data: post
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.delete("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(
      req.params.id
    );

    if (!post) {
      return res.status(404).send({
        message: "Post not found"
      });
    }

    res.status(200).send({
      message: "Post deleted successfully",
      data: post
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Express Test"
  });
});

mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME || "mern_crud"
})
.then(() => {
  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(
      `Server running at http://localhost:${port}`
    );
  });
})
.catch(err => {
  console.error(
    "MongoDB connection failed:",
    err.message
  );
});
