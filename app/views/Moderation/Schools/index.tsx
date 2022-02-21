import React from 'react';
import {
    _cs,
} from '@togglecorp/fujs';
import {
    ListView,
    TextOutput,
    ConfirmButton,
    RadioInput,
    useInputState,
    TextInput,
    Pager,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { IoSearch } from 'react-icons/io5';

import EmptyMessage from '#components/EmptyMessage';

import {
    SchoolListQuery,
    SchoolListQueryVariables,
} from '#generated/types';

import styles from './styles.css';

type VerificationStatusOptionKey = 'all' | 'verified' | 'unverified';
interface VerificationStatusOption {
    key: VerificationStatusOptionKey,
    label: string;
}

const verificationStatusOptions: VerificationStatusOption[] = [
    { key: 'all', label: 'All' },
    { key: 'verified', label: 'Verified' },
    { key: 'unverified', label: 'Unverified' },
];

const verificationStatusKeySelector = (d: VerificationStatusOption) => d.key;
const verificationStatusLabelSelector = (d: VerificationStatusOption) => d.label;

// TODO: Filter by user type school

const SCHOOL_LIST = gql`
query SchoolList(
    $pageSize: Int,
    $page: Int,
    $search: String,
) {
    users(
        pageSize: $pageSize,
        page: $page,
        fullName: $search,
    ) {
        totalCount
        results {
            id
            userType
            school {
                id
                name
                localAddress
                vatNumber
                panNumber
                wardNumber
                municipality {
                    id
                    name
                    district {
                        id
                        name
                    }
                }
            }
        }
    }
}
`;

type SchoolItem = NonNullable<NonNullable<SchoolListQuery['users']>['results']>[number];
const schoolItemKeySelector = (d: SchoolItem) => d.id;

interface SchoolItemProps {
    user: SchoolItem;
}

function SchoolItem(props: SchoolItemProps) {
    const {
        user,
    } = props;

    const school = user?.school;

    if (!school) {
        return null;
    }

    return (
        <div className={styles.schoolItem}>
            <div className={styles.nameAndAddress}>
                <div className={styles.name}>
                    {school.name}
                </div>
                <div className={styles.address}>
                    {`
                        ${school.municipality.name}-${school.wardNumber},
                        ${school.municipality.district.name},
                        ${school.localAddress}
                    `}
                </div>
            </div>
            <TextOutput
                block
                className={styles.panNumber}
                label="PAN"
                value={school.panNumber}
            />
            <div>
                <ConfirmButton
                    name={undefined}
                    variant="tertiary"
                >
                    Verify
                </ConfirmButton>
            </div>
        </div>
    );
}

const MAX_ITEMS_PER_PAGE = 10;

interface Props {
    className?: string;
}

function Schools(props: Props) {
    const { className } = props;

    const [activePage, setActivePage] = React.useState<number>(1);
    const [verified, setVerified] = useInputState<VerificationStatusOption['key']>('all');
    const [search, setSearch] = useInputState<string | undefined>(undefined);
    const [maxItemsPerPage, setMaxItemsPerPage] = useInputState<number>(10);

    const {
        data,
        loading,
        error,
    } = useQuery<SchoolListQuery, SchoolListQueryVariables>(
        SCHOOL_LIST,
        {
            variables: {
                pageSize: MAX_ITEMS_PER_PAGE,
                page: activePage,
                search,
            },
        },
    );

    const schoolItemRendererParams = React.useCallback(
        (_: string, user: SchoolItem): SchoolItemProps => ({
            user,
        }),
        [],
    );

    return (
        <div
            className={_cs(styles.schools, className)}
        >
            <div className={styles.filters}>
                <TextInput
                    name={undefined}
                    icons={<IoSearch />}
                    value={search}
                    onChange={setSearch}
                    variant="general"
                    label="Search by School Name"
                    type="search"
                />
                <RadioInput
                    label="Verification Status"
                    name={undefined}
                    options={verificationStatusOptions}
                    keySelector={verificationStatusKeySelector}
                    labelSelector={verificationStatusLabelSelector}
                    value={verified}
                    onChange={setVerified}
                />
            </div>
            <ListView
                className={styles.schoolItemList}
                data={data?.users?.results ?? undefined}
                pending={loading}
                rendererParams={schoolItemRendererParams}
                renderer={SchoolItem}
                keySelector={schoolItemKeySelector}
                errored={!!error}
                filtered={false}
                messageShown
                emptyMessage={(
                    <EmptyMessage
                        message="Couldn't find any user"
                        suggestion="There aren't any user at the moment"
                    />
                )}
            />
            <Pager
                activePage={activePage}
                maxItemsPerPage={maxItemsPerPage}
                itemsCount={data?.users?.totalCount ?? 0}
                onActivePageChange={setActivePage}
                onItemsPerPageChange={setMaxItemsPerPage}
            />
        </div>
    );
}

export default Schools;
