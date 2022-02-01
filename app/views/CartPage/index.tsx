import React, {
    useCallback,
    useState,
} from 'react';
import {
    Pager,
    Button,
    Container,
    ListView,
    Message,
    NumberInput,
    TextOutput,
} from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { IoTrash } from 'react-icons/io5';
import {
    CartListQuery,
    CartListQueryVariables,
    CheckOutCartMutation,
    CheckOutCartMutationVariables,
    DeleteCartItemsMutation,
    DeleteCartItemsMutationVariables,
} from '#generated/types';

import styles from './styles.css';

const CART_LIST = gql`
query CartList($email: ID!, $page: Int!, $pageSize: Int!) {
    cartItems(createdBy: $email, page: $page, pageSize: $pageSize) {
        results {
            id
            totalPrice
            book {
                id
                title
                image {
                    url
                }
                authors {
                    id
                    name
                }
                price
            }
            quantity
        }
        grandTotalPrice
        page
        pageSize
        totalCount
    }
}
`;

const DELETE_CART_ITEMS = gql`
mutation DeleteCartItems($id: ID!) {
    deleteCartItem(id: $id) {
        errors
        ok
    }
}
`;

const ORDER_FROM_CART = gql`
mutation CheckOutCart {
    placeOrderFromCart {
        errors
        ok
        result {
            id
            orderCode
            status
            totalPrice
        }
    }
}
`;

type Cart = NonNullable<NonNullable<CartListQuery['cartItems']>['results']>[number];
const cartKeySelector = (c: Cart) => c.id;

interface CartProps {
    cart: Cart;
    deleteCart: (id: string) => void;
}

function CartContent(props: CartProps) {
    const {
        cart,
        deleteCart,
    } = props;

    const {
        id,
        quantity,
        book,
    } = cart;

    const {
        title, image,
        authors,
        price,
    } = book;

    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
    ), [authors]);

    return (
        <Container
            className={styles.container}
            heading={title}
            footerActions={(
                <Button
                    name={id}
                    variant="secondary"
                    icons={<IoTrash />}
                    onClick={deleteCart}
                >
                    Remove
                </Button>
            )}
            contentClassName={styles.content}
        >
            <div className={styles.imageContainer}>
                {image?.url ? (
                    <img
                        className={styles.image}
                        src={image.url}
                        alt={title}
                    />
                ) : (
                    <Message
                        message="Preview not available"
                    />
                )}
            </div>
            <div className={styles.details}>
                <TextOutput
                    label="author"
                    value={authorsDisplay}
                />
                <TextOutput
                    label="Price (NPR)"
                    valueType="number"
                    value={price}
                />
                <NumberInput
                    label="Quantity"
                    name="quantity"
                    value={quantity}
                    onChange={undefined}
                />
            </div>
        </Container>
    );
}

function CartPage() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [email] = useState<string>(''); // TODO: need to discuss

    const {
        data: result,
        refetch,
        loading,
    } = useQuery<CartListQuery, CartListQueryVariables>(
        CART_LIST,
        {
            variables: {
                page,
                pageSize,
                email,
            },
        },
    );

    const [deleteCartItem] = useMutation<DeleteCartItemsMutation, DeleteCartItemsMutationVariables>(
        DELETE_CART_ITEMS,
        {
            onCompleted: () => refetch(),
        },
    );

    const [
        placeOrderFromCart,
        {
            loading: submitting,
        },
    ] = useMutation<CheckOutCartMutation, CheckOutCartMutationVariables>(
        ORDER_FROM_CART,
        {
            onCompleted: () => refetch(),
        },
    );

    const pending = loading || submitting;
    const carts = (result?.cartItems?.results) ? result.cartItems.results : [];

    const removeCartItem = useCallback((id: string) => {
        deleteCartItem({
            variables: { id },
        });
    }, [deleteCartItem]);

    const checkout = () => {
        placeOrderFromCart();
    };

    const cartItemRendererParams = React.useCallback((_, data: Cart) => ({
        cart: data,
        deleteCart: removeCartItem,
    }), [removeCartItem]);

    return (
        <Container
            className={styles.wishList}
            heading="My Cart"
            footerIcons={(
                <Pager
                    activePage={page}
                    maxItemsPerPage={pageSize}
                    itemsCount={result?.cartItems?.totalCount ?? 0}
                    onActivePageChange={setPage}
                    onItemsPerPageChange={setPageSize}
                />
            )}
            footerActions={carts.length > 0 && (
                <Button
                    name={undefined}
                    variant="secondary"
                    onClick={checkout}
                    disabled={loading}
                >
                    Order
                </Button>
            )}
        >
            <ListView
                data={carts}
                keySelector={cartKeySelector}
                rendererParams={cartItemRendererParams}
                renderer={CartContent}
                errored={false}
                pending={pending}
                filtered={false}
            />
        </Container>
    );
}

export default CartPage;
