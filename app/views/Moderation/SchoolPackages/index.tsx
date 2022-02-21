import React from 'react';
import { _cs } from '@togglecorp/fujs';

import EmptyMessage from '#components/EmptyMessage';

import styles from './styles.css';

interface Props {
    className?: string;
}

function SchoolPackages(props: Props) {
    const { className } = props;
    return (
        <div
            className={_cs(styles.schoolPackages, className)}
        >
            School Packages
            <EmptyMessage
                message="Couldn't find any school packages"
                suggestion="There aren't any school packages at the moment. It might have not been created yet."
            />
        </div>
    );
}

export default SchoolPackages;
