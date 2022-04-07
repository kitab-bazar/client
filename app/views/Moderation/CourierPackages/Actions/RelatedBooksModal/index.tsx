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
    SchoolCourierPackageBooksQuery,
    SchoolCourierPackageBooksQueryVariables,
    InstitutionCourierPackageBooksQuery,
    InstitutionCourierPackageBooksQueryVariables,
} from '#generated/types';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import { CourierPackage } from '../../index';
import styles from './styles.css';

const SCHOOL_COURIER_PACKAGE_BOOKS = gql`
    query SchoolCourierPackageBooks(
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

const INSTITUTION_COURIER_PACKAGE_BOOKS = gql`
    query InstitutionCourierPackageBooks(
        $id: ID!,
        $page: Int,
        $pageSize: Int,
    ) {
        courierPackage(id: $id) {
            institutionCourierPackageBooks(page: $page, pageSize: $pageSize) {
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

type CourierPackageBook = NonNullable<NonNullable<NonNullable<NonNullable<SchoolCourierPackageBooksQuery['courierPackage']>['schoolCourierPackageBooks']>['results']>[number]>;

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
        data: schoolBookResponse,
        loading: schoolBookLoading,
        error: schoolBookError,
    } = useQuery<SchoolCourierPackageBooksQuery, SchoolCourierPackageBooksQueryVariables>(
        SCHOOL_COURIER_PACKAGE_BOOKS,
        {
            variables,
            skip: courierPackage.type === 'INSTITUTION',
        },
    );

    const {
        data: institutionBookResponse,
        loading: institutionBookLoading,
        error: institutionBookError,
    } = useQuery<InstitutionCourierPackageBooksQuery, InstitutionCourierPackageBooksQueryVariables>(
        INSTITUTION_COURIER_PACKAGE_BOOKS,
        {
            variables,
            skip: courierPackage.type === 'SCHOOL',
        },
    );

    const loading = institutionBookLoading || schoolBookLoading;
    const error = schoolBookError || institutionBookError;

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
                        (courierPackage.type === 'SCHOOL'
                            ? schoolBookResponse
                                ?.courierPackage?.schoolCourierPackageBooks?.totalCount
                            : institutionBookResponse
                                ?.courierPackage?.institutionCourierPackageBooks?.totalCount)
                        ?? 0
                    }
                    maxItemsPerPage={maxItemsPerPage}
                    itemsPerPageControlHidden
                    onActivePageChange={setActivePage}
                />
            )}
        >
            <ListView
                className={styles.bookItemList}
                data={(
                    courierPackage.type === 'SCHOOL'
                        ? schoolBookResponse?.courierPackage?.schoolCourierPackageBooks?.results
                        : institutionBookResponse
                            ?.courierPackage?.institutionCourierPackageBooks?.results
                ) ?? undefined}
                rendererParams={bookItemRendererParams}
                renderer={BookItem}
                keySelector={keySelector}
                errored={!!error}
                filtered={false}
                pending={loading}
                messageShown
            />
        </Modal>
    );
}
export default RelatedBooks;
