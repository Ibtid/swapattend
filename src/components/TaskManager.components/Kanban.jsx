import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask, deleteTask } from "../../redux/taskSlice";
import { DndContext } from "@dnd-kit/core";
import { Column } from "./Column";
import TrashZone from "./TrashZone";
import { COLUMNS } from "./consts/columns.data";
import { logout } from "../../redux/authSlice";

const KanbanBoard = ({ showForm, setShowFormFalse, formData, setFormData }) => {
  const dispatch = useDispatch();
  const { tasks,error, loading } = useSelector((state) => state.tasks);
  const [isDragging, setIsDragging] = useState(false); 

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDragStart = () => {
    setIsDragging(true); 
  }

  const handleDragEnd = (event) => {
    setIsDragging(false); 

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    if (newStatus === "trash") {
      dispatch(deleteTask(taskId));
    } else {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) return;
      dispatch(updateTask({ ...taskToUpdate, status: newStatus }));
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
      <i>{loading? "Loading and saving your status": "Double click the texts you want to edit and drag the card to bottom corner to delete"}</i>
      </div>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
         {isDragging && <TrashZone />}
        <div className="flex gap-8 flex-col md:flex-row">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.title)}
              showForm={showForm}
              setShowFormFalse={setShowFormFalse}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
