import React, { useCallback, useState } from 'react';
import {
    FileInput,
    FileInputProps,
    ImagePreview,
    useAlert,
} from '@the-deep/deep-ui';

import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    CreateActivityLogMutation,
    CreateActivityLogMutationVariables,
    ActivityLogFileType,
} from '#generated/types';

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
                type
            }
        }
    }
`;

export interface Option<N extends string> {
    id: N;
    file: {
        name: string;
        url: string;
    };
}

interface Props<T extends string, N extends string> extends Omit<FileInputProps<T>, 'overrideStatus' | 'status' | 'value' | 'onChange' | 'multiple' | 'className' | 'accept'> {
    className?: string;
    previewClassName?: string;
    fileInputClassName?: string;
    value: N | null | undefined;
    onChange: (value: N | null | undefined, name: T) => void;
    option?: Option<N>;
    onOptionChange: (value: Option<N>) => void;
    previewVisible?: boolean;
    logFileType: ActivityLogFileType,
}

function KitabImageInput<T extends string, N extends string>(props: Props<T, N>) {
    const {
        className,
        previewClassName,
        fileInputClassName,
        value: valueFromProps,
        option,
        disabled,
        name,
        onChange,
        previewVisible,
        maxFileSize = 2,
        logFileType,
        ...otherProps
    } = props;

    const [value, setValue] = useState<File | undefined>();
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
                } = createActivityLogFile;

                if (ok) {
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
            setValue(file);

            if (file) {
                uploadFile({
                    variables: {
                        data: {
                            file,
                            type: logFileType,
                        },
                    },
                    context: {
                        hasUpload: true,
                    },
                });
            } else {
                onChange(undefined, name);
            }
        },
        [uploadFile, name, onChange, logFileType],
    );

    let currentStatus: string;
    if (uploadFilePending) {
        currentStatus = 'Upload in progress';
    } else if (!valueFromProps) {
        currentStatus = 'No files uploaded';
    } else if (option && option.id === valueFromProps) {
        currentStatus = option.file.name;
    } else {
        currentStatus = '?';
    }

    let src: string;
    let alt: string;
    if (option) {
        src = option.file.url;
        alt = option.file.url;
    } else if (value) {
        src = URL.createObjectURL(value);
        alt = value.name;
    }

    return (
        <div className={className}>
            <FileInput
                {...otherProps}
                className={fileInputClassName}
                disabled={disabled || uploadFilePending}
                name={name}
                overrideStatus
                status={currentStatus}
                value={value}
                onChange={handleChange}
                accept="image/*"
                multiple={false}
                maxFileSize={maxFileSize}
            />
            { previewVisible && src && (
                <ImagePreview
                    className={previewClassName}
                    src={src}
                    hideTools
                    alt={alt}
                />
            )}
        </div>
    );
}

export default KitabImageInput;
