import React from 'react';
import { FormattedMessage } from 'react-intl';

import KitabLogo from '#resources/img/KitabLogo.png';

import LoginForm from './LoginForm';

import styles from './styles.css';

function Login() {
    return (
        <div className={styles.login}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <img
                        className={styles.kitabLogo}
                        src={KitabLogo}
                        alt=""
                    />
                    <div className={styles.appName}>
                        Kitab Bazar
                    </div>
                    <FormattedMessage
                        description="Text for bazaar"
                        defaultMessage="Bazaar"
                    />
                </div>
                <div className={styles.right}>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
export default Login;
