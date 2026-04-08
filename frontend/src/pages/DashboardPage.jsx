import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [taskResponse, userResponse] = await Promise.all([
        apiClient.listTasks(token),
        apiClient.listUsers(token)
      ]);
      setTasks(taskResponse.tasks);
      setUsers(userResponse.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createTask = async (payload) => {
    try {
      setBusy(true);
      await apiClient.createTask(token, {
        ...payload,
        dueDate: payload.dueDate || null,
        assigneeId: payload.assigneeId || undefined
      });
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const updateTask = async (id, payload) => {
    try {
      setBusy(true);
      await apiClient.updateTask(token, id, payload);
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setBusy(true);
      await apiClient.deleteTask(token, id);
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Task Dashboard</h1>
          <p>{user?.name}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>
      {error && <p className="error card">{error}</p>}
      <TaskForm users={users} onSubmit={createTask} loading={busy} />
      {loading ? (
        <p className="card">Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          currentUserId={user?._id || user?.id}
          onUpdate={updateTask}
          onDelete={deleteTask}
          loading={busy}
        />
      )}
    </div>
  );
};
