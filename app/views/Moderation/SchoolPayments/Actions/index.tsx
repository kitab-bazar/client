import React, { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@the-deep/deep-ui';

import { Payment } from '../index';

export interface Props {
    className?: string;
    onEditClick: (data: string) => void;
    data: Payment;
    disabled: boolean;
}

function Actions(props: Props) {
    const {
        className,
        onEditClick,
        data,
        disabled,
    } = props;

    const handleEditClick = useCallback(() => {
        onEditClick(data.id);
    }, [onEditClick, data]);

    return (
        <div className={_cs(className)}>
            <Button
                name={undefined}
                title="Edit payment"
                onClick={handleEditClick}
                disabled={disabled}
                variant="tertiary"
            >
                Edit
            </Button>
        </div>
    );
}

export default Actions;
