import React from 'react';
import { LocationState } from 'history';
import { Link, LinkProps } from '@the-deep/deep-ui';

import useRouteMatching, {
    RouteData,
    Attrs,
} from '#base/hooks/useRouteMatching';

export type Props = Omit<LinkProps, 'to'> & {
    route: RouteData;
    attrs?: Attrs;
    children?: React.ReactNode;
    state?: LocationState;
};

function SmartLink(props: Props) {
    const {
        route,
        attrs,
        children,
        state,
        ...otherProps
    } = props;

    const routeData = useRouteMatching(route, attrs);
    if (!routeData) {
        return null;
    }

    return (
        <Link
            {...otherProps}
            to={{
                pathname: routeData.to,
                state,
            }}
        >
            {children ?? routeData.children}
        </Link>
    );
}

export default SmartLink;
