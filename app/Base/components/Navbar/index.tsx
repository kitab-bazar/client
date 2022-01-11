import React, { useContext, useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';
import { useMutation, gql } from '@apollo/client';
import {
    useConfirmation,
    Button,
    ButtonLikeLink,
    TextInput,
    useAlert,
} from '@the-deep/deep-ui';
import { GoSearch } from 'react-icons/go';
import KitabLogo from './KitabLogo.png';
import { UserContext } from '#base/context/UserContext';
import routes from '#base/configs/routes';
import { LogoutMutation, LogoutMutationVariables } from '#generated/types';

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
            <div className={styles.appBrand}>
                <img
                    className={styles.logo}
                    src={KitabLogo}
                    alt="logo"
                />
                <div className={styles.appName}>
                    Kitab Bazar
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.navLinks}>
                    <div className={styles.textInput}>
                        <TextInput
                            icons={<GoSearch />}
                            onChange={undefined}
                            placeholder="Search all books"
                            name={undefined}
                            value={undefined}
                        />
                    </div>
                </div>
                {!(authenticated && user) && (
                    <div className={styles.actions}>
                        <Button
                            name={undefined}
                            onClick={undefined}
                        >
                            Sign Up
                        </Button>
                    </div>
                )}
            </div>
            {!(authenticated && user) && (
                <>
                    <ButtonLikeLink
                        to={generatePath(routes.login.path)}
                        variant="primary"
                    >
                        Login
                    </ButtonLikeLink>
                </>
            )}
            {authenticated && user && (
                <Button
                    name={undefined}
                    onClick={handleLogout}
                    variant="primary"
                >
                    Logout
                </Button>
            )}
            {modal}
        </nav>
    );
}

export default Navbar;
