import React, { useState, useMemo } from 'react';
import {
    Button,
    ListView,
    Message,
    NumberInput,
    TextOutput,
    Heading,
    Container,
    Checkbox,
    useAlert,
    Pager,
} from '@the-deep/deep-ui';
import {
    _cs,
    listToMap,
    sum,
} from '@togglecorp/fujs';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { IoList } from 'react-icons/io5';

import {
    CartListQuery,
    CartListQueryVariables,
    CheckOutCartMutation,
    CheckOutCartMutationVariables,
} from '#generated/types';

import styles from './styles.css';

const CART_LIST = gql`
query CartList($page: Int!, $pageSize: Int!) {
    cartItems(page: $page, pageSize: $pageSize) {
        results {
            id
            totalPrice
            book {
                id
                title
                image {
                    url
                }
                authors {
                    id
                    name
                }
                price
            }
            quantity
        }
        grandTotalPrice
        page
        pageSize
        totalCount
    }
}
`;

const ORDER_FROM_CART = gql`
mutation CheckOutCart($cartItems: [ID!]) {
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

type Cart = NonNullable<NonNullable<CartListQuery['cartItems']>['results']>[number];

const cartKeySelector = (c: Cart) => c.id;

interface CartItemProps {
    cart: Cart;
    isSelected: boolean;
    onSelectionChange: (newValue: boolean, id: string) => void;
    quantity: number | undefined;
    onQuantityChange: (newValue: number | undefined, id: string) => void;
    disabled?: boolean;
}

function CartItem(props: CartItemProps) {
    const {
        cart,
        onSelectionChange,
        isSelected,
        quantity,
        onQuantityChange,
        disabled,
    } = props;

    const {
        id,
        book,
    } = cart;

    const authorsDisplay = React.useMemo(() => (
        book.authors?.map((d) => d.name).join(', ')
    ), [book.authors]);

    return (
        <div className={styles.cartItem}>
            <Checkbox
                className={styles.isSelectedCheckbox}
                name={id}
                value={isSelected}
                onChange={onSelectionChange}
                disabled={disabled}
            />
            <div className={styles.imageContainer}>
                {book.image?.url ? (
                    <img
                        className={styles.image}
                        src={book.image.url}
                        alt={book.title}
                    />
                ) : (
                    <Message
                        // FIXME: translate
                        message="Preview not available"
                    />
                )}
            </div>
            <div className={styles.details}>
                <div className={styles.title}>
                    {book.title}
                </div>
                <TextOutput
                    // FIXME: translate
                    label="Author"
                    value={authorsDisplay}
                />
                <TextOutput
                    // FIXME: translate
                    label="Price (NPR)"
                    valueType="number"
                    value={book.price}
                />
                <NumberInput
                    className={styles.quantityInput}
                    // FIXME: translate
                    label="Quantity"
                    name="quantity"
                    value={quantity}
                    variant="general"
                    onChange={onQuantityChange}
                    type="number"
                    disabled={disabled}
                    min={1}
                />
            </div>
        </div>
    );
}

const MAX_ITEMS_PER_PAGE = 20;

interface Props {
    className?: string;
}

function CartPage(props: Props) {
    const { className } = props;

    const [selectedItems, setSelectedItems] = React.useState<Record<string, boolean>>({});
    const [itemCounts, setItemCounts] = React.useState<Record<string, number | undefined>>({});

    const [pageSize, setPageSize] = useState<number>(MAX_ITEMS_PER_PAGE);
    const [page, setPage] = useState<number>(1);

    const alert = useAlert();

    const orderVariables = useMemo(() => ({
        pageSize,
        page,
    }), [pageSize, page]);

    const {
        data: result,
        loading,
        error,
        refetch,
    } = useQuery<CartListQuery, CartListQueryVariables>(
        CART_LIST,
        {
            variables: orderVariables,
            onCompleted: (response) => {
                if (!response?.cartItems) {
                    return;
                }
                // FIXME: We should think about how to handle paginations
                const cartItems = response.cartItems.results ?? [];
                setSelectedItems(listToMap(cartItems, (d) => d.id, () => true));
                setItemCounts(listToMap(cartItems, (d) => d.id, (d) => d.quantity));
            },
        },
    );

    const [
        placeOrderFromCart,
        { loading: submitting },
    ] = useMutation<CheckOutCartMutation, CheckOutCartMutationVariables>(
        ORDER_FROM_CART,
        {
            onCompleted: (response) => {
                if (response?.placeOrderFromCart?.ok) {
                    alert.show(
                        'Your order was placed successfully!',
                        { variant: 'success' },
                    );
                    setSelectedItems({});
                    setItemCounts({});
                    setPage(1);
                    // NOTE: call refetch because page may already be 1
                    refetch();
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

    const handleOrderNowClick = React.useCallback(() => {
        const selectedKeys = Object.keys(selectedItems)
            .filter((k) => selectedItems[k]);
        if (selectedKeys.length > 0) {
            placeOrderFromCart({ variables: { cartItems: selectedKeys } });
        } else {
            // eslint-disable-next-line no-console
            console.error('There are no selected keys to order');
        }
    }, [placeOrderFromCart, selectedItems]);

    const handleCartSelectionChange = React.useCallback((newValue: boolean, id: string) => {
        setSelectedItems((oldValue) => ({
            ...oldValue,
            [id]: newValue,
        }));
    }, []);

    const handleQuantityChange = React.useCallback((newValue: number | undefined, id: string) => {
        setItemCounts((oldValue) => ({
            ...oldValue,
            [id]: newValue,
        }));
    }, []);

    const cartItemRendererParams = React.useCallback((_: string, data: Cart): CartItemProps => ({
        cart: data,
        isSelected: selectedItems[data.id],
        quantity: itemCounts[data.id],
        onQuantityChange: handleQuantityChange,
        onSelectionChange: handleCartSelectionChange,
        disabled: submitting,
    }), [handleCartSelectionChange, selectedItems, handleQuantityChange, itemCounts, submitting]);

    const [
        totalItemCount,
        totalPrice,
    ] = React.useMemo(() => {
        const selectedItemKeys = Object.keys(itemCounts).filter((k) => selectedItems[k]);

        const totalCount = sum(selectedItemKeys.map((k) => itemCounts[k] ?? 0));

        const priceMap = listToMap(
            result?.cartItems?.results,
            (d) => d.id,
            (d) => d.book.price,
        );

        const total = priceMap
            ? sum(selectedItemKeys.map((k) => (itemCounts[k] ?? 0) * priceMap[k]))
            : undefined;

        return [
            totalCount,
            total,
        ];
    }, [itemCounts, selectedItems, result?.cartItems?.results]);

    return (
        <div className={_cs(styles.cartPage, className)}>
            <div className={styles.container}>
                <Heading
                    className={styles.pageHeading}
                    size="extraLarge"
                    // FIXME: translate
                >
                    My Cart
                </Heading>
                <div className={styles.content}>
                    <ListView
                        // eslint-disable-next-line max-len
                        className={_cs(styles.list, (result?.cartItems?.totalCount ?? 0) === 0 && styles.empty)}
                        data={result?.cartItems?.results ?? undefined}
                        keySelector={cartKeySelector}
                        rendererParams={cartItemRendererParams}
                        renderer={CartItem}
                        errored={!!error}
                        pending={loading}
                        filtered={false}
                        messageShown
                        emptyMessage={(
                            <div className={styles.emptyMessage}>
                                <IoList className={styles.icon} />
                                <div className={styles.text}>
                                    <div
                                        className={styles.primary}
                                        // FIXME: translate
                                    >
                                        Your Shopping Cart is currently empty
                                    </div>
                                    <div
                                        className={styles.suggestion}
                                        // FIXME: translate
                                    >
                                        Add Books that you want to buy by clicking on Add to Cart
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <Pager
                        activePage={page}
                        maxItemsPerPage={pageSize}
                        itemsCount={result?.cartItems?.totalCount ?? 0}
                        onActivePageChange={setPage}
                        onItemsPerPageChange={setPageSize}
                        itemsPerPageControlHidden
                    />
                    <Container
                        className={styles.summary}
                        // FIXME: translate
                        heading="Order Summary"
                        headingSize="extraSmall"
                        contentClassName={styles.summaryContent}
                        spacing="loose"
                    >
                        <TextOutput
                            // FIXME: translate
                            label="Number of Items"
                            value={totalItemCount}
                            valueType="number"
                        />
                        <TextOutput
                            // FIXME: translate
                            label="Total Amount (NPR)"
                            value={totalPrice}
                            valueType="number"
                        />
                        <div className={styles.actions}>
                            <Button
                                name={undefined}
                                variant="secondary"
                                onClick={handleOrderNowClick}
                                disabled={submitting || totalItemCount <= 0}
                                // FIXME: translate
                            >
                                Order Now
                            </Button>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
