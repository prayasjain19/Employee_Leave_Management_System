import apiClient from '../common/apiClient';

export const fetchEvents = async () => {
  const { data } = await apiClient.get('/calendar');
  // backend already formats events to have title, start, end, status
  return data;
};
