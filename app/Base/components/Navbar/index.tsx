import React, { useContext, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useMutation, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import {
    SegmentInput,
    TextInput,
    useAlert,
    Link,
    DropdownMenu,
    DropdownMenuItem,
    useConfirmation,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
    IoCart,
    IoHeart,
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
