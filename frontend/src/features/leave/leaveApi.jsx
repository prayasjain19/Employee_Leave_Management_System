import apiClient from '../common/apiClient';

export const createLeave = async (leaveData) => {
    const { data } = await apiClient.post('/leaves', leaveData);
    return data;
};

export const fetchMyLeaves = async () => {
    const { data } = await apiClient.get('/leaves/me');
    return data;
};

export const fetchPendingLeaves = async () => {
    const { data } = await apiClient.get('/leaves/pending');
    return data;
};

export const decideLeave = async (id, decisionObj) => {
    const { data } = await apiClient.patch(`/leaves/${id}/decision`, decisionObj);
    return data;
};
