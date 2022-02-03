import React, { useRef, useContext, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import {
    SegmentInput,
    TextInput,
    useAlert,
    Link,
    DropdownMenu,
    QuickActionDropdownMenu,
    DropdownMenuItem,
    useConfirmation,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
    IoCart,
    IoHeart,
    IoNotificationsOutline,
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
    UserNotificationsCountQuery,
    UserNotificationsCountQueryVariables,
} from '#generated/types';
import useRouteMatching from '#base/hooks/useRouteMatching';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import Notifications from '#components/Notifications';
import KitabLogo from '#resources/img/KitabLogo.png';
import { resolveToString } from '#base/utils/lang';

import styles from './styles.css';

const LOGOUT = gql`
    mutation Logout {
        logout {
            ok
        }
    }
`;

const NOTIFICATION_POLL_INTERVAL = 60000;

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
    } = useContext(UserContext);

    const {
        lang,
        setLang,
    } = useContext(LanguageContext);

    const alert = useAlert();
    const commonStrings = useTranslation(common);
    const navbarStrings = useTranslation(navbar);

    const {
        data: notifications,
    } = useQuery<UserNotificationsCountQuery, UserNotificationsCountQueryVariables>(
        USER_NOTIFICATIONS_COUNT,
        {
            pollInterval: NOTIFICATION_POLL_INTERVAL,
        },
    );

    const notificationsCount = notifications?.notifications?.unreadCount;

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

    const notificationRef = useRef<
    { setShowPopup: React.Dispatch<React.SetStateAction<boolean>> }
    >(null);

    const [logoutConfirmationModal, setShowLogoutConfirmationTrue] = useConfirmation({
        onConfirm: handleLogout,
    });

    const handleCloseNotificationClick = useCallback(() => {
        notificationRef?.current?.setShowPopup(false);
    }, []);

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
            <div className={styles.main}>
                <div className={styles.searchInputContainer}>
                    <TextInput
                        variant="general"
                        className={styles.searchInput}
                        disabled
                        icons={<IoSearchSharp />}
                        onChange={undefined}
                        placeholder={strings.searchAllBooksPlaceholder}
                        name={undefined}
                        value={undefined}
                    />
                </div>
                <div className={styles.actions}>
                    <SegmentInput
                        className={styles.languageSelection}
                        name={undefined}
                        options={langOptions}
                        keySelector={langKeySelector}
                        labelSelector={langLabelSelector}
                        value={lang}
                        onChange={setLang}
                    />
                    <SmartButtonLikeLink
                        route={routes.register}
                        variant="primary"
                    >
                        {strings.signUpButtonLabel}
                    </SmartButtonLikeLink>
                    <SmartButtonLikeLink
                        route={routes.login}
                        variant="primary"
                        state={{ from: location.pathname }}
                    >
                        {strings.loginButtonLabel}
                    </SmartButtonLikeLink>
                    <SmartButtonLikeLink
                        variant="action"
                        route={routes.wishList}
                    >
                        <IoHeart />
                    </SmartButtonLikeLink>
                    <SmartButtonLikeLink
                        variant="action"
                        route={routes.cartPage}
                    >
                        <IoCart />
                    </SmartButtonLikeLink>
                    {authenticated && user && (
                        <>
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
                                    closeNotification={handleCloseNotificationClick}
                                />
                            </QuickActionDropdownMenu>

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
            </div>
        </nav>
    );
}

export default Navbar;
