import apiClient from '../common/apiClient';

export const createLeave = async (data) => {
  const res = await apiClient.post('/leaves', data);
  return res.data;
};

export const fetchMyLeaves = async () => {
  const res = await apiClient.get('/leaves/me');
  return res.data;
};

export const fetchPendingLeaves = async () => {
  const res = await apiClient.get('/leaves/pending');
  return res.data;
};

export const decideLeave = async (id, payload) => {
  const res = await apiClient.patch(`/leaves/${id}/decision`, payload);
  return res.data;
};
