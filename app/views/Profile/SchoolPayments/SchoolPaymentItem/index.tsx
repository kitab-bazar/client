import React, { ReactNode } from 'react';
import {
    DateOutput,
    TextOutput,
    Tag,
} from '@the-deep/deep-ui';
import { BiLoaderCircle } from 'react-icons/bi';
import { IoCheckmark, IoClose } from 'react-icons/io5';

import useTranslation from '#base/hooks/useTranslation';
import NumberOutput from '#components/NumberOutput';
import { profile } from '#base/configs/lang';

import { SchoolPayment } from '../index';
import styles from './styles.css';

const paymentStatusMap: Record<SchoolPayment['status'], ReactNode> = {
    PENDING: <BiLoaderCircle />,
    VERIFIED: <IoCheckmark />,
    CANCELLED: <IoClose />,
};

interface Props {
    payment: SchoolPayment;
}

function SchoolPaymentItem(props: Props) {
    const {
        payment,
    } = props;
    const strings = useTranslation(profile);

    return (
        <div className={styles.schoolPaymentItem}>
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

export default SchoolPaymentItem;
