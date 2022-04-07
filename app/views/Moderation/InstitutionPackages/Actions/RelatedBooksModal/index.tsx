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
    InstitutionPackageBooksQuery,
    InstitutionPackageBooksQueryVariables,
} from '#generated/types';
import BookItem, { Props as BookItemProps } from '#components/BookItem';
import { InstitutionPackage } from '../../index';

import styles from './styles.css';

const INSTITUTION_PACKAGE_BOOKS = gql`
    query InstitutionPackageBooks(
        $id: ID!,
        $page: Int,
        $pageSize: Int,
    ) {
        institutionPackage(id: $id) {
            institutionPackageBooks(page: $page, pageSize: $pageSize) {
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

type InstitutionPackageBook = NonNullable<NonNullable<NonNullable<NonNullable<InstitutionPackageBooksQuery['institutionPackage']>['institutionPackageBooks']>['results']>[number]>;

const maxItemsPerPage = 10;
function keySelector(packageBook: InstitutionPackageBook) {
    return packageBook.id;
}

interface Props {
    institutionPackage: InstitutionPackage;
    onModalClose: () => void;
}

function RelatedBooks(props: Props) {
    const {
        institutionPackage,
        onModalClose,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);

    const variables = useMemo(() => ({
        id: institutionPackage.id,
        page: activePage,
        pageSize: maxItemsPerPage,
    }), [activePage, institutionPackage.id]);

    const {
        data: bookResponse,
        loading: bookLoading,
        error: bookError,
    } = useQuery<InstitutionPackageBooksQuery, InstitutionPackageBooksQueryVariables>(
        INSTITUTION_PACKAGE_BOOKS,
        {
            variables,
        },
    );

    const bookItemRendererParams = useCallback((
        _: string,
        packageBook: InstitutionPackageBook,
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
            heading={institutionPackage.packageId}
            headingDescription={institutionPackage.institution.canonicalName}
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={bookResponse
                        ?.institutionPackage?.institutionPackageBooks?.totalCount ?? 0}
                    maxItemsPerPage={maxItemsPerPage}
                    itemsPerPageControlHidden
                    onActivePageChange={setActivePage}
                />
            )}
        >
            <ListView
                className={styles.bookItemList}
                data={bookResponse
                    ?.institutionPackage?.institutionPackageBooks?.results ?? undefined}
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
