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

import { bookItem } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { resolveToString } from '#base/utils/lang';
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
type BookForOrder = Pick<BookType, 'id' | 'title' | 'price' | 'image' | 'edition' | 'isbn'> & {
    quantity?: null | NonNullable<BookType['cartDetails']>['quantity'];
};

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
} | {
    variant: 'order';
    book: BookForOrder;
})

function BookItem(props: Props) {
    const {
        className,
        variant,
        book,
        wishListActionsShown,
    } = props;

    const strings = useTranslation(bookItem);
    const alert = useAlert();
    const { user } = useContext(UserContext);

    // eslint-disable-next-line react/destructuring-assignment
    const hasActions = props.variant === 'detail' || props.variant === 'list';
    const canCreateOrder = user?.permissions.includes('CREATE_ORDER');
    const canEditBook = user?.permissions.includes('CAN_UPDATE_BOOK')
        // eslint-disable-next-line react/destructuring-assignment
        && hasActions && props.book.publisher.id === user?.publisherId;

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
                        strings.bookOrderFailedMessage,
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
                        strings.wishlistAdditionFailedMessage,
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
                        strings.wishlistRemovalFailedMessage,
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
        variant !== 'order'
            // eslint-disable-next-line react/destructuring-assignment
            ? props.book.authors?.map((d) => d.name).join(', ')
            : undefined
        // eslint-disable-next-line react/destructuring-assignment
    ), [variant, props.book]);

    const handleClick = React.useCallback(() => {
        // eslint-disable-next-line react/destructuring-assignment
        if (props.variant === 'compact' && props.onClick) {
            // eslint-disable-next-line react/destructuring-assignment
            props.onClick(props.book.id);
        }
    }, [props]);

    const categoriesDisplay = React.useMemo(() => (
        variant === 'list' || variant === 'detail'
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
        if (variant === 'compact' || variant === 'order') {
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
                    {strings.alreadyInOrderListMessage}
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
                {strings.addToOrderButtonLabel}
            </Button>
        );
        // eslint-disable-next-line react/destructuring-assignment
    }, [strings, variant, canCreateOrder, actionsDisabled, handleAddToOrder, props.book]);

    const editButton = React.useMemo(() => {
        if (!canEditBook) {
            return null;
        }

        return (
            <Button
                name={undefined}
                variant="tertiary"
                // TODO: implement this feature
            >
                {strings.editDetailsButtonLabel}
            </Button>
        );
    }, [strings.editDetailsButtonLabel, canEditBook]);

    const wishListButton = React.useMemo(() => {
        if (!wishListActionsShown) {
            return undefined;
        }
        if (variant === 'compact' || variant === 'order') {
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
                    {strings.removeFromWishlistButtonLabel}
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
                    {strings.addToWishlistButtonLabel}
                </Button>
            );
        }
        return undefined;
    }, [
        strings,
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
        props.variant === 'order' && styles.orderVariant,
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
                            className={styles.bookTitle}
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
                            label={strings.nprLabel}
                            hideLabelColon
                            value={book.price}
                        />
                    )}
                    footerClassName={styles.footer}
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
                            {editButton}
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
                            label={strings.priceLabel}
                            value={book.price}
                            valueType="number"
                        />
                    )}
                    contentClassName={styles.content}
                >
                    <div className={styles.bookMeta}>
                        <TextOutput
                            label={strings.languageLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.language}
                        />
                        <TextOutput
                            label={strings.numberOfPagesLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.numberOfPages}
                            valueType="number"
                        />
                        <TextOutput
                            label={strings.isbnLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.isbn}
                        />
                        <TextOutput
                            label={strings.publisherLabel}
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
                        {editButton}
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

    if (variant === 'order') {
        return (
            <div className={containerClassName}>
                {bookCoverPreview}
                <Container
                    className={styles.details}
                    heading={book.title}
                    headingSize="extraSmall"
                >
                    <div className={styles.orderBookMeta}>
                        <TextOutput
                            label={strings.priceLabel}
                            value={book.price}
                            valueType="number"
                        />
                        <TextOutput
                            label={strings.quantityLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.quantity}
                            valueType="number"
                        />
                        <TextOutput
                            label={strings.editionLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.edition}
                        />
                        <TextOutput
                            label={strings.isbnLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.isbn}
                        />
                    </div>
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
                    {authorsDisplay}
                </div>
                <div
                    className={styles.price}
                    // FIXME: use Numeral
                >
                    {resolveToString(strings.bookPrice, { price: String(book.price) })}
                </div>
            </div>
        </div>
    );
}

export default BookItem;
