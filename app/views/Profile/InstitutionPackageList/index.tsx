import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    Pager,
    ListView,
    TextOutput,
    Container,
} from '@the-deep/deep-ui';

import useTranslation from '#base/hooks/useTranslation';
import { profile } from '#base/configs/lang';
import NumberOutput from '#components/NumberOutput';
import {
    InstitutionalPackagesForProfileQuery,
    InstitutionalPackagesForProfileQueryVariables,
} from '#generated/types';

import styles from './styles.css';

const INSTITUTIONAL_PACKAGES_FOR_PROFILE = gql`
query InstitutionalPackagesForProfile(
    $institutionIds: [ID!],
    $page: Int,
    $pageSize: Int,
) {
    institutionPackages(
        institutions: $institutionIds,
        page: $page,
        pageSize: $pageSize
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
            institutionPackageBooks {
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

export type InstitutionPackage = NonNullable<NonNullable<InstitutionalPackagesForProfileQuery['institutionPackages']>['results']>[number];

const institutionPackageKeySelector = (p: InstitutionPackage) => p.id;
const MAX_ITEMS_PER_PAGE = 10;

interface PackageItemProps {
    data: InstitutionPackage;
}

function PackageItem(props: PackageItemProps) {
    const {
        packageId,
        statusDisplay,
        totalPrice,
        totalQuantity,
    } = props.data;

    const strings = useTranslation(profile);

    return (
        <Container
            className={styles.packageItem}
            heading={(
                <TextOutput
                    label={strings.packageIdLabel}
                    value={packageId}
                />
            )}
            headingSize="extraSmall"
            headerActions={(
                <TextOutput
                    label={strings.status}
                    value={statusDisplay}
                />
            )}
            headerActionsContainerClassName={styles.status}
        >
            <TextOutput
                label={strings.booksCountLabel}
                value={(
                    <NumberOutput
                        value={totalQuantity}
                    />
                )}
            />
            <TextOutput
                label={strings.totalPriceLabel}
                value={(
                    <NumberOutput
                        value={totalPrice}
                        currency
                    />
                )}
            />
        </Container>
    );
}

interface Props {
    institutionId: string;
}
function InstitutionPackageList(props: Props) {
    const {
        institutionId,
    } = props;

    const [page, setPage] = useState<number>(1);
    useEffect(() => {
        setPage(1);
    }, []);

    const {
        loading: institutionPackagePending,
        previousData: institutionPackagePreviousData,
        data: institutionPackageResponse = institutionPackagePreviousData,
        error: institutionPackageError,
    } = useQuery<
        InstitutionalPackagesForProfileQuery,
        InstitutionalPackagesForProfileQueryVariables
    >(
        INSTITUTIONAL_PACKAGES_FOR_PROFILE,
        {
            variables: {
                institutionIds: [institutionId],
                page,
                pageSize: MAX_ITEMS_PER_PAGE,
            },
        },
    );

    const strings = useTranslation(profile);

    const packageListRendererParams = useCallback((_, data: InstitutionPackage) => ({
        data,
    }), []);

    return (
        <div className={styles.packages}>
            <h2>
                {strings.packageListLabel}
            </h2>
            <ListView
                className={styles.packageList}
                data={institutionPackageResponse?.institutionPackages?.results}
                keySelector={institutionPackageKeySelector}
                rendererParams={packageListRendererParams}
                renderer={PackageItem}
                pending={institutionPackagePending}
                errored={!!institutionPackageError}
                filtered={false}
            />
            <Pager
                activePage={page}
                onActivePageChange={setPage}
                maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                itemsCount={institutionPackageResponse?.institutionPackages?.totalCount ?? 0}
                itemsPerPageControlHidden
            />
        </div>
    );
}

export default InstitutionPackageList;
