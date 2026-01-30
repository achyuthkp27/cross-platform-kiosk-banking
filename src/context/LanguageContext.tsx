import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../i18n/translations';

// Helper type to access nested keys like 'auth.login_title'
type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKeys = NestedKeyOf<typeof translations.en>;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    // Lazy initialization: read from localStorage on first render
    const [language, setLanguageState] = useState<Language>(() => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const storedLang = localStorage.getItem('kiosk_language') as Language;
                if (storedLang && ['en', 'es', 'nl'].includes(storedLang)) {
                    return storedLang;
                }
            }
        } catch (e) {
            console.error('Failed to load language preference', e);
        }
        return 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('kiosk_language', lang);
            }
        } catch (e) {
            console.error('Failed to save language preference', e);
        }
    };

    const t = (key: TranslationKeys): string => {
        const keys = key.split('.');
        let value: unknown = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                // Fallback to English if translation is missing
                console.warn(`Missing translation for key: ${key} in language: ${language}`);
                let fallback: unknown = translations['en'];
                for (const fk of keys) {
                    if (fallback && typeof fallback === 'object' && fk in fallback) {
                        fallback = (fallback as Record<string, unknown>)[fk];
                    } else {
                        return key; // Return key if even fallback fails
                    }
                }
                return fallback as string;
            }
        }

        return value as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
