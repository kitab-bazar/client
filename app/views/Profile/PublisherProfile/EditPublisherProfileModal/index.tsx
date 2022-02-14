import React, { useState, useMemo } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
    ObjectSchema,
    PartialForm,
    requiredCondition,
    requiredStringCondition,
    useForm,
    createSubmitHandler,
    getErrorObject,
    removeNull,
} from '@togglecorp/toggle-form';
import {
    Modal,
    Button,
    TextInput,
    useAlert,
} from '@the-deep/deep-ui';

import NonFieldError from '#components/NonFieldError';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import { publisher } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import {
    UpdatePublisherProfileMutation,
    UpdatePublisherProfileMutationVariables,
} from '#generated/types';
import PublisherForm from '#views/Register/RegisterForm/PublisherForm';

import { MunicipalityOption } from '#views/Register/RegisterForm/LocationInput';

type FormType = NonNullable<UpdatePublisherProfileMutationVariables>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const extraSchema = {
    name: [],
    municipality: [requiredStringCondition],
    wardNumber: [requiredCondition],
    localAddress: [],
    panNumber: [requiredCondition],
    vatNumber: [requiredCondition],
};

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            phoneNumber: [],
            publisher: {
                fields: () => extraSchema,
            },
        };
        return basicFields;
    },
};
interface Props {
    onEditSuccess: () => void;
    profileDetails: PartialFormType | undefined;
    onModalClose: () => void;
}

const UPDATE_PUBLISHER_PROFILE = gql`
    mutation UpdatePublisherProfile(
        $phoneNumber: String,
        $publisher: PublisherUpdateInputType!,
    ){
        updateProfile(data: {
            phoneNumber: $phoneNumber,
            publisher: $publisher,
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

    const strings = useTranslation(publisher);

    const [
        municipalityOptions,
        setMunicipalityOptions,
    ] = useState<MunicipalityOption[] | undefined | null>();

    const initialValue: PartialFormType = useMemo(() => ({
        phoneNumber: profileDetails?.phoneNumber,
        publisher: profileDetails?.publisher,
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
                        strings.profileUpdateSuccessLabel,
                        { variant: 'success' },
                    );
                    onEditSuccess();
                    onModalClose();
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        strings.profileUpdateErrorLabel,
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
            heading={strings.editProfileModalHeading}
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
                        {strings.cancelLabel}
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={submit}
                        disabled={pristine || updateProfilePending}
                    >
                        {strings.saveLabel}
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <TextInput
                name="phoneNumber"
                label={strings.phoneNumberInputLabel}
                value={value?.phoneNumber}
                error={error?.phoneNumber}
                onChange={setFieldValue}
                disabled={updateProfilePending}
            />
            <PublisherForm
                name="publisher"
                value={value.publisher}
                onChange={setFieldValue}
                error={error?.publisher}
                disabled={updateProfilePending}
                municipalityOptions={municipalityOptions}
                onMunicipalityOptionsChange={setMunicipalityOptions}
            />
        </Modal>
    );
}

export default EditProfileModal;
