import React, { useState, useMemo } from 'react';
import {
    SearchMultiSelectInput,
    SearchMultiSelectInputProps,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    DistrictOptionsQuery,
    DistrictOptionsQueryVariables,
    DistrictType,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

export type SearchDistrictType = Pick<DistrictType, 'id' | 'name'>;

const DISTRICTS = gql`
    query DistrictOptions($name: String) {
        districts(name: $name) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

type Def = { containerClassName?: string };
type DistrictMultiSelectInputProps<K extends string> = SearchMultiSelectInputProps<
    string,
    K,
    SearchDistrictType,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

const keySelector = (d: SearchDistrictType) => d.id;

export function districtTitleSelector(m: SearchDistrictType) {
    return m.name;
}

// FIXME: remove this component
function DistrictMultiSelectInput<K extends string>(props: DistrictMultiSelectInputProps<K>) {
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
    } = useQuery<DistrictOptionsQuery, DistrictOptionsQueryVariables>(
        DISTRICTS,
        {
            variables,
            skip: !opened,
        },
    );

    return (
        <SearchMultiSelectInput
            {...otherProps}
            className={className}
            keySelector={keySelector}
            labelSelector={districtTitleSelector}
            onSearchValueChange={setSearchText}
            searchOptions={data?.districts?.results}
            optionsPending={loading}
            totalOptionsCount={data?.districts?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default DistrictMultiSelectInput;
