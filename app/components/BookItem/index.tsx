import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';
import { getOperationName } from 'apollo-link';
import {
    Container,
    TextOutput,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import {
    IoCheckmark,
    IoClose,
    IoBook,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';

import {
    BookType,
    AddToOrderMutation,
    AddToOrderMutationVariables,
    AddToWishListMutation,
    AddToWishListMutationVariables,
    RemoveFromWishListMutation,
    RemoveFromWishListMutationVariables,
} from '#generated/types';
import { CART_ITEMS } from '#components/OrdersBar/queries';

import UserContext from '#base/context/UserContext';

import styles from './styles.css';

const CART_ITEMS_NAME = getOperationName(CART_ITEMS);

const ADD_TO_ORDER = gql`
mutation AddToOrder($id: String!, $quantity: Int!) {
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

const ADD_TO_WISH_LIST = gql`
mutation AddToWishList($id: String!) {
    createWishlist(data: {book: $id}) {
        errors
        ok
        result {
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

const REMOVE_FROM_WISH_LIST = gql`
mutation RemoveFromWishList($id: ID!) {
    deleteWishlist(id: $id) {
        errors
        ok
        result {
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
type BookForList = Pick<BookType, 'id' | 'title' | 'price' | 'language' | 'authors' | 'categories' | 'image' | 'wishlistId'>
    & {
        publisher: Pick<BookType['publisher'], 'id' | 'name'>;
        cartDetails?: null | Pick<NonNullable<BookType['cartDetails']>, 'id' | 'quantity'>;
    };
type BookForDetail = Pick<BookType, 'id' | 'title' | 'description' | 'price' | 'language' | 'numberOfPages' | 'isbn' | 'authors' | 'categories' | 'image' | 'wishlistId'>
    & {
        publisher: Pick<BookType['publisher'], 'id' | 'name'>
        cartDetails?: null | Pick<NonNullable<BookType['cartDetails']>, 'id' | 'quantity'>;
    };
type BookForCompact = Pick<BookType, 'id' | 'title' | 'image' | 'authors' | 'price'>;

interface BaseProps {
    className?: string;
    wishListActionsShown?: boolean;
}

export type Props = BaseProps & ({
    variant: 'list';
    book: BookForList;
    onBookTitleClick: (bookId: string) => void;
} | {
    variant: 'compact';
    book: BookForCompact;
    onClick: (bookId: string) => void;
} | {
    variant: 'detail';
    book: BookForDetail;
    onCloseButtonClick: (v: undefined) => void;
})

function BookItem(props: Props) {
    const {
        className,
        variant,
        book,
        wishListActionsShown,
    } = props;

    const alert = useAlert();

    const { user } = useContext(UserContext);

    const canCreateOrder = user?.permissions.includes('CREATE_ORDER');

    const [
        addToOrder,
        { loading: addToOrderLoading },
    ] = useMutation<AddToOrderMutation, AddToOrderMutationVariables>(
        ADD_TO_ORDER,
        {
            refetchQueries: CART_ITEMS_NAME ? [CART_ITEMS_NAME] : undefined,
            onCompleted: (response) => {
                if (!response?.createCartItem?.ok) {
                    alert.show(
                        'Failed to add book to the order.',
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
        addToWishList,
        { loading: addToWishListLoading },
    ] = useMutation<AddToWishListMutation, AddToWishListMutationVariables>(
        ADD_TO_WISH_LIST,
        {
            onCompleted: (response) => {
                if (!response?.createWishlist?.ok) {
                    alert.show(
                        // FIXME: translate
                        'Failed to add book to the wish list.',
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
        removeFromWishList,
        { loading: removeFromWishListLoading },
    ] = useMutation<RemoveFromWishListMutation, RemoveFromWishListMutationVariables>(
        REMOVE_FROM_WISH_LIST,
        {
            onCompleted: (response) => {
                if (!response?.deleteWishlist?.ok) {
                    alert.show(
                        'Failed to delete item from wish list',
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
        book.authors?.map((d) => d.name).join(', ')
    ), [book.authors]);

    const handleClick = React.useCallback(() => {
        // eslint-disable-next-line react/destructuring-assignment
        if (props.variant === 'compact' && props.onClick) {
            // eslint-disable-next-line react/destructuring-assignment
            props.onClick(props.book.id);
        }
    }, [props]);

    const categoriesDisplay = React.useMemo(() => (
        variant !== 'compact'
            // eslint-disable-next-line react/destructuring-assignment
            ? props.book.categories?.map((d) => d.name).join(', ')
            : undefined
        // eslint-disable-next-line react/destructuring-assignment
    ), [variant, props.book]);

    const handleAddToOrder = React.useCallback(() => {
        addToOrder({
            variables: {
                id: book.id,
                quantity: 1,
            },
        });
    }, [book.id, addToOrder]);

    const actionsDisabled = addToOrderLoading || addToWishListLoading || removeFromWishListLoading;

    const handleAddToWishList = React.useCallback(() => {
        addToWishList({
            variables: {
                id: book.id,
            },
        });
    }, [book.id, addToWishList]);

    const handleRemoveFromWishList = React.useCallback((id: string) => {
        removeFromWishList({
            variables: {
                id,
            },
        });
    }, [removeFromWishList]);

    const orderButton = React.useMemo(() => {
        if (variant === 'compact') {
            return undefined;
        }

        // eslint-disable-next-line react/destructuring-assignment
        if (props.book.cartDetails) {
            return (
                <Button
                    variant="secondary"
                    name={undefined}
                    icons={<IoCheckmark />}
                    readOnly
                >
                    In order list
                </Button>
            );
        }

        return canCreateOrder && (
            <Button
                name={undefined}
                variant="primary"
                onClick={handleAddToOrder}
                disabled={actionsDisabled}
            >
                Add to Order
            </Button>
        );
        // eslint-disable-next-line react/destructuring-assignment
    }, [variant, canCreateOrder, actionsDisabled, handleAddToOrder, props.book]);

    const wishListButton = React.useMemo(() => {
        if (!wishListActionsShown) {
            return undefined;
        }
        if (variant === 'compact') {
            return undefined;
        }
        // eslint-disable-next-line react/destructuring-assignment
        if (props.book.wishlistId) {
            return canCreateOrder && (
                <Button
                    // eslint-disable-next-line react/destructuring-assignment
                    name={props.book.wishlistId}
                    variant="primary"
                    onClick={handleRemoveFromWishList}
                    disabled={actionsDisabled}
                >
                    Remove from Wish list
                </Button>
            );
        }
        // eslint-disable-next-line react/destructuring-assignment
        if (!props.book.cartDetails) {
            return canCreateOrder && (
                <Button
                    name={undefined}
                    variant="primary"
                    onClick={handleAddToWishList}
                    disabled={actionsDisabled}
                >
                    Add to Wish list
                </Button>
            );
        }
        return undefined;
    }, [
        canCreateOrder,
        variant,
        // eslint-disable-next-line react/destructuring-assignment
        props.book,
        actionsDisabled,
        handleAddToWishList,
        handleRemoveFromWishList,
        wishListActionsShown,
    ]);

    const bookCoverPreview = (
        <div className={styles.preview}>
            {book.image?.url ? (
                <img
                    className={styles.image}
                    src={book.image.url}
                    alt={book.image.name ?? undefined}
                />
            ) : (
                <IoBook className={styles.fallbackIcon} />
            )}
        </div>
    );

    const containerClassName = _cs(
        /* eslint-disable react/destructuring-assignment */
        props.variant === 'list' && styles.listVariant,
        props.variant === 'detail' && styles.detailVariant,
        props.variant === 'compact' && styles.compactVariant,
        /* eslint-enable react/destructuring-assignment */
        styles.bookItem,
        className,
    );

    if (variant === 'list') {
        return (
            <div className={containerClassName}>
                {bookCoverPreview}
                <Container
                    className={styles.details}
                    heading={(
                        <Button
                            name={book.id}
                            variant="action"
                            // eslint-disable-next-line react/destructuring-assignment
                            onClick={props.onBookTitleClick}
                        >
                            {book.title}
                        </Button>
                    )}
                    headingSize="extraSmall"
                    headingDescription={authorsDisplay}
                    headerActions={(
                        <TextOutput
                            valueType="number"
                            label="NPR."
                            hideLabelColon
                            value={book.price}
                        />
                    )}
                    footerIconsContainerClassName={styles.meta}
                    footerIcons={(
                        <>
                            <TextOutput
                                label="Language"
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.language}
                            />
                            <TextOutput
                                label="Publisher"
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.publisher.name}
                            />
                            <div className={styles.categories}>
                                {categoriesDisplay}
                            </div>
                        </>
                    )}
                    footerActionsContainerClassName={styles.actions}
                    footerActions={(
                        <>
                            {wishListButton}
                            {orderButton}
                        </>
                    )}
                />
            </div>
        );
    }

    if (variant === 'detail') {
        return (
            <div className={containerClassName}>
                {bookCoverPreview}
                <Container
                    className={styles.details}
                    heading={book.title}
                    headerActions={(
                        <Button
                            name={undefined}
                            variant="action"
                            // eslint-disable-next-line react/destructuring-assignment
                            onClick={props.onCloseButtonClick}
                        >
                            <IoClose />
                        </Button>
                    )}
                    headingSize="small"
                    headingDescription={authorsDisplay}
                    borderBelowHeader
                    headerDescription={(
                        <TextOutput
                            // FIXME: translate
                            label="Price (NPR)"
                            value={book.price}
                            valueType="number"
                        />
                    )}
                    contentClassName={styles.content}
                >
                    <div className={styles.bookMeta}>
                        <TextOutput
                            // FIXME: translate
                            label="Language"
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.language}
                        />
                        <TextOutput
                            // FIXME: translate
                            label="Number of pages"
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.numberOfPages}
                            valueType="number"
                        />
                        <TextOutput
                            // FIXME: translate
                            label="ISBN"
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.isbn}
                        />
                        <TextOutput
                            // FIXME: translate
                            label="Publisher"
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.publisher.name}
                        />
                        <div className={styles.categories}>
                            {categoriesDisplay}
                        </div>
                    </div>
                    <div className={styles.actions}>
                        {wishListButton}
                        {orderButton}
                    </div>
                    <div
                        // TODO: sanitize description
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={
                            // eslint-disable-next-line react/destructuring-assignment
                            { __html: props.book.description ?? '' }
                        }
                    />
                </Container>
            </div>
        );
    }

    return (
        <div
            role="presentation"
            onClick={handleClick}
            className={containerClassName}
            title={book.title}
        >
            {bookCoverPreview}
            <div className={styles.details}>
                <div
                    className={styles.title}
                >
                    {book.title}
                </div>
                <div className={styles.author}>
                    {book.authors[0].name}
                </div>
                <div className={styles.price}>
                    {`NPR ${book.price}`}
                </div>
            </div>
        </div>
    );
}

export default BookItem;
