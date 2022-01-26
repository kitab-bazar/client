import React, { useCallback, useState } from 'react';
import { Button, Container, NumberInput, TextOutput } from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';

import styles from './styles.css';
import { CartListQuery, CartListQueryVariables, DeleteCartItemsMutation, DeleteCartItemsMutationVariables } from '#generated/types';

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
    cartId: string;
    removeBookFromCartList: (id: string) => void;
}

function CartContent(props: Book) {
    const { id, price, authors, image, title, quantity, removeBookFromCartList, cartId } = props;
    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
    ), [authors]);

    const deleteCartItem = useCallback(() => {
        removeBookFromCartList(cartId);
    }, [cartId]);

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
                        autoFocus
                    >
                        Add to wish list
                    </Button>
                    <Button
                        name={undefined}
                        variant="secondary"
                        icons={<AiTwotoneDelete />}
                        autoFocus
                        onClick={deleteCartItem}
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
    const [deleteCartItem] = useMutation<
        DeleteCartItemsMutation,
        DeleteCartItemsMutationVariables
    >(DELETE_CART_ITEMS);

    const { data, refetch, loading } = useQuery<
        CartListQuery,
        CartListQueryVariables
    >(CART_LIST, {
        variables: { page, pageSize, email },
    });

    const removeCartItem = (id: string) => {
        deleteCartItem({ variables: { id } });
        refetch();
    };
    return (
        <>
            <div className={styles.wishList}>
                {!loading && data?.cartItems?.results
                    && (
                        <>
                            {
                                data.cartItems.results.map((b: any) => (
                                    <CartContent
                                        id={b.book.id}
                                        title={b.book.title}
                                        image={b.book.image}
                                        price={b.book.price}
                                        quantity={b.quantity}
                                        authors={b.book.authors}
                                        removeBookFromCartList={removeCartItem}
                                        cartId={b.id}
                                    />
                                ))
                            }
                        </>
                    )}
            </div>
            <Button
                name={undefined}
                variant="secondary"
                autoFocus
            >
                Order
            </Button>
        </>
    );
}

export default CartPage;
