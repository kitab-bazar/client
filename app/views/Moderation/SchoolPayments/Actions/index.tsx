import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@the-deep/deep-ui';

import { Payment } from '../index';

export interface Props {
    className?: string;
    onEditClick: (paymentId: string) => void;
    onViewPaymentLogClick: (paymentId: string) => void;
    data: Payment;
    disabled: boolean;
}

function Actions(props: Props) {
    const {
        className,
        onEditClick,
        onViewPaymentLogClick,
        data,
        disabled,
    } = props;

    return (
        <div className={_cs(className)}>
            <Button
                name={data.id}
                title="Edit payment"
                onClick={onEditClick}
                disabled={disabled}
                variant="tertiary"
            >
                Edit
            </Button>
            {((data.paymentLog?.totalCount ?? 0) > 0) && (
                <Button
                    name={data.id}
                    title="View payment log"
                    onClick={onViewPaymentLogClick}
                    disabled={disabled}
                    variant="tertiary"
                >
                    View logs
                </Button>
            )}
        </div>
    );
}

export default Actions;
