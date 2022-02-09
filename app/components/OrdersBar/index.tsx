import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Button,
    useBooleanState,
} from '@the-deep/deep-ui';

import {
    CartItemsMetaQuery,
    CartItemsMetaQueryVariables,
} from '#generated/types';

import OrdersModal from './OrdersModal';

import styles from './styles.css';

/*
interface OrdersBarContext {
    updateBar: () => void;
    setUpdateFn: (fn: () => void) => void;
}

export const OrdersBarContext = React.createContext<OrdersBarContext>({
    updateBar: () => {
        // eslint-disable-next-line no-console
        console.warn('OrdersBarContext::updateBar called before it was initialized');
    },
    setUpdateFn: () => {
        // eslint-disable-next-line no-console
        console.warn('OrdersBarContext::setUpdateFn called before it was initialized');
    },
});
*/

const CART_ITEMS = gql`
query CartItemsMeta {
    cartItems {
        totalCount
        grandTotalPrice
    }
}
`;

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

    // const { setUpdateFn } = React.useContext(OrdersBarContext);

    const {
        data: cartItemsMeta,
        // refetch: refetchCartItemMeta,
    } = useQuery<CartItemsMetaQuery, CartItemsMetaQueryVariables>(CART_ITEMS);

    /*
    const updateBar = React.useCallback(() => {
        refetchCartItemMeta();

        if (showOrders) {
            refetchCartItemList();
        }
    }, [refetchCartItemMeta, refetchCartItemList, showOrders]);

    React.useEffect(() => {
        setUpdateFn(() => updateBar);
    }, [updateBar, setUpdateFn]);
    */

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
