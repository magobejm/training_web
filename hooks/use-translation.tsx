'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../dictionaries/en.json';
import es from '../dictionaries/es.json';

type Dictionary = typeof en;
type Language = 'en' | 'es';

const dictionaries: Record<Language, Dictionary> = {
    en,
    es,
};

interface TranslationContextType {
    t: (key: string, params?: Record<string, string | number>) => string;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
    // Default to Spanish as requested
    const [language, setLanguage] = useState<Language>('es');

    // Optional: Load from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (path: string, params?: Record<string, string | number>): string => {
        const keys = path.split('.');
        let current: any = dictionaries[language];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`);
                return path;
            }
            current = current[key];
        }

        let translation = current as string;

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                translation = translation.replace(`{${key}}`, String(value));
            });
        }

        return translation;
    };

    return (
        <TranslationContext.Provider value={{ t, language, setLanguage: handleSetLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}
