import React, { useCallback, useMemo } from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
    Button,
    Modal,
    TextInput,
    useAlert,
} from '@the-deep/deep-ui';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    getErrorObject,
    urlCondition,
    createSubmitHandler,
    removeNull,
    internal,
    PurgeNull,
} from '@togglecorp/toggle-form';
import {
    useMutation,
    gql,
} from '@apollo/client';

import {
    InstitutionCreateInputType,
    ProfileDetailsQuery,
    UpdateInstitutionMutation,
    UpdateInstitutionMutationVariables,
} from '#generated/types';
import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import ErrorMessage from '#components/ErrorMessage';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import styles from './styles.css';

type Institution = NonNullable<NonNullable<ProfileDetailsQuery['me']>['institution']>
type FormType = Institution;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        websiteUrl: [urlCondition],
        logoUrl: [urlCondition],
        libraryUrl: [urlCondition],
    }),
};

const UPDATE_INSTITUTION = gql`
    mutation UpdateInstitution($data: InstitutionCreateInputType!, $id: ID!) {
        updateInstitution(data: $data, id: $id) {
            errors
            ok
            result {
                id
                libraryUrl
                websiteUrl
                logoUrl
            }
        }
    }
`;

interface Props {
    institution: Institution;
    onModalClose: () => void;
}

function UpdateInstitutionDetailModal(props: Props) {
    const {
        institution,
        onModalClose,
    } = props;

    const alert = useAlert();
    const strings = useTranslation(profile);
    const initialFormValue = useMemo(
        (): PartialFormType => (
            institution ? {
                websiteUrl: institution.websiteUrl,
                logoUrl: institution.logoUrl,
                libraryUrl: institution.libraryUrl,
            } : {}),
        [institution],
    );

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialFormValue);

    const error = getErrorObject(riskyError);

    const [
        updateInstitution,
        { loading: updateInstitutionPending },
    ] = useMutation<UpdateInstitutionMutation, UpdateInstitutionMutationVariables>(
        UPDATE_INSTITUTION,
        {
            onCompleted: (response) => {
                if (!response.updateInstitution) {
                    return;
                }
                const {
                    ok,
                    errors,
                } = response.updateInstitution;
                if (ok) {
                    alert.show(
                        strings.updateInstitutionSuccess,
                        { variant: 'success' },
                    );
                    onModalClose();
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);

                    alert.show(
                        <ErrorMessage
                            header={strings.updateInstitutionFailureMessage}
                            description={
                                isDefined(formErrorFromServer)
                                    ? formErrorFromServer[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                setError(errors.message);
                alert.show(
                    <ErrorMessage
                        header={strings.updateInstitutionFailureMessage}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleSubmit = useCallback(() => {
        const submit = createSubmitHandler(
            validate,
            setError,
            (val) => {
                updateInstitution({
                    variables: {
                        data: {
                            name: institution.name,
                            wardNumber: institution.wardNumber,
                            municipality: institution.municipality.id,
                            ...val,
                        } as InstitutionCreateInputType,
                        id: institution.id,
                    },
                });
            },
        );
        submit();
    }, [validate, setError, institution, updateInstitution]);

    return (
        <Modal
            className={styles.addInstitutionDetailModal}
            heading={strings.updateInstitutionDetail}
            headingSize="small"
            size="small"
            onCloseButtonClick={onModalClose}
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
                        onClick={handleSubmit}
                        disabled={pristine || updateInstitutionPending}
                    >
                        {strings.saveLabel}
                    </Button>
                </>
            )}
        >
            <TextInput
                name="websiteUrl"
                onChange={setFieldValue}
                label={strings.urlLabel}
                value={value?.websiteUrl}
                error={error?.websiteUrl}
                disabled={updateInstitutionPending}
            />
            <TextInput
                name="logoUrl"
                onChange={setFieldValue}
                label={strings.logoUrlLabel}
                value={value?.logoUrl}
                error={error?.logoUrl}
                disabled={updateInstitutionPending}
            />
            <TextInput
                name="libraryUrl"
                onChange={setFieldValue}
                label={strings.ebookLibraryLinkLabel}
                value={value?.libraryUrl}
                error={error?.libraryUrl}
                disabled={updateInstitutionPending}
            />
        </Modal>
    );
}

export default UpdateInstitutionDetailModal;
