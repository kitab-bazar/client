import { createContext } from 'react';
import flagNe from '#resources/img/flag-ne.png';
import flagEn from '#resources/img/flag-en.png';

export type Lang = 'en' | 'ne';

export interface LanguageContextInterface {
    lang: Lang;
    setLang: (lang: Lang) => void;
    debug: boolean;
}

export interface LangOption {
    key: Lang;
    label: string;
    iconUrl: string;
}

export const langOptions: LangOption[] = [
    {
        key: 'en',
        label: 'English',
        iconUrl: flagEn,
    },
    {
        key: 'ne',
        label: 'नेपाली',
        iconUrl: flagNe,
    },
];

export const langKeySelector = (d: LangOption) => d.key;
export const langLabelSelector = (d: LangOption) => d.label;

export default createContext<LanguageContextInterface>({
    lang: 'en',
    setLang: (lang: Lang) => {
        // eslint-disable-next-line no-console
        console.warn('Trying to set language before the language context was initialized.', lang);
    },
    debug: false,
});
