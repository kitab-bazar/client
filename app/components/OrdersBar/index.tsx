import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Button,
    Modal,
    useBooleanState,
} from '@the-deep/deep-ui';

import {
    CartItemsMetaQuery,
    CartItemsMetaQueryVariables,
} from '#generated/types';

import styles from './styles.css';

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

const CART_ITEMS = gql`
query CartItemsMeta {
    cartItems {
        totalCount
        grandTotalPrice
        results {
            id
        }
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
    const { setUpdateFn } = React.useContext(OrdersBarContext);
    const {
        data,
        refetch,
    } = useQuery<CartItemsMetaQuery, CartItemsMetaQueryVariables>(CART_ITEMS);

    React.useEffect(() => {
        if (refetch) {
            setUpdateFn(() => refetch);
        }
    }, [refetch, setUpdateFn]);

    if (!data?.cartItems?.totalCount) {
        return null;
    }

    return (
        <div className={_cs(styles.ordersBar, className)}>
            <div className={styles.details}>
                {`${data.cartItems.totalCount} book(s) selected`}
            </div>
            <div className={styles.actions}>
                <Button
                    name={undefined}
                    variant="tertiary"
                    onClick={setShowOrdersTrue}
                >
                    View Orders
                </Button>
            </div>
            {showOrders && (
                <Modal
                    onCloseButtonClick={setShowOrdersFalse}
                    className={styles.ordersModal}
                >
                    Hello world
                </Modal>
            )}
        </div>
    );
}

export default OrdersBar;
