import React, { useMemo, useState } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import {
    Container,
    Pager,
    SelectInput,
    TableView,
    TableColumn,
    TableHeaderCell,
    TableHeaderCellProps,
    createStringColumn,
    createNumberColumn,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    PublisherPackagesQuery,
    PublisherPackagesQueryVariables,
    PublisherPackageOptionsQuery,
    PublisherPackageOptionsQueryVariables,
} from '#generated/types';

import PublisherSelectInput, { SearchUserType } from '#components/PublisherSelectInput';
import { enumKeySelector, enumLabelSelector } from '#utils/types';
import useStateWithCallback from '#hooks/useStateWithCallback';

import Actions, { Props as ActionsProps } from './Actions';
import styles from './styles.css';

export type PublisherPackage = NonNullable<NonNullable<PublisherPackagesQuery['publisherPackages']>['results']>[number];
function packageKeySelector(publisherPackage: PublisherPackage) {
    return publisherPackage.id;
}
interface Props {
    className?: string;
}

const PUBLISHER_PACKAGE_OPTIONS = gql`
    query PublisherPackageOptions {
        publisherPackageStatusOptions: __type(name: "PublisherPackageStatusEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;

const PUBLISHER_PACKAGES = gql`
    query PublisherPackages($page: Int, $pageSize: Int, $status: [PublisherPackageStatusEnum!], $publishers: [ID!]) {
        publisherPackages(page: $page, pageSize: $pageSize, status: $status, publishers: $publishers) {
            page
            pageSize
            totalCount
            results {
                id
                packageId
                status
                statusDisplay
                totalPrice
                totalQuantity
                incentive
                publisher {
                    id
                    name
                }
                relatedOrders {
                    id
                    statusDisplay
                    totalPrice
                    totalQuantity
                    orderCode
                }
            }
        }
    }
`;

function PublisherPackages(props: Props) {
    const { className } = props;
    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useStateWithCallback(10, setActivePage);
    const [
        statusFilter,
        setStatusFilter,
    ] = useStateWithCallback<string | undefined>(undefined, setActivePage);
    const [
        publisherFilter,
        setPublisherFilter,
    ] = useStateWithCallback<string | undefined>(undefined, setActivePage);
    const [publisherOptions, setPublisherOptions] = useState<SearchUserType[] | undefined | null>();

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
        status: statusFilter as PublisherPackagesQueryVariables['status'],
        publishers: publisherFilter ? [publisherFilter] : undefined,
    }), [
        maxItemsPerPage,
        activePage,
        statusFilter,
        publisherFilter,
    ]);

    const {
        data: publisherPackageOptionsQuery,
        loading: publisherPackageOptionsQueryLoading,
    } = useQuery<PublisherPackageOptionsQuery, PublisherPackageOptionsQueryVariables>(
        PUBLISHER_PACKAGE_OPTIONS,
    );
    const {
        data: publisherPackagesResponse,
        loading: publisherPackagesLoading,
        error,
    } = useQuery<PublisherPackagesQuery, PublisherPackagesQueryVariables>(
        PUBLISHER_PACKAGES,
        { variables },
    );

    const columns = useMemo(() => {
        const actionsColumn: TableColumn<
            PublisherPackage,
            string,
            ActionsProps,
            TableHeaderCellProps
        > = {
            id: 'actions',
            title: '',
            headerCellRenderer: TableHeaderCell,
            headerCellRendererParams: {
                sortable: false,
            },
            cellRenderer: Actions,
            cellRendererClassName: styles.actions,
            cellRendererParams: (_, data) => ({
                data,
                disabled: publisherPackagesLoading,
            }),
            columnWidth: 350,
        };

        return [
            createStringColumn<PublisherPackage, string>(
                'id',
                'ID',
                (item) => item.id,
                { columnWidth: 50 },
            ),
            createStringColumn<PublisherPackage, string>(
                'packageId',
                'Package ID',
                (item) => item.packageId,
            ),
            createStringColumn<PublisherPackage, string>(
                'publisher',
                'Publisher',
                (item) => item.publisher.name,
            ),
            createStringColumn<PublisherPackage, string>(
                'status',
                'Status',
                (item) => item.statusDisplay,
            ),
            createNumberColumn<PublisherPackage, string>(
                'totalPrice',
                'Price',
                (item) => item.totalPrice,
            ),
            createNumberColumn<PublisherPackage, string>(
                'totalQuantity',
                'Quantity',
                (item) => item.totalQuantity,
            ),
            createNumberColumn<PublisherPackage, string>(
                'incentive',
                'Incentive',
                (item) => item.incentive,
            ),
            actionsColumn,
        ];
    }, [publisherPackagesLoading]);

    const filtered = isDefined(statusFilter) || isDefined(publisherFilter);

    return (
        <Container
            className={_cs(styles.publisherPackages, className)}
            heading="Publisher Packages"
            headingSize="small"
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={publisherPackagesResponse?.publisherPackages?.totalCount ?? 0}
                    maxItemsPerPage={maxItemsPerPage}
                    onItemsPerPageChange={setMaxItemsPerPage}
                    onActivePageChange={setActivePage}
                />
            )}
            headerDescriptionClassName={styles.filters}
            headerDescription={(
                <>
                    <SelectInput
                        className={styles.filterInput}
                        name="status"
                        label="Status"
                        placeholder="All"
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={
                            publisherPackageOptionsQuery?.publisherPackageStatusOptions?.enumValues
                        }
                        value={statusFilter}
                        onChange={setStatusFilter}
                        disabled={publisherPackageOptionsQueryLoading}
                        variant="general"
                    />
                    <PublisherSelectInput
                        name="publisher"
                        label="Publisher"
                        variant="general"
                        onChange={setPublisherFilter}
                        value={publisherFilter}
                        options={publisherOptions}
                        onOptionsChange={setPublisherOptions}
                    />
                </>
            )}
        >
            <TableView
                className={styles.table}
                data={publisherPackagesResponse?.publisherPackages?.results}
                keySelector={packageKeySelector}
                emptyMessage="No packages available."
                columns={columns}
                filtered={filtered}
                errored={!!error}
                pending={publisherPackagesLoading}
                erroredEmptyMessage="Failed to fetch packages."
                filteredEmptyMessage="No matching packages found."
                messageShown
            />
        </Container>
    );
}

export default PublisherPackages;
