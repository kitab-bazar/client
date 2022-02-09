import React from 'react';
import {
    gql,
    useQuery,
    useMutation,
} from '@apollo/client';
import {
    Button,
    Modal,
    ListView,
    TextOutput,
    useAlert,
} from '@the-deep/deep-ui';

import {
    CartItemsListQuery,
    CartItemsListQueryVariables,
    OrderFromCartMutation,
    OrderFromCartMutationVariables,
} from '#generated/types';

import CartItem, { Props as CartItemProps } from '../CartItem';

import styles from './styles.css';

const CART_ITEMS_LIST = gql`
query CartItemsList($page: Int!, $pageSize: Int!) {
    cartItems(page: $page, pageSize: $pageSize) {
        grandTotalPrice
        totalCount
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

type Cart = NonNullable<NonNullable<NonNullable<CartItemsListQuery>['cartItems']>['results']>[number];

const keySelector = (d: Cart) => d.id;

interface Props {
    onClose: () => void;
}

function OrdersModal(props: Props) {
    const {
        onClose,
    } = props;

    const alert = useAlert();

    const {
        loading: cartLoading,
        data: cartItemList,
    } = useQuery<CartItemsListQuery, CartItemsListQueryVariables>(
        CART_ITEMS_LIST,
        {
            // FIXME: use actual pagination
            variables: {
                page: 1,
                pageSize: 20,
            },
        },
    );

    const [
        placeOrderFromCart,
        // FIXME:
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
                    onClose();
                    // TODO:
                    // refetchCartItemMeta();
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

    const cartList = cartItemList?.cartItems?.results ?? undefined;

    const cartItemRendererParams = (
        _: string,
        cartDetails: Cart,
    ): CartItemProps => ({
        cartDetails,
    });

    const handleOrderBooksClick = React.useCallback(() => {
        // FIXME: this breaks for pagination
        if (cartList) {
            placeOrderFromCart({
                variables: { cartItems: cartList.map((c) => c.id) },
            });
        }
    }, [cartList, placeOrderFromCart]);

    return (
        <Modal
            backdropClassName={styles.modalBackdrop}
            onCloseButtonClick={onClose}
            className={styles.ordersModal}
            // FIXME: translate
            heading="Order List"
            headingSize="small"
            footerIcons={(
                <TextOutput
                    label="Total price (NPR)"
                    valueType="number"
                    value={cartItemList?.cartItems?.grandTotalPrice}
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
    );
}
export default OrdersModal;
