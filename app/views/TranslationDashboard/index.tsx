import React from 'react';
import stringifyObject from 'stringify-object';
import {
    utils as xlsxUtils,
    writeFile as xlsxWriteFile,
    read as xlsxRead,
} from 'xlsx';
import {
    _cs,
    listToGroupList,
    mapToMap,
    listToMap,
} from '@togglecorp/fujs';
import {
    Button,
    useButtonFeatures,
    useAlert,
} from '@the-deep/deep-ui';

import * as strings from '#base/configs/lang';

import styles from './styles.css';

export function getFileName(suffix: string, extension = 'csv') {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    return `${suffix}-${year}-${month}-${day}-${h}-${m}-${s}.${extension}`;
}

interface Props {
    className?: string;
}

function TranslationDashboard(props: Props) {
    const { className } = props;
    const alert = useAlert();
    const fileInputProps = useButtonFeatures({
        variant: 'tertiary',
    });

    const stringList = React.useMemo(() => {
        type StringKeyType = keyof typeof strings;
        const strKeys = Object.keys(strings) as StringKeyType[];

        return strKeys.map((sk) => {
            const langObj = strings[sk] as Record<string, Record<'ne' | 'en', string>>;
            const langObjectKeys = Object.keys(langObj);

            return langObjectKeys.map((lk) => {
                const currentString = langObj[lk];

                return [
                    `${sk}:${lk}`,
                    currentString.en,
                    currentString.ne,
                ];
            });
        }).flat(1);
    }, []);

    const handleExportButtonClick = React.useCallback(() => {
        const ws = xlsxUtils.aoa_to_sheet([
            ['ID', 'en', 'ne'],
            ...stringList,
        ]);

        const wb = xlsxUtils.book_new();
        xlsxUtils.book_append_sheet(wb, ws);

        xlsxWriteFile(wb, getFileName('kitab-strings', 'xlsx'));
    }, [stringList]);

    const handleFileInputChange = React.useCallback((changeEvent) => {
        const file = changeEvent.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readEvent) => {
                const workbook = xlsxRead(readEvent?.target?.result, { type: 'binary' });
                const firstSheet = workbook.SheetNames[0];
                const rowList = xlsxUtils.sheet_to_json<{
                    ID: string;
                    en: string;
                    ne: string;
                }>(workbook.Sheets[firstSheet]);

                const groupedObjects = listToGroupList(
                    rowList,
                    (row) => row.ID.split(':')[0],
                    (row) => ({
                        key: row.ID.split(':')[1],
                        en: row.en,
                        ne: row.ne,
                    }),
                );

                const langObjects = mapToMap(
                    groupedObjects,
                    (k) => k,
                    (v) => listToMap(
                        v,
                        (d) => d.key,
                        (d) => ({
                            en: d.en,
                            ne: d.ne,
                        }),
                    ),
                );

                let clipboardText = '';
                Object.keys(langObjects).forEach((key) => {
                    clipboardText += `export const ${key} = ${stringifyObject(langObjects[key], { singleQuotes: true, indent: '    ' })}\r\n\r\n`;
                });

                navigator.clipboard.writeText(clipboardText);
            };
            reader.readAsBinaryString(file);
            alert.show('Copied to clipboard');
        }
    }, [alert]);

    return (
        <div className={_cs(styles.translationDashboard, className)}>
            <div className={styles.actions}>
                <label
                    {...fileInputProps}
                    htmlFor="kitab-string-import"
                >
                    Import from xlsx
                    <input
                        id="kitab-string-import"
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileInputChange}
                        hidden
                    />
                </label>
                <Button
                    name={undefined}
                    onClick={handleExportButtonClick}
                >
                    Export
                </Button>
            </div>
            <div className={styles.translationItemList}>
                {stringList.map((str) => (
                    <div
                        className={styles.translationItem}
                        key={str[0]}
                    >
                        <div className={styles.key}>
                            {str[0]}
                        </div>
                        <div className={styles.en}>
                            {str[1]}
                        </div>
                        <div className={styles.ne}>
                            {str[2]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TranslationDashboard;
