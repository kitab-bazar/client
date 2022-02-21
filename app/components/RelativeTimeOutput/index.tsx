import React, { memo, useMemo, useContext } from 'react';
import {
    isNotDefined,
    isDefined,
    _cs,
} from '@togglecorp/fujs';

import LanguageContext, { Lang } from '#base/context/LanguageContext';

import styles from './styles.css';

function mod(foo: number, bar: number) {
    const remainder = foo % bar;
    const divident = Math.floor(foo / bar);
    return [divident, remainder];
}

function formatRelativeTime(seconds: number, lang: Lang): string {
    const relativeTimeFormat = new Intl.RelativeTimeFormat(lang, { style: 'long' });

    if (Math.abs(seconds) >= 86400) {
        const [days] = mod(seconds, 86400);
        return relativeTimeFormat.format(days, 'day');
    }
    if (Math.abs(seconds) >= 3600) {
        const [hours] = mod(seconds, 3600);
        return relativeTimeFormat.format(hours, 'hour');
    }
    if (Math.abs(seconds) >= 60) {
        const [minutes] = mod(seconds, 60);
        return relativeTimeFormat.format(minutes, 'minute');
    }

    if (Math.abs(seconds) >= 0) {
        return relativeTimeFormat.format(seconds, 'second');
    }
    return '';
}

function difference(foo: Date, bar?: Date): number {
    return Math.floor((foo.getTime() - (bar ?? new Date()).getTime()) / 1000);
}

export interface Props {
    className?: string;
    invalidText?: React.ReactNode;
    value: number | string | undefined | null,
    tooltip?: number | string | null | undefined;
}

function RelativeTimeOutput(props: Props) {
    const {
        className,
        value,
        tooltip,
        invalidText,
    } = props;

    const {
        lang,
    } = useContext(LanguageContext);

    const val = useMemo(
        () => {
            if (isNotDefined(value)) {
                return invalidText;
            }
            const datetimeAtEod = `${value}T23:59:59.999`;
            const diff = difference(new Date(datetimeAtEod));
            const newValue = formatRelativeTime(
                diff,
                lang,
            );

            return newValue;
        },
        [value, lang, invalidText],
    );

    return (
        <div
            className={_cs(styles.relativeTimeOutput, className)}
            title={isDefined(tooltip) ? String(tooltip) : undefined}
        >
            {val}
        </div>
    );
}

export default memo(RelativeTimeOutput);
