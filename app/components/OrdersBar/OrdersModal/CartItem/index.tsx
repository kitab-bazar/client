import React, { useContext, useRef, useState } from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import { getOperationName } from 'apollo-link';
import {
    Container,
    Button,
    NumberInput,
    useAlert,
} from '@the-deep/deep-ui';
import {
    IoTrash,
    IoBook,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';

import { ordersBar } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import {
    CartItemsListQuery,
    UpdateCartBookQuantityMutation,
    UpdateCartBookQuantityMutationVariables,
    RemoveCartItemMutation,
    RemoveCartItemMutationVariables,
} from '#generated/types';
import { CART_ITEMS } from '#components/OrdersBar/queries';
import NumberOutput from '#components/NumberOutput';

import UserContext from '#base/context/UserContext';

import styles from './styles.css';

const CART_ITEMS_NAME = getOperationName(CART_ITEMS);

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
    onCartItemRemove: () => void;
}

function CartItem(props: Props) {
    const {
        className,
        cartDetails,
        onCartItemRemove,
    } = props;

    const {
        id: cartId,
        book,
        quantity,
        totalPrice,
    } = cartDetails;

    const [cartQuantity, setCartQuantity] = useState(quantity);
    const lastValidCartQuantityRef = useRef(quantity);

    const strings = useTranslation(ordersBar);
    const alert = useAlert();

    const { user } = useContext(UserContext);
    const canCreateOrder = user?.permissions.includes('CREATE_ORDER');

    const [
        removeCartItem,
        { loading: removeLoading },
    ] = useMutation<RemoveCartItemMutation, RemoveCartItemMutationVariables>(
        REMOVE_CART_ITEM,
        {
            refetchQueries: CART_ITEMS_NAME ? [CART_ITEMS_NAME] : undefined,
            onCompleted: (response) => {
                if (response?.deleteCartItem?.ok) {
                    onCartItemRemove();
                } else {
                    alert.show(
                        strings.removeFromCartErrorMessage,
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
        updateCartBookQuantity,
        { loading: updateLoading },
    ] = useMutation<UpdateCartBookQuantityMutation, UpdateCartBookQuantityMutationVariables>(
        UPDATE_CART_BOOK_QUANTITY,
        {
            refetchQueries: CART_ITEMS_NAME ? [CART_ITEMS_NAME] : undefined,
            onCompleted: (response) => {
                if (!response) {
                    return;
                }
                const { updateCartItem } = response;
                if (!updateCartItem?.ok) {
                    alert.show(
                        strings.updateCartErrorMessage,
                        { variant: 'error' },
                    );
                    if (lastValidCartQuantityRef.current) {
                        setCartQuantity(lastValidCartQuantityRef.current);
                    }
                } else if (updateCartItem?.result) {
                    lastValidCartQuantityRef.current = updateCartItem.result.quantity;
                }
            },
            onError: (e) => {
                // eslint-disable-next-line no-console
                console.error(e);
                alert.show(e.message, { variant: 'error' });
            },
        },
    );

    const actionsDisabled = removeLoading || updateLoading;

    const handleQuantityChange = React.useCallback((newQuantity: number | undefined) => {
        if (isDefined(newQuantity) && newQuantity > 0) {
            setCartQuantity(newQuantity);
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
            <Container
                className={styles.details}
                heading={book.title}
                headingSize="extraSmall"
                headingDescriptionClassName={styles.bookMeta}
                headingDescription={(
                    <>
                        {authorsDisplay}
                        <NumberOutput
                            value={book.price}
                            currency
                        />
                    </>
                )}
                headerActions={canCreateOrder && (
                    <Button
                        name={undefined}
                        onClick={handleRemoveButtonClick}
                        variant="action"
                        disabled={actionsDisabled}
                    >
                        <IoTrash />
                    </Button>
                )}
                footerIcons={(
                    <NumberInput
                        className={styles.quantityInput}
                        name={undefined}
                        value={cartQuantity}
                        type="number"
                        variant="general"
                        onChange={handleQuantityChange}
                        // NOTE: not disabling when updateLoading is true
                        readOnly={!canCreateOrder}
                        disabled={removeLoading}
                        min={1}
                        max={99}
                    />
                )}
                footerActionsContainerClassName={styles.actions}
                footerActions={(
                    <NumberOutput
                        value={totalPrice}
                        currency
                    />
                )}
            />
        </div>
    );
}

export default CartItem;
