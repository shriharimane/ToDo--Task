import { useState } from 'react';

const statusOptions = ['Todo', 'In Progress', 'Done'];

export const TaskList = ({ tasks, currentUserId, onUpdate, onDelete, loading }) => {
  const [editDueDate, setEditDueDate] = useState({});

  if (!tasks.length) {
    return <p className="card">No tasks yet. Create your first task.</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => {
        const isCreator = task.creator?._id === currentUserId;
        const isAssignee = task.assignee?._id === currentUserId;
        const assigned = Boolean(task.assignee);

        return (
          <div key={task._id} className="card">
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
            </p>
            <p>
              <strong>Type:</strong> {assigned ? 'Assigned' : 'Personal'}
            </p>
            <p>
              <strong>Owner:</strong> {task.creator?.name}
            </p>
            {assigned && (
              <p>
                <strong>Assignee:</strong> {task.assignee?.name}
              </p>
            )}

            {(!assigned || isAssignee) && (
              <select
                value={task.status}
                onChange={(e) => onUpdate(task._id, { status: e.target.value })}
                disabled={loading || (assigned && !isAssignee)}
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            )}

            {assigned && isCreator && (
              <div className="row">
                <input
                  type="date"
                  value={editDueDate[task._id] ?? (task.dueDate ? task.dueDate.slice(0, 10) : '')}
                  onChange={(e) =>
                    setEditDueDate((prev) => ({
                      ...prev,
                      [task._id]: e.target.value
                    }))
                  }
                />
                <button onClick={() => onUpdate(task._id, { dueDate: editDueDate[task._id] || null })}>
                  Save Due Date
                </button>
              </div>
            )}

            {isCreator && (
              <button className="danger" disabled={loading} onClick={() => onDelete(task._id)}>
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
