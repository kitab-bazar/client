import React from 'react';

import { _cs } from '@togglecorp/fujs';

import styles from './styles.css';

interface Props {
    header?: string;
    description?: string;
    containerClassName?: string;
    headerClassName?: string;
    descriptionClassName?: string;
}
function ErrorMessage(props: Props) {
    const {
        header,
        description,
        containerClassName,
        headerClassName,
        descriptionClassName,
    } = props;

    return (
        <div className={_cs(styles.container, containerClassName)}>
            <div className={_cs(styles.header, headerClassName)}>
                {header}
            </div>
            {description && (
                <div className={_cs(styles.header, descriptionClassName)}>
                    {description}
                </div>
            )}
        </div>
    );
}

export default ErrorMessage;
