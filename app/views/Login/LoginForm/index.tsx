import React, { useCallback } from 'react';
import { generatePath } from 'react-router-dom';

import {
    TextInput,
    Container,
    PasswordInput,
    Button,
    ButtonLikeLink,
} from '@the-deep/deep-ui';

import {
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
    createSubmitHandler,
    emailCondition,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    getErrorObject,
} from '@togglecorp/toggle-form';
import routes from '#base/configs/routes';

import styles from './styles.css';

interface LoginFields {
    email: string;
    password: string;
    // captcha?: string;
}
type FormType = Partial<LoginFields>;

type FormSchema = ObjectSchema<PartialForm<FormType>>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            email: [
                emailCondition,
                requiredStringCondition,
            ],
            password: [
                requiredStringCondition,
                lengthGreaterThanCondition(4),
                lengthSmallerThanCondition(129),
            ],
        };
        return basicFields;
    },
};

const initialValue: FormType = {};

function LoginForm() {
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
            className={styles.loginForm}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <Container
                className={styles.loginFormContainer}
                heading="Login"
                headingSize="medium"
                contentClassName={styles.inputContainer}
                footerContent={(
                    <div className={styles.footer}>
                        Do not have an account yet?
                        &nbsp;
                        <ButtonLikeLink
                            className={styles.registerLink}
                            to={generatePath(routes.register.path)}
                            variant="transparent"
                        >
                            Register
                        </ButtonLikeLink>
                    </div>
                )}
            >
                <TextInput
                    name="email"
                    onChange={setFieldValue}
                    label="Email"
                    value={value?.email}
                    error={error?.email}
                    placeholder="john.doe@gmail.com"
                />
                <PasswordInput
                    name="password"
                    onChange={setFieldValue}
                    label="Password"
                    value={value?.password}
                    error={error?.password}
                    placeholder="****"
                />
                <Button
                    name="login"
                    className={styles.submit}
                    type="submit"
                    variant="primary"
                    disabled={pristine}
                >
                    Login
                </Button>
            </Container>
        </form>
    );
}
export default LoginForm;
