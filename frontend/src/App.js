import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/tasks?page=${page}&size=5`
      );
      setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      alert("Backend not running or CORS issue!");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  // Add Task
  const addTask = async () => {
    try {
      if (!title) return alert("Title required");

      await axios.post("http://localhost:8082/tasks", {
        title,
        description,
        status: "Pending",
      });

      setTitle("");
      setDescription("");
      setPage(0);
      fetchTasks();
    } catch (error) {
      alert("Error adding task");
    }
  };

  // Delete
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      alert("Error deleting");
    }
  };

  // Toggle
  const toggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:8082/tasks/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      alert("Error updating");
    }
  };

  // Update
  const updateTask = async () => {
    try {
      if (!editTitle) return alert("Title required");

      await axios.put(`http://localhost:8082/tasks/${editId}`, {
        title: editTitle,
        description: editDescription,
        status: "Pending",
      });

      setEditId(null);
      fetchTasks();
    } catch (error) {
      alert("Error updating");
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>Task Manager</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      <br /><br />

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredTasks.map((task) => (
        <div key={task.id}>
          {editId === task.id ? (
            <>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              <button onClick={updateTask}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>{task.status}</p>

              <button onClick={() => toggleStatus(task.id)}>Toggle</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
              <button
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

      <br />

      <button disabled={page === 0} onClick={() => setPage(page - 1)}>
        Prev
      </button>

      <span> Page {page + 1} </span>

      <button
        disabled={page === totalPages - 1}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default App;