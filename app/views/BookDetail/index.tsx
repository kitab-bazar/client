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

import {
    BookDetailQuery,
    BookDetailQueryVariables,
    CreateWishListMutation,
    CreateWishListMutationVariables,
    DeleteWishListMutation,
    DeleteWishListMutationVariables,
} from '#generated/types';
// import { UserContext } from '#base/context/UserContext';
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
      quantityInCart
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
            if (response?.book?.quantityInCart) {
                setCartQuantity(response.book.quantityInCart);
            }
        },
    });

    const [
        orderConfirmModalShown,
        setShowOrderConfirmModal,
        hideOrderConfirmModal,
    ] = useModalState(false);

    const alert = useAlert();

    const [
        createWishList,
    ] = useMutation<CreateWishListMutation, CreateWishListMutationVariables>(
        CREATE_WISH_LIST,
        {
            onCompleted: (response) => {
                if (response?.createWishlist?.ok) {
                    alert.show(
                        'Successfully added book to your wishlist.',
                        {
                            variant: 'success',
                        },
                    );
                } else {
                    alert.show(
                        'Failed to add book to wishlist.',
                        {
                            variant: 'error',
                        },
                    );
                }
            },
        },
    );

    const [
        removeWishList,
    ] = useMutation<DeleteWishListMutation, DeleteWishListMutationVariables>(
        DELETE_WISH_LIST,
        {
            onCompleted: (response) => {
                if (response?.deleteWishlist?.ok) {
                    alert.show(
                        'Successfully removed the book from your wishlist.',
                        {
                            variant: 'success',
                        },
                    );
                } else {
                    alert.show(
                        'Failed to remove book from your wishlist.',
                        {
                            variant: 'error',
                        },
                    );
                }
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
                                <div className={styles.primaryAction}>
                                    <NumberInput
                                        className={styles.quantityInput}
                                        label="Quanitity"
                                        name="number-of-items"
                                        value={cartQuantity}
                                        onChange={setCartQuantity}
                                        variant="general"
                                        type="number"
                                        readOnly={!!bookDetail.book.quantityInCart}
                                    />
                                    <NumberInput
                                        className={styles.pricePreview}
                                        name="item-price"
                                        label="Price (NPR)"
                                        value={bookDetail.book.price}
                                        variant="general"
                                        type="number"
                                        readOnly
                                    />
                                    <NumberInput
                                        className={styles.totalPreview}
                                        name="total-price"
                                        label="Total (NPR)"
                                        value={(
                                            (cartQuantity && cartQuantity > 0)
                                                ? bookDetail.book.price * cartQuantity
                                                : undefined
                                        )}
                                        variant="general"
                                        type="number"
                                        readOnly
                                    />
                                </div>
                                <div className={styles.otherActions}>
                                    <Button
                                        name="add-to-cart"
                                        variant="primary"
                                        disabled={isNotDefined(cartQuantity) || cartQuantity < 1}
                                    >
                                        { bookDetail.book.quantityInCart ? 'Remove from Cart' : 'Add to Cart' }
                                    </Button>
                                    <Button
                                        name={undefined}
                                        variant="secondary"
                                        onClick={setShowOrderConfirmModal}
                                        disabled={isNotDefined(cartQuantity) || cartQuantity < 1}
                                    >
                                        Buy Now
                                    </Button>
                                    <Button
                                        name={bookDetail.book.wishlistId ?? undefined}
                                        variant="secondary"
                                        onClick={addToWishList}
                                    >
                                        {bookDetail.book.wishlistId ? 'Remove from wishilist' : 'Add to wishlist'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightColumn}>
                            <Container
                                className={styles.details}
                                heading={bookDetail.book.title}
                                headingDescription={authorsDisplay}
                                headerDescription={(
                                    <div className={styles.headerDescription}>
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
                    bookId={bookDetail?.book?.id}
                    book={bookDetail?.book}
                    onClose={hideOrderConfirmModal}
                />
            )}
        </div>
    );
}
export default BookDetail;
