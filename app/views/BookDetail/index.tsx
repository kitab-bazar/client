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
                wishlistId
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
                wishlistId
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
                wishlistId
            }
        }
    }
}
`;

function BookDetail() {
    // const { id } = useParams<{ id: string }>();
    // NOTE: use proper react router to avoid casting
    const { id } = useParams() as { id: string };
    const [cartQuantity, setCartQuantity] = useInputState<number | undefined>(1);

    const {
        data: bookDetail,
        loading: bookDetailLoading,
        error,
    } = useQuery<
        BookDetailQuery,
        BookDetailQueryVariables
    >(BOOK_DETAIL, {
        variables: { id },
        onCompleted: (response) => {
            if (response?.book?.cartDetails?.quantity) {
                setCartQuantity(response.book.cartDetails.quantity);
            }
        },
    });

    const errored = !!error;

    const [
        orderConfirmModalShown,
        setShowOrderConfirmModal,
        hideOrderConfirmModal,
    ] = useModalState(false);

    const alert = useAlert();

    const [
        addToCart,
        { loading: addToCartLoading },
    ] = useMutation<AddToCartMutation, AddToCartMutationVariables>(
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

    const [
        updateCart,
        { loading: updateCartLoading },
    ] = useMutation<UpdateCartMutation, UpdateCartMutationVariables>(
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

    const [
        removeFromCart,
        { loading: removeFromCartLoading },
    ] = useMutation<DeleteCartItemMutation, DeleteCartItemMutationVariables>(
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

    const [
        createWishList,
        { loading: createWishListLoading },
    ] = useMutation<CreateWishListMutation, CreateWishListMutationVariables>(
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

    const [
        removeWishList,
        { loading: removeWishListLoading },
    ] = useMutation<DeleteWishListMutation, DeleteWishListMutationVariables>(
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

    const authorsDisplay = React.useMemo(() => (
        bookDetail?.book?.authors?.map((d) => d.name).join(', ')
    ), [bookDetail?.book?.authors]);

    const handleAddToWishList = useCallback(() => {
        createWishList({ variables: { id } });
    }, [createWishList, id]);

    const handleRemoveFromWishList = useCallback((wishlistId: string) => {
        removeWishList({ variables: { id: wishlistId } });
    }, [removeWishList]);

    const handleAddToCart = React.useCallback(() => {
        if (isNotDefined(cartQuantity)) {
            // eslint-disable-next-line no-console
            console.error('Cannot update cart quantity because it is not defined');
            return;
        }
        addToCart({
            variables: {
                id,
                quantity: cartQuantity,
            },
        });
    }, [addToCart, cartQuantity, id]);

    const handleUpdateQuantityClick = React.useCallback((cartId: string) => {
        if (isNotDefined(cartQuantity)) {
            // eslint-disable-next-line no-console
            console.error('Cannot update cart quantity because it is not defined');
            return;
        }
        updateCart({
            variables: {
                id: cartId,
                bookId: id,
                quantity: cartQuantity,
            },
        });
    }, [updateCart, cartQuantity, id]);

    const handleRemoveFromCart = React.useCallback((cartId: string) => {
        removeFromCart({ variables: { id: cartId } });
    }, [removeFromCart]);

    const loading = addToCartLoading
        || updateCartLoading
        || removeFromCartLoading
        || createWishListLoading
        || removeWishListLoading;

    return (
        <div className={styles.bookDetail}>
            <div className={styles.container}>
                {errored && (
                    <div
                        className={styles.noDetail}
                        // FIXME: translate
                    >
                        Some error occurred
                    </div>
                )}
                {!errored && bookDetailLoading && (
                    <div
                        className={styles.noDetail}
                        // FIXME: translate
                    >
                        Loading
                    </div>
                )}
                {!errored && !bookDetailLoading && bookDetail?.book && (
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
                                {bookDetail.book.cartDetails && (
                                    <div className={styles.cartDetails}>
                                        <div
                                            className={styles.cartQuantityInfo}
                                            // FIXME: translate
                                        >
                                            {`${bookDetail.book.cartDetails?.quantity} item(s) in the cart`}
                                        </div>
                                        <Button
                                            className={styles.removeButton}
                                            name={bookDetail.book.cartDetails.id}
                                            variant="transparent"
                                            icons={<IoTrash />}
                                            disabled={loading}
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
                                        disabled={loading}
                                        min={1}
                                    />
                                    {bookDetail.book.cartDetails ? (
                                        <Button
                                            name={bookDetail.book.cartDetails.id}
                                            variant="primary"
                                            disabled={
                                                loading
                                                || isNotDefined(cartQuantity)
                                                || cartQuantity < 1
                                                // eslint-disable-next-line max-len
                                                || cartQuantity === bookDetail.book.cartDetails.quantity
                                            }
                                            onClick={handleUpdateQuantityClick}
                                            // FIXME: translate
                                        >
                                            Update Quantity
                                        </Button>
                                    ) : (
                                        <Button
                                            name={undefined}
                                            variant="primary"
                                            disabled={
                                                loading
                                                || isNotDefined(cartQuantity)
                                                || cartQuantity < 1
                                            }
                                            onClick={handleAddToCart}
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
                                        disabled={
                                            loading
                                            || isNotDefined(cartQuantity)
                                            || cartQuantity < 1
                                        }
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
                                    <>
                                        {bookDetail.book.wishlistId ? (
                                            <Button
                                                name={bookDetail.book.wishlistId}
                                                variant="tertiary"
                                                onClick={handleRemoveFromWishList}
                                                disabled={loading || !!bookDetail.book.cartDetails}
                                                // FIXME: translate
                                            >
                                                Remove from Wishlist
                                            </Button>
                                        ) : (
                                            <Button
                                                name={id}
                                                variant="tertiary"
                                                onClick={handleAddToWishList}
                                                disabled={loading || !!bookDetail.book.cartDetails}
                                                // FIXME: translate
                                            >
                                                Add to Wishlist
                                            </Button>
                                        )}
                                    </>
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
                                    // TODO: use ListView
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
                        {orderConfirmModalShown && (
                            <OrderConfirmModal
                                initialQuantity={cartQuantity}
                                book={bookDetail.book}
                                onClose={hideOrderConfirmModal}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
export default BookDetail;
