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
    SchoolPackageBooksQuery,
    SchoolPackageBooksQueryVariables,
} from '#generated/types';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import { SchoolPackage } from '../../index';

import styles from './styles.css';

const SCHOOL_PACKAGE_BOOKS = gql`
    query SchoolPackageBooks(
        $id: ID!,
        $page: Int,
        $pageSize: Int,
    ) {
        schoolPackage(id: $id) {
            schoolPackageBooks(page: $page, pageSize: $pageSize) {
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

type SchoolPackageBook = NonNullable<NonNullable<NonNullable<NonNullable<SchoolPackageBooksQuery['schoolPackage']>['schoolPackageBooks']>['results']>[number]>;

const maxItemsPerPage = 10;
function keySelector(packageBook: SchoolPackageBook) {
    return packageBook.id;
}

interface Props {
    schoolPackage: Pick<SchoolPackage, 'id' | 'packageId' | 'school'>;
    onModalClose: () => void;
}

function RelatedBooks(props: Props) {
    const {
        schoolPackage,
        onModalClose,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);

    const variables = useMemo(() => ({
        id: schoolPackage.id,
        page: activePage,
        pageSize: maxItemsPerPage,
    }), [activePage, schoolPackage.id]);

    const {
        data: bookResponse,
        loading: bookLoading,
        error: bookError,
    } = useQuery<SchoolPackageBooksQuery, SchoolPackageBooksQueryVariables>(
        SCHOOL_PACKAGE_BOOKS,
        {
            variables,
        },
    );

    const bookItemRendererParams = useCallback((
        _: string,
        packageBook: SchoolPackageBook,
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
            heading={schoolPackage.packageId}
            headingDescription={schoolPackage.school.canonicalName}
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={bookResponse?.schoolPackage?.schoolPackageBooks?.totalCount ?? 0}
                    maxItemsPerPage={maxItemsPerPage}
                    itemsPerPageControlHidden
                    onActivePageChange={setActivePage}
                />
            )}
        >
            <ListView
                className={styles.bookItemList}
                data={bookResponse?.schoolPackage?.schoolPackageBooks?.results ?? undefined}
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
