import React from 'react';
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
query CartList {
    cartItems {
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
}

function CartItem(props: CartItemProps) {
    const {
        cart,
        onSelectionChange,
        isSelected,
        quantity,
        onQuantityChange,
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
                />
            </div>
        </div>
    );
}

interface Props {
    className?: string;
}

function CartPage(props: Props) {
    const { className } = props;

    const [selectedItems, setSelectedItems] = React.useState<Record<string, boolean>>({});
    const [itemCounts, setItemCounts] = React.useState<Record<string, number | undefined>>({});

    const alert = useAlert();

    const {
        data: result,
        refetch,
        loading,
    } = useQuery<CartListQuery, CartListQueryVariables>(
        CART_LIST,
        {
            onCompleted: (response) => {
                if (!response?.cartItems) {
                    return;
                }
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
                    refetch();
                    alert.show(
                        'Your order was placed successfully!',
                        { variant: 'success' },
                    );
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

    const pending = loading || submitting;
    const carts = (result?.cartItems?.results) ? result.cartItems.results : [];

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
    }), [handleCartSelectionChange, selectedItems, handleQuantityChange, itemCounts]);

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
                        // FIXME: handle pagination
                        className={_cs(styles.list, carts.length === 0 && styles.empty)}
                        data={carts}
                        keySelector={cartKeySelector}
                        rendererParams={cartItemRendererParams}
                        renderer={CartItem}
                        // FIXME: handle error
                        errored={false}
                        pending={pending}
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
                                disabled={loading || totalItemCount <= 0}
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
