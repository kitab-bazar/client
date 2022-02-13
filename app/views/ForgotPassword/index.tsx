import React from 'react';

import KitabLogo from '#resources/img/KitabLogo.png';
import { common } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import ForgotPasswordForm from './Form';
import styles from './styles.css';

function ForgotPassword() {
    const strings = useTranslation(common);

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
                        {strings.kitabBazarAppLabel}
                    </div>
                </div>
                <div className={styles.right}>
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
