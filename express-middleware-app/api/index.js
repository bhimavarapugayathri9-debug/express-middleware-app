
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const patients = new Map();
let nextId = 1;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

const validatePatient = (req, res, next) => {
  const { name, age, ward } = req.body;
  if (!name || !age || !ward) {
    return res.status(400).json({
      message: "Invalid patient data"
    });
  }
  next();
};

app.get("/", (req, res) => {
  res.json({ message: "Middleware API is running" });
});

app.post("/api/v1/patients", validatePatient, (req, res) => {
  const id = String(nextId++);
  patients.set(id, { id, ...req.body });
  res.status(201).json({
    message: "Patient created successfully",
    id
  });
});

app.get("/api/v1/patients", (req, res) => {
  res.json({
    message: "Patients fetched successfully",
    data: [...patients.values()]
  });
});

app.get("/api/v1/patients/:id", (req, res, next) => {
  const patient = patients.get(req.params.id);
  if (!patient) {
    return next(Object.assign(new Error("Patient not found"), {
      statusCode: 404
    }));
  }
  res.json({
    message: "Patient details fetched successfully",
    data: patient
  });
});

app.put("/api/v1/patients/:id", validatePatient, (req, res, next) => {
  if (!patients.has(req.params.id)) {
    return next(Object.assign(new Error("Patient not found"), {
      statusCode: 404
    }));
  }
  patients.set(req.params.id, {
    id: req.params.id,
    ...req.body
  });
  res.json({ message: "Patient updated successfully" });
});

app.delete("/api/v1/patients/:id", (req, res, next) => {
  if (!patients.delete(req.params.id)) {
    return next(Object.assign(new Error("Patient not found"), {
      statusCode: 404
    }));
  }
  res.json({ message: "Patient deleted successfully" });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error"
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Resource not found"
  });
});

const PORT = process.env.PORT || 6500;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
