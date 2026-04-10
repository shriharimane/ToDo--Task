import apiClient from './apiClient';

const taskService = {
  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  getAllTasks: async () => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  getTaskById: async (taskId) => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await apiClient.patch(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/tasks/users');
    return response.data;
  },
};

export default taskService;
