import React from 'react';
import { _cs } from '@togglecorp/fujs';

import RegisterForm from './RegisterForm';
import KitabLogo from '#resources/img/KitabLogo.png';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Register(props: Props) {
    const {
        className,
    } = props;

    return (
        <div className={_cs(styles.register, className)}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <img
                        src={KitabLogo}
                        alt=""
                    />
                    <div className={styles.appName}>
                        Kitab Bazar
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
