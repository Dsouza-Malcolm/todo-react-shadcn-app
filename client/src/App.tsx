import { useEffect, useState } from "react";
import MaxWidthWrapper from "./components/MaxWidthWrapper";
import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { Plus } from "lucide-react";
import axios from "axios";
import DropdownList from "./components/DropdownList";
import { Task } from "./interfaces/TaskSchema";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddClicked, setIsAddClicked] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<Task | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      const data = await response.data;
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddTask(task: Task) {
    try {
      const response = await axios.post("http://localhost:5000/task", task);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Server responded with:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  async function getTaskById(taskId: string | null) {
    try {
      if (taskId !== null) {
        const response = await axios.get(
          `http://localhost:5000/task/${taskId}`
        );
        setSelectedTaskId(response.data);
      } else {
        setSelectedTaskId(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Server responded with:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  async function updateTask(task: Task) {
    try {
      const response = await axios.put(
        `http://localhost:5000/task/${task.id}`,
        task
      );

      console.log(response.data);
      setTasks((prevTask) => prevTask.filter((t) => t.id !== task.id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Server responded with:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  async function deleteTask(taskId: string) {
    await axios.delete(`http://localhost:5000/task/${taskId}`);
    setTasks(tasks.filter((task) => task.id !== taskId));
  }

  const handleCompleteTask = (taskId: string) => {
    let updatedTask: Task | undefined;
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          updatedTask = { ...task, completed: true, status: "Completed" };
          return updatedTask;
        }
        return task;
      })
    );

    if (updatedTask) {
      updateTask(updatedTask);
    }
  };

  const filteredTasks = selectedTaskId
    ? tasks.filter((task) => task.id === selectedTaskId.id)
    : tasks;

  return (
    <div className="bg-slate-50 pb-10 min-h-screen">
      <Navbar />
      <section>
        <MaxWidthWrapper className="flex flex-col">
          <div className="pt-12 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Today</h2>
            <div>
              <DropdownList getTask={getTaskById} tasks={tasks} />
            </div>
          </div>
          <TodoList
            cancelClicked={setIsAddClicked}
            editingTask={editingTask}
            onEdit={setEditingTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
            Tasks={filteredTasks}
            taskDone={handleCompleteTask}
          />
          <div className="">
            {isAddClicked ? (
              <>
                <div>
                  <TodoForm
                    isAddClicked={setIsAddClicked}
                    onSubmit={handleAddTask}
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => setIsAddClicked(true)}
                  className="flex gap-3 items-center cursor-pointer group py-4 px-2"
                >
                  <Plus className="h-[18px] w-[18px] stroke-red-600 group-hover:bg-red-600 group-hover:stroke-white group-hover:rounded-full" />
                  <p className="text-sm font-medium text-zinc-500 group-hover:text-red-600">
                    Add Task
                  </p>
                </div>
              </>
            )}
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

export default App;
