import { Task } from "../interfaces/TaskSchema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DropdownListProps {
  tasks: Task[];
  getTask: (taskId: string | null) => void;
}

const DropdownList = ({ tasks, getTask }: DropdownListProps) => {
  return (
    <Select onValueChange={(value) => getTask(value === "all" ? null : value)}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter Tasks</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          {tasks.map((task: Task, i: number) => (
            <SelectItem key={task.id} value={task.id}>{`Task ${
              i + 1
            }`}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DropdownList;
