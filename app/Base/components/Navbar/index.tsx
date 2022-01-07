import React, { useContext, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    useConfirmation,
    Button,
    TextInput,
} from '@the-deep/deep-ui';
import {
    IoText,
} from 'react-icons/io5';
import { GoSearch } from 'react-icons/go';
import KitabLogo from './KitabLogo.png';
import { UserContext } from '#base/context/UserContext';

import styles from './styles.css';

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

    /*
    const [logout] = useMutation<LogoutMutation>(
        LOGOUT,
        {
            onCompleted: (data) => {
                if (data.logout?.ok) {
                    setUser(undefined);
                }
                // FIXME: handle failure
            },
            // FIXME: handle failure
        },
    );
    */
    const logout = useCallback(
        () => {
            setUser(undefined);
        },
        [setUser],
    );

    const [
        modal,
        onLogoutClick,
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
                    height={75}
                    width={110}
                    src={KitabLogo}
                    alt="logo"
                />
            </div>
            <div className={styles.main}>
                <div className={styles.navLinks}>
                    <div className={styles.textInput}>
                        <TextInput
                            icons={<IoText />}
                            onChange={undefined}
                            placeholder="Search all books"
                            name={undefined}
                            value={undefined}
                        />
                    </div>
                    <GoSearch />
                    {/* </div> */}
                </div>
                <div className={styles.actions}>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        className={styles.signUpButton}
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
            {authenticated && user && (
                <>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        className={styles.loginButton}
                        variant="primary"
                        autoFocus
                    >
                        Login
                    </Button>
                </>
            )}
            {modal}
        </nav>
    );
}

export default Navbar;
