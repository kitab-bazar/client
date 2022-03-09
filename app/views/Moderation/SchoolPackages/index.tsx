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
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';

import {
    SchoolPackagesQuery,
    SchoolPackagesQueryVariables,
    SchoolPackageOptionsQuery,
    SchoolPackageOptionsQueryVariables,
} from '#generated/types';

import { enumKeySelector, enumLabelSelector } from '#utils/types';
import useStateWithCallback from '#hooks/useStateWithCallback';

import Actions, { Props as ActionsProps } from './Actions';
import styles from './styles.css';

const SCHOOL_PACKAGE_OPTIONS = gql`
    query SchoolPackageOptions {
        schoolPackageStatusOptions: __type(name: "SchoolPackageStatusEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;

const SCHOOL_PACKAGES = gql`
    query SchoolPackages($ordering: String, $page: Int, $pageSize: Int, $status: [SchoolPackageStatusEnum!]) {
        schoolPackages(ordering: $ordering, page: $page, pageSize: $pageSize, status: $status) {
            results {
                id
                packageId
                status
            }
            totalCount
            page
            pageSize
        }
    }
`;

export type SchoolPackage = NonNullable<NonNullable<SchoolPackagesQuery['schoolPackages']>['results']>[number];

function packageKeySelector(schoolPackage: SchoolPackage) {
    return schoolPackage.id;
}

interface Props {
    className?: string;
}

function SchoolPackages(props: Props) {
    const { className } = props;
    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useStateWithCallback(10, setActivePage);
    const [statusFilter, setStatusFilter] = useState<string | undefined>();

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
        status: statusFilter as SchoolPackagesQueryVariables['status'],
    }), [
        maxItemsPerPage,
        activePage,
        statusFilter,
    ]);

    const {
        data: schoolPackageOptionsQuery,
        loading: schoolPackageOptionsQueryLoading,
    } = useQuery<SchoolPackageOptionsQuery, SchoolPackageOptionsQueryVariables>(
        SCHOOL_PACKAGE_OPTIONS,
    );

    const {
        data: schoolPackagesResponse,
        loading: schoolPackagesLoading,
        error,
    } = useQuery<SchoolPackagesQuery, SchoolPackagesQueryVariables>(
        SCHOOL_PACKAGES,
        { variables },
    );

    const filtered = isDefined(statusFilter);

    const columns = useMemo(() => {
        const actionsColumn: TableColumn<
            SchoolPackage,
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
            cellRendererParams: (_, data) => ({
                data,
                disabled: schoolPackagesLoading,
            }),
        };

        return [
            createStringColumn<SchoolPackage, string>(
                'id',
                'ID',
                (item) => item.id,
                { columnWidth: 50 },
            ),
            createStringColumn<SchoolPackage, string>(
                'packageId',
                'Package ID',
                (item) => item.packageId,
            ),
            createStringColumn<SchoolPackage, string>(
                'status',
                'Status',
                (item) => item.status,
            ),
            actionsColumn,
        ];
    }, [schoolPackagesLoading]);

    return (
        <Container
            className={_cs(styles.schoolPackages, className)}
            heading="School Packages"
            headingSize="small"
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={schoolPackagesResponse?.schoolPackages?.totalCount ?? 0}
                    maxItemsPerPage={maxItemsPerPage}
                    onItemsPerPageChange={setMaxItemsPerPage}
                    onActivePageChange={setActivePage}
                />
            )}
            headerDescriptionClassName={styles.filters}
            headerDescription={(
                <SelectInput
                    className={styles.filterInput}
                    name="status"
                    label="Status"
                    placeholder="All"
                    keySelector={enumKeySelector}
                    labelSelector={enumLabelSelector}
                    options={schoolPackageOptionsQuery?.schoolPackageStatusOptions?.enumValues}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    disabled={schoolPackageOptionsQueryLoading}
                    variant="general"
                />
            )}
        >
            <TableView
                className={styles.table}
                data={schoolPackagesResponse?.schoolPackages?.results}
                keySelector={packageKeySelector}
                emptyMessage="No packages available."
                columns={columns}
                filtered={filtered}
                errored={!!error}
                pending={schoolPackagesLoading}
                erroredEmptyMessage="Failed to fetch packages."
                filteredEmptyMessage="No matching packages found."
                messageShown
            />
        </Container>
    );
}

export default SchoolPackages;
