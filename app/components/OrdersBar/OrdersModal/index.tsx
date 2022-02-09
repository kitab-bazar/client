import React, { useState } from 'react';
import {
    gql,
    useQuery,
    useMutation,
} from '@apollo/client';
import { getOperationName } from 'apollo-link';
import {
    Button,
    Modal,
    ListView,
    TextOutput,
    useAlert,
    Pager,
} from '@the-deep/deep-ui';

import {
    CartItemsListQuery,
    CartItemsListQueryVariables,
    OrderFromCartMutation,
    OrderFromCartMutationVariables,
} from '#generated/types';

import CartItem, { Props as CartItemProps } from './CartItem';
import { CART_ITEMS } from '../queries';

import styles from './styles.css';

const CART_ITEMS_NAME = getOperationName(CART_ITEMS);

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

const MAX_ITEMS_PER_PAGE = 20;

interface Props {
    onClose: () => void;
}

function OrdersModal(props: Props) {
    const {
        onClose,
    } = props;

    const alert = useAlert();

    const [page, setPage] = useState<number>(1);

    const {
        loading: cartLoading,
        data: cartItemList,
        error,
    } = useQuery<CartItemsListQuery, CartItemsListQueryVariables>(
        CART_ITEMS_LIST,
        {
            variables: {
                page,
                pageSize: MAX_ITEMS_PER_PAGE,
            },
        },
    );

    const [
        placeOrderFromCart,
        { loading: placeOrderLoading },
    ] = useMutation<OrderFromCartMutation, OrderFromCartMutationVariables>(
        ORDER_FROM_CART,
        {
            refetchQueries: CART_ITEMS_NAME ? [CART_ITEMS_NAME] : undefined,
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
                        'Failed to place the order!',
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
        // FIXME: this breaks when using pagination
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
                    disabled={placeOrderLoading}
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
                errored={!!error}
                pending={cartLoading}
            />
            <Pager
                activePage={page}
                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                itemsCount={cartItemList?.cartItems?.totalCount ?? 0}
                onActivePageChange={setPage}
                itemsPerPageControlHidden
            />
        </Modal>
    );
}
export default OrdersModal;
