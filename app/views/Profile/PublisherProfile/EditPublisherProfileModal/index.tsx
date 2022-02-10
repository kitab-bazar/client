import React, { useMemo, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    createSubmitHandler,
    getErrorObject,
    removeNull,
} from '@togglecorp/toggle-form';
import {
    Modal,
    Button,
    TextInput,
    NumberInput,
    useAlert,
} from '@the-deep/deep-ui';

import NonFieldError from '#components/NonFieldError';
import {
    UpdatePublisherProfileMutation,
    UpdatePublisherProfileMutationVariables,
} from '#generated/types';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

import LocationInput, { MunicipalityOption } from '#views/Register/RegisterForm/LocationInput';

type FormType = NonNullable<UpdatePublisherProfileMutationVariables>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            name: [],
            municipality: [],
            wardNumber: [],
            localAddress: [],
        };
        return basicFields;
    },
};
interface Props {
    onEditSuccess: () => void;
    profileDetails: PartialFormType | undefined | null;
    onModalClose: () => void;
}

const UPDATE_PUBLISHER_PROFILE = gql`
    mutation UpdatePublisherProfile(
        $name: String!,
        $municipality: String!,
        $wardNumber: Int!,
        $localAddress: String,
    ){
        updateProfile(data: {
            publisher: {
                name: $name,
                municipality: $municipality,
                wardNumber: $wardNumber,
                localAddress: $localAddress,
            }
        }) {
            ok
            errors
        }
    }
`;
function EditProfileModal(props: Props) {
    const {
        onModalClose,
        onEditSuccess,
        profileDetails,
    } = props;

    const initialValue: PartialFormType = useMemo(() => ({
        name: profileDetails?.name,
        municipality: profileDetails?.municipality,
        wardNumber: profileDetails?.wardNumber,
        localAddress: profileDetails?.localAddress,
    }), [
        profileDetails?.name,
        profileDetails?.municipality,
        profileDetails?.wardNumber,
        profileDetails?.localAddress,
    ]);

    const [
        municipalityOptions,
        onMunicipalityOptionsChange,
    ] = useState<MunicipalityOption[] | undefined | null>();

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
        updateProfile,
        { loading: updateProfilePending },
    ] = useMutation<UpdatePublisherProfileMutation, UpdatePublisherProfileMutationVariables>(
        UPDATE_PUBLISHER_PROFILE,
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

                if (ok) {
                    alert.show(
                        'Successfully updated profile',
                        { variant: 'success' },
                    );
                    onEditSuccess();
                    onModalClose();
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        'Error updating profile',
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const submit = useMemo(() => (
        createSubmitHandler(
            validate,
            setError,
            (finalValue) => {
                updateProfile({
                    variables: finalValue as FormType,
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
            <NonFieldError error={error} />
            <TextInput
                name="name"
                label="Name of the Publisher"
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                placeholder="Togglecorp"
                disabled={updateProfilePending}
            />
            <LocationInput
                name="municipality"
                label="Municipality"
                error={error?.municipality}
                value={value?.municipality}
                onChange={setFieldValue}
                options={municipalityOptions}
                onOptionsChange={onMunicipalityOptionsChange}
                disabled={updateProfilePending}
            />
            <NumberInput
                name="wardNumber"
                label="Ward Number"
                value={value?.wardNumber}
                error={error?.wardNumber}
                onChange={setFieldValue}
                disabled={updateProfilePending}
                min={1}
                max={99}
            />
            <TextInput
                name="localAddress"
                label="Local Address"
                value={value?.localAddress}
                error={error?.localAddress}
                onChange={setFieldValue}
                disabled={updateProfilePending}
            />
        </Modal>
    );
}

export default EditProfileModal;
