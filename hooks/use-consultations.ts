import api from '@/lib/api';
import { Consultation, Message } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useConsultations(status?: 'OPEN' | 'RESOLVED') {
    return useQuery({
        queryKey: ['consultations', status],
        queryFn: async () => {
            try {
                const params = status ? `?status=${status}` : '';
                const response = await api.get<{ consultations: Consultation[]; total: number }>(`/consultations${params}`);
                return response.data.consultations;
            } catch (error: any) {
                if (error.response?.status === 404 || error.response?.status === 500) {
                    return [];
                }
                throw error;
            }
        },
    });
}

export function useConsultation(id: string) {
    return useQuery({
        queryKey: ['consultations', id],
        queryFn: async () => {
            try {
                const response = await api.get<Consultation>(`/consultations/${id}`);
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

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ consultationId, content }: { consultationId: string; content: string }) => {
            const response = await api.post<Message>(`/consultations/${consultationId}/messages`, {
                content,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['consultations', variables.consultationId] });
            queryClient.invalidateQueries({ queryKey: ['consultations'] });
        },
    });
}

export function useResolveConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (consultationId: string) => {
            const response = await api.patch(`/consultations/${consultationId}/resolve`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultations'] });
        },
    });
}
