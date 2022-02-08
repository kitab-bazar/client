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
                if (!response?.createCartItem?.ok) {
                    alert.show(
                        // FIXME: translate
                        'Failed to add book to the cart.',
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

    const [updateCart] = useMutation<UpdateCartMutation, UpdateCartMutationVariables>(
        UPDATE_CART,
        {
            onCompleted: (response) => {
                if (!response?.updateCartItem?.ok) {
                    alert.show(
                        // FIXME: translate
                        'Failed to update the cart.',
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

    const [removeFromCart] = useMutation<DeleteCartItemMutation, DeleteCartItemMutationVariables>(
        DELETE_CART_ITEM,
        {
            onCompleted: (response) => {
                if (!response?.deleteCartItem?.ok) {
                    // FIXME: translate
                    alert.show(
                        'Failed to remove current book from the cart',
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

    const [createWishList] = useMutation<CreateWishListMutation, CreateWishListMutationVariables>(
        CREATE_WISH_LIST,
        {
            onCompleted: (response) => {
                if (!response?.createWishlist?.ok) {
                    alert.show(
                        // FIXME: translate
                        'Failed to add book to wishlist.',
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

    const [removeWishList] = useMutation<DeleteWishListMutation, DeleteWishListMutationVariables>(
        DELETE_WISH_LIST,
        {
            onCompleted: (response) => {
                if (!response?.deleteWishlist?.ok) {
                    // FIXME: translate
                    alert.show(
                        'Failed to remove book from your wishlist.',
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

    const addToWishList = useCallback((wishlistId: string | undefined) => {
        if (!id) {
            // TODO: may need to return for create wishlist only
            // eslint-disable-next-line no-console
            console.error('Book id is not defined to add to wishlist');
            return;
        }

        if (isDefined(wishlistId)) {
            removeWishList({ variables: { id: wishlistId } });
        } else {
            createWishList({ variables: { id } });
        }
    }, [id, createWishList, removeWishList]);

    const authorsDisplay = React.useMemo(() => (
        bookDetail?.book?.authors?.map((d) => d.name).join(', ')
    ), [bookDetail?.book?.authors]);

    const handleAddToCartClick = React.useCallback((quantity: number | undefined) => {
        const bookId = bookDetail?.book?.id;
        if (isNotDefined(bookId)) {
            // eslint-disable-next-line no-console
            console.error('Cannot add to card because book id is not defined');
            return;
        }
        if (isNotDefined(quantity)) {
            // eslint-disable-next-line no-console
            console.error('Cannot add to card because quantity is not defined');
            return;
        }
        addToCart({
            variables: {
                id: bookId,
                quantity,
            },
        });
    }, [addToCart, bookDetail?.book?.id]);

    const handleRemoveFromCart = React.useCallback(() => {
        // NOTE: this is not exactly cart id
        const cartId = bookDetail?.book?.cartDetails?.id;
        if (isNotDefined(cartId)) {
            // eslint-disable-next-line no-console
            console.error('Cannot remove book from cart because cardId is not defined');
            return;
        }
        removeFromCart({ variables: { id: cartId } });
    }, [removeFromCart, bookDetail?.book?.cartDetails?.id]);

    const handleUpdateQuantityClick = React.useCallback((quantity: number | undefined) => {
        const cartId = bookDetail?.book?.cartDetails?.id;
        const bookId = bookDetail?.book?.id;
        if (isNotDefined(cartId)) {
            // eslint-disable-next-line no-console
            console.error('Cannot update book on cart because cardId is not defined');
            return;
        }
        if (isNotDefined(bookId)) {
            // eslint-disable-next-line no-console
            console.error('Cannot update book on cart because bookId is not defined');
            return;
        }
        if (isNotDefined(quantity)) {
            // eslint-disable-next-line no-console
            console.error('Cannot update book on cart because quantity is not defined');
            return;
        }

        updateCart({
            variables: {
                id: cartId,
                bookId,
                quantity,
            },
        });
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
                                        // FIXME: translate
                                        message="Preview not available"
                                    />
                                )}
                            </div>
                            <div className={styles.actions}>
                                {isAlreadyInCart && (
                                    <div className={styles.cartDetails}>
                                        <div
                                            className={styles.cartQuantityInfo}
                                            // FIXME: translate
                                        >
                                            {`${bookDetail.book.cartDetails?.quantity} item(s) in the cart`}
                                        </div>
                                        <Button
                                            className={styles.removeButton}
                                            name={undefined}
                                            variant="transparent"
                                            icons={<IoTrash />}
                                            onClick={handleRemoveFromCart}
                                            // FIXME: translate
                                        >
                                            Remove from Cart
                                        </Button>
                                    </div>
                                )}
                                <div className={styles.primaryAction}>
                                    <NumberInput
                                        className={styles.quantityInput}
                                        // FIXME: translate
                                        label="Quantity"
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
                                            disabled={
                                                isNotDefined(cartQuantity)
                                                || cartQuantity < 1
                                                // eslint-disable-next-line max-len
                                                || cartQuantity === bookDetail.book.cartDetails?.quantity
                                            }
                                            onClick={handleUpdateQuantityClick}
                                            // FIXME: translate
                                        >
                                            Update Quantity
                                        </Button>
                                    ) : (
                                        <Button
                                            name={cartQuantity}
                                            variant="primary"
                                            disabled={
                                                isNotDefined(cartQuantity)
                                                || cartQuantity < 1
                                            }
                                            onClick={handleAddToCartClick}
                                            // FIXME: translate
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
                                        // FIXME: translate
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
                                        // FIXME: translate
                                    >
                                        {bookDetail.book.wishlistId ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </Button>
                                )}
                                headerDescription={(
                                    <div className={styles.bookMeta}>
                                        <TextOutput
                                            // FIXME: translate
                                            label="Price (NPR)"
                                            value={bookDetail.book.price}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            // FIXME: translate
                                            label="Number of pages"
                                            value={bookDetail.book.numberOfPages}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            // FIXME: translate
                                            label="ISBN"
                                            value={bookDetail.book.isbn}
                                        />
                                        <TextOutput
                                            // FIXME: translate
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
                                    // TODO: sanitize description
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={
                                        { __html: bookDetail.book.description ?? '' }
                                    }
                                />
                            </Container>
                            <Container
                                // FIXME: translate
                                heading="About the author"
                                headingSize="extraSmall"
                            >
                                {bookDetail.book.authors.map((a) => (
                                    // FIXME: use ListView
                                    <div key={a.name}>
                                        <div>
                                            {a.name}
                                        </div>
                                        <div
                                            // TODO: sanitize description
                                            // eslint-disable-next-line react/no-danger
                                            dangerouslySetInnerHTML={
                                                { __html: a.aboutAuthor ?? '' }
                                            }
                                        />
                                    </div>
                                ))}
                            </Container>
                        </div>
                    </div>
                ) : (!loading && (
                    <div
                        // FIXME: handle loading state
                        // FIXME: handle error state
                        className={styles.noDetail}
                        // FIXME: translate
                    >
                        Book details not available
                    </div>
                ))}
            </div>
            {orderConfirmModalShown && bookDetail?.book && (
                <OrderConfirmModal
                    initialQuantity={cartQuantity}
                    book={bookDetail.book}
                    onClose={hideOrderConfirmModal}
                />
            )}
        </div>
    );
}
export default BookDetail;
