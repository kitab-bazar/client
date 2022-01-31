import React, { useCallback, useState } from 'react';
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
    useQuery,
    useMutation,
} from '@apollo/client';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaShoppingCart } from 'react-icons/fa';

import {
    CreateCartMutation,
    CreateCartMutationVariables,
    RemoveWishListMutation,
    RemoveWishListMutationVariables,
    WishListQuery,
    WishListQueryVariables,
} from '#generated/types';

import styles from './styles.css';

const WISH_LIST = gql`
    query WishList ($pageSize: Int!, $page: Int!){
        wishList(pageSize: $pageSize, page: $page) {
            results {
                id
                book {
                    id
                    isbn
                    authors {
                        id
                        name
                    }
                    price
                    title
                    language
                    image {
                        url
                    }
                }
            }
        pageSize
        page
        }
    }
`;

const REMOVE_WISH_LIST = gql`
mutation RemoveWishList ($id: ID!) {
    deleteWishlist(id: $id) {
      errors
      ok
    }
  }
`;

const CREATE_CART = gql`
mutation CreateCart ($id: String!, $quantity: Int! ) {
    createCartItem(data: {book: $id, quantity: $quantity}) {
      errors
      ok
    }
  }
`;

type Wish = NonNullable<NonNullable<WishListQuery['wishList']>['results']>[number]
const wishKeySelector = (w: Wish) => w.id;

interface WishProps {
    wish: Wish;
    removeWishList: (id: string) => void;
    createCart: (id: string, quantity: number) => void;
}

function WishListItem(props: WishProps) {
    const {
        wish,
        removeWishList,
        createCart,
    } = props;

    const {
        id,
        book,
    } = wish;

    const {
        id: bookId,
        price,
        authors,
        title,
        image,
    } = book;

    const [quantity, setQuantity] = useState<number | undefined>(0);
    const handleQuantityChange = (value: number | undefined) => {
        setQuantity(value);
    };
    const handleAddToCart = useCallback(() => {
        if (quantity && quantity > 0) {
            createCart(bookId, quantity);
        }
    }, [quantity]);

    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
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
                            label="Author"
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
                                onChange={handleQuantityChange}
                            />
                        </div>
                    </div>
                </Container>
                <div className={styles.wishListButton}>
                    <Button
                        name={bookId}
                        onClick={handleAddToCart}
                        variant="secondary"
                        icons={<FaShoppingCart />}
                    >
                        Add to cart
                    </Button>
                    <Button
                        name={id}
                        onClick={removeWishList}
                        variant="secondary"
                        icons={<AiTwotoneDelete />}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}

function WishList() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [deleteWishlist] = useMutation<
        RemoveWishListMutation,
        RemoveWishListMutationVariables
    >(REMOVE_WISH_LIST);

    const [createCartItem] = useMutation<
        CreateCartMutation,
        CreateCartMutationVariables
    >(CREATE_CART);

    const { data, refetch, loading } = useQuery<
        WishListQuery,
        WishListQueryVariables
    >(WISH_LIST, {
        variables: { page, pageSize },
        onCompleted: (res: WishListQuery) => {
            setPage(res.wishList?.page ? res.wishList.page : page);
            setPageSize(res.wishList?.pageSize ? res.wishList.pageSize : pageSize);
        },
    });

    const addToCart = useCallback((id: string, quantity: number) => {
        createCartItem({ variables: { id, quantity } }).then(() => {
            refetch();
        }).catch((e) => console.log(e));
    }, []);

    const deleteBook = useCallback((id: string) => {
        deleteWishlist({ variables: { id } }).then(() => {
            refetch();
        });
    }, []);

    const wishes = (!loading && data?.wishList?.results) ? data.wishList.results : [];
    const wishItemRendererParams = React.useCallback((_, d) => ({
        wish: d,
        removeWishList: deleteBook,
        createCart: addToCart,
    }), []);

    return (
        <div className={styles.wishList}>
            <Container
                className={styles.featuredBooksSection}
                heading="My Wishlist"
            >
                <ListView
                    className={styles.bookList}
                    data={wishes}
                    keySelector={wishKeySelector}
                    rendererParams={wishItemRendererParams}
                    renderer={WishListItem}
                    errored={false}
                    pending={loading}
                    filtered={false}
                />
            </Container>
        </div>
    );
}

export default WishList;
