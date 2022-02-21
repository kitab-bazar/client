import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoList } from 'react-icons/io5';

import styles from './styles.css';

interface Props {
    className?: string;
    message?: React.ReactNode;
    suggestion?: React.ReactNode;
}

function EmptyMessage(props: Props) {
    const {
        className,
        message,
        suggestion,
    } = props;

    return (
        <div className={_cs(styles.emptyMessage, className)}>
            <IoList className={styles.icon} />
            <div className={styles.text}>
                <div className={styles.message}>
                    {message}
                </div>
                {suggestion && (
                    <div className={styles.suggestion}>
                        {suggestion}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmptyMessage;
