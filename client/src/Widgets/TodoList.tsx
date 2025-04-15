import React from "react";
import "../Styles/todoItems.css";

const TodoList: React.FC = () => {
  return (
    <div
      className="todo-list-container"
      style={{
        width: "75vw",
         // Optional: Full height
        margin: "0",
        padding: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <iframe
        src="http://192.168.7.15:3001/"
        title="Todo List"
        height="700px"
        width="80px"
        frameBorder="0"
        style={{
          border: "none",
          display: "block",
          minHeight: "700px",
          overflow: "hidden",
        }}
      ></iframe>
    </div>
  );
};

export default TodoList;
