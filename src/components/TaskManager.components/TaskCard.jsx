import { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../../redux/taskSlice";
import { formatDate } from "../../utils/formatDate";
import { Delete } from "lucide-react";

export function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState({
    name: task.name,
    description: task.description,
    status: task.status,
    due_date: task.due_date,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    backgroundColor: isDragging ? "rgb(51, 65, 85)" : "rgb(46, 46, 46)",
    zIndex: isDragging ? 1001 : "auto",
    position: isDragging ? "absolute" : "relative",
    boxShadow: isDragging ? "0 4px 10px rgba(0, 0, 0, 0.2)" : "none",
  };

  const inputRef = useRef(null);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      handleBlur();
    }
  };

  useEffect(() => {
    if (!isEditing) {
      if (
        editedTask.name !== task.name ||
        editedTask.description !== task.description ||
        editedTask.status !== task.status ||
        editedTask.due_date !== task.due_date
      ) {
        dispatch(updateTask({ id: task.id, ...editedTask }));
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, editedTask]); // Also run when `editedTask` changes

  const handleInputChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const handleBlur = () => {
    setIsEditing(null);
  };

  const clickDelete = () => {
    dispatch(deleteTask(task.id));
  };

  if (isEditing) {
    return (
      <div
        className="cursor-grab rounded-lg p-4 shadow-sm hover:shadow-md transition-colors duration-200"
        style={style}
      >
        {isEditing === "name" ? (
          <input
            ref={inputRef}
            type="text"
            name="name"
            value={editedTask.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown} // Listen for Enter key
            autoFocus
            className="w-full bg-neutral-700 text-white p-1 rounded outline-none"
          />
        ) : (
          <h3
            className="font-medium text-neutral-100 cursor-pointer"
            onClick={() => setIsEditing("name")}
          >
            {editedTask.name}
          </h3>
        )}

        {isEditing === "description" ? (
          <textarea
            ref={inputRef}
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-neutral-700 text-white p-1 rounded outline-none mt-2"
          />
        ) : (
          <p
            className="mt-2 text-sm text-neutral-400 cursor-pointer"
            onClick={() => setIsEditing("description")}
          >
            {editedTask.description}
          </p>
        )}

        {isEditing === "status" ? (
          <select
            name="status"
            value={editedTask.status}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full bg-neutral-700 text-white p-1 rounded outline-none mt-2"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        ) : (
          <p
            className="mt-2 text-xs text-neutral-400 cursor-pointer"
            onClick={() => setIsEditing("status")}
          >
            {editedTask.status}
          </p>
        )}

        {isEditing === "due_date" ? (
          <input
            ref={inputRef}
            type="date"
            name="due_date"
            value={editedTask.due_date}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown} // Listen for Enter key
            className="w-full bg-neutral-700 text-white p-1 rounded outline-none mt-2"
          />
        ) : (
          <p
            className="mt-2 text-xs text-neutral-400 cursor-pointer"
            onClick={() => setIsEditing("due_date")}
          >
            {formatDate(editedTask.due_date)}
          </p>
        )}
        <br/>
        <p
          className="mt-2 cursor-pointer p-1 rounded border-1 border-red-300 flex flex-row items-center justify-end"
          onClick={() => clickDelete()}
        >
          <Delete className="text-red-300" />
          <div className="text-red-300">Delete</div>
        </p>
      </div>
    );
  } else {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`cursor-grab rounded-lg p-4 shadow-sm hover:shadow-md transition-colors duration-200 ${
          isDragging && "w-full"
        }`}
        style={style}
      >
        <h3
          className="font-medium text-neutral-100 cursor-pointer w-full"
          onDoubleClick={() => setIsEditing("name")}
        >
          {editedTask.name.trim() ? (
            editedTask.name
          ) : (
            <span className="text-neutral-500">Give a name</span>
          )}
        </h3>
        <p
          className="mt-2 text-sm text-neutral-400 cursor-pointer w-full"
          onDoubleClick={() => setIsEditing("description")}
        >
          {editedTask.description.trim() ? (
            editedTask.description
          ) : (
            <span className="text-neutral-500">Give a description</span>
          )}
        </p>
        <p
          className="mt-2 text-xs text-neutral-400 cursor-pointer w-full"
          onDoubleClick={() => setIsEditing("status")}
        >
          {editedTask.status}
        </p>
        <p
          className="mt-2 text-xs text-neutral-400 cursor-pointer w-full"
          onDoubleClick={() => setIsEditing("due_date")}
        >
          {formatDate(editedTask.due_date)}
        </p>
      </div>
    );
  }
}
