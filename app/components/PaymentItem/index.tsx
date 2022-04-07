import React, { ReactNode } from 'react';
import {
    DateOutput,
    TextOutput,
    Tag,
} from '@the-deep/deep-ui';
import { BiLoaderCircle } from 'react-icons/bi';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { StatusEnum } from '#generated/types';

import useTranslation from '#base/hooks/useTranslation';
import NumberOutput from '#components/NumberOutput';
import { profile } from '#base/configs/lang';

import styles from './styles.css';

interface Payment {
    amount: number;
    createdAt: string;
    id: string;
    paymentTypeDisplay: string;
    status: StatusEnum;
    statusDisplay: string;
    transactionTypeDisplay: string;
}

const paymentStatusMap: Record<Payment['status'], ReactNode> = {
    PENDING: <BiLoaderCircle />,
    VERIFIED: <IoCheckmark />,
    CANCELLED: <IoClose />,
};

interface Props {
    payment: Payment;
}

function PaymentItem(props: Props) {
    const {
        payment,
    } = props;
    const strings = useTranslation(profile);

    return (
        <div className={styles.paymentItem}>
            <div className={styles.details}>
                <div className={styles.paymentDetails}>
                    <DateOutput
                        format="dd-MM-yyyy"
                        value={payment.createdAt}
                    />
                    <div>
                        <TextOutput
                            label={strings.paymentTypeLabel}
                            value={payment.paymentTypeDisplay}
                        />
                        <TextOutput
                            label={strings.transactionTypeLabel}
                            value={payment.transactionTypeDisplay}
                        />
                    </div>
                </div>
                <div className={styles.amount}>
                    <TextOutput
                        label={strings.amountLabel}
                        value={(
                            <NumberOutput
                                value={payment.amount}
                                currency
                            />
                        )}
                    />
                    <Tag
                        icons={paymentStatusMap[payment.status]}
                    >
                        {payment.statusDisplay}
                    </Tag>
                </div>
            </div>
        </div>
    );
}

export default PaymentItem;
