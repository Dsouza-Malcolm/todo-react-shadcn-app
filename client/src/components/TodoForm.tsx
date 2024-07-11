import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { v4 as uuidv4 } from "uuid";

const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string().optional(),
  dueDate: z.coerce
    .date()
    .min(new Date(), { message: "Due date cannot be in the past" }),
  status: z.string().default("In progress"),
  completed: z.boolean().default(false),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  initialTask?: TodoFormData;
  onSubmit: (data: TodoFormData) => void;
  isAddClicked: (state: boolean) => void;
}

const TodoForm = ({ initialTask, isAddClicked, onSubmit }: TodoFormProps) => {
  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialTask || {
      id: uuidv4(),
      title: "",
      description: "",
      dueDate: new Date(),
      completed: false,
    },
  });

  const handleSubmit = (data: TodoFormData) => {
    onSubmit(data);
    if (initialTask) isAddClicked(false);
    if (!initialTask) {
      form.reset();
    }
  };

  const handleCancel = () => {
    isAddClicked(false);
    form.reset();
  };

  return (
    <div className="border border-zinc-400 rounded-xl px-4 py-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="block w-full font-medium border-none rounded-md focus-visible:border-none focus-visible:ring-0 shadow-none placeholder:text-base placeholder:font-semibold py-0 px-0"
                    placeholder="Task Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="block w-full border-none rounded-md focus-visible:border-none focus-visible:ring-0 shadow-none placeholder:text-sm py-0 px-0"
                    placeholder="Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "px-2 pl-2 py-2 h-auto w-auto text-left font-normal text-xs",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPPP")
                        ) : (
                          <span>Set due date</span>
                        )}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-x-2 flex justify-end">
            <Button
              variant={"secondary"}
              className="bg-zinc-300"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-bold px-4 py-2">
              {initialTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TodoForm;
