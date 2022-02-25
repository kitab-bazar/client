import React, { memo, useMemo } from 'react';
import {
    isNotDefined,
    isDefined,
    _cs,
} from '@togglecorp/fujs';
import { common } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import NumberOutput from '#components/NumberOutput';

import styles from './styles.css';

function mod(foo: number, bar: number) {
    const remainder = foo % bar;
    const divident = Math.floor(foo / bar);
    return [divident, remainder];
}

interface Format {
    value: number;
    unit: 'day' | 'hour' | 'minute' | 'second';
}

function formatRelativeTime(seconds: number): Format | undefined {
    if (Math.abs(seconds) >= 86400) {
        const [days] = mod(seconds, 86400);
        return { value: days, unit: 'day' };
    }
    if (Math.abs(seconds) >= 3600) {
        const [hours] = mod(seconds, 3600);
        return { value: hours, unit: 'hour' };
    }
    if (Math.abs(seconds) >= 60) {
        const [minutes] = mod(seconds, 60);
        return { value: minutes, unit: 'minute' };
    }

    if (Math.abs(seconds) >= 0) {
        return { value: seconds, unit: 'second' };
    }
    return undefined;
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

    const strings = useTranslation(common);

    const val = useMemo(
        () => {
            if (isNotDefined(value)) {
                return invalidText;
            }
            const datetimeAtEod = `${value}T23:59:59.999`;
            const diff = difference(new Date(datetimeAtEod));
            const newValue = formatRelativeTime(
                diff,
            );
            if (isNotDefined(newValue)) {
                return invalidText;
            }

            return (
                <>
                    <NumberOutput
                        value={newValue.value}
                    />
                    <div>
                        {newValue.unit === 'day' && strings.dayLabel}
                        {newValue.unit === 'hour' && strings.hourLabel}
                        {newValue.unit === 'minute' && strings.minuteLabel}
                        {newValue.unit === 'second' && strings.secondLabel}
                    </div>
                </>
            );
        },
        [value, invalidText, strings],
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
