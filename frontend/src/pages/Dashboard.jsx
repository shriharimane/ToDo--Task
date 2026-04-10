import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import '../styles/Dashboard.css';

/**
 * Dashboard Component - Main task management interface
 * Features: Task filtering, search, status categorization, and role-based actions
 */
const Dashboard = () => {
  const { user } = useAuth();

  // State Management
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks and users on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchTasks(), fetchUsers()]);
    };
    initializeData();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getAllTasks();
      setTasks(response.tasks || []);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await taskService.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply status filter
    if (filter !== 'all') {
      result = result.filter((task) => task.status === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, filter, searchQuery]);

  // Categorize tasks
  const taskCategories = useMemo(() => {
    const categories = {
      assigned: [],
      personal: [],
      myAssignments: [],
    };

    const userId = user?.id ? String(user.id) : null;
    
    tasks.forEach((task) => {
      if (task.taskType === 'Assigned') {
        const creatorId = task.createdBy?._id ? String(task.createdBy._id) : null;
        const assigneeId = task.assignedTo?._id ? String(task.assignedTo._id) : null;
        
        if (userId && creatorId && userId === creatorId) {
          categories.assigned.push(task);
        } else if (userId && assigneeId && userId === assigneeId) {
          categories.myAssignments.push(task);
        }
      } else {
        categories.personal.push(task);
      }
    });

    return categories;
  }, [tasks, user]);

  // Get statistics
  const statistics = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'Todo').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
      assigned: taskCategories.assigned.length,
      personal: taskCategories.personal.length,
      myAssignments: taskCategories.myAssignments.length,
    };
  }, [tasks, taskCategories]);

  // Modal handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        setSuccessMessage('✓ Task updated successfully!');
      } else {
        await taskService.createTask(taskData);
        setSuccessMessage('✓ Task created successfully!');
      }
      handleCloseModal();
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
      console.error('Save task error:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this task? This action cannot be undone.'
      )
    ) {
      try {
        await taskService.deleteTask(taskId);
        setSuccessMessage('✓ Task deleted successfully!');
        await fetchTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
        console.error('Delete task error:', err);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setSuccessMessage('✓ Task status updated!');
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      console.error('Status change error:', err);
    }
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div>
            <h1 className="dashboard-title">👋 Welcome, {user?.username}</h1>
            <p className="dashboard-subtitle">Manage your tasks efficiently and stay productive</p>
          </div>
          <button className="btn btn-primary btn-lg btn-add-task" onClick={handleAddTask}>
            ✚ Create New Task
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="message-alert error-alert" role="alert">
          ⚠️ {error}
          <button className="message-close" onClick={() => setError('')}>✕</button>
        </div>
      )}

      {successMessage && (
        <div className="message-alert success-alert" role="status">
          {successMessage}
        </div>
      )}

      <div className="dashboard-container">
        {/* Sidebar - Statistics */}
        <aside className="dashboard-sidebar">
          <div className="stats-card">
            <h3 className="stats-title">📊 Your Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{statistics.total}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">📝 Personal</span>
              <span className="stat-value">{statistics.personal}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">👥 Assigned by Me</span>
              <span className="stat-value">{statistics.assigned}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">📤 Assigned to Me</span>
              <span className="stat-value">{statistics.myAssignments}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">❌ Todo</span>
              <span className="stat-value status-todo-count">{statistics.todo}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">⏳ In Progress</span>
              <span className="stat-value status-progress-count">{statistics.inProgress}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">✅ Completed</span>
              <span className="stat-value status-done-count">{statistics.done}</span>
            </div>
          </div>

          {/* Filter Section */}
          <div className="stats-card">
            <h3 className="stats-title">🔍 Filter</h3>
            <div className="filter-buttons">
              {['all', 'Todo', 'In Progress', 'Done'].map((filterOption) => (
                <button
                  key={filterOption}
                  className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
                  onClick={() => setFilter(filterOption)}
                >
                  {filterOption === 'all' ? '📋 All' : filterOption}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Search Section */}
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ✕ Clear
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading tasks...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h2>No Tasks Found</h2>
              <p>
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : filter !== 'all'
                  ? `No tasks with status "${filter}"`
                  : 'Create your first task to get started'}
              </p>
              {!searchQuery && filter === 'all' && (
                <button className="btn btn-primary" onClick={handleAddTask}>
                  ✚ Create Your First Task
                </button>
              )}
            </div>
          )}

          {/* Tasks List */}
          {!loading && filteredTasks.length > 0 && (
            <div className="tasks-section">
              <h2 className="tasks-section-title">
                📋 {filter === 'all' ? 'All Tasks' : `Tasks - ${filter}`} ({filteredTasks.length})
              </h2>
              <div className="tasks-grid">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Task Categories Overview */}
          {!loading && tasks.length > 0 && !searchQuery && filter === 'all' && (
            <div className="categories-overview">
              {taskCategories.personal.length > 0 && (
                <div className="category-summary">
                  <h3>📝 Personal Tasks ({taskCategories.personal.length})</h3>
                  <p>Tasks created by you that are not assigned to anyone else</p>
                </div>
              )}
              {taskCategories.assigned.length > 0 && (
                <div className="category-summary">
                  <h3>👥 Tasks Assigned by Me ({taskCategories.assigned.length})</h3>
                  <p>Tasks you created and assigned to team members</p>
                </div>
              )}
              {taskCategories.myAssignments.length > 0 && (
                <div className="category-summary">
                  <h3>📤 Tasks Assigned to Me ({taskCategories.myAssignments.length})</h3>
                  <p>Tasks assigned to you by team members - You can update status only</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          users={users}
          onSave={handleSaveTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
