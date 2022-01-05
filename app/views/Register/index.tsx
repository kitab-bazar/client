import React from 'react';
import { _cs } from '@togglecorp/fujs';

import PageContent from '#components/PageContent';

import styles from './styles.css';

interface Props {
    className?: string;
    name: string;
}

function Register(props: Props) {
    const {
        className,
        name,
    } = props;

    return (
        <PageContent className={_cs(styles.register, className)}>
            {name}
        </PageContent>
    );
}
export default Register;
