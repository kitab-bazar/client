import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    ContainerCard,
    TextOutput,
} from '@the-deep/deep-ui';
import {
    OrderType,
} from '#generated/types';
import routes from '#base/configs/routes';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import styles from './styles.css';

type Order = Omit<OrderType, 'createdBy'>;

interface Props {
    className?: string;
    order: Order;
}
function OrderItem(props: Props) {
    const {
        className,
        order,
    } = props;

    return (
        <ContainerCard
            className={_cs(className, styles.orderItem)}
            heading={order.orderCode}
            headingClassName={styles.heading}
            headingSize="extraSmall"
            footerActions={(
                <SmartButtonLikeLink
                    route={routes.orderList}
                    state={{ orderId: order.orderCode }}
                >
                    View details
                </SmartButtonLikeLink>
            )}
        >
            <TextOutput
                label="Books Quantity"
                labelContainerClassName={styles.label}
                valueType="number"
                hideLabelColon
                value={order.totalQuantity}
            />
            <TextOutput
                label="Total Price"
                labelContainerClassName={styles.label}
                valueType="number"
                hideLabelColon
                value={order.totalPrice}
                valueProps={{
                    prefix: 'Rs.',
                }}
            />
            <TextOutput
                label="Status"
                labelContainerClassName={styles.label}
                hideLabelColon
                value={order.status}
            />
        </ContainerCard>
    );
}

export default OrderItem;
