import { useMemo, useState } from 'react';

const statusOptions = ['Todo', 'In Progress', 'Done'];

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export const TaskList = ({ tasks, currentUserId, onUpdate, onDelete, loading }) => {
  const [editDueDate, setEditDueDate] = useState({});
  const [personalDrafts, setPersonalDrafts] = useState({});

  const personalTaskDefaults = useMemo(
    () =>
      tasks.reduce((acc, task) => {
        if (!task.assignee) {
          acc[task._id] = {
            title: task.title,
            description: task.description || '',
            status: task.status,
            dueDate: toDateInput(task.dueDate)
          };
        }
        return acc;
      }, {}),
    [tasks]
  );

  const getPersonalDraft = (task) => personalDrafts[task._id] || personalTaskDefaults[task._id];

  const updatePersonalDraft = (taskId, key, value) => {
    setPersonalDrafts((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || personalTaskDefaults[taskId]),
        [key]: value
      }
    }));
  };

  if (!tasks.length) {
    return <p className="card">No tasks yet. Create your first task.</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => {
        const isCreator = task.creator?._id === currentUserId;
        const isAssignee = task.assignee?._id === currentUserId;
        const assigned = Boolean(task.assignee);
        const personalDraft = !assigned ? getPersonalDraft(task) : null;

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

            {!assigned && isCreator && personalDraft && (
              <div className="stack-sm">
                <input
                  value={personalDraft.title}
                  onChange={(e) => updatePersonalDraft(task._id, 'title', e.target.value)}
                  placeholder="Title"
                  disabled={loading}
                />
                <textarea
                  value={personalDraft.description}
                  onChange={(e) => updatePersonalDraft(task._id, 'description', e.target.value)}
                  placeholder="Description"
                  disabled={loading}
                />
                <div className="row">
                  <select
                    value={personalDraft.status}
                    onChange={(e) => updatePersonalDraft(task._id, 'status', e.target.value)}
                    disabled={loading}
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={personalDraft.dueDate}
                    onChange={(e) => updatePersonalDraft(task._id, 'dueDate', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  disabled={loading}
                  onClick={() =>
                    onUpdate(task._id, {
                      title: personalDraft.title,
                      description: personalDraft.description,
                      status: personalDraft.status,
                      dueDate: personalDraft.dueDate || null
                    })
                  }
                >
                  Save Personal Task
                </button>
              </div>
            )}

            {assigned && isAssignee && (
              <select
                value={task.status}
                onChange={(e) => onUpdate(task._id, { status: e.target.value })}
                disabled={loading}
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
                  value={editDueDate[task._id] ?? toDateInput(task.dueDate)}
                  onChange={(e) =>
                    setEditDueDate((prev) => ({
                      ...prev,
                      [task._id]: e.target.value
                    }))
                  }
                  disabled={loading}
                />
                <button
                  disabled={loading}
                  onClick={() => onUpdate(task._id, { dueDate: editDueDate[task._id] || null })}
                >
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
