import React, { useContext } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import { getOperationName } from 'apollo-link';
import {
    Container,
    TextOutput,
    Button,
    useAlert,
    Tag,
    useModalState,
} from '@the-deep/deep-ui';
import {
    IoCheckmark,
    IoClose,
    IoBookOutline,
    IoPencil,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    internal,
    removeNull,
} from '@togglecorp/toggle-form';

import { bookItem } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
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
import ErrorMessage from '#components/ErrorMessage';
import NumberOutput from '#components/NumberOutput';
import UploadBookModal from '#components/UploadBookModal';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

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

export type BookForList = Pick<BookType, 'id' | 'title' | 'price' | 'gradeDisplay' | 'categories' | 'languageDisplay' | 'image' | 'wishlistId'> & {
    authors: Pick<BookType['authors'][number], 'id' | 'name'>[],
    publisher: Pick<BookType['publisher'], 'id' | 'name'>,
    cartDetails?: Pick<NonNullable<BookType['cartDetails']>, 'id' | 'quantity'> | null | undefined,
};
export type BookForDetail = Pick<BookType, 'id' | 'title' | 'description' | 'gradeDisplay' | 'price' | 'languageDisplay' | 'numberOfPages' | 'isbn' | 'authors' | 'categories' | 'image' | 'wishlistId' | 'titleEn' | 'titleNe' | 'descriptionEn' | 'descriptionNe' | 'grade' | 'language' | 'publishedDate' | 'edition'> & {
    authors: Pick<BookType['authors'][number], 'id' | 'name' | 'aboutAuthor'>[],
    publisher: Pick<BookType['publisher'], 'id' | 'name'>,
    cartDetails?: Pick<NonNullable<BookType['cartDetails']>, 'id' | 'quantity'> | null | undefined,
};
type BookForCompact = Pick<BookType, 'id' | 'title' | 'image' | 'price'> & {
    authors: Pick<BookType['authors'][number], 'id' | 'name'>[],
    publisher?: Pick<BookType['publisher'], 'id' | 'name'>,
};
type BookForOrder = Pick<BookType, 'id' | 'title' | 'price' | 'image' | 'edition' | 'isbn' | 'gradeDisplay' | 'languageDisplay'> & {
    publisher?: null | NonNullable<Pick<BookType['publisher'], 'id' | 'name'>>
    quantity?: null | NonNullable<BookType['cartDetails']>['quantity'];
};
type BookForPackage = Omit<BookForList, 'cartDetails' | 'wishlistId'>;

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
} | {
    variant: 'package';
    book: BookForPackage;
    quantity: number;
})

function BookItem(props: Props) {
    const {
        className,
        book,
        variant,
        wishListActionsShown,
    } = props;

    const strings = useTranslation(bookItem);
    const alert = useAlert();
    const { user } = useContext(UserContext);

    const canCreateOrder = user?.permissions.includes('CREATE_ORDER');
    const isPublisher = variant === 'detail' && book?.publisher?.id === user?.publisherId;
    const isModerator = user?.type === 'MODERATOR';
    const canUpdateBook = user?.permissions.includes('CAN_UPDATE_BOOK') && (isPublisher || isModerator);
    const [
        uploadBookModalShown,
        showUploadBookModal,
        hideUploadBookModal,
    ] = useModalState(false);

    const [
        addToOrder,
        { loading: addToOrderLoading },
    ] = useMutation<AddToOrderMutation, AddToOrderMutationVariables>(
        ADD_TO_ORDER,
        {
            refetchQueries: CART_ITEMS_NAME ? [CART_ITEMS_NAME] : undefined,
            onCompleted: (response) => {
                if (response?.createCartItem?.ok) {
                    alert.show(
                        strings.bookOrderSuccessMessage,
                        { variant: 'success' },
                    );
                } else if (response?.createCartItem?.errors) {
                    const transformedError = transformToFormError(
                        removeNull(response?.createCartItem?.errors) as ObjectError[],
                    );
                    alert.show(
                        <ErrorMessage
                            header={strings.bookOrderFailedMessage}
                            description={
                                isDefined(transformedError)
                                    ? transformedError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header={strings.bookOrderFailedMessage}
                        description={errors.message}
                    />,
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
                if (response?.createWishlist?.ok) {
                    alert.show(
                        strings.wishlistAdditionSuccessMessage,
                        { variant: 'success' },
                    );
                } else if (response?.createWishlist?.errors) {
                    const transformedError = transformToFormError(
                        removeNull(response?.createWishlist?.errors) as ObjectError[],
                    );
                    alert.show(
                        <ErrorMessage
                            header={strings.wishlistAdditionFailedMessage}
                            description={
                                isDefined(transformedError)
                                    ? transformedError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header={strings.wishlistAdditionFailedMessage}
                        description={errors.message}
                    />,
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
                if (response?.deleteWishlist?.ok) {
                    alert.show(
                        strings.wishlistRemovalSuccessMessage,
                        { variant: 'success' },
                    );
                } else if (response?.deleteWishlist?.errors) {
                    const transformedError = transformToFormError(
                        removeNull(response?.deleteWishlist?.errors) as ObjectError[],
                    );
                    alert.show(
                        <ErrorMessage
                            header={strings.wishlistRemovalFailedMessage}
                            description={
                                isDefined(transformedError)
                                    ? transformedError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header={strings.wishlistRemovalFailedMessage}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const authorsDisplay = React.useMemo(() => (
        // eslint-disable-next-line react/destructuring-assignment
        props.variant !== 'order'
        // eslint-disable-next-line react/destructuring-assignment
            ? props.book.authors?.map((d) => d.name).join(', ')
            : undefined
        // eslint-disable-next-line react/destructuring-assignment
    ), [props.variant, props.book]);

    const handleClick = React.useCallback(() => {
        // eslint-disable-next-line react/destructuring-assignment
        if (props.variant === 'compact' && props.onClick) {
            // eslint-disable-next-line react/destructuring-assignment
            props.onClick(props.book.id);
        }
    }, [props]);

    const categoriesDisplay = React.useMemo(() => (
        // eslint-disable-next-line react/destructuring-assignment
        props.variant === 'list' || props.variant === 'detail' || props.variant === 'package'
            // eslint-disable-next-line react/destructuring-assignment
            ? props.book.categories?.map((d) => d.name).join(', ')
            : undefined
        // eslint-disable-next-line react/destructuring-assignment
    ), [props.variant, props.book]);

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
        // eslint-disable-next-line react/destructuring-assignment
        if (props.variant === 'compact' || props.variant === 'order' || props.variant === 'package') {
            return undefined;
        }

        // eslint-disable-next-line react/destructuring-assignment
        if (props.book.cartDetails) {
            return (
                <Tag icons={<IoCheckmark />}>
                    {strings.alreadyInOrderListMessage}
                </Tag>
            );
        }

        return canCreateOrder && (
            <Button
                name={undefined}
                variant="tertiary"
                onClick={handleAddToOrder}
                disabled={actionsDisabled}
            >
                {strings.addToOrderButtonLabel}
            </Button>
        );
        // eslint-disable-next-line react/destructuring-assignment
    }, [strings, props.variant, canCreateOrder, actionsDisabled, handleAddToOrder, props.book]);

    const wishListButton = React.useMemo(() => {
        if (!wishListActionsShown) {
            return undefined;
        }
        // eslint-disable-next-line react/destructuring-assignment
        if (props.variant === 'compact' || props.variant === 'order' || props.variant === 'package') {
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
        // eslint-disable-next-line react/destructuring-assignment
        props.variant,
        // eslint-disable-next-line react/destructuring-assignment
        props.book,
        actionsDisabled,
        handleAddToWishList,
        handleRemoveFromWishList,
        wishListActionsShown,
    ]);

    const editBookButton = React.useMemo(() => {
        if (canUpdateBook) {
            return (
                <Button
                    name={undefined}
                    icons={<IoPencil />}
                    onClick={showUploadBookModal}
                >
                    {strings.editBookLabel}
                </Button>
            );
        }
        return undefined;
    }, [canUpdateBook, showUploadBookModal, strings.editBookLabel]);

    const bookCoverPreview = (
        <div className={styles.preview}>
            {book.image?.url ? (
                <img
                    className={styles.image}
                    src={book.image.url}
                    alt={book.image.name ?? undefined}
                />
            ) : (
                <IoBookOutline className={styles.fallbackIcon} />
            )}
        </div>
    );

    const containerClassName = _cs(
        /* eslint-disable react/destructuring-assignment */
        props.variant === 'list' && styles.listVariant,
        props.variant === 'detail' && styles.detailVariant,
        props.variant === 'compact' && styles.compactVariant,
        props.variant === 'order' && styles.orderVariant,
        props.variant === 'package' && styles.packageVariant,
        /* eslint-enable react/destructuring-assignment */
        styles.bookItem,
        className,
    );

    // eslint-disable-next-line react/destructuring-assignment
    if (props.variant === 'list') {
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
                        <NumberOutput
                            value={book.price}
                            currency
                        />
                    )}
                    footerClassName={styles.footer}
                    footerIconsContainerClassName={styles.meta}
                    footerIcons={(
                        <>
                            <TextOutput
                                label={strings.languageLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.languageDisplay}
                            />
                            <TextOutput
                                label={strings.publisherLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.publisher.name}
                            />
                            <TextOutput
                                label={strings.gradeLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.gradeDisplay}
                            />
                            <div className={styles.categories}>
                                <TextOutput
                                    label={strings.categoriesLabel}
                                    value={categoriesDisplay}
                                />
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

    // eslint-disable-next-line react/destructuring-assignment
    if (props.variant === 'detail') {
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
                    footerActions={editBookButton}
                    headingSize="small"
                    headingDescription={authorsDisplay}
                    borderBelowHeader
                    headerDescription={(
                        <TextOutput
                            label={strings.priceLabel}
                            value={(
                                <NumberOutput
                                    value={book.price}
                                    currency
                                />
                            )}
                        />
                    )}
                    contentClassName={styles.content}
                >
                    <div className={styles.bookMeta}>
                        <TextOutput
                            label={strings.languageLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.languageDisplay}
                        />
                        <TextOutput
                            label={strings.gradeLabel}
                            // eslint-disable-next-line react/destructuring-assignment
                            value={props.book.gradeDisplay}
                        />
                        <TextOutput
                            label={strings.numberOfPagesLabel}
                            value={(
                                <NumberOutput
                                    // eslint-disable-next-line react/destructuring-assignment
                                    value={props.book.numberOfPages}
                                />
                            )}
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
                            <TextOutput
                                label={strings.categoriesLabel}
                                value={categoriesDisplay}
                            />
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
                {uploadBookModalShown && (
                    <UploadBookModal
                        onModalClose={hideUploadBookModal}
                        // eslint-disable-next-line react/destructuring-assignment
                        bookDetails={props.book}
                    />
                )}
            </div>
        );
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (props.variant === 'package') {
        return (
            <div className={containerClassName}>
                {bookCoverPreview}
                <Container
                    className={styles.details}
                    heading={book.title}
                    headingSize="extraSmall"
                    headingDescription={authorsDisplay}
                    headerActions={(
                        <NumberOutput
                            value={book.price}
                            currency
                        />
                    )}
                    footerClassName={styles.footer}
                    footerIconsContainerClassName={styles.meta}
                    footerIcons={(
                        <>
                            <TextOutput
                                label={strings.languageLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.languageDisplay}
                            />
                            <TextOutput
                                label={strings.publisherLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.publisher.name}
                            />
                            <TextOutput
                                label={strings.gradeLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.gradeDisplay}
                            />
                            <div className={styles.categories}>
                                <TextOutput
                                    label={strings.categoriesLabel}
                                    value={categoriesDisplay}
                                />
                            </div>
                        </>
                    )}
                    footerActionsContainerClassName={styles.actions}
                    footerActions={(
                        <TextOutput
                            label={strings.quantityLabel}
                            value={(
                                <NumberOutput
                                    // eslint-disable-next-line react/destructuring-assignment
                                    value={props.quantity}
                                />
                            )}
                        />
                    )}
                />
            </div>
        );
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (props.variant === 'order') {
        return (
            <div className={containerClassName}>
                {bookCoverPreview}
                <Container
                    className={styles.details}
                    heading={book.title}
                    headingSize="extraSmall"
                    contentClassName={styles.content}
                >
                    <div className={styles.orderBookMeta}>
                        <div className={styles.left}>
                            <TextOutput
                                label={strings.priceLabel}
                                value={(
                                    <NumberOutput
                                        value={book.price}
                                    />
                                )}
                            />
                            <TextOutput
                                label={strings.quantityLabel}
                                value={(
                                    <NumberOutput
                                        // eslint-disable-next-line react/destructuring-assignment
                                        value={props.book.quantity}
                                    />
                                )}
                            />
                            <TextOutput
                                label={strings.gradeLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.gradeDisplay}
                            />
                            <TextOutput
                                label={strings.publisherLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.publisher?.name}
                            />
                        </div>
                        <div className={styles.right}>
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
                            <TextOutput
                                label={strings.languageLabel}
                                // eslint-disable-next-line react/destructuring-assignment
                                value={props.book.languageDisplay}
                            />
                        </div>
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
                <div className={styles.title}>
                    {book.title}
                </div>
                <div className={styles.author}>
                    {authorsDisplay}
                </div>
                <NumberOutput
                    className={styles.price}
                    currency
                    value={book.price}
                />
            </div>
        </div>
    );
}

export default BookItem;
