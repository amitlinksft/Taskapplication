import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask, getCategories } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import CategoryFilter from '../components/CategoryFilter';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      const { data } = await getTasks(params);
      setTasks(data.results);
      setPagination((prev) => ({ ...prev, count: data.count, next: data.next, previous: data.previous }));
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
      setPagination((p) => ({ ...p, page: 1 }));
      fetchTasks();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch {
      setError('Failed to delete task.');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await updateTask(task.id, { ...task, status: newStatus, category: task.category_detail?.id || null });
      fetchTasks();
    } catch {
      setError('Failed to update task.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalPages = Math.ceil(pagination.count / 5);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>TaskManager</h1>
        </div>
        <div className="header-right">
          <span className="user-name">Hi, {user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-top">
          <div className="stats">
            <div className="stat-card">
              <span className="stat-number">{pagination.count}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <button className="add-task-btn" onClick={() => { setEditingTask(null); setShowForm(true); }}>
            + New Task
          </button>
        </div>

        {error && <div className="dashboard-error">{error}<button onClick={() => setError('')}>x</button></div>}

        <CategoryFilter
          categories={categories}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
        />

        {(showForm || editingTask) && (
          <TaskForm
            categories={categories}
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => { setShowForm(false); setEditingTask(null); }}
          />
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={(task) => { setShowForm(false); setEditingTask(task); }}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={!pagination.previous}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </button>
            <span>Page {pagination.page} of {totalPages}</span>
            <button
              disabled={!pagination.next}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
