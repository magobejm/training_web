import { create } from 'zustand';
import { Exercise } from '@/types';

export interface WizardExercise {
    id: string; // temp id for UI
    exerciseId: string;
    name: string;
    exercise: Exercise;
    targetSets: number;
    targetReps: string;
    targetRir?: number;
    restSeconds?: number;
    customDescription?: string;
    customVideoUrl?: string;
    customImageUrl?: string;
    coachNotes?: string;
    order: number;
}

export interface WizardDay {
    id: string; // temp id
    name: string;
    order: number;
    exercises: WizardExercise[];
}

interface PlanInfo {
    name: string;
    description: string;
}

interface PlanWizardState {
    // State
    planInfo: PlanInfo;
    days: WizardDay[];
    activeStep: number;

    // Actions
    setPlanInfo: (info: PlanInfo) => void;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    addDay: () => void;
    removeDay: (dayId: string) => void;
    updateDayName: (dayId: string, name: string) => void;
    reorderDays: (days: WizardDay[]) => void;

    addExerciseToDay: (dayId: string, exercise: Exercise) => void;
    removeExerciseFromDay: (dayId: string, exerciseId: string) => void;
    updateExerciseConfig: (dayId: string, exerciseId: string, config: Partial<WizardExercise>) => void;

    reset: () => void;
}

export const usePlanWizardStore = create<PlanWizardState>((set) => ({
    planInfo: {
        name: '',
        description: '',
    },
    days: [],
    activeStep: 0,

    setPlanInfo: (info) => set((state) => ({ planInfo: { ...state.planInfo, ...info } })),
    setStep: (step) => set({ activeStep: step }),
    nextStep: () => set((state) => ({ activeStep: Math.min(state.activeStep + 1, 3) })), // 4 steps (0-3)
    prevStep: () => set((state) => ({ activeStep: Math.max(state.activeStep - 1, 0) })),

    addDay: () => set((state) => ({
        days: [
            ...state.days,
            {
                id: crypto.randomUUID(),
                name: `Day ${state.days.length + 1}`,
                order: state.days.length + 1,
                exercises: []
            }
        ]
    })),

    removeDay: (dayId) => set((state) => ({
        days: state.days.filter(d => d.id !== dayId)
    })),

    updateDayName: (dayId, name) => set((state) => ({
        days: state.days.map(d => d.id === dayId ? { ...d, name } : d)
    })),

    reorderDays: (days) => set({ days }),

    addExerciseToDay: (dayId, exercise) => set((state) => ({
        days: state.days.map(d => {
            if (d.id !== dayId) return d;
            return {
                ...d,
                exercises: [
                    ...d.exercises,
                    {
                        id: crypto.randomUUID(),
                        exerciseId: exercise.id,
                        name: exercise.name,
                        exercise,
                        targetSets: 3,
                        targetReps: '8-12',
                        targetRir: 2,
                        restSeconds: 90,
                        order: d.exercises.length + 1,
                    }
                ]
            };
        })
    })),

    removeExerciseFromDay: (dayId, exerciseId) => set((state) => ({
        days: state.days.map(d => {
            if (d.id !== dayId) return d;
            return {
                ...d,
                exercises: d.exercises.filter(e => e.id !== exerciseId)
            };
        })
    })),

    updateExerciseConfig: (dayId, exerciseId, config) => set((state) => ({
        days: state.days.map(d => {
            if (d.id !== dayId) return d;
            return {
                ...d,
                exercises: d.exercises.map(e =>
                    e.id === exerciseId ? { ...e, ...config } : e
                )
            };
        })
    })),

    reset: () => set({
        planInfo: { name: '', description: '' },
        days: [],
        activeStep: 0
    })
}));
