import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { BodyMetric, ProgressPhoto } from '@/types';

export function useBodyMetrics(clientId?: string) {
    return useQuery({
        queryKey: ['body-metrics', clientId],
        queryFn: async () => {
            const response = await api.get<{ metrics: BodyMetric[]; total: number }>('/body-metrics', {
                params: { userId: clientId }, // API uses CurrentUser if not provided, but we might want to specify if admin/trainer
            });
            return response.data;
        },
        enabled: !!clientId,
    });
}

export function useLogMetric() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<BodyMetric>) => {
            const response = await api.post<BodyMetric>('/body-metrics', data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['body-metrics', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['client', variables.userId] });
        },
    });
}

export function useProgressPhotos(clientId?: string) {
    return useQuery({
        queryKey: ['progress-photos', clientId],
        queryFn: async () => {
            // Updated API returns { photos: ProgressPhoto[], total: number }
            const response = await api.get<{ photos: ProgressPhoto[]; total: number }>('/body-metrics/photos', {
                params: { userId: clientId },
            });
            return response.data;
        },
        enabled: !!clientId,
    });
}

export function useUploadPhoto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { imageUrl: string; caption?: string; userId: string }) => {
            const response = await api.post<ProgressPhoto>('/body-metrics/photos', data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['progress-photos', variables.userId] });
        },
    });
}

export function useDeletePhoto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ photoId }: { photoId: string; userId: string }) => {
            await api.delete(`/body-metrics/photos/${photoId}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['progress-photos', variables.userId] });
        },
    });
}
