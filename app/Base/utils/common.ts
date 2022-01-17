import { BACKEND_SERVER_URL } from '#base/configs/env';

// eslint-disable-next-line import/prefer-default-export
export function getMediaUrl(mediaName: string | undefined) {
    if (!mediaName) {
        return undefined;
    }

    return `${BACKEND_SERVER_URL}/media/${mediaName}`;
}
