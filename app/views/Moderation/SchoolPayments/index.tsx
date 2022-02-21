import React from 'react';
import { _cs } from '@togglecorp/fujs';

import EmptyMessage from '#components/EmptyMessage';

import styles from './styles.css';

interface Props {
    className?: string;
}

function SchoolPayments(props: Props) {
    const { className } = props;
    return (
        <div
            className={_cs(styles.schoolPayments, className)}
        >
            School Payments
            <EmptyMessage
                message="Couldn't find any payments"
                suggestion="There aren't any payments for the Schools at the moment"
            />
        </div>
    );
}

export default SchoolPayments;
