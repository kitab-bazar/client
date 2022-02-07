import React, { useMemo, useState } from 'react';

import {
    Modal,
    Button,
    TextInput,
    useAlert,
} from '@the-deep/deep-ui';
import { useMutation, useQuery, gql } from '@apollo/client';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    createSubmitHandler,
    getErrorObject,
    removeNull,
} from '@togglecorp/toggle-form';

import {
    UpdateSchoolProfileMutation,
    UpdateSchoolProfileMutationVariables,
    MunicipalitiesListQuery,
    MunicipalitiesListQueryVariables,
    MunicipalityType,
    SchoolType,
} from '#generated/types';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import useDebouncedValue from '#hooks/useDebouncedValue';
import MunicipalitySelectInput from '#components/MunicipalitySelectInput';

import styles from './styles.css';

const MUNICIPALITIES_LIST = gql`
    query MunicipalitiesList($name: String) {
        municipalities(name: $name) {
            totalCount
            results {
                id
                name
                district{
                    id
                    name
                }
                province{
                    id
                    name
                }
            }
        }
    }
`;

const UPDATE_SCHOOL_PROFILE = gql`
    mutation UpdateSchoolProfile(
        $firstName: String,
        $lastName: String,
        $phoneNumber: String,
        $name: String!,
        $municipality: String!,
        $wardNumber: Int!,
        $localAddress: String,
    ){
        updateProfile(data: {
            firstName: $firstName,
            lastName: $lastName,
            phoneNumber: $phoneNumber,
            school: {
              name: $name,
              municipality: $municipality,
              wardNumber: $wardNumber,
              localAddress: $localAddress,
            },
        }) {
            ok
            errors
        }
    }
`;

interface UpdateSchoolProfileFields {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    name: string;
    municipality: string;
    localAddress: string;
    wardNumber: number;
    panNumber: string;
    vatNumber: string;
}

type FormType = Partial<UpdateSchoolProfileFields>;

type FormSchema = ObjectSchema<PartialForm<FormType>>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            firstName: [],
            lastName: [],
            phoneNumber: [],
            name: [],
            municipality: [],
            wardNumber: [],
            localAddress: [],
            panNumber: [],
            vatNumber: [],
        };
        return basicFields;
    },
};

interface Props {
    onModalClose: () => void;
    onEditSuccess: () => void;
    profileDetails: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        school: SchoolType;
    };
}

function EditProfileModal(props: Props) {
    const {
        onEditSuccess,
        onModalClose,
        profileDetails,
    } = props;

    const initialValue = useMemo((): FormType => ({
        firstName: profileDetails.firstName,
        lastName: profileDetails.lastName,
        phoneNumber: profileDetails.phoneNumber ?? undefined,
        municipality: profileDetails.school?.municipality?.id,
        panNumber: profileDetails.school?.panNumber ?? undefined,
        vatNumber: profileDetails.school?.vatNumber ?? undefined,
        wardNumber: profileDetails.school?.wardNumber,
        localAddress: profileDetails.school?.localAddress ?? undefined,
        name: profileDetails.school?.name,
    }), [profileDetails]);

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const error = getErrorObject(riskyError);
    const alert = useAlert();
    const [
        municipalityOptions,
        setMunicipalityOptions,
    ] = useState<MunicipalityType[] | null | undefined>(() => (
        profileDetails.school ? [profileDetails.school.municipality] : undefined
    ));

    const [
        updateProfile,
        { loading: updateProfilePending },
    ] = useMutation<UpdateSchoolProfileMutation, UpdateSchoolProfileMutationVariables>(
        UPDATE_SCHOOL_PROFILE,
        {
            onCompleted: (response) => {
                const { updateProfile: profileRes } = response;
                if (!profileRes) {
                    return;
                }
                const {
                    errors,
                    ok,
                } = profileRes;

                if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        'Error updating profile',
                        {
                            variant: 'error',
                        },
                    );
                } else if (ok) {
                    alert.show(
                        'Successfully updated profile',
                        {
                            variant: 'success',
                        },
                    );
                    onEditSuccess();
                    onModalClose();
                }
            },
            onError: () => {
                alert.show(
                    'Error updating profile.',
                    {
                        variant: 'error',
                    },
                );
            },
        },
    );

    const submit = useMemo(() => (
        createSubmitHandler(
            validate,
            setError,
            (finalValue) => {
                // FIXME: cast finalValue
                updateProfile({
                    variables: {
                        firstName: finalValue.firstName,
                        lastName: finalValue.lastName,
                        phoneNumber: finalValue.phoneNumber,
                        municipality: finalValue.municipality,
                        panNumber: finalValue.panNumber,
                        vatnumber: finalValue.vatNumber,
                        wardNumber: finalValue.wardNumber,
                        localAddress: finalValue.localAddress,
                        name: finalValue.name,
                    },
                });
            },
        )
    ), [setError, validate, updateProfile]);

    return (
        <Modal
            heading="Edit Profile"
            onCloseButtonClick={onModalClose}
            size="small"
            freeHeight
            bodyClassName={styles.editModalContent}
            footerActions={(
                <>
                    <Button
                        name={undefined}
                        onClick={onModalClose}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={submit}
                        disabled={pristine || updateProfilePending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <TextInput
                name="name"
                onChange={setFieldValue}
                label="School Name"
                value={value?.name}
                error={error?.name}
                disabled={updateProfilePending}
            />
            <TextInput
                name="firstName"
                onChange={setFieldValue}
                label="First Name"
                value={value?.firstName}
                error={error?.firstName}
                disabled={updateProfilePending}
            />
            <TextInput
                name="lastName"
                onChange={setFieldValue}
                label="Last Name"
                value={value?.lastName}
                error={error?.lastName}
                disabled={updateProfilePending}
            />
            <TextInput
                name="phoneNumber"
                label="Phone Number"
                onChange={setFieldValue}
                value={value?.phoneNumber}
                error={error?.phoneNumber}
                disabled={updateProfilePending}
            />
            <MunicipalitySelectInput
                name="municipality"
                label="Municipality"
                onChange={setFieldValue}
                value={value?.municipality}
                error={error?.municipality}
                options={municipalityOptions}
                onOptionsChange={setMunicipalityOptions}
            />
            <TextInput
                name="panNumber"
                label="PAN Number"
                onChange={setFieldValue}
                value={value?.panNumber}
                error={error?.panNumber}
                disabled={updateProfilePending}
            />
            <TextInput
                name="vatNumber"
                label="VAT Number"
                onChange={setFieldValue}
                value={value?.vatNumber}
                error={error?.vatNumber}
                disabled={updateProfilePending}
            />
        </Modal>
    );
}

export default EditProfileModal;
