export interface Role {
    id: string;
    name: 'TRAINER' | 'CLIENT' | 'ADMIN';
    description?: string;
}

export interface MuscleGroup {
    id: string;
    name: string;
    imageUrl?: string | null;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: Role; // Updated from string union to Object
    avatarUrl?: string | null;
    phone?: string | null;
    birthDate?: string | null;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
    height?: number | null;
    weight?: number | null;
    maxHeartRate?: number | null;
    restingHeartRate?: number | null;
    leanMass?: number | null;
    waist?: number | null;
    hips?: number | null;
    chest?: number | null;
    arm?: number | null;
    leg?: number | null;
    activePlan?: {
        id: string;
        name: string;
        description?: string;
    };
    createdAt: string;
    updatedAt: string;
    completedWorkouts?: number;
    goal?: string | null;
}


export interface Exercise {
    id: string;
    name: string;
    description: string;
    muscleGroup: string; // Keep string for backward compat or display
    muscleGroupDetails?: MuscleGroup; // Add relation details
    defaultVideoUrl?: string | null;
    defaultImageUrl?: string | null;
    thumbnailUrl?: string | null;
}

export interface TrainingPlan {
    id: string;
    name: string;
    description?: string;
    authorId: string;
    days?: TrainingDay[];
    createdAt: string;
    updatedAt: string;
}

export interface TrainingDay {
    id: string;
    planId: string;
    name: string;
    order: number;
    exercises?: DayExercise[];
    createdAt: string;
    updatedAt: string;
}

export interface DayExercise {
    id: string;
    dayId: string;
    exerciseId: string;
    order: number;
    targetSets: number;
    targetReps: string;
    targetRir?: number;
    restSeconds: number;
    customDescription?: string;
    customVideoUrl?: string;
    customImageUrl?: string;
    coachNotes?: string;
    exercise?: Exercise;
}

export interface WorkoutSession {
    id: string;
    userId: string;
    trainerId?: string;
    trainingDayId?: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
    startedAt: string;
    completedAt?: string;
    totalVolume: number;
    durationSeconds?: number;
}

export interface BodyMetric {
    id: string;
    userId: string;
    weight: number;
    height?: number;
    bodyFat?: number;
    waist?: number | null;
    hips?: number | null;
    chest?: number | null;
    arm?: number | null;
    leg?: number | null;
    measurements?: Record<string, number>;
    notes?: string;
    loggedAt: string;
}

export interface CoachNote {
    id: string;
    clientId: string;
    authorId: string;
    content: string;
    author?: {
        id: string;
        name: string;
        userRole: {
            name: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface ProgressPhoto {
    id: string;
    userId: string;
    imageUrl: string;
    caption?: string;
    loggedAt: string;
}

export interface Consultation {
    id: string;
    clientId: string;
    trainerId: string;
    subject: string;
    status: 'OPEN' | 'RESOLVED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    createdAt: string;
    messages?: Message[];
}

export interface Message {
    id: string;
    consultationId: string;
    senderId: string;
    content: string;
    readAt?: string;
    createdAt: string;
}

export interface ScheduledWorkout {
    id: string;
    userId: string;
    trainerId: string;
    trainingDayId: string;
    scheduledFor: string;
    reminderSent: boolean;
    completed: boolean;
    notes?: string;
    clientName?: string;
    planName?: string;
    dayName?: string;
}

export interface TrainerStats {
    totalClients: number;
    totalExercises: number;
    totalPlans: number;
    sessionsToday: number;
}

export interface ClientStats {
    completedWorkoutsThisMonth: number;
    activePlan: {
        id: string;
        name: string;
        description: string | null;
    } | null;
    nextSession?: {
        id: string;
        date: string;
    };
}

export interface DashboardResponse {
    role: Role;
    data: TrainerStats | ClientStats;
}

