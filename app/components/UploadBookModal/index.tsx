import React, { useState, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    useQuery,
    useMutation,
    gql,
} from '@apollo/client';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    createSubmitHandler,
    getErrorObject,
    requiredCondition,
    requiredListCondition,
    requiredStringCondition,
    greaterThanCondition,
    removeNull,
} from '@togglecorp/toggle-form';
import {
    Modal,
    Button,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    DateInput,
    useAlert,
} from '@the-deep/deep-ui';

import {
    CreateBooksOptionsQuery,
    CreateBooksOptionsQueryVariables,
    CreateBookMutation,
    CreateBookMutationVariables,
    UpdateBookMutation,
    UpdateBookMutationVariables,
} from '#generated/types';
import { newBookModal } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import AuthorMultiSelectInput, { Author } from '#components/AuthorMultiSelectInput';
import CategoryMultiSelectInput, { Category } from '#components/CategoryMultiSelectInput';
import { EnumFix } from '#utils/types';

import styles from './styles.css';

interface EnumEntity<T> {
    name: T;
    description?: string | null;
}

function enumKeySelector<T>(d: EnumEntity<T>) {
    return d.name;
}
function enumLabelSelector<T>(d: EnumEntity<T>) {
    return d.description ?? `${d.name}`;
}

const BOOK = gql`
    query Book(
        $id: ID!,
    ) {
        book(id: $id) {
            id
            title
            titleNe
            description
            descriptionNe
            edition
            grade
            isbn
            numberOfPages
            language
            publisher
            publishedDate
            price
            weight
            categories {
                id
                name
            }
            authors {
                id
                name
            }
            image {
                name
                url
            }
        }
    }
`;

const CREATE_BOOK = gql`
    mutation CreateBook(
        $data: BookCreateInputType!,
    ) {
        createBook(data: $data) {
            ok
            errors
            result {
                id
                title
                titleNe
                description
                descriptionNe
                edition
                grade
                isbn
                numberOfPages
                language
                publisher
                publishedDate
                price
                weight
                categories {
                    id
                    name
                }
                authors {
                    id
                    name
                }
                image {
                    name
                    url
                }
            }
        }
    }
`;

const UPDATE_BOOK = gql`
    mutation UpdateBook(
        $data: BookCreateInputType!,
        $id: ID!,
    ) {
        updateBook(data: $data, id: $id) {
            ok
            errors
            result {
                id
                title
                titleNe
                description
                descriptionNe
                edition
                grade
                isbn
                numberOfPages
                language
                publisher
                publishedDate
                price
                weight
                categories {
                    id
                    name
                }
                authors {
                    id
                    name
                }
                image {
                    name
                    url
                }
            }
        }
    }
`;

const CREATE_BOOKS_OPTIONS = gql`
    query CreateBooksOptions {
        gradeOptions: __type(name: "grade") {
            name
            enumValues {
                name
                description
            }
        }
        languageOptions: __type(name: "language") {
            name
            enumValues {
                name
                description
            }
        }
        authors {
            results {
                id
                name
            }
        }

    }
`;
type FormType = EnumFix<CreateBookMutationVariables['data'], 'language' | 'grade'>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

// NOTE: may need to use array condition

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        title: [requiredStringCondition],
        titleNe: [requiredStringCondition],
        description: [requiredStringCondition],
        descriptionNe: [requiredStringCondition],
        edition: [],
        grade: [requiredCondition],
        isbn: [requiredStringCondition],
        numberOfPages: [requiredCondition],
        language: [requiredCondition],
        publisher: [requiredCondition],
        publishedDate: [requiredCondition],
        price: [requiredCondition, greaterThanCondition(0)],
        weight: [greaterThanCondition(0)],
        categories: [requiredListCondition],
        authors: [requiredListCondition],
        image: [],
    }),
};

const initialValue: PartialFormType = {};

interface Props {
    id?: string;
    publisher: string;
    className?: string;
    onModalClose: () => void;
    onBookAdd: () => void;
}

function UploadBookModal(props: Props) {
    const {
        className,
        onModalClose,
        onBookAdd,
        publisher,
        id,
    } = props;

    const strings = useTranslation(newBookModal);
    const [authors, setAuthors] = useState<Author[] | undefined | null>();
    const [categories, setCategories] = useState<Category[] | undefined | null>();

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
        setValue,
    } = useForm(schema, initialValue);

    const error = getErrorObject(riskyError);
    const alert = useAlert();

    const {
        loading: bookLoading,
    } = useQuery(
        BOOK,
        {
            variables: id ? {
                id,
            } : undefined,
            skip: !id,
            onCompleted: (response) => {
                if (!response?.book?.ok) {
                    alert.show(
                        'Could not get book',
                        { variant: 'error' },
                    );
                    return;
                }
                const book = response.book.result;
                setValue({
                    ...book,
                });
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const [
        createBook,
        { loading: createBookPending },
    ] = useMutation<CreateBookMutation, CreateBookMutationVariables>(
        CREATE_BOOK,
        {
            onCompleted: (response) => {
                if (!response.createBook) {
                    return;
                }
                const { errors, ok } = response.createBook;
                if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        'Error creating book',
                        { variant: 'error' },
                    );
                } else if (ok) {
                    alert.show(
                        'Successfully creating book',
                        { variant: 'success' },
                    );
                    onBookAdd();
                    onModalClose();
                }
            },
            onError: () => {
                alert.show(
                    'Error creating book',
                    { variant: 'error' },
                );
            },
        },
    );

    const [
        updateBook,
        { loading: updateBookPending },
    ] = useMutation<UpdateBookMutation, UpdateBookMutationVariables>(
        UPDATE_BOOK,
        {
            onCompleted: (response) => {
                if (!response.updateBook) {
                    return;
                }
                const { errors, ok } = response.updateBook;
                if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        'Error updating book',
                        { variant: 'error' },
                    );
                } else if (ok) {
                    alert.show(
                        'Successfully updated book',
                        { variant: 'success' },
                    );
                    onModalClose();
                }
            },
            onError: () => {
                alert.show(
                    'Error updating book',
                    { variant: 'error' },
                );
            },
        },
    );

    const {
        data: createBooksOptions,
        loading: createBooksOptionsPending,
        error: createBooksOptionsError,
    } = useQuery<CreateBooksOptionsQuery, CreateBooksOptionsQueryVariables>(
        CREATE_BOOKS_OPTIONS,
    );

    const handleSubmit = useCallback(
        () => {
            const submit = createSubmitHandler(
                validate,
                setError,
                (val) => {
                    if (id) {
                        updateBook({
                            variables: {
                                id,
                                data: {
                                    ...val as UpdateBookMutationVariables['data'],
                                    publisher,
                                    // FIXME: add this to form
                                    isPublished: true,
                                },
                            },
                        });
                    } else {
                        createBook({
                            variables: {
                                data: {
                                    ...val as CreateBookMutationVariables['data'],
                                    publisher,
                                    // FIXME: add this to form
                                    isPublished: true,
                                },
                            },
                        });
                    }
                },
            );
            submit();
        },
        [setError, validate, createBook, updateBook, id, publisher],
    );

    const optionsDisabled = createBooksOptionsPending || !!createBooksOptionsError;

    const pending = createBookPending || updateBookPending || bookLoading;

    return (
        <Modal
            className={_cs(styles.uploadBookModal, className)}
            bodyClassName={styles.inputList}
            heading={id ? 'Edit book' : strings.modalHeading}
            onCloseButtonClick={onModalClose}
            size="medium"
            freeHeight
            footerActions={(
                <>
                    <Button
                        name={undefined}
                        onClick={onModalClose}
                        variant="secondary"
                    >
                        {strings.cancelButtonLabel}
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={pristine || pending}
                    >
                        {strings.saveButtonLabel}
                    </Button>
                </>
            )}
        >
            <TextInput
                name="title"
                label={strings.titleLabel}
                value={value?.title}
                error={error?.title}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextInput
                name="titleNe"
                label={strings.titleNepaliLabel}
                value={value?.titleNe}
                error={error?.titleNe}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextArea
                name="description"
                label={strings.descriptionLabel}
                value={value?.description}
                error={error?.description}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextArea
                name="descriptionNe"
                label={strings.descriptionNepaliLabel}
                value={value?.descriptionNe}
                error={error?.descriptionNe}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextInput
                name="isbn"
                label={strings.isbnLabel}
                value={value?.isbn}
                error={error?.isbn}
                onChange={setFieldValue}
                disabled={pending}
            />
            <TextInput
                name="edition"
                label={strings.editionLabel}
                value={value?.edition}
                error={error?.edition}
                onChange={setFieldValue}
                disabled={pending}
            />
            <NumberInput
                name="numberOfPages"
                label={strings.numberOfPagesLabel}
                value={value?.numberOfPages}
                error={error?.numberOfPages}
                onChange={setFieldValue}
                disabled={pending}
                min={1}
            />
            <SelectInput
                label={strings.gradeLabel}
                name="grade"
                options={createBooksOptions?.gradeOptions?.enumValues}
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                value={value.grade}
                onChange={setFieldValue}
                disabled={pending || optionsDisabled}
            />
            <SelectInput
                label={strings.languageLabel}
                name="language"
                options={createBooksOptions?.languageOptions?.enumValues}
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                value={value.language}
                onChange={setFieldValue}
                disabled={pending || optionsDisabled}
            />
            <DateInput
                name="publishedDate"
                label={strings.publishedDateLabel}
                disabled={pending}
                onChange={setFieldValue}
                value={value?.publishedDate}
                error={error?.publishedDate}
            />
            <NumberInput
                name="price"
                label={strings.priceLabel}
                value={value?.price}
                error={error?.price}
                onChange={setFieldValue}
                disabled={pending}
                min={1}
            />
            <NumberInput
                name="weight"
                label={strings.weightLabel}
                value={value?.weight}
                error={error?.weight}
                onChange={setFieldValue}
                disabled={pending}
                min={1}
            />
            <CategoryMultiSelectInput
                name="categories"
                label={strings.categoriesLabel}
                value={value.categories}
                onChange={setFieldValue}
                options={categories}
                onOptionsChange={setCategories}
                disabled={pending}
            />
            <AuthorMultiSelectInput
                name="authors"
                label={strings.authorsLabel}
                value={value.authors}
                onChange={setFieldValue}
                options={authors}
                onOptionsChange={setAuthors}
                disabled={pending}
            />
        </Modal>
    );
}

export default UploadBookModal;
