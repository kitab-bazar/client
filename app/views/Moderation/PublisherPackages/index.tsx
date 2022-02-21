import React from 'react';
import { _cs } from '@togglecorp/fujs';

import EmptyMessage from '#components/EmptyMessage';

import styles from './styles.css';

interface Props {
    className?: string;
}

function PublisherPackages(props: Props) {
    const { className } = props;
    return (
        <div
            className={_cs(styles.publisherPackages, className)}
        >
            Publisher Packages
            <EmptyMessage
                message="Couldn't find any publisher packages"
                suggestion="There aren't any publisher packages at the moment. It might have not been created yet."
            />
        </div>
    );
}

export default PublisherPackages;
