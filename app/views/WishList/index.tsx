import React, {
    useCallback,
    useState,
} from 'react';
import {
    Button,
    ListView,
    Message,
    NumberInput,
    TextOutput,
    useAlert,
    Heading,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
    useMutation,
} from '@apollo/client';
import {
    IoTrash,
    IoCart,
    IoList,
} from 'react-icons/io5';
import {
    isDefined,
    isNotDefined,
    _cs,
} from '@togglecorp/fujs';

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
query WishList($pageSize: Int!, $page: Int!) {
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
mutation RemoveWishList($id: ID!) {
    deleteWishlist(id: $id) {
        errors
        ok
    }
}
`;

const CREATE_CART = gql`
mutation CreateCart($id: String!, $quantity: Int!) {
    createCartItem(data: { book: $id, quantity: $quantity }) {
        errors
        ok
    }
}
`;

type Wish = NonNullable<NonNullable<WishListQuery['wishList']>['results']>[number]
const wishKeySelector = (w: Wish) => w.id;

interface WishProps {
    wish: Wish;
    onRemoveWishList: (id: string) => void;
    onCreateCart: (id: string, quantity: number) => void;
}

function WishListItem(props: WishProps) {
    const {
        wish,
        onRemoveWishList,
        onCreateCart,
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

    const [
        quantity,
        setQuantity,
    ] = useState<number | undefined>(1);

    const handleAddToCart = useCallback(() => {
        if (isDefined(quantity) && quantity > 0) {
            onCreateCart(bookId, quantity);
        }
    }, [quantity, bookId, onCreateCart]);

    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
    ), [authors]);

    return (
        <div className={styles.wishlistItem}>
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
            <div className={styles.content}>
                <div className={styles.details}>
                    <Heading size="small">
                        {title}
                    </Heading>
                    <TextOutput
                        label="Author"
                        value={authorsDisplay}
                    />
                    <TextOutput
                        label="Price (NPR)"
                        valueType="number"
                        value={price}
                    />
                </div>
                <div className={styles.actions}>
                    <NumberInput
                        className={styles.quantityInput}
                        label="Quantity"
                        name="quantity"
                        value={quantity}
                        onChange={setQuantity}
                        type="number"
                        variant="general"
                    />
                    <Button
                        name={bookId}
                        onClick={handleAddToCart}
                        variant="primary"
                        icons={<IoCart />}
                        disabled={isNotDefined(quantity) || (quantity < 1)}
                    >
                        Add to cart
                    </Button>
                </div>
                <Button
                    name={id}
                    onClick={onRemoveWishList}
                    variant="tertiary"
                    icons={<IoTrash />}
                >
                    Remove from Wishlist
                </Button>
            </div>
        </div>
    );
}

interface Props {
    className?: string;
}

function WishList(props: Props) {
    const { className } = props;
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const alert = useAlert();

    const {
        data,
        refetch,
        loading,
    } = useQuery<WishListQuery, WishListQueryVariables>(
        WISH_LIST,
        {
            variables: {
                page,
                pageSize,
            },
            onCompleted: (res: WishListQuery) => {
                setPage(res.wishList?.page ? res.wishList.page : page);
                setPageSize(res.wishList?.pageSize ? res.wishList.pageSize : pageSize);
            },
        },
    );

    const [
        deleteWishlist,
    ] = useMutation<RemoveWishListMutation, RemoveWishListMutationVariables>(
        REMOVE_WISH_LIST,
        {
            onCompleted: (response) => {
                refetch();
                if (response?.deleteWishlist?.ok) {
                    alert.show(
                        'Item deleted from wishlist successfully',
                        {
                            variant: 'success',
                        },
                    );
                } else {
                    alert.show(
                        'Failed to delete item from wishlist',
                        {
                            variant: 'error',
                        },
                    );
                }
            },
            onError: () => {
                alert.show(
                    'Failed to delete item from wishlist',
                    {
                        variant: 'error',
                    },
                );
            },
        },
    );

    const [
        createCartItem,
    ] = useMutation<CreateCartMutation, CreateCartMutationVariables>(
        CREATE_CART,
        {
            onCompleted: (response) => {
                if (response?.createCartItem?.ok) {
                    alert.show(
                        'The book was successfully added to your cart.',
                        {
                            variant: 'success',
                        },
                    );
                    // TODO: Delete book from wishlist from backend after item is added
                    refetch();
                } else {
                    alert.show(
                        'There was an error while adding this to your cart. It might already be there.',
                        {
                            variant: 'success',
                        },
                    );
                    // TODO: Delete book from wishlist from backend after item is added
                    refetch();
                }
            },
        },
    );
    const addToCart = useCallback((id: string, quantity: number) => {
        createCartItem({
            variables: {
                id,
                quantity,
            },
        });
    }, [createCartItem]);

    const deleteBook = useCallback((id: string) => {
        deleteWishlist({
            variables: {
                id,
            },
        });
    }, [deleteWishlist]);

    const wishes = data?.wishList?.results ?? [];

    const wishItemRendererParams = React.useCallback((_, d: Wish) => ({
        wish: d,
        onRemoveWishList: deleteBook,
        onCreateCart: addToCart,
    }), [deleteBook, addToCart]);

    return (
        <div className={_cs(styles.wishlist, className)}>
            <div className={styles.container}>
                <Heading
                    className={styles.pageHeading}
                    size="extraLarge"
                >
                    Wishlist
                </Heading>
                <ListView
                    className={_cs(styles.list, wishes.length === 0 && styles.empty)}
                    data={wishes}
                    keySelector={wishKeySelector}
                    rendererParams={wishItemRendererParams}
                    renderer={WishListItem}
                    pending={loading}
                    errored={false}
                    messageShown
                    emptyMessage={(
                        <div className={styles.emptyMessage}>
                            <IoList className={styles.icon} />
                            <div className={styles.text}>
                                <div className={styles.primary}>
                                    Your Wishlist is currently empty
                                </div>
                                <div className={styles.suggestion}>
                                    Add Books that you want to buy later by clicking Add to Wishlist
                                </div>
                            </div>
                        </div>
                    )}
                    filtered={false}
                />
            </div>
        </div>
    );
}

export default WishList;
