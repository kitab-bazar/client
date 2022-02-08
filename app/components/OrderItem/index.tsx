import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
} from '@the-deep/deep-ui';
import {
    OrderStatus,
} from '#generated/types';
import routes from '#base/configs/routes';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';

import styles from './styles.css';

export interface Props {
    className?: string;
    orderCode: string;
    totalPrice: number;
    status: OrderStatus;
    totalBookTypes: number;
}

function OrderItem(props: Props) {
    const {
        orderCode,
        className,
        totalPrice,
        status,
        totalBookTypes,
    } = props;

    return (
        <Container
            className={_cs(styles.orderItem, className)}
            contentClassName={styles.orderMeta}
            heading={orderCode}
            headingClassName={styles.heading}
            headingSize="extraSmall"
            headingContainerClassName={styles.heading}
            withoutExternalPadding
            footerActions={(
                <SmartButtonLikeLink
                    route={routes.orderList}
                    state={{ orderId: orderCode }}
                    variant="transparent"
                >
                    View order details
                </SmartButtonLikeLink>
            )}
        >
            <TextOutput
                label="Books"
                valueType="number"
                value={totalBookTypes}
            />
            <TextOutput
                label="Total price"
                valueType="number"
                value={totalPrice}
                valueProps={{
                    prefix: 'NPR. ',
                }}
            />
            <TextOutput
                label="status"
                value={status}
            />
        </Container>
    );
}

export default OrderItem;
