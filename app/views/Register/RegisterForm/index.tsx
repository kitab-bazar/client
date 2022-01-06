import React, { useCallback } from 'react';

import {
    Container,
    TextInput,
    PasswordInput,
    Button,
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
} from '@togglecorp/toggle-form';
import styles from './styles.css';

interface RegisterFields {
    email: string;
    fullName: string;
    organizationName: string;
    createPassword: string;
    verifyPassword: string;
    captcha?: string;
}

type FormType = Partial<RegisterFields>;

type FormSchema = ObjectSchema<PartialForm<FormType>>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: [emailCondition, requiredStringCondition],
        fullName: [requiredStringCondition],
        organizationName: [requiredStringCondition],
        createPassword: [
            requiredStringCondition,
            lengthGreaterThanCondition(4),
            lengthSmallerThanCondition(129),
        ],
    }),
};

const initialValue: FormType = {};

function RegisterForm() {
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const error = getErrorObject(riskyError);

    const handleSubmit = useCallback(() => {
        console.warn('to be handled');
        // TODO: handle Submit
    }, []);

    return (
        <form
            className={styles.registerForm}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <Container
                className={styles.registerFormContainer}
                heading="Register"
                headingSize="medium"
                headingClassName={styles.heading}
                contentClassName={styles.inputContainer}
            >
                <TextInput
                    name="email"
                    label="Email"
                    value={value?.email}
                    error={error?.email}
                    onChange={setFieldValue}
                    placeholder="johndoe@email.com"
                />
                <TextInput
                    name="fullName"
                    label="Full Name"
                    value={value?.fullName}
                    error={error?.fullName}
                    onChange={setFieldValue}
                    placeholder="John Doe"
                />
                <TextInput
                    name="organizationName"
                    label="Organization Name"
                    value={value?.organizationName}
                    error={error?.organizationName}
                    onChange={setFieldValue}
                    placeholder="Janashakti School"
                />
                <PasswordInput
                    name="createPassword"
                    label="Create Password"
                    value={value?.createPassword}
                    error={error?.createPassword}
                    onChange={setFieldValue}
                    placeholder="******"
                />
                <PasswordInput
                    name="verifyPassword"
                    label="Re-enter Password"
                    value={value?.verifyPassword}
                    error={error?.verifyPassword}
                    onChange={setFieldValue}
                    placeholder="******"
                />
                <Button
                    name="register"
                    className={styles.submit}
                    type="submit"
                    variant="primary"
                    disabled={pristine}
                >
                    Register
                </Button>
            </Container>
        </form>
    );
}

export default RegisterForm;
