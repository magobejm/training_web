import api from '@/lib/api';
import { TrainingPlan } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTrainingPlans() {
    return useQuery({
        queryKey: ['training-plans'],
        queryFn: async () => {
            try {
                const response = await api.get<TrainingPlan[]>('/training-plans');
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 404 || error.response?.status === 500) {
                    return [];
                }
                throw error;
            }
        },
    });
}

export function useTrainingPlan(id: string) {
    return useQuery({
        queryKey: ['training-plans', id],
        queryFn: async () => {
            try {
                const response = await api.get<TrainingPlan>(`/training-plans/${id}`);
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        enabled: !!id,
    });
}

export function useCreatePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; description?: string; userId?: string }) => {
            const response = await api.post<TrainingPlan>('/training-plans', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['training-plans'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

// Helper functions for Plan Builder orchestration
export const addDayToPlan = async (planId: string, data: { name: string; order: number }) => {
    const response = await api.post(`/training-plans/${planId}/days`, data);
    return response.data;
};

export const addExerciseToDay = async (
    planId: string,
    dayId: string,
    data: {
        exerciseId: string;
        order: number;
        targetSets: number;
        targetReps: string;
        restSeconds: number;
        weight?: number;
        rpe?: number;
        notes?: string;
    }
) => {
    // Backend expects targetReps as string (e.g. "10-12"), but UI might give number.
    // We ensure it's a string.
    // Also mapping weight/notes to coachNotes or custom description if needed, 
    // but based on DTO: coachNotes, customDescription.
    // The DTO has: targetSets, targetReps, restSeconds, etc.

    const payload = {
        exerciseId: data.exerciseId,
        order: data.order,
        targetSets: data.targetSets,
        targetReps: String(data.targetReps),
        restSeconds: data.restSeconds || 60,
        coachNotes: data.notes,
        // Store weight in customDescription for now as there is no specific weight field in DTO
        // OR we could assume the backend 'targetReps' could hold weight info? 
        // No, let's put weight in coachNotes like "Peso: 50kg".
        customDescription: data.weight ? `Peso objetivo: ${data.weight}kg` : undefined,
    };

    const response = await api.post(`/training-plans/${planId}/days/${dayId}/exercises`, payload);
    return response.data;
};

export function useDeleteTrainingPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/training-plans/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['training-plans'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}
