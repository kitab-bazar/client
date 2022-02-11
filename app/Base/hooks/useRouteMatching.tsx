import { useContext } from 'react';
import { generatePath } from 'react-router-dom';

import UserContext from '#base/context/UserContext';
import { wrap } from '#base/utils/routes';

export interface Attrs {
    [key: string]: string | undefined;
}

export type RouteData = ReturnType<typeof wrap>;

function useRouteMatching(route: RouteData, attrs?: Attrs) {
    const {
        user,
        authenticated,
    } = useContext(UserContext);

    const {
        checkPermissions,
        title,
        visibility,
        path,
    } = route;

    if (visibility === 'is-not-authenticated' && authenticated) {
        return undefined;
    }

    if (visibility === 'is-authenticated' && !authenticated) {
        return undefined;
    }

    if (
        authenticated
        && checkPermissions
        && !checkPermissions(user)
    ) {
        return undefined;
    }

    return {
        // NOTE: we just pass projectId here so that the permission check and
        // projectId param is in sync
        to: generatePath(path, { ...attrs }),
        children: title,
    };
}

export default useRouteMatching;
