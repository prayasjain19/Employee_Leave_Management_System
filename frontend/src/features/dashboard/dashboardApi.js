import apiClient from '../common/apiClient';

export const fetchStats = async () => {
  const { data } = await apiClient.get('/dashboard/stats');
  return data;
};
