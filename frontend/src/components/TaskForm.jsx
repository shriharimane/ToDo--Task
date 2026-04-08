import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  status: 'Todo',
  dueDate: '',
  assigneeId: ''
};

export const TaskForm = ({ users, onSubmit, loading }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Create Task</h3>
      <input required name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <div className="row">
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
      </div>
      <select name="assigneeId" value={form.assigneeId} onChange={handleChange}>
        <option value="">Personal task (unassigned)</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            Assign to {u.name}
          </option>
        ))}
      </select>
      <button disabled={loading} type="submit">
        {loading ? 'Saving...' : 'Add Task'}
      </button>
    </form>
  );
};
