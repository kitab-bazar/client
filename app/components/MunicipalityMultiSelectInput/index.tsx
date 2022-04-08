import React, { useState, useMemo } from 'react';
import {
    SearchMultiSelectInput,
    SearchMultiSelectInputProps,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    MunicipalityOptionsQuery,
    MunicipalityOptionsQueryVariables,
    MunicipalityType,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

export type SearchMunicipalityType = Pick<MunicipalityType, 'id' | 'name'>;

const MUNICIPALITIES = gql`
    query MunicipalityOptions($name: String) {
        municipalities(name: $name) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

type Def = { containerClassName?: string };
type MunicipalityMultiSelectInputProps<K extends string> = SearchMultiSelectInputProps<
    string,
    K,
    SearchMunicipalityType,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keyMultiselector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

const keySelector = (d: SearchMunicipalityType) => d.id;

export function municipalityTitleSelector(m: SearchMunicipalityType) {
    return m.name;
}

// FIXME: remove this component
function MunicipalityMultiSelectInput<K extends string>(
    props: MunicipalityMultiSelectInputProps<K>,
) {
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
    } = useQuery<MunicipalityOptionsQuery, MunicipalityOptionsQueryVariables>(
        MUNICIPALITIES,
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
            labelSelector={municipalityTitleSelector}
            onSearchValueChange={setSearchText}
            searchOptions={data?.municipalities?.results}
            optionsPending={loading}
            totalOptionsCount={data?.municipalities?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default MunicipalityMultiSelectInput;
