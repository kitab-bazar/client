import React, { useCallback, useMemo, useState } from 'react';
import { isDefined } from '@togglecorp/fujs';
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
    internal,
} from '@togglecorp/toggle-form';
import { gql, useMutation } from '@apollo/client';
import {
    SchoolCreateInputType,
    UpdateSchoolMutation,
    UpdateSchoolMutationVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import LocationInput, { MunicipalityOption } from '#components/LocationInput';
import ErrorMessage from '#components/ErrorMessage';

import { SchoolItemType } from '../index';
import styles from './styles.css';

const UPDATE_SCHOOL = gql`
    mutation UpdateSchool($data:  SchoolCreateInputType!, $id: ID!) {
        updateSchool(id: $id, data: $data) {
            errors
            ok
            result {
                id
                name
                panNumber
                schoolId
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

type FormType = UpdateSchoolMutationVariables['data'];
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        name: [requiredStringCondition],
        municipality: [requiredStringCondition],
        localAddress: [],
        panNumber: [],
        schoolId: [],
        wardNumber: [requiredCondition],
    }),
    validation: (value) => {
        if (value && !value.panNumber && !value.schoolId) {
            return 'Either pan number or school id is required';
        }
        return undefined;
    },
};

interface Props {
    school: NonNullable<SchoolItemType['school']>;
    onModalClose: () => void;
}

function UpdateSchoolModal(props: Props) {
    const {
        school,
        onModalClose,
    } = props;

    const [
        municipalityOptions,
        setMunicipalityOptions,
    ] = useState<MunicipalityOption[] | undefined | null>([school.municipality]);

    const initialValue: PartialFormType = useMemo(() => (school ? ({
        name: school.name,
        municipality: school.municipality.id,
        localAddress: school.localAddress ?? '',
        panNumber: school.panNumber,
        schoolId: school.schoolId,
        wardNumber: school.wardNumber,
    }) : {}), [school]);

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
        updateSchool,
        { loading: updateSchoolPending },
    ] = useMutation<UpdateSchoolMutation, UpdateSchoolMutationVariables>(
        UPDATE_SCHOOL,
        {
            onCompleted: (response) => {
                if (!response.updateSchool) {
                    return;
                }
                const {
                    ok,
                    errors,
                } = response.updateSchool;
                if (ok) {
                    onModalClose();
                    alert.show(
                        'School updated successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);
                    alert.show(
                        <ErrorMessage
                            header="Failed to update school."
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
                alert.show(
                    <ErrorMessage
                        header="Failed to update institution."
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
                updateSchool({
                    variables: { data: val as SchoolCreateInputType, id: school.id },
                });
            },
        );
        submit();
    }, [setError, validate, updateSchool, school.id]);

    return (
        <Modal
            className={styles.updateSchoolModal}
            heading="Edit School"
            headingSize="small"
            onCloseButtonClick={onModalClose}
            headingDescription={school.name}
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
                        disabled={pristine || updateSchoolPending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <TextInput
                name="name"
                label="School Name"
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                disabled={updateSchoolPending}
            />
            <LocationInput
                name="municipality"
                label="Municipality"
                error={error?.municipality}
                value={value?.municipality}
                onChange={setFieldValue}
                options={municipalityOptions}
                onOptionsChange={setMunicipalityOptions}
                disabled={updateSchoolPending}
            />
            <NumberInput
                name="wardNumber"
                label="Ward Number"
                value={value?.wardNumber}
                error={error?.wardNumber}
                onChange={setFieldValue}
                disabled={updateSchoolPending}
                min={1}
                max={99}
            />
            <TextInput
                name="localAddress"
                label="Local Address"
                value={value?.localAddress}
                error={error?.localAddress}
                onChange={setFieldValue}
                disabled={updateSchoolPending}
            />
            <TextInput
                name="panNumber"
                label="PAN Number"
                value={value?.panNumber}
                error={error?.panNumber}
                onChange={setFieldValue}
                disabled={updateSchoolPending}
            />
            <TextInput
                name="schoolId"
                label="School ID"
                value={value?.schoolId}
                error={error?.schoolId}
                onChange={setFieldValue}
                disabled={updateSchoolPending}
            />
        </Modal>
    );
}

export default UpdateSchoolModal;
