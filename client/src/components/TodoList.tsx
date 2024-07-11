import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Edit, X } from "lucide-react";
import { format } from "date-fns";
import TodoForm from "./TodoForm";
import { useState } from "react";

type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: string;
  completed: boolean;
};

type TodoListProps = {
  Tasks: Task[];
  editingTask: Task | null;
  onEdit: (data: Task | null) => void;
  onUpdate: (data: Task) => void;
  onDelete: (data: string) => void;
  taskDone: (data: string) => void;
  cancelClicked: (data: boolean) => void;
};

const TodoList = ({
  Tasks,
  editingTask,
  onEdit,
  onUpdate,
  taskDone,
  cancelClicked,
  onDelete,
}: TodoListProps) => {
  const [completingTasks, setCompletingTasks] = useState<string[]>([]);

  const handleCheckBox = (taskId: string) => {
    setCompletingTasks((prev) => [...prev, taskId]);
    setTimeout(() => {
      taskDone(taskId);
    }, 1000);
  };

  const incompleteTasks = Tasks.filter((task) => task.completed !== true);

  return (
    <div className="pt-4">
      <Table>
        <TableBody>
          {incompleteTasks.map((t) => (
            <TableRow
              key={t.id}
              className={
                completingTasks.includes(t.id)
                  ? "opacity-50 transition-opacity duration-2000"
                  : ""
              }
            >
              {editingTask && editingTask.id === t.id ? (
                <TableCell colSpan={5}>
                  <TodoForm
                    onSubmit={onUpdate}
                    isAddClicked={(state: boolean) => {
                      cancelClicked(state);
                      if (!state) {
                        onEdit(null);
                      }
                    }}
                    initialTask={editingTask}
                  />
                </TableCell>
              ) : (
                <>
                  <TableCell className="w-6/12">
                    <div className="flex gap-4 justify-start items-center">
                      <div>
                        <Checkbox
                          onCheckedChange={() => handleCheckBox(t.id)}
                          checked={
                            completingTasks.includes(t.id) ? true : false
                          }
                        />
                      </div>
                      <div>
                        <Label>{t.title}</Label>
                        <p>{t.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-2/12">
                    {new Date(t.dueDate).setHours(0, 0, 0, 0) <
                    new Date().setHours(0, 0, 0, 0)
                      ? "Pending"
                      : completingTasks.includes(t.id)
                      ? "Completed"
                      : "In progress"}
                  </TableCell>
                  <TableCell className="w-2/12">
                    {format(new Date(t.dueDate), "dd-MM-yyyy")}
                  </TableCell>
                  <TableCell className="1/12">
                    <div onClick={() => onEdit(t)}>
                      <Edit className="w-4 h-4 stroke-zinc-400 hover:stroke-zinc-900 cursor-pointer" />
                    </div>
                  </TableCell>
                  <TableCell className="1/12">
                    <div onClick={() => onDelete(t.id)}>
                      <X className="w-5 h-5 stroke-zinc-400 hover:stroke-white hover:bg-red-600 rounded-full p-0.5 cursor-pointer" />
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodoList;
