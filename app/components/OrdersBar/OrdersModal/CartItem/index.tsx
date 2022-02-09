import React from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
    Button,
    NumberInput,
    useAlert,
} from '@the-deep/deep-ui';
import { IoTrash } from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';

import {
    CartItemsListQuery,
    UpdateCartBookQuantityMutation,
    UpdateCartBookQuantityMutationVariables,
    RemoveCartItemMutation,
    RemoveCartItemMutationVariables,
} from '#generated/types';

import styles from './styles.css';

const UPDATE_CART_BOOK_QUANTITY = gql`
mutation UpdateCartBookQuantity($id: ID!, $bookId: String!, $quantity: Int!) {
    updateCartItem(id: $id, data: { book: $bookId, quantity: $quantity }) {
        errors
        ok
        result {
            id
            quantity
            totalPrice
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

const REMOVE_CART_ITEM = gql`
mutation RemoveCartItem($id: ID!) {
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

type CartDetails = NonNullable<NonNullable<CartItemsListQuery['cartItems']>['results']>[number];

export interface Props {
    className?: string;
    cartDetails: CartDetails;
}

function CartItem(props: Props) {
    const {
        className,
        cartDetails,
    } = props;

    const {
        id: cartId,
        book,
        quantity,
        totalPrice,
    } = cartDetails;

    const alert = useAlert();

    const [removeCartItem] = useMutation<RemoveCartItemMutation, RemoveCartItemMutationVariables>(
        REMOVE_CART_ITEM,
        {
            onCompleted: (response) => {
                if (response?.deleteCartItem?.ok) {
                    console.warn('refetch cart info here');
                    // updateBar();
                } else {
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

    const [updateCartBookQuantity] = useMutation<
        UpdateCartBookQuantityMutation,
        UpdateCartBookQuantityMutationVariables
    >(
        UPDATE_CART_BOOK_QUANTITY,
        {
            onCompleted: (response) => {
                if (response?.updateCartItem?.ok) {
                    console.warn('refetch cart info here');
                } else {
                    alert.show(
                        'Failed to update the cart',
                        { variant: 'error' },
                    );
                }
            },
            onError: (e) => {
                // eslint-disable-next-line no-console
                console.error(e);
                alert.show(e.message, { variant: 'error' });
            },
        },
    );

    const handleQuantityChange = React.useCallback((newQuantity: number | undefined) => {
        if (isDefined(newQuantity) && newQuantity > 0) {
            updateCartBookQuantity({
                variables: {
                    id: cartId,
                    bookId: book.id,
                    quantity: newQuantity,
                },
            });
        }
    }, [updateCartBookQuantity, cartId, book.id]);

    const handleRemoveButtonClick = React.useCallback(() => {
        removeCartItem({ variables: { id: cartId } });
    }, [cartId, removeCartItem]);

    const authorsDisplay = React.useMemo(() => (
        book.authors?.map((d) => d.name).join(', ')
    ), [book.authors]);

    return (
        <div className={_cs(styles.cartItem, className)}>
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
                heading={book.title}
                headingSize="extraSmall"
                headingDescriptionClassName={styles.bookMeta}
                headingDescription={(
                    <>
                        {authorsDisplay}
                        <TextOutput
                            valueType="number"
                            label="NPR."
                            hideLabelColon
                            value={book.price}
                        />
                    </>
                )}
                headerActions={(
                    <Button
                        name={undefined}
                        onClick={handleRemoveButtonClick}
                        variant="action"
                    >
                        <IoTrash />
                    </Button>
                )}
                footerIcons={(
                    <NumberInput
                        className={styles.quantityInput}
                        name={undefined}
                        value={quantity}
                        type="number"
                        variant="general"
                        onChange={handleQuantityChange}
                    />
                )}
                footerActionsContainerClassName={styles.actions}
                footerActions={(
                    <TextOutput
                        valueType="number"
                        label="NPR."
                        hideLabelColon
                        value={totalPrice}
                    />
                )}
            />
        </div>
    );
}

export default CartItem;
