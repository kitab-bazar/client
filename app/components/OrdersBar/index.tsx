import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery } from '@apollo/client';
import {
    Button,
    useBooleanState,
} from '@the-deep/deep-ui';

import {
    CartItemsMetaQuery,
    CartItemsMetaQueryVariables,
} from '#generated/types';

import OrdersModal from './OrdersModal';
import { CART_ITEMS } from './queries';

import styles from './styles.css';

interface Props {
    className?: string;
}

function OrdersBar(props: Props) {
    const {
        className,
    } = props;

    const [
        showOrders,
        setShowOrdersTrue,
        setShowOrdersFalse,
    ] = useBooleanState(false);

    const {
        data: cartItemsMeta,
    } = useQuery<CartItemsMetaQuery, CartItemsMetaQueryVariables>(CART_ITEMS);

    return (
        <>
            {cartItemsMeta?.cartItems?.totalCount && (
                <div className={_cs(styles.ordersBar, showOrders && styles.hidden, className)}>
                    <div>
                        {`${cartItemsMeta.cartItems.totalCount} book(s) selected`}
                    </div>
                    <div>
                        <Button
                            name={undefined}
                            variant="tertiary"
                            onClick={setShowOrdersTrue}
                        >
                            View Orders
                        </Button>
                    </div>
                </div>
            )}
            {showOrders && (
                <OrdersModal
                    onClose={setShowOrdersFalse}
                />
            )}
        </>
    );
}

export default OrdersBar;
