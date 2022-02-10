import React, { useEffect, useContext } from 'react';
import {
    Redirect,
    useLocation,
} from 'react-router-dom';

import useTranslation from '#base/hooks/useTranslation';
import PreloadMessage from '#base/components/PreloadMessage';
import { UserContext } from '#base/context/UserContext';
import { NavbarContext } from '#base/context/NavbarContext';
import PageTitle from '#base/components/PageTitle';
import { User } from '#base/types/user';
import ErrorBoundary from '#base/components/ErrorBoundary';
import { common } from '#base/configs/lang';

import styles from './styles.css';

type Visibility = 'is-authenticated' | 'is-not-authenticated' | 'is-anything';

export interface Props<T extends { className?: string }> {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.LazyExoticComponent<(props: T) => React.ReactElement<any, any> | null>;
    componentProps: React.PropsWithRef<T>;
    overrideProps: Partial<React.PropsWithRef<T>>;
    visibility: Visibility,
    checkPermissions?: (
        user: User | undefined,
    ) => boolean | undefined,
    navbarVisibility: boolean;

    path: string;
    loginPage?: string;
    defaultPage?: string;
}

function Page<T extends { className?: string }>(props: Props<T>) {
    const {
        component: Comp,
        componentProps,
        overrideProps,
        title,
        navbarVisibility,
        visibility,
        checkPermissions,

        loginPage = '/login/',
        defaultPage = '/',
        path,
    } = props;

    const commonStrings = useTranslation(common);

    const location = useLocation();

    const { user, authenticated } = useContext(UserContext);
    const { setNavbarVisibility } = useContext(NavbarContext);

    const redirectToSignIn = visibility === 'is-authenticated' && !authenticated;
    const redirectToHome = visibility === 'is-not-authenticated' && authenticated;
    const redirect = redirectToSignIn || redirectToHome;

    useEffect(
        () => {
            // NOTE: should not set visibility for redirection or, navbar will
            // flash
            if (!redirect) {
                setNavbarVisibility(navbarVisibility);
            }
        },
        // NOTE: setNavbarVisibility will not change
        // NOTE: navbarVisibility will not change
        // NOTE: adding path because Path component is reused when used in Switch > Routes
        [setNavbarVisibility, navbarVisibility, path, redirect],
    );

    if (redirectToSignIn) {
        return (
            <Redirect
                to={{
                    pathname: loginPage,
                    state: { from: location.pathname },
                }}
            />
        );
    }

    if (redirectToHome) {
        const state = location.state as { from?: string }| undefined;
        if (state?.from) {
            return (
                <Redirect
                    to={{
                        pathname: state.from,
                        state: undefined,
                    }}
                />
            );
        }
        return (
            <Redirect to={defaultPage} />
        );
    }

    // FIXME: custom error message from checkPermissions
    // FIXME: add a "back to home" or somewhere page
    // FIXME: only hide page if page is successfully mounted
    if (checkPermissions && !checkPermissions(user)) {
        return (
            <>
                <PageTitle value={`403 - ${title}`} />
                <PreloadMessage
                    heading={commonStrings.unathenticatedPageHeader}
                    content={commonStrings.unathenticatedPageContent}
                />
            </>
        );
    }

    return (
        <>
            <PageTitle value={title} />
            <ErrorBoundary>
                <Comp
                    className={styles.page}
                    {...componentProps}
                    {...overrideProps}
                />
            </ErrorBoundary>
        </>
    );
}

export default Page;
