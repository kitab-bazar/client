import React, { useMemo, useCallback, useState } from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import {
    ListView,
    TextOutput,
    DateOutput,
    ConfirmButton,
    Button,
    Tag,
    RadioInput,
    TextInput,
    Pager,
    useAlert,
    useModalState,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
    useMutation,
} from '@apollo/client';
import {
    removeNull,
    internal,
} from '@togglecorp/toggle-form';
import {
    IoSearch,
    IoCheckmark,
    IoClose,
} from 'react-icons/io5';

import EmptyMessage from '#components/EmptyMessage';
import ErrorMessage from '#components/ErrorMessage';
import NumberOutput from '#components/NumberOutput';
import useStateWithCallback from '#hooks/useStateWithCallback';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import MunicipalityMultiSelectInput, { SearchMunicipalityType } from '#components/MunicipalityMultiSelectInput';
import DistrictMultiSelectInput, { SearchDistrictType } from '#components/DistrictMultiSelectInput';

import {
    ModerationSchoolListQuery,
    ModerationSchoolListQueryVariables,
    UpdateUserVerificationStatusMutation,
    UpdateUserVerificationStatusMutationVariables,
    UpdateUserActiveStatusMutation,
    UpdateUserActiveStatusMutationVariables,
} from '#generated/types';
import UpdateSchoolModal from './UpdateSchoolModal';

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

type OrderOptionKey = 'date_joined' | '-date_joined';
interface OrderOption {
    key: OrderOptionKey;
    label: string;
}

const orderOptions: OrderOption[] = [
    { key: 'date_joined', label: 'Oldest first' },
    { key: '-date_joined', label: 'Newest first' },
];

const verificationStatusKeySelector = (d: VerificationStatusOption) => d.key;
const verificationStatusLabelSelector = (d: VerificationStatusOption) => d.label;
const orderingKeySelector = (d: OrderOption) => d.key;
const orderingLabelSelector = (d: OrderOption) => d.label;

type OrderMismatchOptionKey = 'all' | 'mismatched';
interface OrderMismatchOption {
    key: OrderMismatchOptionKey,
    label: string;
}

const orderMismatchOptions: OrderMismatchOption[] = [
    { key: 'all', label: 'All' },
    { key: 'mismatched', label: 'Mismatched' },
];
const orderMismatchStatusKeySelector = (d: OrderMismatchOption) => d.key;
const orderMismatchStatusLabelSelector = (d: OrderMismatchOption) => d.label;

const MODERATION_SCHOOL_LIST = gql`
query ModerationSchoolList(
    $pageSize: Int,
    $page: Int,
    $search: String,
    $isVerified: Boolean,
    $orderMismatchUsers: Boolean,
    $ordering: String,
    $districts: [ID!],
    $municipalities: [ID!],
) {
    moderatorQuery {
        users(
            pageSize: $pageSize,
            page: $page,
            search: $search,
            isVerified: $isVerified,
            orderMismatchUsers: $orderMismatchUsers,
            ordering: $ordering,
            userType: SCHOOL_ADMIN,
            districts: $districts,
            municipalities: $municipalities,
        ) {
            totalCount
            results {
               id
                userType
                canonicalName
                email
                phoneNumber
                isVerified
                isDeactivated
                outstandingBalance
                dateJoined
                school {
                    id
                    name
                    localAddress
                    vatNumber
                    panNumber
                    schoolId
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
}
`;

const UPDATE_USER_VERIFICATION_STATUS = gql`
mutation UpdateUserVerificationStatus(
    $userId: ID!,
) {
    moderatorMutation {
        userVerify(id: $userId) {
            ok
            errors
            result {
                id
                isVerified
            }
        }
    }
}
`;
const UPDATE_USER_ACTIVE_STATUS = gql`
mutation UpdateUserActiveStatus(
    $userId: ID!,
    $isDeactivated: Boolean!,
) {
    moderatorMutation {
        userDeactivateToggle(data: {isDeactivated: $isDeactivated}, id: $userId) {
            errors
            ok
            result {
                id
                isDeactivated
            }
        }
    }
}
`;

export type SchoolItemType = NonNullable<NonNullable<NonNullable<ModerationSchoolListQuery['moderatorQuery']>['users']>['results']>[number];
const schoolItemKeySelector = (d: SchoolItemType) => d.id;

interface SchoolItemProps {
    user: SchoolItemType;
    onUserDeactivationSuccess: () => void;
}

function SchoolItem(props: SchoolItemProps) {
    const {
        user,
        onUserDeactivationSuccess,
    } = props;

    const school = user?.school;
    const alert = useAlert();
    const [
        updateSchoolModalShown,
        showUpdateSchoolModal,
        hideUpdateSchoolModal,
    ] = useModalState(false);

    const handleEditSchoolClick = useCallback(() => {
        showUpdateSchoolModal();
    }, [showUpdateSchoolModal]);

    const [
        updateUserVerificationStatus,
        { loading: userVerificationLoading },
    ] = useMutation<
        UpdateUserVerificationStatusMutation,
        UpdateUserVerificationStatusMutationVariables
    >(
        UPDATE_USER_VERIFICATION_STATUS,
        {
            onCompleted: (response) => {
                const userVerify = response?.moderatorMutation?.userVerify;
                if (!userVerify) {
                    return;
                }

                const {
                    errors,
                    ok,
                } = userVerify;

                if (ok) {
                    alert.show(
                        'User verification successful',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const transformedError = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    alert.show(
                        <ErrorMessage
                            header="User Verification Successful"
                            description={
                                isDefined(transformedError)
                                    ? transformedError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header=" Failed to verify user."
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const [
        updateUserActiveStatus,
        { loading: userActiveLoading },
    ] = useMutation<
        UpdateUserActiveStatusMutation,
        UpdateUserActiveStatusMutationVariables
    >(
        UPDATE_USER_ACTIVE_STATUS,
        {
            onCompleted: (response) => {
                const userDeactivateToggle = response?.moderatorMutation?.userDeactivateToggle;
                if (!userDeactivateToggle) {
                    return;
                }

                const {
                    errors,
                    ok,
                } = userDeactivateToggle;

                if (ok) {
                    onUserDeactivationSuccess();
                    alert.show(
                        'User deactivated successfully',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const transformedError = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    alert.show(
                        <ErrorMessage
                            header="Failed to deactivate the account"
                            description={
                                isDefined(transformedError)
                                    ? transformedError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header="Failed to deactivate the account."
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleVerifyButtonClick = useCallback(() => {
        updateUserVerificationStatus({
            variables: {
                userId: user.id,
            },
        });
    }, [user, updateUserVerificationStatus]);

    const handleActiveButtonClick = useCallback(() => {
        updateUserActiveStatus({
            variables: {
                isDeactivated: true,
                userId: user.id,
            },
        });
    }, [user, updateUserActiveStatus]);

    if (!school) {
        return null;
    }

    return (
        <div className={styles.schoolItem}>
            <div className={styles.details}>
                <div className={styles.nameAndAddress}>
                    <div className={styles.name}>
                        {school.name}
                    </div>
                    <div className={styles.address}>
                        {school.localAddress && (
                            <div>
                                {school.localAddress}
                            </div>
                        )}
                        {`
                            ${school.municipality.name}-${school.wardNumber},
                            ${school.municipality.district.name}
                        `}
                    </div>
                </div>
                <TextOutput
                    block
                    label="Phone No."
                    className={styles.phoneNumber}
                    labelContainerClassName={styles.label}
                    value={(
                        <a
                            className={styles.phoneLink}
                            href={`tel:${user.phoneNumber}`}
                        >
                            {user.phoneNumber}
                        </a>
                    )}
                    hideLabelColon
                />
                <TextOutput
                    block
                    label="Email"
                    className={styles.email}
                    labelContainerClassName={styles.label}
                    value={(
                        <a
                            className={styles.emailLink}
                            href={`mailto:${user.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {user.email}
                        </a>
                    )}
                    hideLabelColon
                />
                <TextOutput
                    block
                    label="Created At"
                    className={styles.createdAt}
                    labelContainerClassName={styles.label}
                    value={(
                        <DateOutput
                            format="dd-MM-yyyy"
                            value={user.dateJoined}
                        />
                    )}
                    hideLabelColon
                />
                <TextOutput
                    block
                    className={styles.panNumber}
                    label="PAN"
                    value={school.panNumber}
                    hideLabelColon
                    labelContainerClassName={styles.label}
                />
                <TextOutput
                    block
                    className={styles.schoolId}
                    label="School ID"
                    value={school.schoolId}
                    hideLabelColon
                    labelContainerClassName={styles.label}
                />
                <TextOutput
                    block
                    className={styles.outstandingBalance}
                    label="Outstanding Balance"
                    value={(
                        <NumberOutput
                            value={user.outstandingBalance}
                            currency
                        />
                    )}
                    hideLabelColon
                    labelContainerClassName={styles.label}
                />
            </div>
            <div className={styles.actions}>
                <Button
                    name={undefined}
                    onClick={handleEditSchoolClick}
                    variant="primary"
                >
                    Edit School
                </Button>
                {user.isVerified ? (
                    <Tag
                        icons={<IoCheckmark />}
                    >
                        Verified
                    </Tag>
                ) : (
                    <ConfirmButton
                        name={undefined}
                        variant="tertiary"
                        onConfirm={handleVerifyButtonClick}
                        disabled={userVerificationLoading}
                        message={(
                            <>
                                <div>
                                    Are you sure to mark following school as verified?
                                </div>
                                <strong>
                                    {user?.school?.name}
                                </strong>
                            </>
                        )}
                    >
                        Verify
                    </ConfirmButton>
                )}
                {user.isDeactivated || user.isVerified ? (
                    <></>
                ) : (
                    <ConfirmButton
                        name={undefined}
                        variant="tertiary"
                        onConfirm={handleActiveButtonClick}
                        disabled={userActiveLoading}
                        message={(
                            <>
                                <div>
                                    Are you sure to deactivate the account?
                                </div>
                                <strong>
                                    {user?.school?.name}
                                </strong>
                            </>
                        )}
                    >
                        Deactivate
                    </ConfirmButton>
                )}
            </div>
            {updateSchoolModalShown && (
                <UpdateSchoolModal
                    school={school}
                    onModalClose={hideUpdateSchoolModal}
                />
            )}
        </div>
    );
}

interface Props {
    className?: string;
}

function Schools(props: Props) {
    const { className } = props;

    const [activePage, setActivePage] = React.useState<number>(1);
    const [mismatchStatus, setMismatchStatus] = useStateWithCallback<OrderMismatchOption['key']>('all', setActivePage);
    const [verified, setVerified] = useStateWithCallback<VerificationStatusOption['key']>(
        'all',
        setActivePage,
    );
    const [ordering, setOrdering] = useStateWithCallback<OrderOption['key']>(
        'date_joined',
        setActivePage,
    );
    const [search, setSearch] = useStateWithCallback<string | undefined>(undefined, setActivePage);
    const [maxItemsPerPage, setMaxItemsPerPage] = useStateWithCallback<number>(10, setActivePage);
    const [
        districtFilter,
        setDistrictFilter,
    ] = useStateWithCallback<string[] | undefined>(undefined, setActivePage);
    const [
        municipalityFilter,
        setMunicipalityFilter,
    ] = useStateWithCallback<string[] | undefined>(undefined, setActivePage);
    const [
        municipalityOptions,
        setMunicipalityOptions,
    ] = useState<SearchMunicipalityType[] | undefined | null>();
    const [
        districtOptions,
        setDistrictOptions,
    ] = useState<SearchDistrictType[] | undefined | null>();

    const isVerifiedFilter = useMemo(() => {
        if (verified === 'verified') {
            return true;
        }

        if (verified === 'unverified') {
            return false;
        }

        return undefined;
    }, [verified]);

    const isMismatchedFilter = useMemo(() => {
        if (mismatchStatus === 'mismatched') {
            return true;
        }

        return undefined;
    }, [mismatchStatus]);

    const variables = useMemo(() => ({
        pageSize: maxItemsPerPage,
        page: activePage,
        search,
        ordering,
        isVerified: isVerifiedFilter,
        orderMismatchUsers: isMismatchedFilter,
        districts: districtFilter,
        municipalities: municipalityFilter,
    }), [
        activePage,
        isMismatchedFilter,
        isVerifiedFilter,
        maxItemsPerPage,
        ordering,
        search,
        districtFilter,
        municipalityFilter,
    ]);

    const {
        previousData,
        data = previousData,
        loading,
        error,
        refetch,
    } = useQuery<ModerationSchoolListQuery, ModerationSchoolListQueryVariables>(
        MODERATION_SCHOOL_LIST,
        {
            variables,
        },
    );

    const handleSchoolDeactivation = useCallback(() => {
        refetch();
    }, [refetch]);

    const schoolItemRendererParams = useCallback(
        (_: string, user: SchoolItemType): SchoolItemProps => ({
            user,
            onUserDeactivationSuccess: handleSchoolDeactivation,
        }),
        [handleSchoolDeactivation],
    );

    const handleSearchClear = useCallback(() => {
        setSearch(undefined);
    }, [setSearch]);

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
                    actions={search && (
                        <Button
                            onClick={handleSearchClear}
                            variant="action"
                            name={undefined}
                            title="Clear"
                        >
                            <IoClose />
                        </Button>
                    )}
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
                <RadioInput
                    label="Order Payment Mismatch Status"
                    name={undefined}
                    options={orderMismatchOptions}
                    keySelector={orderMismatchStatusKeySelector}
                    labelSelector={orderMismatchStatusLabelSelector}
                    value={mismatchStatus}
                    onChange={setMismatchStatus}
                />
                <RadioInput
                    label="Order by"
                    name={undefined}
                    options={orderOptions}
                    keySelector={orderingKeySelector}
                    labelSelector={orderingLabelSelector}
                    value={ordering}
                    onChange={setOrdering}
                />
                <MunicipalityMultiSelectInput
                    name="municipalities"
                    label="Municipalities"
                    variant="general"
                    onChange={setMunicipalityFilter}
                    value={municipalityFilter}
                    options={municipalityOptions}
                    onOptionsChange={setMunicipalityOptions}
                />
                <DistrictMultiSelectInput
                    name="districts"
                    label="Districts"
                    variant="general"
                    onChange={setDistrictFilter}
                    value={districtFilter}
                    options={districtOptions}
                    onOptionsChange={setDistrictOptions}
                />
            </div>
            <ListView
                className={styles.schoolItemList}
                data={data?.moderatorQuery?.users?.results ?? undefined}
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
                className={styles.pager}
                activePage={activePage}
                maxItemsPerPage={maxItemsPerPage}
                itemsCount={data?.moderatorQuery?.users?.totalCount ?? 0}
                onActivePageChange={setActivePage}
                onItemsPerPageChange={setMaxItemsPerPage}
            />
        </div>
    );
}

export default Schools;
