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
    InstitutionOptionsQuery,
    InstitutionOptionsQueryVariables,
    UserType,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

export type SearchUserType = Pick<UserType, 'id' | 'canonicalName'>;

const INSTITUTIONS = gql`
query InstitutionOptions($search: String) {
    moderatorQuery {
        users(search: $search, userType: INSTITUTIONAL_USER) {
            results {
                id
                canonicalName
            }
            totalCount
        }
    }
}
`;

type Def = { containerClassName?: string };
type InstitutionSelectInputProps<K extends string> = SearchSelectInputProps<
    string,
    K,
    SearchUserType,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

const keySelector = (d: SearchUserType) => d.id;

export function userTitleSelector(user: SearchUserType) {
    return user.canonicalName;
}

function InstitutionSelectInput<K extends string>(props: InstitutionSelectInputProps<K>) {
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
    } = useQuery<InstitutionOptionsQuery, InstitutionOptionsQueryVariables>(
        INSTITUTIONS,
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
            searchOptions={data?.moderatorQuery?.users?.results}
            optionsPending={loading}
            totalOptionsCount={data?.moderatorQuery?.users?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default InstitutionSelectInput;
