import React, { useCallback, useMemo } from 'react';

import { useQuery, useMutation, gql } from '@apollo/client';

import {
    TextInput,
    NumberInput,
    SelectInput,
    PasswordInput,
    Button,
    useInputState,
    useAlert,
} from '@the-deep/deep-ui';

import {
    ObjectSchema,
    PartialForm,
    emailCondition,
    requiredStringCondition,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    useForm,
    getErrorObject,
    createSubmitHandler,
    removeNull,
    requiredCondition,
} from '@togglecorp/toggle-form';

import {
    UserUserType,
    RegisterInstitutionMutation,
    RegisterInstitutionMutationVariables,
    ProvinceListQuery,
    ProvinceListQueryVariables,
    DistrictListQuery,
    DistrictListQueryVariables,
    MunicipalityListQuery,
    MunicipalityListQueryVariables,
} from '#generated/types';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

import styles from './styles.css';

const REGISTER = gql`
    mutation RegisterInstitution(
        $email: String!
        $name: String
        $password: String!
        $phoneNumber: String
        $userType: user_type
        $institution: InstitutionInputType!
    ) {
        register(data: {
            email: $email
            firstName: $name
            lastName: $name
            password: $password
            phoneNumber: $phoneNumber
            userType: $userType
            institution: $institution
        }) {
            errors
            ok
        }
    }
`;

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

interface InstitutionalRegistrationFields {
    email: string;
    name: string;
    password: string;
    verifyPassword: string;
    userType: UserUserType;
    wardNumber: number;
    panNumber: string;
    vatNumber: string;
    province: string;
    district: string;
    municipality: string;
    localAddress: string;
    phoneNumber: string;
}

type FormType = Partial<InstitutionalRegistrationFields>;
type FormSchema = ObjectSchema<PartialForm<FormType>>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: [emailCondition, requiredStringCondition],
        name: [requiredStringCondition],
        password: [
            requiredStringCondition,
            lengthGreaterThanCondition(4),
            lengthSmallerThanCondition(129),
        ],
        wardNumber: [requiredCondition],
        panNumber: [requiredCondition],
        vatNumber: [requiredCondition],
        province: [requiredStringCondition],
        district: [requiredStringCondition],
        municipality: [requiredStringCondition],
        localAddress: [],
        phoneNumber: [
            requiredStringCondition,
            lengthGreaterThanCondition(9),
            lengthSmallerThanCondition(15),
        ],
    }),
};

const initialValue: FormType = {
    userType: 'INSTITUTIONAL_USER',
};

type Province = NonNullable<NonNullable<ProvinceListQuery['provinces']>['results']>[number];
type District = NonNullable<NonNullable<DistrictListQuery['districts']>['results']>[number];
type Municipality = NonNullable<NonNullable<MunicipalityListQuery['municipalities']>['results']>[number];

const provinceKeySelector = (d: Province) => d.id;
const provinceLabelSelector = (d: Province) => d.name;

const districtKeySelector = (d: District) => d.id;
const districtLabelSelector = (d: District) => d.name;

const municipalityKeySelector = (d: Municipality) => d.id;
const municipalityLabelSelector = (d: Municipality) => d.name;

function InstitutionForm() {
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const alert = useAlert();

    const error = getErrorObject(riskyError);
    const [confirmPassword, setConfirmPassword] = useInputState<string | undefined>(undefined);

    const {
        data: provinceList,
        loading: provincesPending,
    } = useQuery<ProvinceListQuery, ProvinceListQueryVariables>(
        PROVINCE_LIST,
    );

    const districtVariables = useMemo(() => ({
        provinceIds: value?.province ? [value.province] : undefined,
    }), [value?.province]);

    const {
        data: districtList,
        loading: districtsPending,
    } = useQuery<DistrictListQuery, DistrictListQueryVariables>(
        DISTRICT_LIST,
        { variables: districtVariables },
    );

    const municipalityVariables = useMemo(() => ({
        provinceIds: value?.province ? [value.province] : undefined,
        districtIds: value?.district ? [value.district] : undefined,
    }), [value?.province, value?.district]);

    const {
        data: municipalityList,
        loading: municipalitiesPending,
    } = useQuery<MunicipalityListQuery, MunicipalityListQueryVariables>(
        MUNICIPALITY_LIST,
        { variables: municipalityVariables },
    );

    const [
        register,
        { loading: registerPending },
    ] = useMutation<RegisterInstitutionMutation, RegisterInstitutionMutationVariables>(
        REGISTER,
        {
            onCompleted: (response) => {
                const { register: registerRes } = response;

                if (!register) {
                    return;
                }

                const {
                    ok,
                    errors,
                } = registerRes ?? {};

                if (ok) {
                    alert.show(
                        'Registration completed successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError []);
                    setError(formError);

                    alert.show(
                        'Error during registration',
                        { variant: 'error' },
                    );
                }
            },
        },
    );

    const pending = provincesPending
        || districtsPending
        || municipalitiesPending
        || registerPending;

    const handleSubmit = useCallback((formValues: Partial<InstitutionalRegistrationFields>) => {
        const finalValue = formValues as InstitutionalRegistrationFields;
        register({
            variables: {
                email: finalValue.email,
                password: finalValue.password,
                phoneNumber: finalValue.phoneNumber,
                userType: 'INSTITUTIONAL_USER',
                institution: {
                    name: finalValue.name,
                    municipality: finalValue.municipality,
                    wardNumber: finalValue.wardNumber,
                    localAddress: finalValue.localAddress,
                    panNumber: finalValue.panNumber,
                    vatNumber: finalValue.vatNumber,
                },
            },
        });
    }, [register]);

    const confirmationError = React.useMemo(() => {
        if (confirmPassword === value?.password) {
            return undefined;
        }

        return 'Password doesn\'t match';
    }, [confirmPassword, value?.password]);

    return (
        <form
            className={styles.registerForm}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <TextInput
                name="email"
                label="Email"
                value={value?.email}
                error={error?.email}
                onChange={setFieldValue}
                placeholder="johndoe@email.com"
                disabled={pending}
            />
            <TextInput
                name="name"
                label="Name of the Institution"
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                placeholder="Togglecorp"
                disabled={pending}
            />
            <PasswordInput
                name="password"
                label="Password"
                value={value?.password}
                error={error?.password}
                onChange={setFieldValue}
                disabled={pending}
            />
            <PasswordInput
                name="confirm-password"
                label="Confirm Password"
                value={confirmPassword}
                error={confirmationError}
                onChange={setConfirmPassword}
                disabled={pending}
            />
            <TextInput
                name="phoneNumber"
                label="Phone Number"
                value={value?.phoneNumber}
                error={error?.phoneNumber}
                onChange={setFieldValue}
                disabled={pending}
            />
            <SelectInput
                label="Province"
                name="province"
                options={provinceList?.provinces?.results}
                keySelector={provinceKeySelector}
                labelSelector={provinceLabelSelector}
                value={value?.province}
                error={error?.province}
                onChange={setFieldValue}
            />
            <SelectInput
                label="District"
                name="district"
                options={districtList?.districts?.results}
                keySelector={districtKeySelector}
                labelSelector={districtLabelSelector}
                value={value?.district}
                error={error?.district}
                onChange={setFieldValue}
            />
            <SelectInput
                label="Municipality"
                name="municipality"
                options={municipalityList?.municipalities?.results}
                keySelector={municipalityKeySelector}
                labelSelector={municipalityLabelSelector}
                value={value?.municipality}
                error={error?.municipality}
                onChange={setFieldValue}
            />
            <NumberInput
                name="wardNumber"
                label="Ward Number"
                value={value?.wardNumber}
                error={error?.wardNumber}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextInput
                name="localAddress"
                label="Local Address"
                value={value?.localAddress}
                error={error?.localAddress}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextInput
                name="panNumber"
                label="PAN"
                value={value?.panNumber}
                error={error?.panNumber}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextInput
                name="vatNumber"
                label="VAT Number"
                value={value?.vatNumber}
                error={error?.vatNumber}
                onChange={setFieldValue}
                disabled={pending}
            />
            <Button
                name="register"
                type="submit"
                variant="primary"
                disabled={pristine || pending || !!confirmationError}
            >
                Register
            </Button>
        </form>
    );
}

export default InstitutionForm;
