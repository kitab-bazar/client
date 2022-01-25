import React, { useState } from 'react';
import { Button, Container, NumberInput, TextOutput } from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import styles from './styles.css';
import { CartListQuery, CartListQueryVariables } from '#generated/types';

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

interface Author {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface Book {
    id: number;
    price: number;
    authors: Author[];
    quantity: number;
    image: Image;
    title: string;
    cartId: number;
    mutate: (id: number) => void;
}

function CartContent(props: Book) {
    const { id, price, authors, image, title, quantity, mutate, cartId } = props;
    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
    ), [authors]);

    const deleteCartItem = (_id: number) => {
        mutate(_id);
    };
    return (
        <div className={styles.container}>
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
                        onClick={() => deleteCartItem(cartId)}
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

    const { data, refetch, loading } = useQuery<
        CartListQuery,
        CartListQueryVariables
    >(CART_LIST, {
        variables: { page, pageSize, email },
    });

    const removeCartItem = (_id: number) => {
        deleteCartItem({ variables: { id: _id } });
        refetch();
    };
    return (
        <>
            <div className={styles.wishList}>
                {!loading && data?.cartItems?.results && data.cartItems.results.length > 0
                    ? (
                        <>
                            {
                                data.cartItems.results.map((_b: any) => (
                                    <CartContent
                                        id={_b.book.id}
                                        title={_b.book.title}
                                        image={_b.book.image}
                                        price={_b.book.price}
                                        quantity={_b.quantity}
                                        authors={_b.book.authors}
                                        mutate={removeCartItem}
                                        cartId={_b.id}
                                    />
                                ))
                            }
                            <Link to="/order-page" style={{ textDecoration: 'none' }}>
                                <Button
                                    name={undefined}
                                    variant="secondary"
                                >
                                    Order
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <div className={styles.noPreview}>
                            Cart is empty
                        </div>
                    )}
            </div>
        </>
    );
}

export default CartPage;
