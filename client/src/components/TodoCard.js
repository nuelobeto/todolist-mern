import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

function TodoCard({ todo }) {
  const { todoComplete, todoIncomplete, removeTodo, updateTodo } =
    useContext(GlobalContext);
  const [content, setContent] = useState(todo.content);
  const [editing, setEditing] = useState(false);
  const input = useRef(null);

  const onEdit = (e) => {
    e.preventDefault();

    setEditing(true);
    input.current.focus();
  };

  const stopEditing = (e) => {
    if (e) {
      e.preventDefault();
    }

    setEditing(false);
    setContent(todo.content);
  };

  const markAsComplete = (e) => {
    e.preventDefault();
    axios.put(`/api/todos/${todo._id}/complete`).then((res) => {
      todoComplete(res.data);
    });
  };

  const markAsIncomplete = (e) => {
    e.preventDefault();

    axios.put(`/api/todos/${todo._id}/incomplete`).then((res) => {
      todoIncomplete(res.data);
    });
  };

  const deleteTodo = (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure you want to delete this todo?")) {
      axios.delete(`/api/todos/${todo._id}/delete`).then(() => {
        removeTodo(todo);
      });
    }
  };

  const editTodo = (e) => {
    e.preventDefault();

    axios
      .put(`/api/todos/${todo._id}/update`, { content })
      .then((res) => {
        updateTodo(res.data);
        setEditing(false);
      })
      .catch(() => {
        stopEditing();
      });
  };

  return (
    <div className={`todo ${todo.complete ? "todo--complete" : ""}`}>
      <input
        type="checkbox"
        checked={todo.complete}
        onChange={!todo.complete ? markAsComplete : markAsIncomplete}
      />

      <input
        type="text"
        value={content}
        ref={input}
        readOnly={!editing}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="todo__controls">
        {!editing ? (
          <>
            {!todo.complete && <button onClick={onEdit}>Edit</button>}
            <button onClick={deleteTodo}>Delete</button>
          </>
        ) : (
          <>
            <button onClick={stopEditing}>Cancel</button>
            <button onClick={editTodo}>Save</button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoCard;
