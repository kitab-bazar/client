import React, { useContext, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useMutation, gql } from '@apollo/client';
import {
    useConfirmation,
    Button,
    SegmentInput,
    TextInput,
    useAlert,
    Link,
} from '@the-deep/deep-ui';
import {
    IoSearchSharp,
    IoCart,
    IoHeart,
} from 'react-icons/io5';

import routes from '#base/configs/routes';
import LanguageContext, {
    langOptions,
    langKeySelector,
    langLabelSelector,
} from '#base/context/LanguageContext';
import { UserContext } from '#base/context/UserContext';
import { LogoutMutation, LogoutMutationVariables } from '#generated/types';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import SmartLink from '#base/components/SmartLink';
import KitabLogo from '#resources/img/KitabLogo.png';

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

    const [logout] = useMutation<LogoutMutation, LogoutMutationVariables>(
        LOGOUT,
        {
            onCompleted: (data) => {
                if (data.logout?.ok) {
                    setUser(undefined);
                    alert.show(
                        'Successfully logged out',
                        {
                            variant: 'success',
                        },
                    );
                } else {
                    alert.show(
                        'Error logging out',
                        {
                            variant: 'error',
                        },
                    );
                }
            },

            onError: (gqlError) => {
                alert.show(
                    'Failed to send join request.',
                    { variant: 'error' },
                );

                // TODO: Remove this
                // eslint-disable-next-line no-console
                console.warn('Error: ', gqlError);
            },
        },
    );

    const handleLogout = useCallback(
        () => {
            logout();
            setUser(undefined);
        },
        [setUser, logout],
    );

    const [
        modal,
        // onLogoutClick,
    ] = useConfirmation<undefined>({
        showConfirmationInitially: false,
        onConfirm: logout,
        message: 'Are you sure you want to logout?',
    });

    return (
        <nav className={_cs(className, styles.navbar)}>
            <Link
                to="/"
                className={styles.appBrand}
            >
                <img
                    className={styles.logo}
                    src={KitabLogo}
                    alt="logo"
                />
                <div className={styles.appName}>
                    Kitab Bazar
                </div>
            </Link>
            <div className={styles.main}>
                <div className={styles.navLinks}>
                    <div className={styles.textInput}>
                        <TextInput
                            disabled
                            icons={<IoSearchSharp />}
                            onChange={undefined}
                            placeholder="Search all books"
                            name={undefined}
                            value={undefined}
                        />
                    </div>
                </div>
                <div className={styles.actions}>
                    <SegmentInput
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
                        Sign Up
                    </SmartButtonLikeLink>
                    <SmartButtonLikeLink
                        route={routes.login}
                        variant="primary"
                    >
                        Login
                    </SmartButtonLikeLink>
                    <SmartButtonLikeLink
                        variant="secondary"
                        route={routes.wishList}
                    >
                        <IoHeart />
                    </SmartButtonLikeLink>
                    <SmartButtonLikeLink
                        variant="secondary"
                        route={routes.cartPage}
                    >
                        <IoCart />
                    </SmartButtonLikeLink>
                    {authenticated && user && (
                        <div className={styles.userInfo}>
                            <div>
                                Hello
                            </div>
                            <SmartLink
                                route={routes.myProfile}
                            >
                                <strong>
                                    {user.displayName}
                                </strong>
                                !
                            </SmartLink>
                            <Button
                                name={undefined}
                                onClick={handleLogout}
                                variant="primary"
                            >
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {modal}
        </nav>
    );
}

export default Navbar;
