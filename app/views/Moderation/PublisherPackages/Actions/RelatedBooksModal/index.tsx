import React, { useCallback, useState, useMemo } from 'react';
import {
    Modal,
    ListView,
    Pager,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    PublisherPackageBooksQuery,
    PublisherPackageBooksQueryVariables,
} from '#generated/types';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import { PublisherPackage } from '../../index';

import styles from './styles.css';

const PUBLISHER_PACKAGE_BOOKS = gql`
    query PublisherPackageBooks(
        $id: ID!,
        $page: Int,
        $pageSize: Int,
    ) {
        publisherPackage(id: $id) {
            publisherPackageBooks(page: $page, pageSize: $pageSize) {
                page
                pageSize
                totalCount
                results {
                    id
                    quantity
                    book {
                        id
                        title
                        price
                        gradeDisplay
                        languageDisplay
                        publisher {
                            id
                            name
                        }
                        authors {
                            id
                            name
                        }
                        categories {
                            id
                            name
                        }
                        image {
                            name
                            url
                        }
                    }
                }
            }
            id
        }
    }
`;

type PublisherPackageBook = NonNullable<NonNullable<NonNullable<NonNullable<PublisherPackageBooksQuery['publisherPackage']>['publisherPackageBooks']>['results']>[number]>;

const maxItemsPerPage = 10;
function keySelector(packageBook: PublisherPackageBook) {
    return packageBook.id;
}

interface Props {
    publisherPackage: PublisherPackage;
    onModalClose: () => void;
}

function RelatedBooks(props: Props) {
    const {
        publisherPackage,
        onModalClose,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);

    const variables = useMemo(() => ({
        id: publisherPackage.id,
        page: activePage,
        pageSize: maxItemsPerPage,
    }), [activePage, publisherPackage.id]);

    const {
        data: bookResponse,
        loading: bookLoading,
        error: bookError,
    } = useQuery<PublisherPackageBooksQuery, PublisherPackageBooksQueryVariables>(
        PUBLISHER_PACKAGE_BOOKS,
        {
            variables,
        },
    );

    const bookItemRendererParams = useCallback((
        _: string,
        packageBook: PublisherPackageBook,
    ): BookItemProps => ({
        book: packageBook.book,
        quantity: packageBook.quantity,
        variant: 'package',
    }), []);

    return (
        <Modal
            className={styles.relatedBooksModal}
            backdropClassName={styles.modalBackdrop}
            onCloseButtonClick={onModalClose}
            heading={publisherPackage.packageId}
            headingDescription={publisherPackage.publisher.name}
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={
                        bookResponse?.publisherPackage?.publisherPackageBooks?.totalCount ?? 0
                    }
                    maxItemsPerPage={maxItemsPerPage}
                    itemsPerPageControlHidden
                    onActivePageChange={setActivePage}
                />
            )}
        >
            <ListView
                className={styles.bookItemList}
                data={bookResponse?.publisherPackage?.publisherPackageBooks?.results ?? undefined}
                rendererParams={bookItemRendererParams}
                renderer={BookItem}
                keySelector={keySelector}
                errored={!!bookError}
                filtered={false}
                pending={bookLoading}
                messageShown
            />
        </Modal>
    );
}
export default RelatedBooks;
