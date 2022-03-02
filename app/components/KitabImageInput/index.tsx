import React, { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    FileInput,
    FileInputProps,
    Button,
    useAlert,
    QuickActionButton,
} from '@the-deep/deep-ui';
import {
    MdFileUpload,
} from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    CreateActivityLogMutation,
    CreateActivityLogMutationVariables,
    ActivityLogFileType,
} from '#generated/types';

import styles from './styles.css';

const CREATE_ACTIVITY_LOG = gql`
    mutation CreateActivityLog(
        $type: type!,
        $file: Upload!,
    ) {
        createActivityLogFile(data: {type: $type, file: $file}) {
            ok
            errors
            result {
                file {
                    name
                    url
                }
                id
            }
        }
    }
`;

export type Option = NonNullable<NonNullable<NonNullable<CreateActivityLogMutation>['createActivityLogFile']>['result']>;

interface PreviewProps<ID extends string> {
    id: ID,
    file: {
        name?: string | null | undefined,
        url?: string | null | undefined,
    } | null | undefined;
    onRemoveButtonClick?: (id: ID) => void;
}

export function Preview<ID extends string>(props: PreviewProps<ID>) {
    const {
        id,
        file,
        onRemoveButtonClick,
    } = props;

    if (!file?.url) {
        return null;
    }

    const isPreviewable = file.url.match(/.(jpg|jpeg|png|gif)$/i);

    const removeButton = (
        <QuickActionButton
            name={id}
            onClick={onRemoveButtonClick}
            className={styles.removeButton}
        >
            <IoClose />
        </QuickActionButton>
    );

    if (!isPreviewable) {
        return (
            <div className={styles.noPreview}>
                {removeButton}
                Preview not available!
            </div>
        );
    }

    return (
        <div className={styles.preview}>
            <img
                className={styles.image}
                src={file.url}
                alt={file.name ?? id}
            />
            {removeButton}
        </div>
    );
}

interface Props<T extends string> extends Omit<FileInputProps<T>, 'overrideStatus' | 'status' | 'value' | 'onChange' | 'multiple' | 'className' | 'accept'> {
    className?: string;
    fileInputClassName?: string;
    value?: Option[] | null | undefined;
    onChange: (value: Option[] | null | undefined, name: T) => void;
    logFileType: ActivityLogFileType,
    hidePreview?: boolean;
    hideClearButton?: boolean;
}

function KitabImageInput<T extends string>(props: Props<T>) {
    const {
        className,
        actions,
        fileInputClassName,
        value,
        disabled,
        name,
        onChange,
        maxFileSize = 2,
        logFileType,
        hidePreview,
        hideClearButton,
        ...otherProps
    } = props;

    const alert = useAlert();

    const [
        uploadFile,
        { loading: uploadFilePending },
    ] = useMutation<CreateActivityLogMutation, CreateActivityLogMutationVariables>(
        CREATE_ACTIVITY_LOG,
        {
            onCompleted: (response) => {
                const { createActivityLogFile } = response;
                if (!createActivityLogFile) {
                    return;
                }

                const {
                    ok,
                    errors,
                    result,
                } = createActivityLogFile;

                if (ok && result) {
                    onChange([...(value ?? []), result], name);
                    alert.show(
                        'Added file successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    alert.show(
                        'Failed to add file!',
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

    const handleChange = useCallback(
        (file: File | undefined) => {
            if (file) {
                uploadFile({
                    variables: {
                        file,
                        type: logFileType,
                    },
                    context: {
                        hasUpload: true,
                    },
                });
            }
        },
        [uploadFile, logFileType],
    );

    const handleClear = useCallback(() => {
        onChange(undefined, name);
    }, [onChange, name]);

    const handleFileRemoveButtonClick = useCallback((id: string) => {
        const newValue = [...(value ?? [])];
        const i = newValue.findIndex((f) => f.id === id);
        if (i === -1) {
            return;
        }

        newValue.splice(i, 1);
        onChange(newValue, name);
    }, [value, onChange, name]);

    let currentStatus: string;
    if (uploadFilePending) {
        currentStatus = 'Upload in progress';
    } else if (!value || value.length === 0) {
        currentStatus = 'No files uploaded';
    } else {
        currentStatus = Array.isArray(value) ? `${value.length} files selected` : '1 file selected';
    }

    return (
        <div className={_cs(className, styles.kitabImageInput)}>
            <FileInput
                {...otherProps}
                className={_cs(fileInputClassName, styles.input)}
                disabled={disabled || uploadFilePending}
                actions={(
                    <>
                        {actions}
                        {!hideClearButton && value && (value.length > 0) && (
                            <Button
                                onClick={handleClear}
                                disabled={disabled}
                                variant="action"
                                name={undefined}
                                title="Clear"
                            >
                                <IoClose />
                            </Button>
                        )}
                    </>
                )}
                name={name}
                overrideStatus
                status={currentStatus}
                value={null}
                onChange={handleChange}
                accept="image/*"
                multiple={false}
                maxFileSize={maxFileSize}
            >
                <MdFileUpload />
            </FileInput>
            {!hidePreview && (
                <div className={styles.previewList}>
                    {value?.map((file) => (
                        <Preview
                            key={file.id}
                            id={file.id}
                            file={file.file}
                            onRemoveButtonClick={handleFileRemoveButtonClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default KitabImageInput;
