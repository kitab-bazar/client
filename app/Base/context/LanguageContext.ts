import { createContext } from 'react';

export type Lang = 'en' | 'np';

export interface LanguageContextInterface {
    lang: Lang;
    setLang: (lang: Lang) => void;
    debug: boolean;
}

export interface LangOption {
    key: Lang;
    label: string;
}

export const langOptions: LangOption[] = [
    {
        key: 'en',
        label: 'en',
    },
    {
        key: 'np',
        label: 'ने.',
    },
];

export const langKeySelector = (d: LangOption) => d.key;
export const langLabelSelector = (d: LangOption) => d.label;

export default createContext<LanguageContextInterface>({
    lang: 'en',
    setLang: (lang: Lang) => {
        console.warn('Trying to set language before the language context was initialized.', lang);
    },
    debug: false,
});
