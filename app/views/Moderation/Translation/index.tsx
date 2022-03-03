import React from 'react';
import { _cs } from '@togglecorp/fujs';

import * as strings from '#base/configs/lang';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Translation(props: Props) {
    const { className } = props;

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

    return (
        <div className={_cs(styles.translation, className)}>
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
    );
}

export default Translation;
