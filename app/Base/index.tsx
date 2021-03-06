import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Router } from 'react-router-dom';
import { IoArrowUp } from 'react-icons/io5';
import { init, ErrorBoundary, setUser as setUserOnSentry } from '@sentry/react';
import { unique, _cs } from '@togglecorp/fujs';
import { AlertContainer, AlertContext, AlertOptions, QuickActionButton } from '@the-deep/deep-ui';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import ReactGA from 'react-ga';

import '@the-deep/deep-ui/build/index.css';

import browserHistory from '#base/configs/history';
import sentryConfig from '#base/configs/sentry';
import apolloConfig from '#base/configs/apollo';
import { trackingId, gaConfig } from '#base/configs/googleAnalytics';
import { UserContext, UserContextInterface } from '#base/context/UserContext';
import { NavbarContext, NavbarContextInterface } from '#base/context/NavbarContext';
import LanguageContext, { Lang } from '#base/context/LanguageContext';
import { sync } from '#base/hooks/useAuthSync';
import Init from '#base/components/Init';
import PreloadMessage from '#base/components/PreloadMessage';
import AuthPopup from '#base/components/AuthPopup';
import Navbar from '#base/components/Navbar';
import Footer from '#base/components/Footer';
import useLocalStorage from '#base/hooks/useLocalStorage';
import Routes from '#base/components/Routes';
import useTranslation from '#base/hooks/useTranslation';
import { homePage } from '#base/configs/lang';
import { isStaging } from '#base/configs/env';

import { User, OrderWindow } from '#base/types/user';

import Nagbar from '#components/Nagbar';
import OrdersBar from '#components/OrdersBar';

import styles from './styles.css';

if (sentryConfig) {
    init(sentryConfig);
}

if (trackingId) {
    ReactGA.initialize(trackingId, gaConfig);
    browserHistory.listen((location) => {
        const page = location.pathname ?? window.location.pathname;
        ReactGA.set({ page });
        ReactGA.pageview(page);
    });
}

if (isStaging) {
    document.documentElement.style.setProperty('--dui-color-accent', '#9c27b0');
}

const apolloClient = new ApolloClient(apolloConfig);

function Base() {
    const [user, setUser] = useState<User | undefined>();
    const [orderWindow, setOrderWindow] = useState<OrderWindow | undefined>();

    const [navbarVisibility, setNavbarVisibility] = useState(false);
    const [lang, setLang] = useLocalStorage<Lang>('lang', 'ne', false);

    const [logicalTime, setLogicalTime] = useState(0);

    const reset = useCallback(
        () => {
            setLogicalTime((val) => val + 1);
        },
        [],
    );

    React.useEffect(() => {
        apolloClient.refetchQueries({
            include: 'active',
        });
    }, [lang]);

    const authenticated = !!user;

    const setUserWithSentry: typeof setUser = useCallback(
        (u) => {
            if (typeof u === 'function') {
                setUser((oldUser) => {
                    const newUser = u(oldUser);
                    const sanitizedUser = newUser;

                    sync(!!sanitizedUser, sanitizedUser?.id);
                    setUserOnSentry(sanitizedUser ?? null);
                    if (!sanitizedUser) {
                        setOrderWindow(undefined);
                    }

                    return newUser;
                });
            } else {
                const sanitizedUser = u;
                sync(!!sanitizedUser, sanitizedUser?.id);
                setUserOnSentry(sanitizedUser ?? null);
                if (!sanitizedUser) {
                    setOrderWindow(undefined);
                }
                setUser(sanitizedUser);
            }
        },
        [setUser],
    );

    const userContext: UserContextInterface = useMemo(
        () => ({
            authenticated,
            user,
            setUser: setUserWithSentry,
            orderWindow,
            setOrderWindow,
            navbarVisibility,
            setNavbarVisibility,
        }),
        [
            authenticated,
            user,
            orderWindow,
            setUserWithSentry,
            navbarVisibility,
            setNavbarVisibility,
        ],
    );

    const navbarContext: NavbarContextInterface = useMemo(
        () => ({
            navbarVisibility,
            setNavbarVisibility,
            reset,
        }),
        [navbarVisibility, setNavbarVisibility, reset],
    );

    const [alerts, setAlerts] = React.useState<AlertOptions[]>([]);

    const addAlert = React.useCallback(
        (alert: AlertOptions) => {
            setAlerts((prevAlerts) => unique(
                [...prevAlerts, alert],
                (a) => a.name,
            ) ?? prevAlerts);
        },
        [setAlerts],
    );

    const removeAlert = React.useCallback(
        (name: string) => {
            setAlerts((prevAlerts) => {
                const i = prevAlerts.findIndex((a) => a.name === name);
                if (i === -1) {
                    return prevAlerts;
                }

                const newAlerts = [...prevAlerts];
                newAlerts.splice(i, 1);

                return newAlerts;
            });
        },
        [setAlerts],
    );

    const updateAlertContent = React.useCallback(
        (name: string, children: React.ReactNode) => {
            setAlerts((prevAlerts) => {
                const i = prevAlerts.findIndex((a) => a.name === name);
                if (i === -1) {
                    return prevAlerts;
                }

                const updatedAlert = {
                    ...prevAlerts[i],
                    children,
                };

                const newAlerts = [...prevAlerts];
                newAlerts.splice(i, 1, updatedAlert);

                return newAlerts;
            });
        },
        [setAlerts],
    );

    const alertContext = React.useMemo(
        () => ({
            alerts,
            addAlert,
            updateAlertContent,
            removeAlert,
        }),
        [alerts, addAlert, updateAlertContent, removeAlert],
    );

    const languageContext = React.useMemo(() => ({
        lang,
        setLang,
        debug: false,
    }), [lang, setLang]);

    // NOTE: make sure page is
    // destroyed when user is changed
    // NOTE: adding time to reload even when user doesn't change
    const key = `${user?.id ?? '0'}:${logicalTime}`;

    const baseElementRef = useRef<HTMLDivElement>(null);
    const [gotoTopButtonVisible, setGotoTopButtonVisible] = useState<boolean>(false);

    useEffect(
        () => {
            let scrollTimeout: number | undefined;
            const handlePageScroll = () => {
                window.clearTimeout(scrollTimeout);

                scrollTimeout = window.setTimeout(() => {
                    const scrollTop = baseElementRef.current?.scrollTop ?? 0;
                    setGotoTopButtonVisible(scrollTop > 0);
                }, 200);
            };
            const reff = baseElementRef.current;
            if (reff) {
                reff.addEventListener('scroll', handlePageScroll);
            }
            return () => {
                if (reff) {
                    reff.removeEventListener('scroll', handlePageScroll);
                }
                window.clearTimeout(scrollTimeout);
            };
        },
        [],
    );

    const handleGotoTopButtonClick = useCallback(() => {
        const c = baseElementRef.current;
        if (c) {
            c.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        }
    }, [baseElementRef]);

    const strings = useTranslation(homePage);

    return (
        <div
            ref={baseElementRef}
            className={styles.base}
        >
            <ErrorBoundary
                showDialog
                fallback={(
                    <PreloadMessage
                        heading="Oh no!"
                        content="Some error occurred!"
                    />
                )}
            >
                <ApolloProvider client={apolloClient}>
                    <LanguageContext.Provider value={languageContext}>
                        <UserContext.Provider value={userContext}>
                            <NavbarContext.Provider value={navbarContext}>
                                <AlertContext.Provider value={alertContext}>
                                    <AuthPopup />
                                    <AlertContainer className={styles.alertContainer} />
                                    <Router history={browserHistory}>
                                        <Init
                                            preloadClassName={styles.preload}
                                            key={key}
                                        >
                                            <Navbar
                                                className={_cs(
                                                    styles.navbar,
                                                    !navbarVisibility && styles.hidden,
                                                )}
                                            />
                                            <Nagbar />
                                            <Routes className={styles.view} />
                                            <Footer className={styles.footer} />
                                            { authenticated && (
                                                <OrdersBar className={styles.ordersBar} />
                                            )}
                                        </Init>
                                    </Router>
                                </AlertContext.Provider>
                            </NavbarContext.Provider>
                        </UserContext.Provider>
                    </LanguageContext.Provider>
                </ApolloProvider>
            </ErrorBoundary>
            {gotoTopButtonVisible && (
                <QuickActionButton
                    name={undefined}
                    className={styles.gotoTopButton}
                    title={strings.gotoTopTitle}
                    onClick={handleGotoTopButtonClick}
                    spacing="loose"
                    variant="primary"
                >
                    <IoArrowUp />
                </QuickActionButton>
            )}
        </div>
    );
}

export default Base;
