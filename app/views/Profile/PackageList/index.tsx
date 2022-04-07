import React, { useCallback, useState, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';
import {
    ListView,
    TextOutput,
    Container,
} from '@the-deep/deep-ui';

import useTranslation from '#base/hooks/useTranslation';
import { profile } from '#base/configs/lang';
import NumberOutput from '#components/NumberOutput';
import {
    PublisherPackagesForProfileQuery,
    PublisherPackagesForProfileQueryVariables,
} from '#generated/types';

import styles from './styles.css';

const PUBLISHER_PACKAGES_FOR_PROFILE = gql`
query PublisherPackagesForProfile($publisherIds: [ID!]) {
    publisherPackages(publishers: $publisherIds) {
        totalCount
        results {
            id
            incentive
            status
            statusDisplay
            totalPrice
            totalQuantity
            packageId
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

interface PackageItemProps {
    data: PublisherPackage;
}

function PackageItem(props: PackageItemProps) {
    const {
        packageId,
        statusDisplay,
        totalPrice,
        totalQuantity,
        incentive,
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
            <TextOutput
                label={strings.incentiveLabel}
                value={(
                    <NumberOutput
                        value={incentive}
                        currency
                    />
                )}
            />
        </Container>
    );
}

interface Props {
    className?: string;
    user?: string;
}

function OrderList(props: Props) {
    const {
        className,
        user,
    } = props;

    const [page, setPage] = useState<number>(1);
    useEffect(() => {
        setPage(1);
    }, [user]);

    const {
        loading: publisherPackagePending,
        previousData: publisherPackagePreviousData,
        data: publisherPackageResponse = publisherPackagePreviousData,
    } = useQuery<PublisherPackagesForProfileQuery, PublisherPackagesForProfileQueryVariables>(
        PUBLISHER_PACKAGES_FOR_PROFILE,
    );

    const strings = useTranslation(profile);

    const packageListRendererParams = useCallback((_, data: PublisherPackage) => ({
        data,
    }), []);

    return (
        <div className={styles.packages}>
            <h2>
                {strings.packageListLabel}
            </h2>
            <ListView
                className={styles.packageList}
                data={publisherPackageResponse?.publisherPackages?.results ?? undefined}
                keySelector={publisherPackageKeySelector}
                rendererParams={packageListRendererParams}
                renderer={PackageItem}
                pending={publisherPackagePending}
            />
        </div>
    );
}

export default OrderList;
