import { Lang } from '#base/context/LanguageContext';

export type LangString = Record<Lang, string>;
export type LangStringWithTemplate = LangString & {
    var: string[];
}

export interface LangStrings {
    [key: string]: LangString | LangStringWithTemplate;
}

export const common = {
    kitabBazarAppLabel: {
        en: 'Kitab Bazar',
        np: 'किताब बजार',
    },
};

export const navbar = {
    searchAllBooksPlaceholder: {
        en: 'Search all books',
        np: 'किताब खोज्नु होस्',
    },
    signUpButtonLabel: {
        en: 'Sign Up',
        np: 'नया दर्ता',
    },
    loginButtonLabel: {
        en: 'Login',
        np: 'लग इन',
    },
    greetings: {
        en: 'Hello {name}!',
        np: 'नमस्कार {name}!',
    },
    gotoProfile: {
        en: 'Goto profile',
        np: 'प्रोफाइलमा जानुहोस्',
    },
    logoutConfirmMessage: {
        en: 'Are you sure you want to logout?',
        np: 'साचिकै लग ओउट गर्ने हो?',
    },
    logoutButtonLabel: {
        en: 'Logout',
        np: 'लग ओउट',
    },
};

export const login = {
    loginHeaderLabel: {
        en: 'Login',
        np: 'लग इन',
    },
    emailLabel: {
        en: 'Email',
        np: 'इमेल',
    },
    passwordLabel: {
        en: 'Password',
        np: 'पासवर्ड',
    },
    loginButtonLabel: {
        en: 'Login',
        np: 'लग इन',
    },
    donotHaveAccountYetLabel: {
        en: 'Do not have an account yet?',
        np: 'दर्ता भएको छैन?',
    },
    errorLoggingInLabel: {
        en: 'Error while logging in.',
        np: 'लोग इन गर्न समस्या भएको छ।',
    },
    registerlabel: {
        en: 'Register',
        np: 'दर्ता  गर्नुहोस्',
    },
};

export const homePage = {
    kitabLabel: {
        en: 'Kitab',
        np: 'किताब',
    },
    bazarLabel: {
        en: 'Bazar',
        np: 'बजार',
    },
    tagLineLabel: {
        en: 'Knowledge Improvement Through Access of Books',
        np: 'किताबको पहुँचबाट शिक्षाको विकास',
    },
    featuredBooksLabel: {
        en: 'Featured Books',
        np: 'चित्रित किताबहरु',
    },
    faqButtonLabel: {
        en: 'FAQs',
        np: 'जानबुझ',
    },
    blogsButtonLabel: {
        en: 'Blogs',
        np: 'ब्लगहरु',
    },
    whyKitabBazarLabel: {
        en: 'Why Kitab Bazar?',
        np: 'किन किताब बजार?',
    },
    contactUsButtonLabel: {
        en: 'Contact Us',
        np: 'सम्पर्क गर्नुहोस',
    },
};
