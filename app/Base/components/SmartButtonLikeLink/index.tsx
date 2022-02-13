import React from 'react';
import {
    ButtonLikeLink,
    ButtonLikeLinkProps,
} from '@the-deep/deep-ui';

import useRouteMatching, {
    RouteData,
    Attrs,
} from '#base/hooks/useRouteMatching';

export type Props = Omit<ButtonLikeLinkProps, 'to'> & {
    route: RouteData;
    attrs?: Attrs;
    children?: React.ReactNode;
    state?: unknown;
};

function SmartButtonLikeLink(props: Props) {
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
        <ButtonLikeLink
            {...otherProps}
            to={{
                pathname: routeData.to,
                state,
            }}
        >
            {children ?? routeData.children}
        </ButtonLikeLink>
    );
}

export default SmartButtonLikeLink;
