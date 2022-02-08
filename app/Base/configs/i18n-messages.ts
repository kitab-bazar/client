import lang from '../../../i18n/lang.json';

export type SupportedLang = 'en' | 'ne';

export type SupportedKeys = keyof typeof lang;

export const messages: {
    [langKey in SupportedLang]?: {
        [key in SupportedKeys]?: string;
    };
} = {};

export function addMessages(
    idWithMessageList: [SupportedKeys, { [langKey in SupportedLang]?: string }][],
) {
    idWithMessageList.forEach(([id, message]) => {
        Object.keys(message).forEach((langKey) => {
            const typedLangKey = langKey as SupportedLang;

            const messagesForLang = messages[typedLangKey];
            if (messagesForLang) {
                messagesForLang[id] = message[typedLangKey];
            } else {
                messages[typedLangKey] = {
                    [id]: message[typedLangKey],
                };
            }
        });
    });
}
