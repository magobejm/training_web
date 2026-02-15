import api from '@/lib/api';
import { User } from '@/types';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';

export function useClients() {
    return useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            try {
                // Los clientes son usuarios con role CLIENT
                const response = await api.get<User[]>('/users');
                return response.data.filter(u => u.role.name === 'CLIENT');
            } catch (error: any) {
                // Si el endpoint no existe o hay error, retornar array vacío
                if (error.response?.status === 404 || error.response?.status === 500) {
                    return [];
                }
                throw error;
            }
        },
    });
}

export function useClient(id: string): UseQueryResult<User | null, Error> {
    return useQuery({
        queryKey: ['clients', id],
        queryFn: async () => {
            try {
                const response = await api.get<User>(`/users/${id}`);
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

export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { email: string; name: string; password: string; avatarUrl?: string | null }) => {
            const response = await api.post('/auth/register', {
                ...data,
                role: 'CLIENT',
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (clientId: string) => {
            const response = await api.delete(`/users/${clientId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useAssignPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ clientId, planId }: { clientId: string; planId: string | null }) => {
            const response = await api.patch(`/users/${clientId}/plan`, { planId });
            return response.data;
        },
        onSuccess: (_, { clientId }) => {
            queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
            const response = await api.patch(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['clients', id] });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
}
