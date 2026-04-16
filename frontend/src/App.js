import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial",
      background: "linear-gradient(to right, #c2e9fb, #a1c4fd)",
      minHeight: "100vh",
    },
    card: {
      background: "white",
      padding: "15px",
      margin: "10px 0",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    input: {
      padding: "8px",
      margin: "5px",
      width: "45%",
    },
    button: {
      padding: "8px 12px",
      margin: "5px",
      border: "none",
      backgroundColor: "#4a90e2",
      color: "white",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/tasks`, {
      params: { page, size: 5 },
    });
    setTasks(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const addTask = async () => {
    if (!title) return alert("Title required");

    await axios.post(`${API}/tasks`, {
      title,
      description,
      status: "Pending",
    });

    setTitle("");
    setDescription("");
    setPage(0);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (window.confirm("Delete?")) {
      await axios.delete(`${API}/tasks/${id}`);
      fetchTasks();
    }
  };

  const toggleStatus = async (id) => {
    await axios.put(`${API}/tasks/${id}/toggle`);
    fetchTasks();
  };

  const updateTask = async () => {
    await axios.put(`${API}/tasks/${editId}`, {
      title: editTitle,
      description: editDescription,
    });
    setEditId(null);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center" }}>Task Manager</h1>

      {/* Add Task */}
      <div>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button style={styles.button} onClick={addTask}>
          Add
        </button>
      </div>

      {/* Search */}
      <input
        style={{ ...styles.input, width: "95%" }}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tasks */}
      {filteredTasks.map((task) => (
        <div key={task.id} style={styles.card}>
          {editId === task.id ? (
            <>
              <input
                style={styles.input}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                style={styles.input}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <br />
              <button style={{ ...styles.button, backgroundColor: "green" }} onClick={updateTask}>
                Save
              </button>
              <button style={{ ...styles.button, backgroundColor: "gray" }} onClick={() => setEditId(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <p style={{ color: task.status === "Completed" ? "green" : "orange" }}>
                {task.status}
              </p>

              <button style={styles.button} onClick={() => toggleStatus(task.id)}>
                Toggle
              </button>
              <button style={{ ...styles.button, backgroundColor: "red" }} onClick={() => deleteTask(task.id)}>
                Delete
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "orange" }}
                onClick={() => {
                  setEditId(task.id);
                  setEditTitle(task.title);
                  setEditDescription(task.description);
                }}
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          style={styles.button}
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span> Page {page + 1} </span>

        <button
          style={styles.button}
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;