import React, { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { FiEdit2 } from 'react-icons/fi';
import {
    QuickActionButton,
} from '@the-deep/deep-ui';

import { Payment } from '../index';

export interface Props {
    className?: string;
    onEditClick: (data: Payment) => void;
    data: Payment;
}

function TableActions(props: Props) {
    const {
        className,
        onEditClick,
        data,
    } = props;

    const handleEditClick = useCallback(() => {
        onEditClick(data);
    }, [onEditClick, data]);

    return (
        <div className={_cs(className)}>
            <QuickActionButton
                name={undefined}
                title="Edit payment"
                onClick={handleEditClick}
            >
                <FiEdit2 />
            </QuickActionButton>
        </div>
    );
}

export default TableActions;
