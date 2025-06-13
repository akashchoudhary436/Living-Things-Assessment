import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      setTasks(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, effort: parseInt(effort), due_date: dueDate };
    try {
      if (editingTask) {
        await axios.put(`http://localhost:8000/api/tasks/${editingTask.id}/`, taskData, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        setEditingTask(null);
      } else {
        await axios.post('http://localhost:8000/api/tasks/', taskData, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
      }
      setTitle('');
      setDescription('');
      setEffort('');
      setDueDate('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setEffort(task.effort);
    setDueDate(task.due_date);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/export/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Tasks</h2>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
            />
            <input
              type="number"
              placeholder="Effort (Days)"
              value={effort}
              onChange={(e) => setEffort(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
              {editingTask && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null);
                    setTitle('');
                    setDescription('');
                    setEffort('');
                    setDueDate('');
                  }}
                  className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <button
          onClick={handleExport}
          className="mb-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Export to Excel
        </button>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                {task.description && <p className="text-gray-600">{task.description}</p>}
                <p className="text-sm text-gray-500">Effort: {task.effort} days</p>
                <p className="text-sm text-gray-500">Due: {task.due_date}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;