import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
} from '@the-deep/deep-ui';
import { orderItem } from '#base/configs/lang';
import { resolveToString } from '#base/utils/lang';
import useTranslation from '#base/hooks/useTranslation';
import { OrderType } from '#generated/types';

import NumberOutput from '#components/NumberOutput';

import styles from './styles.css';

export type Order = Pick<OrderType, 'id' | 'orderCode' | 'totalPrice' | 'status' | 'totalQuantity'>

export interface Props {
    className?: string;
    order: Order;
    onClick?: (name: Order['id']) => void;
}

function OrderItem(props: Props) {
    const {
        className,
        order,
        onClick,
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

    const handleClick = React.useCallback(() => {
        if (onClick) {
            onClick(order.id);
        }
    }, [onClick, order.id]);

    return (
        <Container
            className={_cs(
                styles.orderItem,
                onClick && styles.clickable,
                className,
            )}
            containerElementProps={
                onClick ? { onClick: handleClick } : undefined
            }
            contentClassName={styles.orderMeta}
            heading={title}
            headingClassName={styles.heading}
            headingSize="extraSmall"
            headingContainerClassName={styles.heading}
            footerActions={status}
            footerActionsContainerClassName={styles.status}
        >
            <TextOutput
                label={strings.booksLabel}
                value={(
                    <NumberOutput
                        value={totalQuantity}
                    />
                )}
            />
            <TextOutput
                label={strings.totalPriceLabel}
                value={(
                    <NumberOutput
                        value={totalPrice}
                        currency
                    />
                )}
            />
        </Container>
    );
}

export default OrderItem;
