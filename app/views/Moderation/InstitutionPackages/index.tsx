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
    InstitutionPackagesQuery,
    InstitutionPackagesQueryVariables,
    InstitutionPackageOptionsQuery,
    InstitutionPackageOptionsQueryVariables,
} from '#generated/types';

import InstitutionSelectInput, { SearchUserType } from '#components/InstitutionSelectInput';
import { enumKeySelector, enumLabelSelector } from '#utils/types';
import useStateWithCallback from '#hooks/useStateWithCallback';

import Actions, { Props as ActionsProps } from './Actions';
import styles from './styles.css';

const INSTITUTION_PACKAGE_OPTIONS = gql`
    query InstitutionPackageOptions {
        institutionPackageStatusOptions: __type(name: "InstitutionPackageStatusEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;

const INSTITUTION_PACKAGES = gql`
    query InstitutionPackages($ordering: String, $page: Int, $pageSize: Int, $status: [InstitutionPackageStatusEnum!], $institutions: [ID!]) {
        institutionPackages(ordering: $ordering, page: $page, pageSize: $pageSize, status: $status, institutions: $institutions) {
            results {
                id
                packageId
                statusDisplay
                status
                institution {
                    canonicalName
                    id
                }
                totalPrice
                totalQuantity
                relatedOrders {
                    id
                    orderCode
                    statusDisplay
                    totalPrice
                    totalQuantity
                }
            }
            totalCount
            page
            pageSize
        }
    }
`;

export type InstitutionPackage = NonNullable<NonNullable<InstitutionPackagesQuery['institutionPackages']>['results']>[number];

function packageKeySelector(institutionPackage: InstitutionPackage) {
    return institutionPackage.id;
}

interface Props {
    className?: string;
}

function InstitutionPackages(props: Props) {
    const { className } = props;
    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useStateWithCallback(10, setActivePage);
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [institutionFilter, setInstitutionFilter] = useState<string | undefined>();
    const [
        institutionOptions,
        setInstitutionOptions,
    ] = useState<SearchUserType[] | undefined | null>();

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
        status: statusFilter as InstitutionPackagesQueryVariables['status'],
        institutions: institutionFilter ? [institutionFilter] : undefined,
    }), [
        maxItemsPerPage,
        activePage,
        statusFilter,
        institutionFilter,
    ]);

    const {
        data: institutionPackageOptionsQuery,
        loading: institutionPackageOptionsQueryLoading,
    } = useQuery<InstitutionPackageOptionsQuery, InstitutionPackageOptionsQueryVariables>(
        INSTITUTION_PACKAGE_OPTIONS,
    );

    const {
        data: institutionPackagesResponse,
        loading: institutionPackagesLoading,
        error,
    } = useQuery<InstitutionPackagesQuery, InstitutionPackagesQueryVariables>(
        INSTITUTION_PACKAGES,
        { variables },
    );

    const filtered = isDefined(statusFilter) || isDefined(institutionFilter);

    const columns = useMemo(() => {
        const actionsColumn: TableColumn<
            InstitutionPackage,
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
                disabled: institutionPackagesLoading,
            }),
            columnWidth: 350,
        };

        return [
            createStringColumn<InstitutionPackage, string>(
                'id',
                'ID',
                (item) => item.id,
                { columnWidth: 50 },
            ),
            createStringColumn<InstitutionPackage, string>(
                'packageId',
                'Package ID',
                (item) => item.packageId,
            ),
            createStringColumn<InstitutionPackage, string>(
                'institution',
                'Institution',
                (item) => item.institution.canonicalName,
            ),
            createStringColumn<InstitutionPackage, string>(
                'status',
                'Status',
                (item) => item.statusDisplay,
            ),
            createNumberColumn<InstitutionPackage, string>(
                'totalPrice',
                'Price',
                (item) => item.totalPrice,
            ),
            createNumberColumn<InstitutionPackage, string>(
                'totalQuantity',
                'Quantity',
                (item) => item.totalQuantity,
            ),
            actionsColumn,
        ];
    }, [institutionPackagesLoading]);

    return (
        <Container
            className={_cs(styles.institutionPackages, className)}
            heading="Institution Packages"
            headingSize="small"
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={institutionPackagesResponse?.institutionPackages?.totalCount ?? 0}
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
                        options={institutionPackageOptionsQuery
                            ?.institutionPackageStatusOptions?.enumValues}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        disabled={institutionPackageOptionsQueryLoading}
                        variant="general"
                    />
                    <InstitutionSelectInput
                        name="institution"
                        label="Institution"
                        variant="general"
                        onChange={setInstitutionFilter}
                        value={institutionFilter}
                        options={institutionOptions}
                        onOptionsChange={setInstitutionOptions}
                    />
                </>
            )}
        >
            <TableView
                className={styles.table}
                data={institutionPackagesResponse?.institutionPackages?.results}
                keySelector={packageKeySelector}
                emptyMessage="No packages available."
                columns={columns}
                filtered={filtered}
                errored={!!error}
                pending={institutionPackagesLoading}
                erroredEmptyMessage="Failed to fetch packages."
                filteredEmptyMessage="No matching packages found."
                messageShown
            />
        </Container>
    );
}

export default InstitutionPackages;
