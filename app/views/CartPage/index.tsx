import React, { useCallback, useState } from 'react';
import { Button, Container, ListView, NumberInput, TextOutput } from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';

import styles from './styles.css';
import {
    CartListQuery,
    CartListQueryVariables,
    CheckOutCartMutation,
    CheckOutCartMutationVariables,
} from '#generated/types';

const CART_LIST = gql`
    query CartList ($email: ID!, $page: Int!, $pageSize: Int!) {
        cartItems (createdBy: $email, page: $page, pageSize: $pageSize){
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

const DELETE_CART_ITEMS = gql`
    mutation DeleteCartItems ($id: ID!) {
        deleteCartItem(id: $id) {
        errors
        ok
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

type Cart = NonNullable<NonNullable<CartListQuery['cartItems']>['results']>[number]
const cartKeySelector = (c: Cart) => c.id;

interface CartProps {
    cart: Cart;
    deleteCart: (id: string) => void;
}

function CartContent(props: CartProps) {
    const { cart, deleteCart } = props;
    const { id, quantity, book } = cart;
    const { id: bookId, title, image, authors, price } = book;

    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
    ), [authors]);

    const deleteCartItem = useCallback(() => {
        deleteCart(id);
    }, [id]);

    return (
        <div className={styles.container} key={id}>
            <div className={styles.metaData}>
                {image?.url ? (
                    <img
                        className={styles.image}
                        src={image.url}
                        alt={title}
                    />
                ) : (
                    <div className={styles.noPreview}>
                        Preview not available
                    </div>
                )}
                <Container
                    className={styles.details}
                    heading={title}
                >
                    <div className={styles.headerDescription}>
                        <TextOutput
                            label="author"
                            value={authorsDisplay}
                        />
                        <TextOutput
                            label="Price (NPR)"
                            valueType="number"
                            value={price}
                        />
                        <div className={styles.quantity}>
                            <TextOutput
                                label="Quantity"
                                valueType="number"
                            />
                            <NumberInput
                                name="quantity"
                                value={quantity}
                                onChange={undefined}
                            />
                        </div>
                    </div>
                </Container>
                <div className={styles.wishListButton}>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="secondary"
                        icons={<FaHeart />}
                    >
                        Add to wish list
                    </Button>
                    <Button
                        name={undefined}
                        variant="secondary"
                        icons={<AiTwotoneDelete />}
                        onClick={() => deleteCartItem()}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CartPage() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [email, setEmail] = useState<string>('admin@gmail.com');
    const [deleteCartItem] = useMutation(DELETE_CART_ITEMS);

    const { data: result, refetch, loading } = useQuery<
        CartListQuery,
        CartListQueryVariables
    >(CART_LIST, {
        variables: { page, pageSize, email },
    });

    const [placeOrderFromCart,
        { data: response, loading: submitting }] = useMutation<
            CheckOutCartMutation,
            CheckOutCartMutationVariables
        >(ORDER_FROM_CART);

    const pending = loading || submitting;
    const carts = (!loading && result?.cartItems?.results) ? result.cartItems.results : [];

    const removeCartItem = (id: string) => {
        deleteCartItem({ variables: { id } });
        refetch();
    };

    const checkout = () => {
        placeOrderFromCart();
        refetch();
    };

    const cartItemRendererParams = React.useCallback((_, data) => ({
        cart: data,
        deleteCart: removeCartItem,
    }), []);

    return (
        <div className={styles.wishList}>
            <Container
                className={styles.featuredBooksSection}
                heading="My Cart"
            >
                <ListView
                    className={styles.bookList}
                    data={carts}
                    keySelector={cartKeySelector}
                    rendererParams={cartItemRendererParams}
                    renderer={CartContent}
                    errored={false}
                    pending={loading}
                    filtered={false}
                />
            </Container>
            {!loading && carts.length > 0
                && (
                    <Button
                        name={undefined}
                        variant="secondary"
                        onClick={checkout}
                    >
                        Order
                    </Button>
                )}
        </div>

    );
}

export default CartPage;
