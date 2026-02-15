import api from '@/lib/api';
import { ScheduledWorkout } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useScheduledWorkouts(month?: number, year?: number) {
    return useQuery({
        queryKey: ['scheduled-workouts', month, year],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();

                if (month && year) {
                    // Calculate start and end of month
                    const startDate = new Date(year, month - 1, 1).toISOString();
                    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
                    params.append('startDate', startDate);
                    params.append('endDate', endDate);
                }

                const response = await api.get<{ workouts: ScheduledWorkout[], total: number }>(`/scheduled-workouts?${params}`);
                return response.data.workouts;
            } catch (error: any) {
                if (error.response?.status === 404 || error.response?.status === 500) {
                    return [];
                }
                throw error;
            }
        },
    });
}

export function useCreateScheduledWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            clientId?: string;
            trainerId?: string;
            trainingDayId: string;
            scheduledFor: string;
            notes?: string;
        }) => {
            const response = await api.post<ScheduledWorkout>('/scheduled-workouts', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scheduled-workouts'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useDeleteScheduledWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/scheduled-workouts/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scheduled-workouts'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useRescheduleWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, date }: { id: string; date: string }) => {
            const response = await api.patch(`/scheduled-workouts/${id}`, { newDate: date });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scheduled-workouts'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useCancelScheduledWorkout() {
    return useDeleteScheduledWorkout();
}
