import React from 'react';

import KitabLogo from '#resources/img/KitabLogo.png';
import { common } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import LoginForm from './LoginForm';

import styles from './styles.css';

function Login() {
    const strings = useTranslation(common);

    return (
        <div className={styles.login}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <img
                        className={styles.kitabLogo}
                        src={KitabLogo}
                        alt="Kitab"
                    />
                    <div className={styles.appName}>
                        {strings.kitabBazarAppLabel}
                    </div>
                </div>
                <div className={styles.right}>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;
