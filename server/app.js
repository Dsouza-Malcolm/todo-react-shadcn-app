import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

let TODOS = [
  {
    id: "f46c8132-2946-45b8-95d9-af659a2b97aa",
    title: "Grocery",
    description: "buy milk",
    status: "Pending",
    dueDate: "2024-05-25",
    completed: false,
  },
  {
    id: "3980d5a4-dcb7-4d98-bd05-b32562bb6982",
    title: "GYM",
    description: "Exercise Push ups",
    status: "Pending",
    dueDate: "2024-05-25",
    completed: false,
  },
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/tasks", (req, res) => {
  res.status(201).json(TODOS);
});

app.get("/task/:id", (req, res) => {
  const taskId = req.params.id;
  const task = TODOS.find((todo) => todo.id === taskId);
  console.log(task);
  if (task) {
    res.status(201).json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.post("/task", (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Task data is missing" });
    }

    const newTask = req.body;

    TODOS.push(newTask);

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/task/:id", (req, res) => {
  const id = req.params.id;
  TODOS = TODOS.filter((todo) => todo.id !== id);

  res.status(200).json({ message: "Completed tasks deleted successfully" });
});

app.put("/task/:id", (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;
  TODOS = TODOS.map((todo) => (todo.id === id ? updatedTask : todo));

  res.status(200).json({ message: "Completed tasks Updated successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
