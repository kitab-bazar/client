import React from 'react';
import { useQuery, gql } from '@apollo/client';
import {
    useInputState,
    SelectInput,
} from '@the-deep/deep-ui';

import {
    ProvinceListQuery,
    ProvinceListQueryVariables,
    DistrictListQuery,
    DistrictListQueryVariables,
    MunicipalityListQuery,
    MunicipalityListQueryVariables,
} from '#generated/types';

// import styles from './styles.css';

const PROVINCE_LIST = gql`
    query ProvinceList {
        provinces {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

const DISTRICT_LIST = gql`
    query DistrictList($provinceIds: [ID!]) {
        districts(provinces: $provinceIds) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

const MUNICIPALITY_LIST = gql`
    query MunicipalityList(
        $provinceIds: [ID!],
        $districtIds: [ID!],
    ) {
        municipalities(
            provinces: $provinceIds,
            districts: $districtIds,
        ) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

type Province = NonNullable<NonNullable<ProvinceListQuery['provinces']>['results']>[number];
type District = NonNullable<NonNullable<DistrictListQuery['districts']>['results']>[number];
type Municipality = NonNullable<NonNullable<MunicipalityListQuery['municipalities']>['results']>[number];

const provinceKeySelector = (d: Province) => d.id;
const provinceLabelSelector = (d: Province) => d.name;

const districtKeySelector = (d: District) => d.id;
const districtLabelSelector = (d: District) => d.name;

const municipalityKeySelector = (d: Municipality) => d.id;
const municipalityLabelSelector = (d: Municipality) => d.name;

interface Props<K extends string> {
    name: K;
    onChange: (value: Municipality['id'] | undefined, name: K) => void;
    value: Municipality['id'] | undefined;
    error?: string;
}

function LocationInput<K extends string>(props: Props<K>) {
    const {
        name,
        onChange,
        value,
        error,
    } = props;

    const {
        data: provinceList,
        loading: provincesPending,
    } = useQuery<ProvinceListQuery, ProvinceListQueryVariables>(
        PROVINCE_LIST,
    );

    const [province, setProvince] = useInputState<Province['id'] | undefined>(undefined);
    const [district, setDistrict] = useInputState<District['id'] | undefined>(undefined);
    const [municipality, setMunicipality] = useInputState<Municipality['id'] | undefined>(undefined);

    React.useEffect(() => {
        if (onChange) {
            onChange(municipality, name);
        }
    }, [name, onChange, municipality]);

    React.useEffect(() => {
        setMunicipality(value);
    }, [value, setMunicipality]);

    const districtVariables = React.useMemo(() => ({
        provinceIds: province ? [province] : undefined,
    }), [province]);

    const {
        data: districtList,
        loading: districtsPending,
    } = useQuery<DistrictListQuery, DistrictListQueryVariables>(
        DISTRICT_LIST,
        { variables: districtVariables },
    );

    const municipalityVariables = React.useMemo(() => ({
        provinceIds: province ? [province] : undefined,
        districtIds: district ? [district] : undefined,
    }), [province, district]);

    const {
        data: municipalityList,
        loading: municipalitiesPending,
    } = useQuery<MunicipalityListQuery, MunicipalityListQueryVariables>(
        MUNICIPALITY_LIST,
        { variables: municipalityVariables },
    );

    return (
        <>
            <SelectInput
                label="Province"
                name="province"
                options={provinceList?.provinces?.results}
                keySelector={provinceKeySelector}
                labelSelector={provinceLabelSelector}
                value={province}
                onChange={setProvince}
                disabled={provincesPending}
            />
            <SelectInput
                label="District"
                name="district"
                options={districtList?.districts?.results}
                keySelector={districtKeySelector}
                labelSelector={districtLabelSelector}
                value={district}
                onChange={setDistrict}
                disabled={districtsPending}
            />
            <SelectInput
                label="Municipality"
                name={municipality}
                options={municipalityList?.municipalities?.results}
                keySelector={municipalityKeySelector}
                labelSelector={municipalityLabelSelector}
                value={municipality}
                onChange={setMunicipality}
                disabled={municipalitiesPending}
                error={error}
            />
        </>
    );
}

export default LocationInput;
