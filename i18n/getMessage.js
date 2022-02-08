const fs = require('fs');
const path = require('path');

// NOTE: we are passing different locales (not just one locale)
// we are using defaultMessage for all the locales
module.exports = function getMessage(key, locales, defaultMessage) {
    const file = fs.readFileSync(
        path.resolve(__dirname, './lang.json'),
    );
    const messages = JSON.parse(file);

    const defaultMessages = locales.reduce(
        (acc, locale) => ({
            ...acc,
            [locale]: messages[key]
                ? messages[key][locale] || defaultMessage
                : defaultMessages,
        }),
        {},
    );

    return messages[key] || defaultMessages;
};
