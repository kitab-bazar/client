import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
    Card,
} from '@the-deep/deep-ui';
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
            <Card className={styles.card}>
                <div className={styles.left}>
                    Image goes here
                </div>
                <div className={styles.right}>
                    This is where the form goes!
                </div>
            </Card>
        </div>
    );
}
export default Register;
