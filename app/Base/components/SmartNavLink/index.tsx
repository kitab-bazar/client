import React from 'react';
import { LocationState } from 'history';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';
import { Border } from '@the-deep/deep-ui';

import useRouteMatching, {
    RouteData,
    Attrs,
} from '#base/hooks/useRouteMatching';

import styles from './styles.css';

export type Props = Omit<NavLinkProps, 'to'> & {
    route: RouteData;
    attrs?: Attrs;
    children?: React.ReactNode;
    state?: LocationState;
};

function SmartNavLink(props: Props) {
    const {
        route,
        attrs,
        children,
        className,
        activeClassName,
        state,
        ...otherProps
    } = props;

    const routeData = useRouteMatching(route, attrs);
    if (!routeData) {
        return null;
    }

    return (
        <NavLink
            {...otherProps}
            to={{
                pathname: routeData.to,
                state,
            }}
            className={_cs(styles.smartNavLink, className)}
            activeClassName={_cs(styles.active, activeClassName)}
        >
            {children ?? routeData.children}
            <Border
                active
                className={styles.border}
                transparent
            />
        </NavLink>
    );
}

export default SmartNavLink;
