import React from 'react';
import { _cs } from '@togglecorp/fujs';

import KitabLogo from '#resources/img/KitabLogo.png';
import { common } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import RegisterForm from './RegisterForm';
import styles from './styles.css';

interface Props {
    className?: string;
}

function Register(props: Props) {
    const {
        className,
    } = props;

    const strings = useTranslation(common);

    return (
        <div className={_cs(styles.register, className)}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <img
                        src={KitabLogo}
                        alt=""
                    />
                    <div className={styles.appName}>
                        {strings.kitabBazarAppLabel}
                    </div>
                </div>
                <div className={styles.right}>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
export default Register;
