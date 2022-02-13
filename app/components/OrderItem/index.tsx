import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
} from '@the-deep/deep-ui';
import routes from '#base/configs/routes';
import { orderItem } from '#base/configs/lang';
import { resolveToString } from '#base/utils/lang';
import useTranslation from '#base/hooks/useTranslation';
import { OrderType } from '#generated/types';

import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';

import styles from './styles.css';

export type Order = Pick<OrderType, 'id' | 'orderCode' | 'totalPrice' | 'status' | 'totalQuantity'>

export interface Props {
    className?: string;
    order: Order;
    detailsLinkHidden?: boolean;
}

function OrderItem(props: Props) {
    const {
        className,
        order,
        detailsLinkHidden,
    } = props;

    const {
        orderCode,
        totalPrice,
        totalQuantity,
        status,
    } = order;

    const strings = useTranslation(orderItem);
    const title = resolveToString(
        strings.orderTitle,
        { code: orderCode?.split('-')?.[0] },
    );

    return (
        <Container
            className={_cs(styles.orderItem, className)}
            contentClassName={styles.orderMeta}
            heading={title}
            headingClassName={styles.heading}
            headingSize="extraSmall"
            headingContainerClassName={styles.heading}
            withoutExternalPadding
            footerActions={!detailsLinkHidden && (
                <SmartButtonLikeLink
                    route={routes.orderDetail}
                    attrs={{ orderId: order.id }}
                    variant="transparent"
                >
                    {strings.viewDetailsLabel}
                </SmartButtonLikeLink>
            )}
        >
            <TextOutput
                label={strings.booksLabel}
                valueType="number"
                value={totalQuantity}
            />
            <TextOutput
                label={strings.totalPriceLabel}
                valueType="number"
                value={totalPrice}
                valueProps={{
                    prefix: strings.nprPrefix,
                }}
            />
            <TextOutput
                label={strings.statusLabel}
                value={status}
            />
        </Container>
    );
}

export default OrderItem;
