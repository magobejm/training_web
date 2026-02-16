import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { CoachNote } from '@/types';

export function useCoachNotes(clientId?: string) {
    return useQuery({
        queryKey: ['coach-notes', clientId],
        queryFn: async () => {
            const response = await api.get<CoachNote[]>('/coach-notes', {
                params: { clientId },
            });
            return response.data;
        },
        enabled: !!clientId,
    });
}

export function useCreateCoachNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { clientId: string; content: string }) => {
            const response = await api.post<CoachNote>('/coach-notes', data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['coach-notes', variables.clientId] });
        },
    });
}

export function useUpdateCoachNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content }: { id: string; content: string; clientId: string }) => {
            const response = await api.patch<CoachNote>(`/coach-notes/${id}`, { content });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['coach-notes', variables.clientId] });
        },
    });
}

export function useDeleteCoachNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: string; clientId: string }) => {
            await api.delete(`/coach-notes/${id}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['coach-notes', variables.clientId] });
        },
    });
}
