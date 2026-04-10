import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/TaskModal.css';

/**
 * TaskModal Component - Create or edit tasks with role-based field restrictions
 * Ensures assignees can only update the status field
 * Ensures creators cannot update task status
 */
const TaskModal = ({ task, users, onSave, onClose }) => {
  const { user } = useAuth();

  // Helper function to normalize IDs for comparison
  const normalizeId = (id) => {
    if (!id) return null;
    return String(id);
  };

  // Determine user's role and permissions
  const [permissions, setPermissions] = useState({
    isCreator: false,
    isAssignee: false,
    canEditDetails: true,
    canChangeStatus: false,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    dueDate: '',
    assignedTo: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize permissions and form data
  useEffect(() => {
    if (task) {
      const userId = normalizeId(user?.id);
      const creatorId = normalizeId(task.createdBy?._id);
      const assigneeId = normalizeId(task.assignedTo?._id);
      
      const isCreator = userId && creatorId && userId === creatorId;
      const isAssignee = userId && assigneeId && userId === assigneeId && !isCreator;

      setPermissions({
        isCreator,
        isAssignee,
        canEditDetails: isCreator,
        canChangeStatus: isAssignee,
      });

      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Todo',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedTo: task.assignedTo?._id || '',
      });
    }
  }, [task, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      setError('Task title is required');
      return false;
    }
    if (!formData.description?.trim()) {
      setError('Task description is required');
      return false;
    }
    if (!formData.dueDate) {
      setError('Due date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // For assignee, only update status
    if (permissions.isAssignee) {
      // Validate status is selected
      if (!formData.status) {
        setError('Please select a status');
        return;
      }

      setLoading(true);
      try {
        onSave({ status: formData.status });
      } catch (err) {
        setError(err.message || 'Failed to update task');
      } finally {
        setLoading(false);
      }
      return;
    }

    // For creator, validate and submit full details
    if (!validateForm()) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      status: formData.status,
    };

    // Only include assignedTo if it has changed or is new task
    if (formData.assignedTo) {
      payload.assignedTo = formData.assignedTo;
    }

    setLoading(true);
    try {
      onSave(payload);
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => u._id !== user?.id);
  const isNewTask = !task;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isNewTask ? '✚ Create New Task' : '✎ Edit Task'}
            </h2>
            {task?.taskType === 'Assigned' && permissions.isAssignee && (
              <p className="modal-subtitle">As an assignee, you can only update the task status</p>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-alert" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="task-form">
          {/* Task Details Section - Only for Creators */}
          {permissions.canEditDetails && (
            <div className="form-section">
              <h3 className="section-title">Task Details</h3>

              {/* Title Field */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Task Title <span className="required">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a clear, concise task title"
                  className="form-input"
                  disabled={!permissions.canEditDetails}
                  maxLength="100"
                />
                <span className="char-count">{formData.title.length}/100</span>
              </div>

              {/* Description Field */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the task..."
                  className="form-textarea"
                  rows="4"
                  disabled={!permissions.canEditDetails}
                  maxLength="500"
                />
                <span className="char-count">{formData.description.length}/500</span>
              </div>

              {/* Due Date Field */}
              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                  Due Date <span className="required">*</span>
                </label>
                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!permissions.canEditDetails}
                />
              </div>

              {/* Assignment Field - Only for New Tasks */}
              {isNewTask && (
                <div className="form-group">
                  <label htmlFor="assignedTo" className="form-label">
                    Assign Task <span className="optional">(optional)</span>
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">
                      ▪ Keep as Personal Task
                    </option>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <option key={u._id} value={u._id}>
                          👤 {u.username} ({u.email})
                        </option>
                      ))
                    ) : (
                      <option disabled>No other users available</option>
                    )}
                  </select>
                  <p className="field-hint">
                    📌 Assigned tasks can be edited by you, but only the assignee can update the status
                  </p>
                </div>
              )}

              {/* Task Type Display for Existing Assigned Tasks */}
              {task?.taskType === 'Assigned' && task?.assignedTo && (
                <div className="info-box">
                  <strong>Currently assigned to:</strong> {task.assignedTo.username}
                </div>
              )}
            </div>
          )}

          {/* Status Section - For All Users with Permission */}
          {(permissions.canEditDetails || permissions.canChangeStatus) && (
            <div className="form-section">
              <h3 className="section-title">Task Status</h3>
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status <span className="required">*</span>
                </label>
                <div className="status-selector">
                  {['Todo', 'In Progress', 'Done'].map((statusOption) => (
                    <label key={statusOption} className="status-radio">
                      <input
                        type="radio"
                        name="status"
                        value={statusOption}
                        checked={formData.status === statusOption}
                        onChange={handleInputChange}
                        disabled={!permissions.canChangeStatus && !permissions.canEditDetails}
                      />
                      <span
                        className={`status-label status-${statusOption
                          .toLowerCase()
                          .replace(' ', '-')}`}
                      >
                        {statusOption}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Permission Warning for Assignees */}
          {permissions.isAssignee && !permissions.canEditDetails && (
            <div className="warning-box">
              <strong>⚠️ Important:</strong> As an assignee, you can only update the task status. You
              cannot modify the task title, description, or due date. Contact the task creator for
              any changes to these details.
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? '⏳ Saving...' : '✓ Save Task'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
