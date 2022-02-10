import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery } from '@apollo/client';
import {
    Button,
    useBooleanState,
    TextOutput,
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

    const totalCount = cartItemsMeta?.cartItems?.totalCount ?? 0;
    const totalQuantity = cartItemsMeta?.cartItems?.totalQuantity ?? 0;
    const totalPrice = cartItemsMeta?.cartItems?.grandTotalPrice ?? 0;

    return (
        <>
            {totalCount > 0 && (
                <div className={_cs(styles.ordersBar, showOrders && styles.hidden, className)}>
                    <div className={styles.summary}>
                        {`${totalCount} book(s) selected`}
                        <TextOutput
                            label="Total price (NPR)"
                            valueType="number"
                            value={totalPrice}
                        />
                        <TextOutput
                            label="Total Books"
                            valueType="number"
                            value={totalQuantity}
                        />
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
                    totalPrice={totalPrice}
                    totalQuantity={totalQuantity}
                />
            )}
        </>
    );
}

export default OrdersBar;
