import { webEndpoint } from '#base/configs/env';

// FIXME: Fix this in server and DO NOT USE this!
// eslint-disable-next-line import/prefer-default-export
export function getMediaUrl(mediaName: string | undefined) {
    if (!mediaName) {
        return undefined;
    }

    return `${webEndpoint}/media/${mediaName}`;
}
