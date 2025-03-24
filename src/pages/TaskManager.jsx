import { useEffect, useState } from "react";

import KanbanBoard from "../components/TaskManager.components/Kanban";
import KanbanButtons from "../components/TaskManager.components/KanbanButtons";
import Navbar from "../components/TaskManager.components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const TaskManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.tasks);


  useEffect(()=>{
    if(error=="Unauthenticated."){
      dispatch(logout())
    }
  },[error])

  return (
    <>
      <Navbar />
      <KanbanButtons
        showForm={showForm}
        setShowFormTrue={() => {
          setShowForm(true);
        }}
      />
      <KanbanBoard
        showForm={showForm}
        setShowFormFalse={() => {
          setShowForm(false);
        }}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default TaskManager