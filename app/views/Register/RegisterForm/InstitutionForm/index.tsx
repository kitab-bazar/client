import React, { useCallback, useMemo } from 'react';

import { useQuery, useMutation, gql } from '@apollo/client';

import {
    TextInput,
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
    RegisterMutation,
    RegisterMutationVariables,
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
        $email: String!,
        $password: String!,
        $firstName: String!,
        $lastName: String!,
        $userType: user_type,
        $wardNumber: Int!,
        $panNumber: String!,
        $vatNumber: String!,
        $name: String!,
        $institutionEmail: String!,
        $province: String!,
        $district: String!,
        $municipality: String!,
        $localAddress: String,
        $phoneNumber: String,
    ) {
        register(data: {
            email: $email,
            password: $password,
            firstName: $firstName,
            lastName: $lastName,
            userType: $userType,
            phoneNumber: $phoneNumber,
            profile: {
                institution: {
                    wardNumber: $wardNumber,
                    panNumber: $panNumber,
                    vatNumber: $vatNumber,
                    name: $name,
                    email: $institutionEmail,
                    province: $province,
                    district: $district,
                    municipality: $municipality,
                    localAddress: $localAddress,
                },
            },
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
    firstName: string;
    lastName: string;
    password: string;
    verifyPassword: string;
    userType: UserUserType;
    wardNumber: number;
    panNumber: number;
    vatNumber: number;
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
        firstName: [requiredStringCondition],
        lastName: [requiredStringCondition],
        password: [
            requiredStringCondition,
            lengthGreaterThanCondition(4),
            lengthSmallerThanCondition(129),
        ],
        userType: [requiredStringCondition],
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

const provinceKeySelector = (d) => d.id;
const provinceLabelSelector = (d) => d.name;

const districtKeySelector = (d) => d.id;
const districtLabelSelector = (d) => d.name;

const municipalityKeySelector = (d) => d.id;
const municipalityLabelSelector = (d) => d.name;

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
    const [confirmPassword, setConfirmPassword] = useInputState<string>('');

    const {
        data: provinceList,
        loading: provincesPending,
    } = useQuery<ProvinceListQuery, ProvinceListQueryVariables>(
        PROVINCE_LIST,
    );

    const districtVariables = useMemo(() => ({
        provinceIds: [value?.province],
    }), []);

    const {
        data: districtList,
        loading: districtsPending,
    } = useQuery<DistrictListQuery, DistrictListQueryVariables>(
        DISTRICT_LIST,
        {
            variables: districtVariables,
        },
    );

    const municipalityVariables = useMemo(() => ({
        provinceIds: [value?.province],
        districtIds: [value?.district],
    }), []);

    const {
        data: municipalityList,
        loading: municipalitiesPending,
    } = useQuery<MunicipalityListQuery, MunicipalityListQueryVariables>(
        MUNICIPALITY_LIST,
        {
            variables: municipalityVariables,
        },
    );

    const [
        register,
        { loading: registerPending },
    ] = useMutation<RegisterMutation, RegisterMutationVariables>(
        REGISTER,
        {
            onCompleted: (response) => {
                console.info('Institution form');
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
                        {
                            variant: 'success',
                        },
                    );
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError []);
                    setError(formError);

                    alert.show(
                        'Error during registration',
                        {
                            variant: 'error',
                        },
                    );
                }
            },
        },
    );

    const pending = provincesPending
        || districtsPending
        || municipalitiesPending
        || registerPending;

    const handleSubmit = useCallback((finalValue) => {
        register({
            variables: {
                email: finalValue?.email,
                password: finalValue?.password,
                firstName: finalValue?.firstName,
                lastName: finalValue?.lastName,
                userType: 'INDIVIDUAL_USER',
                profile: {
                    institution: {
                        wardNumber: finalValue?.wardNumber,
                        panNumber: finalValue?.panNumber,
                        vatNumber: finalValue?.vatNumber,
                        name: finalValue?.name,
                        email: finalValue?.email,
                        province: finalValue?.province,
                        district: finalValue?.district,
                        municipality: finalValue?.municipality,
                        localAddress: finalValue?.localAddress,
                    },
                },
            },
        });
    }, []);

    const confirmationError = React.useMemo(() => {
        if (confirmPassword === value?.password) {
            return undefined;
        }

        return 'Password doesn\'t match';
    }, [confirmPassword, value?.password]);

    return (
        <div>
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
                    name="firstName"
                    label="First Name"
                    value={value?.firstName}
                    error={error?.firstName}
                    onChange={setFieldValue}
                    placeholder="John"
                    disabled={pending}
                />
                <TextInput
                    name="lastName"
                    label="Last Name"
                    value={value?.lastName}
                    error={error?.lastName}
                    onChange={setFieldValue}
                    placeholder="John Doe"
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
                <SelectInput
                    name="province"
                    options={provinceList}
                    keySelector={provinceKeySelector}
                    labelSelector={provinceLabelSelector}
                    value={value?.province}
                    error={error?.province}
                    onChange={setFieldValue}
                />
                <SelectInput
                    name="district"
                    options={districtList}
                    keySelector={districtKeySelector}
                    labelSelector={districtLabelSelector}
                    value={value?.district}
                    error={error?.district}
                    onChange={setFieldValue}
                />
                <SelectInput
                    name="municipality"
                    options={municipalityList}
                    keySelector={municipalityKeySelector}
                    labelSelector={municipalityLabelSelector}
                    value={value?.municipality}
                    error={error?.municipality}
                    onChange={setFieldValue}
                />
                <Button
                    name="register"
                    className={styles.submit}
                    type="submit"
                    variant="primary"
                    disabled={pristine || pending}
                >
                    Register
                </Button>
            </form>
        </div>
    );
}

export default InstitutionForm;
