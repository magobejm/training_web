import api from '@/lib/api';
import { Exercise } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Muscle Groups Hook
export function useMuscleGroups() {
    return useQuery({
        queryKey: ['muscle-groups'],
        queryFn: async () => {
            const { data } = await api.get<{ id: string; name: string; imageUrl: string | null }[]>('/muscle-groups');
            return data;
        },
    });
}

export function useExercises() {
    return useQuery({
        queryKey: ['exercises'],
        queryFn: async () => {
            const response = await api.get<Exercise[]>('/exercises');
            return response.data;
        },
    });
}

export function useExercise(id: string) {
    return useQuery({
        queryKey: ['exercises', id],
        queryFn: async () => {
            const response = await api.get<Exercise>(`/exercises/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<Exercise, 'id'>) => {
            const response = await api.post<Exercise>('/exercises', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

// ... existing code ...
export function useUpdateExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Exercise> }) => {
            const response = await api.patch<Exercise>(`/exercises/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useDeleteExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/exercises/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

