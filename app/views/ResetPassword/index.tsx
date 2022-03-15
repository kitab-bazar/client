import React from 'react';

import KitabLogo from '#resources/img/KitabLogo.png';
import { common } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import ResetPasswordForm from './ResetPasswordForm';
import styles from './styles.css';

function ResetPassword() {
    const strings = useTranslation(common);

    return (
        <div className={styles.resetPassword}>
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
                    <ResetPasswordForm />
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
