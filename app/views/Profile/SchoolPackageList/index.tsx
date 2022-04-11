import React, { useCallback, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    Pager,
    Button,
    ListView,
    TextOutput,
    Container,
    useModalState,
} from '@the-deep/deep-ui';

import useTranslation from '#base/hooks/useTranslation';
import { profile } from '#base/configs/lang';
import NumberOutput from '#components/NumberOutput';
import {
    SchoolPackagesForProfileQuery,
    SchoolPackagesForProfileQueryVariables,
} from '#generated/types';

import RelatedBooksModal from '#views/Moderation/SchoolPackages/Actions/RelatedBooksModal';
import styles from './styles.css';

const SCHOOL_PACKAGES_FOR_PROFILE = gql`
query SchoolPackagesForProfile(
    $pageSize: Int,
    $page: Int,
) {
    schoolPackages(
        page: $page,
        pageSize: $pageSize,
    ) {
        page
        pageSize
        totalCount
        results {
            id
            status
            statusDisplay
            totalPrice
            totalQuantity
            packageId
            school {
                canonicalName
                id
            }
            schoolPackageBooks {
                totalCount
                results {
                    id
                    quantity
                    book {
                        id
                        title
                        price
                        weight
                    }
                }
            }
        }
    }
}
`;

export type SchoolPackage = NonNullable<NonNullable<SchoolPackagesForProfileQuery['schoolPackages']>['results']>[number];

const schoolPackageKeySelector = (p: SchoolPackage) => p.id;
const MAX_ITEMS_PER_PAGE = 10;

interface PackageItemProps {
    data: SchoolPackage;
}

function PackageItem(props: PackageItemProps) {
    const {
        data,
    } = props;

    const strings = useTranslation(profile);

    const [
        viewRelatedBooksModalShown,
        showRelatedBooksModal,
        hideRelatedBooksModal,
    ] = useModalState(false);

    return (
        <Container
            className={styles.packageItem}
            heading={(
                <TextOutput
                    label={strings.packageIdLabel}
                    value={data.packageId}
                />
            )}
            headingSize="extraSmall"
            headerActions={(
                <TextOutput
                    label={strings.status}
                    value={data.statusDisplay}
                />
            )}
            footerActions={(
                <Button
                    name={undefined}
                    title={strings.viewRelatedBooks}
                    onClick={showRelatedBooksModal}
                    variant="tertiary"
                >
                    {strings.booksLabel}
                </Button>
            )}
        >
            <TextOutput
                label={strings.booksCountLabel}
                value={(
                    <NumberOutput
                        value={data.totalQuantity}
                    />
                )}
            />
            <TextOutput
                label={strings.totalPriceLabel}
                value={(
                    <NumberOutput
                        value={data.totalPrice}
                        currency
                    />
                )}
            />
            {viewRelatedBooksModalShown && (
                <RelatedBooksModal
                    schoolPackage={data}
                    onModalClose={hideRelatedBooksModal}
                />
            )}
        </Container>
    );
}

interface Props{
    className?: string;
}

function SchoolPackageList(props: Props) {
    const {
        className,
    } = props;

    const [page, setPage] = useState<number>(1);

    const {
        loading: schoolPackagePending,
        previousData: schoolPackagePreviousData,
        data: schoolPackageResponse = schoolPackagePreviousData,
        error: schoolPackageError,
    } = useQuery<SchoolPackagesForProfileQuery, SchoolPackagesForProfileQueryVariables>(
        SCHOOL_PACKAGES_FOR_PROFILE,
        {
            variables: {
                page,
                pageSize: MAX_ITEMS_PER_PAGE,
            },
        },
    );

    const strings = useTranslation(profile);

    const packageListRendererParams = useCallback((_, data: SchoolPackage) => ({
        data,
    }), []);

    return (
        <div className={_cs(styles.packages, className)}>
            <h2>
                {strings.packageListLabel}
            </h2>
            <ListView
                className={styles.packageList}
                data={schoolPackageResponse?.schoolPackages?.results}
                keySelector={schoolPackageKeySelector}
                rendererParams={packageListRendererParams}
                renderer={PackageItem}
                pending={schoolPackagePending}
                emptyMessage={strings.noPackagesFound}
                messageShown
                errored={!!schoolPackageError}
                filtered={false}
            />
            <Pager
                activePage={page}
                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                itemsCount={schoolPackageResponse?.schoolPackages?.totalCount ?? 0}
                onActivePageChange={setPage}
                itemsPerPageControlHidden
            />
        </div>
    );
}

export default SchoolPackageList;
