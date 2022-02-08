import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    gql,
    useQuery,
    useMutation,
} from '@apollo/client';
import {
    Button,
    Modal,
    useBooleanState,
    ListView,
    TextOutput,
    useAlert,
} from '@the-deep/deep-ui';

import {
    CartItemsMetaQuery,
    CartItemsMetaQueryVariables,
    CartItemsListQuery,
    CartItemsListQueryVariables,
    OrderFromCartMutation,
    OrderFromCartMutationVariables,
} from '#generated/types';

import CartItem, { Props as CartItemProps } from './CartItem';

import styles from './styles.css';

const keySelector = (d: { id: string }) => d.id;

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
    }
}
`;

const CART_ITEMS_LIST = gql`
query CartItemsList($page: Int!, $pageSize: Int!) {
    cartItems(page: $page, pageSize: $pageSize) {
        results {
            id
            totalPrice
            book {
                id
                title
                image {
                    url
                    name
                }
                authors {
                    id
                    name
                }
                price
            }
            quantity
        }
        page
        pageSize
    }
}
`;

const ORDER_FROM_CART = gql`
mutation OrderFromCart($cartItems: [ID!]) {
    placeOrderFromCart(data: { cartItemIds: $cartItems }) {
        errors
        ok
        result {
            id
            orderCode
            status
            totalPrice
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

    const alert = useAlert();
    const [
        showOrders,
        setShowOrdersTrue,
        setShowOrdersFalse,
    ] = useBooleanState(false);
    const { setUpdateFn } = React.useContext(OrdersBarContext);
    const {
        data: cartItemsMeta,
        refetch: refetchCartItemMeta,
    } = useQuery<CartItemsMetaQuery, CartItemsMetaQueryVariables>(CART_ITEMS);

    const {
        loading: cartLoading,
        data: cartItemList,
        refetch: refetchCartItemList,
    } = useQuery<CartItemsListQuery, CartItemsListQueryVariables>(
        CART_ITEMS_LIST,
        {
            // FIXME: use actual pagination
            variables: {
                page: 1,
                pageSize: 20,
            },
            onCompleted: (response) => {
                if (response?.cartItems?.results?.length === 0) {
                    setShowOrdersFalse();
                }
            },
        },
    );

    const [
        placeOrderFromCart,
        // { loading: submitting },
    ] = useMutation<OrderFromCartMutation, OrderFromCartMutationVariables>(
        ORDER_FROM_CART,
        {
            onCompleted: (response) => {
                if (response?.placeOrderFromCart?.ok) {
                    alert.show(
                        'Your order was placed successfully!',
                        { variant: 'success' },
                    );
                    refetchCartItemMeta();
                    refetchCartItemList();
                } else {
                    alert.show(
                        'Failed to place the Order!',
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const updateBar = React.useCallback(() => {
        refetchCartItemMeta();

        if (showOrders) {
            refetchCartItemList();
        }
    }, [refetchCartItemMeta, refetchCartItemList, showOrders]);

    React.useEffect(() => {
        setUpdateFn(() => updateBar);
    }, [updateBar, setUpdateFn]);

    const cartList = cartItemList?.cartItems?.results ?? undefined;
    const cartItemRendererParams = (
        _: string,
        cartDetails: NonNullable<(typeof cartList)>[number],
    ): CartItemProps => ({
        cartDetails,
    });

    const handleViewOrdersButtonClick = React.useCallback(() => {
        refetchCartItemList();
        setShowOrdersTrue();
    }, [setShowOrdersTrue, refetchCartItemList]);

    const handleOrderBooksClick = React.useCallback(() => {
        if (cartList) {
            placeOrderFromCart({
                variables: { cartItems: cartList.map((c) => c.id) },
            });
        }
    }, [cartList, placeOrderFromCart]);

    if (!cartItemsMeta?.cartItems?.totalCount) {
        return null;
    }

    return (
        <div className={_cs(styles.ordersBar, showOrders && styles.hidden, className)}>
            <div className={styles.details}>
                {`${cartItemsMeta.cartItems.totalCount} book(s) selected`}
            </div>
            <div className={styles.actions}>
                <Button
                    name={undefined}
                    variant="tertiary"
                    onClick={handleViewOrdersButtonClick}
                >
                    View Orders
                </Button>
            </div>
            {showOrders && (
                <Modal
                    backdropClassName={styles.modalBackdrop}
                    onCloseButtonClick={setShowOrdersFalse}
                    className={styles.ordersModal}
                    // FIXME: translate
                    heading="Order List"
                    headingSize="small"
                    footerIcons={(
                        <TextOutput
                            label="Total price (NPR)"
                            valueType="number"
                            value={cartItemsMeta?.cartItems?.grandTotalPrice}
                        />
                    )}
                    footerActions={(
                        <Button
                            name={undefined}
                            variant="primary"
                            onClick={handleOrderBooksClick}
                        >
                            Order Books
                        </Button>
                    )}
                >
                    <ListView
                        className={styles.cartItemList}
                        data={cartList}
                        renderer={CartItem}
                        rendererParams={cartItemRendererParams}
                        keySelector={keySelector}
                        filtered={false}
                        errored={false}
                        pending={cartLoading}
                    />
                </Modal>
            )}
        </div>
    );
}

export default OrdersBar;
