import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import Newtodo from "./Newtodo";
import TodoCard from "./TodoCard";

function Dashboard() {
  const { user, completeTodos, incompleteTodos } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && navigate) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="dashboard">
      <Newtodo />

      <div className="todos">
        <h2 className="todo__title">Incomplete todos</h2>
        {incompleteTodos.map((todo) => (
          <TodoCard key={todo._id} todo={todo} />
        ))}
      </div>
      <div className="todos">
        <h2 className="todo__title">Complete todos</h2>
        {completeTodos.map((todo) => (
          <TodoCard key={todo._id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
