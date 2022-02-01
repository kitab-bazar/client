import React, {
    useCallback,
    useState,
} from 'react';
import {
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
import { IoHeartOutline, IoTrash } from 'react-icons/io5';
import {
    CartListQuery,
    CartListQueryVariables,
    CheckOutCartMutation,
    CheckOutCartMutationVariables,
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

type Cart = NonNullable<NonNullable<CartListQuery['cartItems']>['results']>[number]
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
        authors?.map((d: any) => d.name).join(', ')
    ), [authors]);

    return (
        <div className={styles.container} key={id}>
            <div className={styles.metaData}>
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
                <Container
                    className={styles.details}
                    heading={title}
                >
                    <div className={styles.headerDescription}>
                        <TextOutput
                            label="author"
                            value={authorsDisplay}
                        />
                        <TextOutput
                            label="Price (NPR)"
                            valueType="number"
                            value={price}
                        />
                        <div className={styles.quantity}>
                            <TextOutput
                                label="Quantity"
                                valueType="number"
                            />
                            <NumberInput
                                name="quantity"
                                value={quantity}
                                onChange={undefined}
                            />
                        </div>
                    </div>
                </Container>
                <div className={styles.wishListButton}>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="secondary"
                        icons={<IoHeartOutline />}
                    >
                        Add to wish list
                    </Button>
                    <Button
                        name={id}
                        variant="secondary"
                        icons={<IoTrash />}
                        onClick={deleteCart}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CartPage() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [email, setEmail] = useState<string>(''); // TODO: need to discuss
    const [deleteCartItem] = useMutation(DELETE_CART_ITEMS);

    const {
        data: result,
        refetch,
        loading,
    } = useQuery<CartListQuery, CartListQueryVariables>(
        CART_LIST, {
        variables: {
            page,
            pageSize,
            email,
        },
    });

    const [
        placeOrderFromCart,
        {
            data: response,
            loading: submitting,
        },
    ] = useMutation<CheckOutCartMutation, CheckOutCartMutationVariables>(
        ORDER_FROM_CART,
    );

    const pending = loading || submitting;
    const carts = (result?.cartItems?.results) ? result.cartItems.results : [];

    const removeCartItem = useCallback((id: string) => {
        deleteCartItem({ variables: { id }, onCompleted: () => refetch() });
    }, []);

    const checkout = () => {
        placeOrderFromCart({ onCompleted: () => refetch() });
    };

    const cartItemRendererParams = React.useCallback((_, data: Cart) => ({
        cart: data,
        deleteCart: removeCartItem,
    }), [removeCartItem]);

    return (
        <div className={styles.wishList}>
            <Container
                className={styles.featuredBooksSection}
                heading="My Cart"
            >
                <ListView
                    className={styles.bookList}
                    data={carts}
                    keySelector={cartKeySelector}
                    rendererParams={cartItemRendererParams}
                    renderer={CartContent}
                    errored={false}
                    pending={loading}
                    filtered={false}
                />
            </Container>
            {carts.length > 0
                && (
                    <Button
                        name={undefined}
                        variant="secondary"
                        onClick={checkout}
                        disabled={loading}
                    >
                        Order
                    </Button>
                )}
        </div>
    );
}

export default CartPage;
