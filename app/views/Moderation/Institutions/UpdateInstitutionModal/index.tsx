import React, { useCallback, useMemo, useState } from 'react';
import {
    Modal,
    Button,
    useAlert,
    TextInput,
    NumberInput,
} from '@the-deep/deep-ui';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    getErrorObject,
    requiredCondition,
    requiredStringCondition,
    createSubmitHandler,
    removeNull,
} from '@togglecorp/toggle-form';
import { gql, useMutation } from '@apollo/client';
import {
    InstitutionCreateInputType,
    UpdateInstitutionMutation,
    UpdateInstitutionMutationVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import LocationInput, { MunicipalityOption } from '#components/LocationInput';
import { InstitutionItemType } from '../index';
import styles from './styles.css';

const UPDATE_INSTITUTION = gql`
    mutation UpdateInstitution($data:  InstitutionCreateInputType!, $id: ID!) {
        updateInstitution(id: $id, data: $data) {
            errors
            ok
            result {
                id
                name
                panNumber
                vatNumber
                wardNumber
                localAddress
                municipality {
                    id
                    name
                    district {
                        id
                        name
                        province {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;

type FormType = UpdateInstitutionMutationVariables['data'];
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        name: [requiredStringCondition],
        municipality: [requiredStringCondition],
        localAddress: [],
        panNumber: [],
        wardNumber: [requiredCondition],
    }),
};

interface Props {
    institution: NonNullable<InstitutionItemType['institution']>;
    onModalClose: () => void;
}

function UpdateInstitutionModal(props: Props) {
    const {
        institution,
        onModalClose,
    } = props;

    const [
        municipalityOptions,
        setMunicipalityOptions,
    ] = useState<MunicipalityOption[] | undefined | null>([institution.municipality]);

    const initialValue: PartialFormType = useMemo(() => (institution ? ({
        name: institution.name,
        municipality: institution.municipality.id,
        localAddress: institution.localAddress ?? '',
        panNumber: institution.panNumber,
        wardNumber: institution.wardNumber,
    }) : {}), [institution]);

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
                    onModalClose();
                    alert.show(
                        'Institution updated successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);
                }
            },
            onError: (errors) => {
                alert.show(
                    <div>
                        <div>
                            Failed to update institution.
                        </div>
                        <div>
                            {errors.message}
                        </div>
                    </div>,
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
                    variables: { data: val as InstitutionCreateInputType, id: institution.id },
                });
            },
        );
        submit();
    }, [setError, validate, updateInstitution, institution.id]);

    return (
        <Modal
            className={styles.updateInstitutionModal}
            heading="Edit Institution"
            headingSize="small"
            onCloseButtonClick={onModalClose}
            headingDescription={institution.name}
            size="small"
            freeHeight
            bodyClassName={styles.content}
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
                        onClick={handleSubmit}
                        disabled={pristine || updateInstitutionPending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <TextInput
                name="name"
                label="Institution Name"
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                disabled={updateInstitutionPending}
            />
            <LocationInput
                name="municipality"
                label="Municipality"
                error={error?.municipality}
                value={value?.municipality}
                onChange={setFieldValue}
                options={municipalityOptions}
                onOptionsChange={setMunicipalityOptions}
                disabled={updateInstitutionPending}
            />
            <NumberInput
                name="wardNumber"
                label="Ward Number"
                value={value?.wardNumber}
                error={error?.wardNumber}
                onChange={setFieldValue}
                disabled={updateInstitutionPending}
                min={1}
                max={99}
            />
            <TextInput
                name="localAddress"
                label="Local Address"
                value={value?.localAddress}
                error={error?.localAddress}
                onChange={setFieldValue}
                disabled={updateInstitutionPending}
            />
            <TextInput
                name="panNumber"
                label="PAN Number"
                value={value?.panNumber}
                error={error?.panNumber}
                onChange={setFieldValue}
                disabled={updateInstitutionPending}
            />
        </Modal>
    );
}

export default UpdateInstitutionModal;
