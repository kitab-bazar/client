import React from 'react';
import { _cs } from '@togglecorp/fujs';

import EmptyMessage from '#components/EmptyMessage';

import styles from './styles.css';

interface Props {
    className?: string;
}

function MunicipalityPackages(props: Props) {
    const { className } = props;
    return (
        <div
            className={_cs(styles.municipalityPackages, className)}
        >
            Municipality Packages
            <EmptyMessage
                message="Couldn't find any municipality packages"
                suggestion="There aren't any municipality packages at the moment. It might have not been created yet."
            />
        </div>
    );
}

export default MunicipalityPackages;
