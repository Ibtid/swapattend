import { useRef, useEffect } from "react";

import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../redux/taskSlice";
import { taskSchema } from "./validationSchema/taskSchama";



export function Column({ column, tasks, showForm, setShowFormFalse }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
  });
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [parent] = useAutoAnimate();
 
  const dropdownOpen = useSelector((state) => state.tasks.dropdownOpen);
  const onSubmit = async (data) => {
    try {
      await dispatch(createTask(data));
      reset();
      setShowFormFalse();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className={`flex w-full md:w-80 flex-col rounded-lg ${ isOver?"bg-neutral-600": "bg-neutral-800"} p-4`}>
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>

      <AnimatePresence>
        {showForm && column.id === "To Do" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-neutral-800 border-2 border-neutral-700 p-4 rounded-lg shadow-md mb-4"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="Title"
                {...register("name")}
                className="w-full mb-2 p-2 rounded bg-neutral-700 text-white outline-none"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              <textarea
                placeholder="Description"
                {...register("description")}
                className="w-full mb-2 p-2 rounded bg-neutral-700 text-white outline-none"
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}

              <input
                type="date"
                {...register("due_date")}
                className="w-full mb-2 p-2 rounded bg-neutral-700 text-white outline-none"
              />
              {errors.due_date && (
                <p className="text-red-500">{errors.due_date.message}</p>
              )}
              <br/>

              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 rounded text-white hover:bg-gray-600 transition"
                  onClick={()=>{
                    reset()
                    setShowFormFalse()
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        ref={dropdownOpen ? undefined : setNodeRef}
        className="flex min-h-32 md:flex-1 flex-col gap-4"
      >
        <div
          ref={dropdownOpen ? undefined : parent}
          className="flex min-h-32 md:flex-1 flex-col gap-4"
        >
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
