import apiClient from '../common/apiClient';

export const fetchMyBalance = async () => {
  const { data } = await apiClient.get('/balances/me');
  return data;
};

export const fetchEmployeeBalance = async (id) => {
  const { data } = await apiClient.get(`/balances/${id}`);
  return data;
};
