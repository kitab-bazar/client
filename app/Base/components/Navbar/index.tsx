import React, {
    // useRef,
    useContext,
    useCallback,
} from 'react';
import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';
import {
    // useQuery,
    useMutation,
    gql,
} from '@apollo/client';
import { useLocation } from 'react-router-dom';
import {
    SelectInput,
    useAlert,
    Link,
    useConfirmation,
    DropdownMenu,
    DropdownMenuItem,
} from '@the-deep/deep-ui';
import {
    IoPerson,
} from 'react-icons/io5';

import routes from '#base/configs/routes';
import LanguageContext, {
    langOptions,
    langKeySelector,
    langLabelSelector,
} from '#base/context/LanguageContext';
import {
    common,
    navbar,
} from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { UserContext } from '#base/context/UserContext';
import {
    LogoutMutation,
    LogoutMutationVariables,
} from '#generated/types';
import useRouteMatching from '#base/hooks/useRouteMatching';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import SmartNavLink from '#base/components/SmartNavLink';
import RelativeTimeOutput from '#components/RelativeTimeOutput';
import KitabLogo from '#resources/img/KitabLogo.png';
import { resolveToString, resolveToComponent } from '#base/utils/lang';

import styles from './styles.css';

const languageIconMap = listToMap(
    langOptions,
    (d) => d.key,
    (d) => d.iconUrl,
);

const LOGOUT = gql`
    mutation Logout {
        logout {
            ok
        }
    }
`;

// const NOTIFICATION_POLL_INTERVAL = 60000;

export const USER_NOTIFICATIONS_COUNT = gql`
    query UserNotificationsCount {
        notifications {
            unreadCount
        }
    }
`;

interface Props {
    className?: string;
}

function Navbar(props: Props) {
    const { className } = props;
    const location = useLocation();

    const {
        authenticated,
        user,
        setUser,
        orderWindow,
    } = useContext(UserContext);

    const {
        lang,
        setLang,
    } = useContext(LanguageContext);

    const alert = useAlert();
    const commonStrings = useTranslation(common);
    const navbarStrings = useTranslation(navbar);

    /*
    const {
        data: notifications,
    } = useQuery<UserNotificationsCountQuery, UserNotificationsCountQueryVariables>(
        USER_NOTIFICATIONS_COUNT,
        {
            pollInterval: NOTIFICATION_POLL_INTERVAL,
            skip: !authenticated,
        },
    );

    const notificationsCount = notifications?.notifications?.unreadCount;

    const notificationRef = useRef<
    { setShowPopup: React.Dispatch<React.SetStateAction<boolean>> }
    >(null);

    const handleCloseNotificationClick = useCallback(() => {
        notificationRef?.current?.setShowPopup(false);
    }, []);
    */

    const strings = {
        ...commonStrings,
        ...navbarStrings,
    };

    const profileUrl = useRouteMatching(routes.myProfile);

    const [
        logout,
        // { loading: logoutLoading },
    ] = useMutation<LogoutMutation, LogoutMutationVariables>(
        LOGOUT,
        {
            onCompleted: (data) => {
                if (data.logout?.ok) {
                    setUser(undefined);
                    alert.show(
                        strings.logoutSuccessMessage,
                        { variant: 'success' },
                    );
                } else {
                    alert.show(
                        strings.logoutErrorMessage,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleLogout = useCallback(
        () => {
            logout();
        },
        [logout],
    );

    const [logoutConfirmationModal, setShowLogoutConfirmationTrue] = useConfirmation({
        onConfirm: handleLogout,
    });

    return (
        <nav className={_cs(className, styles.navbar)}>
            <Link
                to="/"
                className={styles.appBrand}
                linkElementClassName={styles.link}
            >
                <img
                    className={styles.logo}
                    src={KitabLogo}
                    alt="logo"
                />
                <div className={styles.appName}>
                    {commonStrings.kitabBazarAppLabel}
                </div>
            </Link>
            <div className={styles.mainMenu}>
                <SmartNavLink
                    route={routes.home}
                    exact
                    className={styles.navLink}
                />
                <SmartNavLink
                    route={routes.bookList}
                    className={styles.navLink}
                />
                <SmartNavLink
                    route={routes.moderation}
                    className={styles.navLink}
                />
            </div>
            <div className={styles.actions}>
                {orderWindow && (
                    <div className={styles.orderWindowMessage}>
                        {resolveToComponent(
                            strings.orderWindowMessage,
                            {
                                relativeTime: (
                                    <RelativeTimeOutput
                                        value={orderWindow.endDate}
                                    />
                                ),
                            },
                        )}
                    </div>
                )}
                <SelectInput
                    nonClearable
                    variant="general"
                    className={styles.languageSelection}
                    name={undefined}
                    options={langOptions}
                    keySelector={langKeySelector}
                    labelSelector={langLabelSelector}
                    value={lang}
                    onChange={setLang}
                    icons={(
                        <img
                            className={styles.icon}
                            alt={lang}
                            src={languageIconMap[lang]}
                        />
                    )}
                />
                <SmartButtonLikeLink
                    route={routes.register}
                    variant="general"
                >
                    {strings.signUpButtonLabel}
                </SmartButtonLikeLink>
                <SmartButtonLikeLink
                    route={routes.login}
                    variant="tertiary"
                    state={{ from: location.pathname }}
                >
                    {strings.loginButtonLabel}
                </SmartButtonLikeLink>
                {authenticated && user && (
                    <>
                        {/*
                        <QuickActionDropdownMenu
                            label={(<IoNotificationsOutline />)}
                            componentRef={notificationRef}
                            className={styles.notificationButton}
                            actions={notificationsCount !== 0 ? notificationsCount : undefined}
                            popupClassName={styles.popup}
                            actionsContainerClassName={styles.notificationCount}
                            persistent
                        >
                            <Notifications
                                onNotificationClose={handleCloseNotificationClick}
                            />
                        </QuickActionDropdownMenu>
                        */}
                        <DropdownMenu
                            label={<IoPerson />}
                            variant="tertiary"
                            className={styles.userDropdown}
                        >
                            <div className={styles.userInfo}>
                                <div className={styles.greetings}>
                                    {resolveToString(strings.greetings, { name: user.displayName ?? 'Unnamed' })}
                                </div>
                                {profileUrl && (
                                    <DropdownMenuItem href={profileUrl.to}>
                                        {strings.gotoProfile}
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    name={undefined}
                                    onClick={setShowLogoutConfirmationTrue}
                                    // TODO: disable dropdown menu item
                                    // disabled={logoutLoading}
                                >
                                    {strings.logoutButtonLabel}
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenu>
                        {logoutConfirmationModal}
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
