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

import { ordersBar } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { resolveToComponent } from '#base/utils/lang';

import NumberOutput from '#components/NumberOutput';
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

    const strings = useTranslation(ordersBar);
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
                        <div className={styles.bookSelected}>
                            {resolveToComponent(
                                strings.booksSelectedMessage,
                                { count: <NumberOutput value={totalCount} /> },
                            )}
                        </div>
                        <TextOutput
                            label={strings.totalPriceLabel}
                            value={(
                                <NumberOutput
                                    value={totalPrice}
                                    currency
                                />
                            )}
                        />
                        <TextOutput
                            label={strings.totalBooksLabel}
                            value={(
                                <NumberOutput
                                    value={totalQuantity}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.actions}>
                        <Button
                            name={undefined}
                            variant="tertiary"
                            onClick={setShowOrdersTrue}
                        >
                            {strings.viewOrdersLabel}
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
