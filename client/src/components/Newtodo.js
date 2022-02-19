import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";

function Newtodo() {
  const { addTodo } = useContext(GlobalContext);
  const [content, setContent] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    axios.post("/api/todos/new", { content }).then((res) => {
      setContent("");
      addTodo(res.data);
    });
  };

  return (
    <form className="new" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Add a task..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="btn" type="submit" disabled={content.length === 0}>
        Add
      </button>
    </form>
  );
}

export default Newtodo;
