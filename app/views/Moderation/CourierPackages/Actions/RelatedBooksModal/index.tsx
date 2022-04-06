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
    CourierPackageBooksQuery,
    CourierPackageBooksQueryVariables,
} from '#generated/types';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import { CourierPackage } from '../../index';

import styles from './styles.css';

const COURIER_PACKAGE_BOOKS = gql`
    query CourierPackageBooks(
        $id: ID!,
        $page: Int,
        $pageSize: Int,
    ) {
        courierPackage(id: $id) {
            schoolCourierPackageBooks(page: $page, pageSize: $pageSize) {
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

type CourierPackageBook = NonNullable<NonNullable<NonNullable<NonNullable<CourierPackageBooksQuery['courierPackage']>['schoolCourierPackageBooks']>['results']>[number]>;

const maxItemsPerPage = 10;
function keySelector(packageBook: CourierPackageBook) {
    return packageBook.id;
}

interface Props {
    courierPackage: CourierPackage;
    onModalClose: () => void;
}

function RelatedBooks(props: Props) {
    const {
        courierPackage,
        onModalClose,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);

    const variables = useMemo(() => ({
        id: courierPackage.id,
        page: activePage,
        pageSize: maxItemsPerPage,
    }), [activePage, courierPackage.id]);

    const {
        data: bookResponse,
        loading: bookLoading,
        error: bookError,
    } = useQuery<CourierPackageBooksQuery, CourierPackageBooksQueryVariables>(
        COURIER_PACKAGE_BOOKS,
        {
            variables,
        },
    );

    const bookItemRendererParams = useCallback((
        _: string,
        packageBook: CourierPackageBook,
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
            heading={courierPackage.packageId}
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={
                        bookResponse?.courierPackage?.schoolCourierPackageBooks?.totalCount ?? 0
                    }
                    maxItemsPerPage={maxItemsPerPage}
                    itemsPerPageControlHidden
                    onActivePageChange={setActivePage}
                />
            )}
        >
            <ListView
                className={styles.bookItemList}
                data={bookResponse?.courierPackage?.schoolCourierPackageBooks?.results ?? undefined}
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
