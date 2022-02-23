import React, { useState, useMemo } from 'react';
import {
    SearchSelectInput,
    SearchSelectInputProps,
} from '@the-deep/deep-ui';
import {
    useQuery,
    gql,
} from '@apollo/client';
import {
    SchoolOptionsQuery,
    SchoolOptionsQueryVariables,
    UserType,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

export type SearchUserType = Pick<UserType, 'id' | 'fullName'>;

const SCHOOLS = gql`
    query SchoolOptions($search: String) {
        users(search: $search, userType: SCHOOL_ADMIN) {
            results {
                id
                fullName
            }
            totalCount
        }
    }
`;

type Def = { containerClassName?: string };
type SchoolSelectInputProps<K extends string> = SearchSelectInputProps<
    string,
    K,
    SearchUserType,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

const keySelector = (d: SearchUserType) => d.id;

export function userTitleSelector(user: SearchUserType) {
    // FIXME: use canonicalName
    return user.fullName || 'Server will fix this';
}

function SchoolSelectInput<K extends string>(props: SchoolSelectInputProps<K>) {
    const {
        className,
        ...otherProps
    } = props;

    const [opened, setOpened] = useState(false);
    const [searchText, setSearchText] = useState<string>('');
    const debouncedSearchText = useDebouncedValue(searchText);

    const variables = useMemo(() => ({
        search: debouncedSearchText,
    }), [debouncedSearchText]);

    const {
        previousData,
        data = previousData,
        loading,
    } = useQuery<SchoolOptionsQuery, SchoolOptionsQueryVariables>(
        SCHOOLS,
        {
            variables,
            skip: !opened,
        },
    );

    return (
        <SearchSelectInput
            {...otherProps}
            className={className}
            keySelector={keySelector}
            labelSelector={userTitleSelector}
            onSearchValueChange={setSearchText}
            searchOptions={data?.users?.results}
            optionsPending={loading}
            totalOptionsCount={data?.users?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default SchoolSelectInput;
