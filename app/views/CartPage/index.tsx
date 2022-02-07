import React, {
    useState,
} from 'react';
import {
    Pager,
    Button,
    ListView,
    Message,
    NumberInput,
    TextOutput,
    Heading,
    Container,
    Checkbox,
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
query CartList($email: ID!, $page: Int!, $pageSize: Int!) {
    cartItems(createdBy: $email, page: $page, pageSize: $pageSize) {
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
mutation CheckOutCart {
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

type Cart = NonNullable<NonNullable<CartListQuery['cartItems']>['results']>[number];
const cartKeySelector = (c: Cart) => c.id;

interface CartItemProps {
    cart: Cart;
    isSelected: boolean;
    onSelectionChange: (newValue: boolean, id: string) => void;
    quantity: number,
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
        // quantity,
        book,
    } = cart;

    const {
        title,
        image,
        authors,
        price,
    } = book;

    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
    ), [authors]);

    return (
        <div className={styles.cartItem}>
            <Checkbox
                className={styles.isSelectedCheckbox}
                name={id}
                value={isSelected}
                onChange={onSelectionChange}
            />
            <div className={styles.imageContainer}>
                {image?.url ? (
                    <img
                        className={styles.image}
                        src={image.url}
                        alt={title}
                    />
                ) : (
                    <Message
                        message="Preview not available"
                    />
                )}
            </div>
            <div className={styles.details}>
                <div className={styles.title}>
                    {title}
                </div>
                <TextOutput
                    label="Author"
                    value={authorsDisplay}
                />
                <TextOutput
                    label="Price (NPR)"
                    valueType="number"
                    value={price}
                />
                <NumberInput
                    className={styles.quantityInput}
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
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [email] = useState<string>(''); // TODO: need to discuss

    const [selectedItems, setSelectedItems] = React.useState<Record<string, boolean>>({});
    const [itemCounts, setItemCounts] = React.useState<Record<string, number>>({});

    const {
        data: result,
        refetch,
        loading,
    } = useQuery<CartListQuery, CartListQueryVariables>(
        CART_LIST,
        {
            variables: {
                page,
                pageSize,
                email,
            },
            onCompleted: (response) => {
                if (!response?.cartItems) {
                    return;
                }
                setSelectedItems({
                    ...listToMap(response.cartItems.results, (d) => d.id, () => true),
                });
                setItemCounts({
                    ...listToMap(response.cartItems.results, (d) => d.id, (d) => d.quantity),
                });
            },
        },
    );

    const [
        placeOrderFromCart,
        {
            loading: submitting,
        },
    ] = useMutation<CheckOutCartMutation, CheckOutCartMutationVariables>(
        ORDER_FROM_CART,
        {
            onCompleted: () => refetch(),
        },
    );

    const pending = loading || submitting;
    const carts = (result?.cartItems?.results) ? result.cartItems.results : [];

    const checkout = () => {
        placeOrderFromCart();
    };

    const handleCartSelectionChange = React.useCallback((newValue, id) => {
        setSelectedItems((oldValue) => ({
            ...oldValue,
            [id]: newValue,
        }));
    }, []);

    const handleQuantityChange = React.useCallback((newValue, id) => {
        setItemCounts((oldValue) => ({
            ...oldValue,
            [id]: newValue,
        }));
    }, []);

    const cartItemRendererParams = React.useCallback((_, data: Cart) => ({
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
        const totalCount = sum(selectedItemKeys.map((k) => itemCounts[k]));
        // listToMap(cart, d => d.

        return [
            totalCount,
            undefined,
        ];
    }, [itemCounts, selectedItems]);

    return (
        <div className={_cs(styles.cartPage, className)}>
            <div className={styles.container}>
                <Heading
                    className={styles.pageHeading}
                    size="extraLarge"
                >
                    Shopping Cart
                </Heading>
                <Pager
                    activePage={page}
                    maxItemsPerPage={pageSize}
                    itemsCount={result?.cartItems?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    onItemsPerPageChange={setPageSize}
                />
                <div className={styles.content}>
                    <ListView
                        className={_cs(styles.list, carts.length === 0 && styles.empty)}
                        data={carts}
                        keySelector={cartKeySelector}
                        rendererParams={cartItemRendererParams}
                        renderer={CartItem}
                        errored={false}
                        pending={pending}
                        filtered={false}
                        messageShown
                        emptyMessage={(
                            <div className={styles.emptyMessage}>
                                <IoList className={styles.icon} />
                                <div className={styles.text}>
                                    <div className={styles.primary}>
                                        Your Shopping Cart is currently empty
                                    </div>
                                    <div className={styles.suggestion}>
                                        Add Books that you want to buy by clicking on Add to Cart
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <Container
                        className={styles.summary}
                        heading="Order Summary"
                        headingSize="extraSmall"
                        contentClassName={styles.summaryContent}
                        spacing="loose"
                    >
                        <TextOutput
                            label="Number of Items"
                            value={0}
                            valueType="number"
                        />
                        <TextOutput
                            label="Total Amount (NPR)"
                            value={2000}
                            valueType="number"
                        />
                        <div className={styles.actions}>
                            <Button
                                name={undefined}
                                variant="secondary"
                                onClick={checkout}
                                disabled={loading}
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
