'use client';

interface AvatarProps {
    name?: string;
    id: string; // Used for deterministic random generation
    avatarUrl?: string | null; // Optional custom avatar URL (legacy)
    src?: string | null; // Direct image source (prioritized)
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function Avatar({ name, id, avatarUrl, src, size = 'md', className = '' }: AvatarProps) {
    // Stylized/Animated-style avatars (Authentic Pixar-style)
    const avatarCollection = [
        '/images/avatars/pixar-1.png',
        '/images/avatars/pixar-2.png',
        '/images/avatars/pixar-3.png',
        '/images/avatars/pixar-4.png',
        '/images/avatars/pixar-5.png',
        '/images/avatars/pixar-6.png',
    ];

    // Deterministic selection based on ID
    const getAvatarIndex = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % avatarCollection.length;
    };

    const finalAvatarUrl = src || avatarUrl || avatarCollection[getAvatarIndex(id)];

    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
        xl: 'h-24 w-24',
    };

    return (
        <div className={`rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 ${sizeClasses[size]} ${className}`}>
            <img
                src={finalAvatarUrl}
                alt={name || 'Avatar'}
                className="w-full h-full object-cover"
                onError={(e) => {
                    // Fallback to initial if image fails
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${name || id}&background=random&color=fff`;
                }}
            />
        </div>
    );
}
