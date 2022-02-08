import { isDefined } from '@togglecorp/fujs';

// eslint-disable-next-line import/prefer-default-export
export function resolveToString(template: string, params: Record<string, string>) {
    if (!isDefined(template)) {
        return '';
    }

    const parts = template.split('{');
    const resolvedParts = parts.map(
        (part) => {
            const endIndex = part.indexOf('}');

            if (endIndex === -1) {
                return part;
            }

            const key = part.substring(0, endIndex);

            if (!isDefined(params[key])) {
                // eslint-disable-next-line no-console
                console.error(`value for key "${key}" not provided`);
                return '';
            }

            return part.replace(`${key}}`, params[key]);
        },
    );

    return resolvedParts.join('');
}
