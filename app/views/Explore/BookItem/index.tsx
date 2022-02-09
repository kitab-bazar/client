import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import {
    IoCheckmark,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';

import SmartLink from '#base/components/SmartLink';
import routes from '#base/configs/routes';
import {
    ExploreBooksQuery,
    AddToOrderMutation,
    AddToOrderMutationVariables,
    AddToWishListMutation,
    AddToWishListMutationVariables,
    RemoveFromWishListMutation,
    RemoveFromWishListMutationVariables,
} from '#generated/types';
import { OrdersBarContext } from '#components/OrdersBar';

import styles from './styles.css';

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

type BookDetails = NonNullable<NonNullable<ExploreBooksQuery['books']>['results']>[number];

export interface Props {
    className?: string;
    book: BookDetails;
}

function BookItem(props: Props) {
    const {
        className,
        book,
    } = props;

    const alert = useAlert();
    const { updateBar } = React.useContext(OrdersBarContext);

    const [
        addToOrder,
        { loading: addToOrderLoading },
    ] = useMutation<AddToOrderMutation, AddToOrderMutationVariables>(
        ADD_TO_ORDER,
        {
            onCompleted: (response) => {
                if (!response?.createCartItem?.ok) {
                    alert.show(
                        'Failed to add book to the order.',
                        { variant: 'error' },
                    );
                } else {
                    updateBar();
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

    const categoriesDisplay = React.useMemo(() => (
        book.categories?.map((d) => d.name).join(', ')
    ), [book.categories]);

    const handleAddToOrder = React.useCallback(() => {
        addToOrder({
            variables: {
                id: book.id,
                quantity: 1,
            },
        });
    }, [book.id, addToOrder]);

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

    const disabled = addToOrderLoading || addToWishListLoading || removeFromWishListLoading;

    return (
        <div className={_cs(styles.bookItem, className)}>
            <div className={styles.preview}>
                {book.image?.url && (
                    <img
                        className={styles.image}
                        src={book.image.url}
                        alt={book.image.name ?? undefined}
                    />
                )}
            </div>
            <Container
                className={styles.details}
                heading={(
                    <SmartLink
                        route={routes.bookDetail}
                        attrs={{
                            id: book.id,
                        }}
                    >
                        {book.title}
                    </SmartLink>
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
                            value={book.language}
                        />
                        <TextOutput
                            label="Publisher"
                            value={book.publisher.name}
                        />
                        <div className={styles.categories}>
                            {categoriesDisplay}
                        </div>
                    </>
                )}
                footerActionsContainerClassName={styles.actions}
                footerActions={(
                    <>
                        {book.wishlistId ? (
                            <Button
                                name={book.wishlistId}
                                variant="primary"
                                onClick={handleRemoveFromWishList}
                                disabled={disabled}
                            >
                                Remove from Wish list
                            </Button>
                        ) : (
                            !book.cartDetails && (
                                <Button
                                    name={undefined}
                                    variant="primary"
                                    onClick={handleAddToWishList}
                                    disabled={disabled}
                                >
                                    Add to Wish list
                                </Button>
                            )
                        )}
                        {book.cartDetails ? (
                            <Button
                                variant="secondary"
                                name={undefined}
                                icons={<IoCheckmark />}
                                readOnly
                            >
                                In order list
                            </Button>
                        ) : (
                            <Button
                                name={undefined}
                                variant="primary"
                                onClick={handleAddToOrder}
                                disabled={disabled}
                            >
                                Add to Order
                            </Button>
                        )}
                    </>
                )}
            />
        </div>
    );
}

export default BookItem;
