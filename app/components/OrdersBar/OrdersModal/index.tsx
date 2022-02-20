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
    Pager,
    ListView,
    TextOutput,
    useAlert,
    useModalState,
} from '@the-deep/deep-ui';

import { ordersBar } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import {
    CartItemsListQuery,
    CartItemsListQueryVariables,
    OrderFromCartMutation,
    OrderFromCartMutationVariables,
} from '#generated/types';

import KitabLogo from '#resources/img/KitabLogo.png';
import NumberOutput from '#components/NumberOutput';

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
mutation OrderFromCart {
    placeOrderFromCart {
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

const MAX_ITEMS_PER_PAGE = 10;

interface Props {
    onClose: () => void;
    totalPrice: number;
    totalQuantity: number;
}

function OrdersModal(props: Props) {
    const {
        onClose,
        totalPrice,
        totalQuantity,
    } = props;

    const strings = useTranslation(ordersBar);
    const alert = useAlert();

    const [page, setPage] = useState<number>(1);
    const [
        showOrderSuccessfulModal,
        setShowOrderSuccessfulModalTrue,
    ] = useModalState(false);

    const {
        loading: cartLoading,
        data: cartItemList,
        error,
        refetch,
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
        {
            data: orderDetails,
            loading: placeOrderLoading,
        },
    ] = useMutation<OrderFromCartMutation, OrderFromCartMutationVariables>(
        ORDER_FROM_CART,
        {
            refetchQueries: CART_ITEMS_NAME ? [CART_ITEMS_NAME] : undefined,
            onCompleted: (response) => {
                if (response?.placeOrderFromCart?.ok) {
                    alert.show(
                        strings.orderPlacementSuccessfulMessage,
                        { variant: 'success' },
                    );
                    setShowOrderSuccessfulModalTrue();
                    // onClose();
                } else {
                    alert.show(
                        strings.orderPlacementFailureMessage,
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

    const cartItemRendererParams = React.useCallback(
        (
            _: string,
            cartDetails: Cart,
        ): CartItemProps => ({
            cartDetails,
            onCartItemRemove: refetch,
        }),
        [refetch],
    );

    const handleOrderBooksClick = React.useCallback(() => {
        placeOrderFromCart();
    }, [placeOrderFromCart]);

    const handleDoneButtonClick = React.useCallback(() => {
        window.location.reload();
        onClose();
    }, [onClose]);

    return (
        <>
            <Modal
                backdropClassName={styles.modalBackdrop}
                onCloseButtonClick={onClose}
                className={styles.ordersModal}
                heading={strings.orderListHeading}
                headingSize="small"
                footerIcons={(
                    <>
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
                    </>
                )}
                footerActions={(
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={handleOrderBooksClick}
                        disabled={
                            placeOrderLoading
                                || (cartItemList?.cartItems?.totalCount ?? 0) <= 0
                        }
                    >
                        {strings.orderBooksButtonLabel}
                    </Button>
                )}
            >
                <ListView
                    className={styles.cartItemList}
                    data={cartItemList?.cartItems?.results ?? undefined}
                    renderer={CartItem}
                    rendererParams={cartItemRendererParams}
                    keySelector={keySelector}
                    filtered={false}
                    errored={!!error}
                    pending={cartLoading}
                    messageShown
                />
                <Pager
                    activePage={page}
                    maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                    itemsCount={cartItemList?.cartItems?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    itemsPerPageControlHidden
                />
            </Modal>
            {showOrderSuccessfulModal && (
                <Modal
                    className={styles.orderSuccessModal}
                    bodyClassName={styles.content}
                    size="small"
                    hideCloseButton
                    footerContentClassName={styles.footer}
                    footer={(
                        <Button
                            name={undefined}
                            onClick={handleDoneButtonClick}
                        >
                            {strings.doneButtonLabel}
                        </Button>
                    )}
                >
                    <img
                        className={styles.logo}
                        src={KitabLogo}
                        alt="logo"
                    />
                    <div className={styles.successMessage}>
                        {strings.orderPlacementSuccessfulMessage}
                    </div>
                    <div className={styles.orderDetails}>
                        <TextOutput
                            label={strings.orderIdLabel}
                            value={orderDetails?.placeOrderFromCart?.result?.orderCode?.split('-')?.[0]}
                        />
                        <TextOutput
                            label={strings.totalPriceLabel}
                            value={(
                                <NumberOutput
                                    value={orderDetails?.placeOrderFromCart?.result?.totalPrice}
                                    currency
                                />
                            )}
                        />
                    </div>
                    <div className={styles.helpText}>
                        {strings.orderPlacementHelpText}
                    </div>
                </Modal>
            )}
        </>
    );
}
export default OrdersModal;
