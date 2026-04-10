import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/TaskCard.css';

/**
 * TaskCard Component - Displays individual task with role-based actions
 * Shows different action buttons based on user's role (creator or assignee)
 */
const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuth();

  // Helper function to normalize IDs for comparison
  const normalizeId = (id) => {
    if (!id) return null;
    return String(id);
  };

  // Determine user's role in relation to the task
  const permissions = useMemo(() => {
    const userId = normalizeId(user?.id);
    const creatorId = normalizeId(task.createdBy?._id);
    const assigneeId = normalizeId(task.assignedTo?._id);
    
    const isCreator = userId && creatorId && userId === creatorId;
    const isAssignee = userId && assigneeId && userId === assigneeId;

    return {
      isCreator,
      isAssignee,
      canEdit: isCreator,
      canDelete: isCreator,
      canChangeStatus: isAssignee && !isCreator,
      canChangePermissions: false,
    };
  }, [task, user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Todo': '#e74c3c',
      'In Progress': '#f39c12',
      'Done': '#27ae60',
    };
    return statusColors[status] || '#95a5a6';
  };

  const getTaskTypeIcon = (taskType) => {
    return taskType === 'Assigned' ? '👥' : '📝';
  };

  const handleStatusClick = () => {
    if (permissions.canChangeStatus) {
      onEdit(task);
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      {/* Card Header */}
      <div className="task-card-header">
        <div className="task-card-title-section">
          <span className="task-type-icon">{getTaskTypeIcon(task.taskType)}</span>
          <h3 className="task-card-title">{task.title}</h3>
          {isOverdue && <span className="overdue-badge">Overdue</span>}
        </div>
        <span className="task-type-badge">{task.taskType}</span>
      </div>

      {/* Card Body */}
      <div className="task-card-body">
        <p className="task-description">{task.description}</p>

        {/* Assignment Info */}
        {task.assignedTo && (
          <div className="assignment-info">
            <div className="assignment-detail">
              <span className="label">Assigned to:</span>
              <span className="value">
                <span className="avatar">{task.assignedTo.username.charAt(0).toUpperCase()}</span>
                {task.assignedTo.username}
              </span>
            </div>
            {permissions.isCreator && (
              <span className="role-badge creator-badge">You are creator</span>
            )}
            {permissions.isAssignee && (
              <span className="role-badge assignee-badge">Your Task</span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="task-meta">
          <div className="meta-item">
            <span className="meta-label">📅 Due Date:</span>
            <span className={`meta-value ${isOverdue ? 'overdue-text' : ''}`}>
              {formatDate(task.dueDate)}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">👤 Created by:</span>
            <span className="meta-value">{task.createdBy?.username}</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="task-status-section">
          <div className="status-label">Status</div>
          <div
            className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')} ${
              permissions.canChangeStatus ? 'clickable' : ''
            }`}
            style={{
              backgroundColor: getStatusColor(task.status),
              cursor: permissions.canChangeStatus ? 'pointer' : 'default',
            }}
            onClick={handleStatusClick}
            title={permissions.canChangeStatus ? 'Click to change status' : ''}
          >
            {task.status}
            {permissions.canChangeStatus && <span className="edit-hint">✎</span>}
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="task-card-footer">
        {permissions.canEdit && (
          <button className="btn-action btn-edit" onClick={() => onEdit(task)} title="Edit task details">
            ✎ Edit
          </button>
        )}

        {permissions.canChangeStatus && (
          <button className="btn-action btn-status" onClick={() => onEdit(task)} title="Change task status">
            ⟳ Change Status
          </button>
        )}

        {permissions.canDelete && (
          <button className="btn-action btn-delete" onClick={() => onDelete(task._id)} title="Delete task">
            🗑 Delete
          </button>
        )}

        {!permissions.canEdit && !permissions.canChangeStatus && (
          <div className="no-actions-text">No actions available</div>
        )}
      </div>

      {/* Permission Info for Assignee */}
      {permissions.isAssignee && !permissions.isCreator && (
        <div className="permission-info">
          ℹ️ As an assignee, you can only change the task status. Other details cannot be modified.
        </div>
      )}
    </div>
  );
};

export default TaskCard;
