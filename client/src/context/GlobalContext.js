import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { reducer } from "./GlobalReducer";

// Initial state
const initialState = {
  user: null,
  fetchingUser: true,
  completeTodos: [],
  incompleteTodos: [],
};

// create context
export const GlobalContext = createContext(initialState);

// provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getCurrentUser();
  }, []);

  // action: get current user
  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/api/auth/current");

      if (res.data) {
        const todoRes = await axios.get("/api/todos/current");
        if (todoRes.data) {
          dispatch({
            type: "SET_USER",
            payload: res.data,
          });

          dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: todoRes.data.complete,
          });

          dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: todoRes.data.incomplete,
          });
        }
      } else {
        dispatch({ type: "RESET_USER" });
      }
    } catch (error) {
      dispatch({ type: "RESET_USER" });
    }
  };

  // action: logout
  const logout = async () => {
    try {
      await axios.put("/api/auth/logout");

      dispatch({
        type: "RESET_USER",
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "RESET_USER",
      });
    }
  };

  // action: add a new todo
  const addTodo = (todo) => {
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: [todo, ...state.incompleteTodos],
    });
  };

  // action: mark a todo as complete
  const todoComplete = (todo) => {
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: state.incompleteTodos.filter(
        (incompleteTodo) => incompleteTodo._id !== todo._id
      ),
    });

    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: [todo, ...state.completeTodos],
    });
  };

  // action: mark a todo as incomplete
  const todoIncomplete = (todo) => {
    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: state.completeTodos.filter(
        (completeTodo) => completeTodo._id !== todo._id
      ),
    });

    const newIncompleteTodos = [todo, ...state.incompleteTodos];

    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: newIncompleteTodos.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  };

  // action: delete a todo
  const removeTodo = (todo) => {
    if (todo.complete) {
      dispatch({
        type: "SET_COMPLETE_TODOS",
        payload: state.completeTodos.filter(
          (completeTodo) => completeTodo._id !== todo._id
        ),
      });
    } else {
      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: state.incompleteTodos.filter(
          (incompleteTodo) => incompleteTodo._id !== todo._id
        ),
      });
    }
  };

  // action: update a todo
  const updateTodo = (todo) => {
    if (todo.complete) {
      const newCompleteTodos = state.completeTodos.map((completeTodo) =>
        completeTodo._id !== todo._id ? completeTodo : todo
      );

      dispatch({
        type: "SET_COMPLETE_TODOS",
        payload: newCompleteTodos,
      });
    } else {
      const newIncompleteTodos = state.incompleteTodos.map((incompleteTodo) =>
        incompleteTodo._id ? incompleteTodo : todo
      );

      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: newIncompleteTodos,
      });
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        fetchingUser: state.fetchingUser,
        completeTodos: state.completeTodos,
        incompleteTodos: state.incompleteTodos,
        getCurrentUser,
        logout,
        addTodo,
        todoComplete,
        todoIncomplete,
        removeTodo,
        updateTodo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
