import React, { useCallback } from 'react';
import {
    Container,
    TextOutput,
    useAlert,
    Message,
    Button,
    NumberInput,
    useModalState,
    useInputState,
} from '@the-deep/deep-ui';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { useParams } from 'react-router-dom';
import { IoTrash } from 'react-icons/io5';

import {
    BookDetailQuery,
    BookDetailQueryVariables,
    CreateWishListMutation,
    CreateWishListMutationVariables,
    DeleteWishListMutation,
    DeleteWishListMutationVariables,
    AddToCartMutation,
    AddToCartMutationVariables,
    UpdateCartMutation,
    UpdateCartMutationVariables,
    DeleteCartItemMutation,
    DeleteCartItemMutationVariables,
} from '#generated/types';
import OrderConfirmModal from './OrderConfirmModal';

import styles from './styles.css';

const BOOK_DETAIL = gql`
query BookDetail($id: ID!) {
    book(id: $id) {
        description
        id
        image {
            name
            url
        }
        isbn
        edition
        language
        price
        title
        numberOfPages
        authors {
            id
            name
            aboutAuthor
        }
        cartDetails {
            id
            quantity
        }
        wishlistId
    }
}
`;

const CREATE_WISH_LIST = gql`
mutation CreateWishList ($id: String!) {
    createWishlist(data: {book: $id}) {
        errors
        ok
        result {
            book {
                id
                wishlistId
            }
        }
    }
}
`;

const DELETE_WISH_LIST = gql`
mutation DeleteWishList ($id: ID!) {
    deleteWishlist(id: $id) {
        errors
        ok
        result {
            book {
                id
                wishlistId
            }
        }
    }
}
`;

const ADD_TO_CART = gql`
mutation AddToCart($id: String!, $quantity: Int!) {
    createCartItem(data: { book: $id, quantity: $quantity }) {
        errors
        ok
        result {
            id
            book {
                id
                cartDetails {
                    id
                    quantity
                }
            }
        }
    }
}
`;

const UPDATE_CART = gql`
mutation UpdateCart($id: ID!, $bookId: String!, $quantity: Int!) {
    updateCartItem(id: $id, data: { book: $bookId, quantity: $quantity }) {
        errors
        ok
        result {
            id
            book {
                id
                cartDetails {
                    id
                    quantity
                }
            }
        }
    }
}
`;

const DELETE_CART_ITEM = gql`
mutation DeleteCartItem($id: ID!) {
    deleteCartItem(id: $id) {
        errors
        ok
        result {
            id
            book {
                id
                cartDetails {
                    id
                    quantity
                }
            }
        }
    }
}
`;

function BookDetail() {
    const { id } = useParams();
    const [cartQuantity, setCartQuantity] = useInputState<number | undefined>(1);

    const {
        data: bookDetail,
        loading,
    } = useQuery<
        BookDetailQuery,
        BookDetailQueryVariables
    >(BOOK_DETAIL, {
        skip: !id,
        variables: { id: id ?? '' },
        onCompleted: (response) => {
            if (response?.book?.cartDetails?.quantity) {
                setCartQuantity(response.book.cartDetails?.quantity);
            }
        },
    });

    const [
        orderConfirmModalShown,
        setShowOrderConfirmModal,
        hideOrderConfirmModal,
    ] = useModalState(false);

    const alert = useAlert();

    const [addToCart] = useMutation<AddToCartMutation, AddToCartMutationVariables>(
        ADD_TO_CART,
        {
            onCompleted: (response) => {
                if (response?.createCartItem?.ok) {
                    return;
                }

                alert.show(
                    'Failed to add book to the cart.',
                    { variant: 'error' },
                );
            },
        },
    );

    const [updateCart] = useMutation<UpdateCartMutation, UpdateCartMutationVariables>(
        UPDATE_CART,
        {
            onCompleted: (response) => {
                if (response?.updateCartItem?.ok) {
                    return;
                }

                alert.show(
                    'Failed to update the cart.',
                    { variant: 'error' },
                );
            },
        },
    );

    const [createWishList] = useMutation<CreateWishListMutation, CreateWishListMutationVariables>(
        CREATE_WISH_LIST,
        {
            onCompleted: (response) => {
                if (response?.createWishlist?.ok) {
                    return;
                }

                alert.show(
                    'Failed to add book to wishlist.',
                    { variant: 'error' },
                );
            },
        },
    );

    const [removeWishList] = useMutation<DeleteWishListMutation, DeleteWishListMutationVariables>(
        DELETE_WISH_LIST,
        {
            onCompleted: (response) => {
                if (response?.deleteWishlist?.ok) {
                    return;
                }
                alert.show(
                    'Failed to remove book from your wishlist.',
                    { variant: 'error' },
                );
            },
        },
    );

    const [removeFromCart] = useMutation<DeleteCartItemMutation, DeleteCartItemMutationVariables>(
        DELETE_CART_ITEM,
        {
            onCompleted: (response) => {
                if (response?.deleteCartItem?.ok) {
                    return;
                }

                alert.show(
                    'Failed to remove current book from the cart',
                    { variant: 'error' },
                );
            },
        },
    );

    const addToWishList = useCallback((wishlistId: number | undefined) => {
        if (!id) {
            return;
        }

        if (isDefined(wishlistId)) {
            removeWishList({ variables: { id: String(wishlistId) } });
        } else {
            createWishList({ variables: { id } });
        }
    }, [id, createWishList, removeWishList]);

    const authorsDisplay = React.useMemo(() => (
        bookDetail?.book?.authors?.map((d) => d.name).join(', ')
    ), [bookDetail?.book?.authors]);

    const handleAddToCartClick = React.useCallback((quantity: number | undefined) => {
        const bookId = bookDetail?.book?.id;
        if (isDefined(bookId) && quantity && quantity > 0) {
            addToCart({
                variables: {
                    id: bookId,
                    quantity,
                },
            });
        }
    }, [addToCart, bookDetail?.book?.id]);

    const handleRemoveFromCart = React.useCallback(() => {
        const cartId = bookDetail?.book?.cartDetails?.id;
        if (isDefined(cartId)) {
            removeFromCart({ variables: { id: cartId } });
        }
    }, [removeFromCart, bookDetail?.book?.cartDetails?.id]);

    const handleUpdateQuantityClick = React.useCallback((quantity: number | undefined) => {
        const cartId = bookDetail?.book?.cartDetails?.id;
        const bookId = bookDetail?.book?.id;

        if (isDefined(cartId) && isDefined(bookId) && quantity && quantity > 0) {
            updateCart({
                variables: {
                    id: cartId,
                    bookId,
                    quantity,
                },
            });
        }
    }, [updateCart, bookDetail?.book?.id, bookDetail?.book?.cartDetails?.id]);

    const isAlreadyInCart = (bookDetail?.book?.cartDetails?.quantity ?? 0) > 0;

    return (
        <div className={styles.bookDetail}>
            <div className={styles.container}>
                {bookDetail?.book ? (
                    <div className={styles.bookDetail}>
                        <div className={styles.leftColumn}>
                            <div className={styles.preview}>
                                {bookDetail?.book?.image?.url ? (
                                    <img
                                        className={styles.image}
                                        src={bookDetail.book.image.url}
                                        alt={bookDetail.book.title}
                                    />
                                ) : (
                                    <Message
                                        message="Preview not available"
                                    />
                                )}
                            </div>
                            <div className={styles.actions}>
                                {isAlreadyInCart && (
                                    <div className={styles.cartDetails}>
                                        <div className={styles.cartQuantityInfo}>
                                            {`${bookDetail.book.cartDetails?.quantity} item(s) in the cart`}
                                        </div>
                                        <Button
                                            className={styles.removeButton}
                                            name={undefined}
                                            variant="transparent"
                                            icons={<IoTrash />}
                                            onClick={handleRemoveFromCart}
                                        >
                                            Remove from Cart
                                        </Button>
                                    </div>
                                )}
                                <div className={styles.primaryAction}>
                                    <NumberInput
                                        className={styles.quantityInput}
                                        label="Quanitity"
                                        name={undefined}
                                        value={cartQuantity}
                                        onChange={setCartQuantity}
                                        variant="general"
                                        type="number"
                                    />
                                    {isAlreadyInCart ? (
                                        <Button
                                            name={cartQuantity}
                                            variant="primary"
                                            disabled={isNotDefined(cartQuantity)
                                                || cartQuantity < 1
                                                || cartQuantity === bookDetail
                                                    .book.cartDetails?.quantity}
                                            onClick={handleUpdateQuantityClick}
                                        >
                                            Update Quantity
                                        </Button>
                                    ) : (
                                        <Button
                                            name={cartQuantity}
                                            variant="primary"
                                            disabled={isNotDefined(cartQuantity)
                                                || cartQuantity < 1}
                                            onClick={handleAddToCartClick}
                                        >
                                            Add to Cart
                                        </Button>
                                    )}
                                </div>
                                <div className={styles.otherActions}>
                                    <Button
                                        name={undefined}
                                        variant="tertiary"
                                        onClick={setShowOrderConfirmModal}
                                        disabled={isNotDefined(cartQuantity) || cartQuantity < 1}
                                        title="Place order immediately without adding it to cart"
                                    >
                                        Quick Buy
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightColumn}>
                            <Container
                                className={styles.details}
                                heading={bookDetail.book.title}
                                headingDescription={authorsDisplay}
                                headerActions={(
                                    <Button
                                        name={bookDetail.book.wishlistId ?? undefined}
                                        variant="tertiary"
                                        onClick={addToWishList}
                                        disabled={isAlreadyInCart}
                                    >
                                        {bookDetail.book.wishlistId ? 'Remove from Wishilist' : 'Add to Wishlist'}
                                    </Button>
                                )}
                                headerDescription={(
                                    <div className={styles.bookMeta}>
                                        <TextOutput
                                            label="Price (NPR)"
                                            value={bookDetail.book.price}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            label="Number of pages"
                                            value={bookDetail.book.numberOfPages}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            label="ISBN"
                                            value={bookDetail.book.isbn}
                                        />
                                        <TextOutput
                                            label="Language"
                                            value={bookDetail.book.language}
                                        />
                                    </div>
                                )}
                            />
                            <Container
                                heading="Description"
                                headingSize="extraSmall"
                            >
                                <div
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={
                                        { __html: bookDetail.book.description ?? '' }
                                    }
                                />
                            </Container>
                            <Container
                                heading="About the author"
                                headingSize="extraSmall"
                            >
                                {bookDetail.book.authors.map((a) => (
                                    <React.Fragment key={a.name}>
                                        <div>
                                            {a.name}
                                        </div>
                                        <div
                                            // eslint-disable-next-line react/no-danger
                                            dangerouslySetInnerHTML={
                                                { __html: a.aboutAuthor ?? '' }
                                            }
                                        />
                                    </React.Fragment>
                                ))}
                            </Container>
                        </div>
                    </div>
                ) : (!loading && (
                    <div className={styles.noDetail}>
                        Book details not available
                    </div>
                ))}
            </div>
            {orderConfirmModalShown && bookDetail?.book && (
                <OrderConfirmModal
                    initialQuantity={cartQuantity}
                    bookId={bookDetail?.book?.id}
                    book={bookDetail?.book}
                    onClose={hideOrderConfirmModal}
                />
            )}
        </div>
    );
}
export default BookDetail;
