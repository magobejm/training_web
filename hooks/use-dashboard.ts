import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardResponse } from '@/types';

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await api.get<DashboardResponse>('/dashboard/stats');
            return response.data;
        },
    });
}
