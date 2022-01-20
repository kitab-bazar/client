import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, NumberInput, TextOutput } from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
    useMutation,
} from '@apollo/client';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaShoppingCart } from 'react-icons/fa';

import {
    WishListQuery,
    WishListQueryVariables,
} from '#generated/types';

import styles from './styles.css';

const WISH_LIST = gql`
    query WishList ($pageSize: Int!, $page: Int!){
        wishList(pageSize: $pageSize, page: $page) {
            results {
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

interface Author {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface Book {
    id: number;
    price: number;
    authors: Author[];
    image: Image;
    title: string;
    mutate: (id: number) => void;
}

function WishListBook(props: Book) {
    const { id, price, authors, image, title, mutate } = props;
    const authorsDisplay = React.useMemo(() => (
        authors?.map((d) => d.name).join(', ')
    ), [authors]);

    const removeBook = (_id: number) => {
        mutate(_id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.metaData}>
                {image?.url ? (
                    <img
                        className={styles.image}
                        src={image.url}
                        alt={title}
                    />
                ) : (
                    <div className={styles.noPreview}>
                        Preview not available
                    </div>
                )}
                <Container
                    className={styles.details}
                    heading={title}
                >
                    <div className={styles.headerDescription}>
                        <TextOutput
                            label={authorsDisplay}
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
                                value={undefined}
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
                        icons={<FaShoppingCart />}
                        autoFocus
                    >
                        Add to cart
                    </Button>
                    <Button
                        name={undefined}
                        onClick={() => removeBook(id)}
                        variant="secondary"
                        icons={<AiTwotoneDelete />}
                        autoFocus
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
    const [deleteWishlist] = useMutation(REMOVE_WISH_LIST);

    const { data, refetch, loading } = useQuery<
        WishListQuery,
        WishListQueryVariables
    >(WISH_LIST, {
        variables: { page, pageSize },
    });

    const deleteBook = (_id: number) => {
        deleteWishlist({ variables: { id: _id } });
        refetch();
    };

    useEffect(() => {
        if (!loading && data?.wishList) {
            if (data.wishList.page != null && data.wishList.page) {
                setPage(data.wishList.page);
            }
            if (data.wishList.pageSize != null && data.wishList.pageSize) {
                setPageSize(data.wishList.pageSize);
            }
        }
    }, [loading]);

    return (
        <div className={styles.wishList}>
            {!loading && data?.wishList?.results
                && (
                    <>
                        {
                            data.wishList.results.map((_b: any) => (
                                <WishListBook
                                    id={_b.book.id}
                                    title={_b.book.title}
                                    image={_b.book.image}
                                    price={_b.book.price}
                                    authors={_b.book.authors}
                                    mutate={deleteBook}
                                />
                            ))
                        }
                    </>
                )}
        </div>
    );
}

export default WishList;
