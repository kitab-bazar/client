import React, { useState, useMemo } from 'react';
import {
    SearchSelectInput,
    SearchSelectInputProps,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    SchoolOptionsQuery,
    SchoolOptionsQueryVariables,
    SchoolType,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

export type SearchSchoolType = Pick<SchoolType, 'id' | 'name'>;

const SCHOOLS = gql`
    query SchoolOptions($name: String) {
        schools(name: $name) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

type Def = { containerClassName?: string };
type SchoolSelectInputProps<K extends string> = SearchSelectInputProps<
    string,
    K,
    SearchSchoolType,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

const keySelector = (d: SearchSchoolType) => d.id;

export function schoolTitleSelector(school: SearchSchoolType) {
    return school.name;
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
        name: debouncedSearchText,
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
            labelSelector={schoolTitleSelector}
            onSearchValueChange={setSearchText}
            searchOptions={data?.schools?.results}
            optionsPending={loading}
            totalOptionsCount={data?.schools?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default SchoolSelectInput;
