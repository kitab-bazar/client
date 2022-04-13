import React, { useCallback, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    Pager,
    ListView,
    TextOutput,
    Button,
    Container,
    useModalState,
    Link,
} from '@the-deep/deep-ui';

import useTranslation from '#base/hooks/useTranslation';
import { profile } from '#base/configs/lang';
import NumberOutput from '#components/NumberOutput';
import {
    PublisherPackagesForProfileQuery,
    PublisherPackagesForProfileQueryVariables,
} from '#generated/types';

import RelatedBooksModal from '#views/Moderation/PublisherPackages/Actions/RelatedBooksModal';
import styles from './styles.css';

const PUBLISHER_PACKAGES_FOR_PROFILE = gql`
query PublisherPackagesForProfile(
    $pageSize: Int,
    $page: Int,
) {
    publisherPackages(
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
            incentive
            totalPrice
            totalQuantity
            packageId
            ordersExportFile {
                name
                url
            }
            publisher {
                id
                name
            }
            publisherPackageBooks {
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

export type PublisherPackage = NonNullable<NonNullable<PublisherPackagesForProfileQuery['publisherPackages']>['results']>[number];

const publisherPackageKeySelector = (p: PublisherPackage) => p.id;
const MAX_ITEMS_PER_PAGE = 10;

interface PackageItemProps {
    data: PublisherPackage;
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
                <>
                    {data.ordersExportFile?.url && (
                        <Link
                            to={data.ordersExportFile?.url}
                        >
                            {strings.exportPackage}
                        </Link>
                    )}
                    <Button
                        name={undefined}
                        title={strings.viewRelatedBooks}
                        onClick={showRelatedBooksModal}
                        variant="tertiary"
                    >
                        {strings.booksLabel}
                    </Button>
                </>

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
            <TextOutput
                label={strings.incentiveLabel}
                value={(
                    <NumberOutput
                        value={data.incentive}
                    />
                )}
            />
            {viewRelatedBooksModalShown && (
                <RelatedBooksModal
                    publisherPackage={data}
                    onModalClose={hideRelatedBooksModal}
                />
            )}
        </Container>
    );
}

interface Props{
    className?: string;
}

function PublisherPackageList(props: Props) {
    const {
        className,
    } = props;
    const [page, setPage] = useState<number>(1);

    const {
        loading: publisherPackagePending,
        previousData: publisherPackagePreviousData,
        data: publisherPackageResponse = publisherPackagePreviousData,
        error: publisherPackageError,
    } = useQuery<PublisherPackagesForProfileQuery, PublisherPackagesForProfileQueryVariables>(
        PUBLISHER_PACKAGES_FOR_PROFILE,
        {
            variables: {
                page,
                pageSize: MAX_ITEMS_PER_PAGE,
            },
        },
    );

    const strings = useTranslation(profile);

    const packageListRendererParams = useCallback((_, data: PublisherPackage) => ({
        data,
    }), []);

    return (
        <div className={_cs(styles.packages, className)}>
            <h2>
                {strings.packageListLabel}
            </h2>
            <ListView
                className={styles.packageList}
                data={publisherPackageResponse?.publisherPackages?.results}
                keySelector={publisherPackageKeySelector}
                rendererParams={packageListRendererParams}
                renderer={PackageItem}
                pending={publisherPackagePending}
                errored={!!publisherPackageError}
                emptyMessage={strings.noPackagesFound}
                messageShown
                filtered={false}
            />
            <Pager
                activePage={page}
                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                itemsCount={publisherPackageResponse?.publisherPackages?.totalCount ?? 0}
                onActivePageChange={setPage}
                itemsPerPageControlHidden
            />
        </div>
    );
}

export default PublisherPackageList;
