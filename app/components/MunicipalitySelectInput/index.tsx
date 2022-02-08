import React, { useState, useMemo } from 'react';
import {
    SearchSelectInput,
    SearchSelectInputProps,
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
type MunicipalitySelectInputProps<K extends string> = SearchSelectInputProps<
    string,
    K,
    SearchMunicipalityType,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

const keySelector = (d: SearchMunicipalityType) => d.id;

export function municipalityTitleSelector(m: SearchMunicipalityType) {
    return m.name;
}

function MunicipalitySelectInput<K extends string>(props: MunicipalitySelectInputProps<K>) {
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
        <SearchSelectInput
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

export default MunicipalitySelectInput;
