import React, { createContext, useContext, useState, useEffect } from 'react';
import { MagicKeyword } from '../types';
import { MAGIC_KEYWORDS } from '../data';

interface KeywordContextType {
    keywords: MagicKeyword[];
    addKeyword: (keyword: MagicKeyword) => void;
    updateKeyword: (term: string, keyword: MagicKeyword) => void;
    deleteKeyword: (term: string) => void;
    resetData: () => void;
}

const KeywordContext = createContext<KeywordContextType | undefined>(undefined);

export const KeywordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [keywords, setKeywords] = useState<MagicKeyword[]>([]);

    // Initialize from LocalStorage or default data
    useEffect(() => {
        const stored = localStorage.getItem('magic_keywords_data');
        if (stored) {
            try {
                setKeywords(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse keywords from local storage", e);
                setKeywords(MAGIC_KEYWORDS);
            }
        } else {
            setKeywords(MAGIC_KEYWORDS);
        }
    }, []);

    // Persist to LocalStorage whenever keywords change
    useEffect(() => {
        if (keywords.length > 0) {
            localStorage.setItem('magic_keywords_data', JSON.stringify(keywords));
        }
    }, [keywords]);

    const addKeyword = (keyword: MagicKeyword) => {
        setKeywords(prev => [keyword, ...prev]);
    };

    const updateKeyword = (term: string, updatedKeyword: MagicKeyword) => {
        setKeywords(prev => prev.map(k => k.term === term ? updatedKeyword : k));
    };

    const deleteKeyword = (term: string) => {
        setKeywords(prev => prev.filter(k => k.term !== term));
    };

    const resetData = () => {
        setKeywords(MAGIC_KEYWORDS);
        localStorage.removeItem('magic_keywords_data');
    };

    return (
        <KeywordContext.Provider value={{ keywords, addKeyword, updateKeyword, deleteKeyword, resetData }}>
            {children}
        </KeywordContext.Provider>
    );
};

export const useKeywords = () => {
    const context = useContext(KeywordContext);
    if (!context) {
        throw new Error('useKeywords must be used within a KeywordProvider');
    }
    return context;
};
