import React, { useCallback } from 'react';
import {
    Container,
    Tab,
    Tabs,
    TabPanel,
    TabList,
    TextOutput,
    useAlert,
    Message,
    Button,
    useModalState,
} from '@the-deep/deep-ui';
import {
    gql,
    useMutation,
    useQuery,
} from '@apollo/client';
import { useParams } from 'react-router-dom';

import {
    BookDetailQuery,
    BookDetailQueryVariables,
    CreateWishListMutation,
    CreateWishListMutationVariables,
} from '#generated/types';
import OrderConfirmModal from './OrderConfirmModal';

import styles from './styles.css';

const BOOK_DETAIL = gql`
query BookDetail($id: ID!) {
    book(id: $id) {
      description
      id
      image {
        name
        url
      }
      isbn
      edition
      language
      price
      title
      numberOfPages
      authors {
        id
        name
      }
    }
  }
`;

const CREATE_WISH_LIST = gql`
mutation CreateWishList ($id: String!) {
    createWishlist(data: {book: $id}) {
        errors
        ok
    }
}
`;

function BookDetail() {
    const { id } = useParams();

    const {
        data: bookDetail,
        loading,
    } = useQuery<
        BookDetailQuery,
        BookDetailQueryVariables
    >(BOOK_DETAIL, {
        skip: !id,
        variables: { id: id ?? '' },
    });

    const [
        orderConfirmModalShown,
        showOrderConfirmModal,
        hideOrderConfirmModal,
    ] = useModalState(false);

    const alert = useAlert();

    const [
        createWishList,
    ] = useMutation<CreateWishListMutation, CreateWishListMutationVariables>(
        CREATE_WISH_LIST,
        {
            onCompleted: (response) => {
                if (response?.createWishlist?.ok) {
                    alert.show(
                        'Successfully added book to your wishlist.',
                        {
                            variant: 'success',
                        },
                    );
                } else {
                    alert.show(
                        'Failed to add book to wishlist. It might already be in there.',
                        {
                            variant: 'error',
                        },
                    );
                }
            },
        },
    );

    const addToWishList = useCallback(() => {
        createWishList({ variables: id ? { id } : undefined });
    }, [id, createWishList]);

    const [activeTab, setActiveTab] = React.useState<'description' | 'content' | undefined>('description');

    const authorsDisplay = React.useMemo(() => (
        bookDetail?.book?.authors?.map((d) => d.name).join(', ')
    ), [bookDetail?.book?.authors]);

    return (
        <div className={styles.bookDetail}>
            <div className={styles.container}>
                {bookDetail?.book ? (
                    <>
                        <div className={styles.metaData}>
                            <div className={styles.preview}>
                                {bookDetail?.book?.image?.url ? (
                                    <img
                                        className={styles.image}
                                        src={bookDetail.book.image.url}
                                        alt={bookDetail.book.title}
                                    />
                                ) : (
                                    <Message
                                        message="Preview not available"
                                    />
                                )}
                            </div>
                            <Container
                                className={styles.details}
                                heading={bookDetail.book.title}
                                headingDescription={authorsDisplay}
                                headerDescription={(
                                    <div className={styles.headerDescription}>
                                        <TextOutput
                                            label="Price (NPR)"
                                            value={bookDetail.book.price}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            label="Number of pages"
                                            value={bookDetail.book.numberOfPages}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            label="ISBN"
                                            value={bookDetail.book.isbn}
                                        />
                                        <TextOutput
                                            label="Language"
                                            value={bookDetail.book.language}
                                        />
                                    </div>
                                )}
                                footerIcons={(
                                    <>
                                        <Button
                                            name={undefined}
                                            variant="secondary"
                                            onClick={addToWishList}
                                        >
                                            Add to wishlist
                                        </Button>
                                        <Button
                                            name={undefined}
                                            variant="secondary"
                                            onClick={showOrderConfirmModal}
                                        >
                                            Buy Now
                                        </Button>
                                    </>
                                )}
                            />
                        </div>
                        <div className={styles.otherDetails}>
                            <Tabs
                                value={activeTab}
                                onChange={setActiveTab}
                            >
                                <TabList>
                                    <Tab name="description">
                                        Description
                                    </Tab>
                                    <Tab name="content">
                                        Content
                                    </Tab>
                                </TabList>
                                <TabPanel name="description">
                                    <div
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={
                                            { __html: bookDetail.book.description ?? '' }
                                        }
                                    />
                                </TabPanel>
                                <TabPanel name="content">
                                    <div className={styles.bookContentPreview}>
                                        Not available
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                        <Container
                            heading="About the author"
                            headingSize="small"
                        >
                            Author detail not available
                        </Container>
                    </>
                ) : (!loading && (
                    <div className={styles.noDetail}>
                        Book details not available
                    </div>
                ))}
            </div>
            {orderConfirmModalShown && bookDetail?.book && (
                <OrderConfirmModal
                    bookId={bookDetail?.book?.id}
                    book={bookDetail?.book}
                    onClose={hideOrderConfirmModal}
                />
            )}
        </div>
    );
}
export default BookDetail;
