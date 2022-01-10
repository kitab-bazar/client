import React from 'react';

import {
    Card,
} from '@the-deep/deep-ui';

import LoginForm from './LoginForm';

import styles from './styles.css';

function Login() {
    return (
        <div className={styles.login}>
            <Card className={styles.card}>
                <div className={styles.left}>
                    Image goes here
                </div>
                <div className={styles.right}>
                    <LoginForm />
                </div>
            </Card>
        </div>
    );
}
export default Login;
