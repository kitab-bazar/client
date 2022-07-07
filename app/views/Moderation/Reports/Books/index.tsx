import React, { useMemo, useState } from 'react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Container, SelectInput } from '@the-deep/deep-ui';
import styles from './styles.css';
import { ReportsQuery } from '#generated/types';

type booksPerCategoryType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['booksPerCategory'];
type booksPerLanguageType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['booksPerLanguage'];
type booksPerGradeType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['booksPerGrade'];
type booksPerPublisherType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['booksPerPublisher'];
type booksPerPublisherPerCategoryType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['booksPerPublisherPerCategory'];
interface BooksProps {
    booksPerCategory: booksPerCategoryType;
    booksPerLanguage: booksPerLanguageType;
    booksPerGrade: booksPerGradeType;
    booksPerPublisher: booksPerPublisherType;
    booksPerPublisherPerCategory: booksPerPublisherPerCategoryType;
    publisherColor: {
        publisher: string | undefined;
        fill: string;
    }[] | undefined
}
interface Option {
    name: string;
    description: string | undefined;
    color: string | undefined;
}

export const bookKeySelector = (d: Option) => d.name ?? '';
export const bookLabelSelector = (d: Option) => d.description ?? '';

function Books(props: BooksProps) {
    const {
        booksPerCategory,
        booksPerLanguage,
        booksPerPublisher,
        booksPerGrade,
        booksPerPublisherPerCategory,
        publisherColor,
    } = props;

    const [value, setValue] = useState<string | undefined>('Publisher');
    const [publisherValue, setPublisherValue] = useState<string | undefined>('Parichaya');

    const options: Option[] = [{
        name: 'Publisher',
        description: 'Publisher',
        color: 'var(--dui-color-cornflower-blue)',
    },
    {
        name: 'Category',
        description: 'Category',
        color: 'var(--dui-color-elton-blue)',
    },
    {
        name: 'Grade',
        description: 'Grade',
        color: 'var(--dui-color-maximum-yellow-red)',
    },
    {
        name: 'Language',
        description: 'Language',
        color: 'var(--dui-color-rose-madder)',
    },
    ];

    const categorizedPublisherOption = useMemo(() => (
        booksPerPublisherPerCategory
            ?.map((publisher) => {
                const color = publisherColor?.find(
                    (item) => item.publisher === publisher?.publisherName,
                );

                return {
                    name: publisher?.publisherName ?? '',
                    description: publisher?.publisherName,
                    color: color?.fill,
                };
            })
    ), [booksPerPublisherPerCategory, publisherColor]);

    const publisherOptions = categorizedPublisherOption?.find(
        (newOptions) => newOptions.name === publisherValue,
    );

    const booksOptions = options.find((newOptions) => newOptions.name === value);

    const numberOfCategorizedBooksPerPublisher = booksPerPublisherPerCategory
        ?.find((item) => item?.publisherName === publisherValue);

    const onBooksSelectChange = (newOption?: string) => {
        setValue(newOption);
    };

    const onPublisherSelectChange = (newPublisher?: string) => {
        setPublisherValue(newPublisher);
    };

    return (
        <Container
            className={styles.reports}
            heading="Books"
            headingSize="small"
        >
            <Container
                className={styles.reports}
                heading={`Number of Books per ${value}`}
                headingSize="extraSmall"
                headerDescriptionClassName={styles.filters}
                headerDescription={(
                    <>
                        <SelectInput
                            className={styles.filterInput}
                            name="books"
                            placeholder="Select"
                            keySelector={bookKeySelector}
                            labelSelector={bookLabelSelector}
                            options={options}
                            value={value}
                            onChange={onBooksSelectChange}
                            variant="general"
                        />
                    </>
                )}
            >
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        {booksOptions?.name === 'Publisher' && (
                            <ResponsiveContainer>
                                <BarChart
                                    margin={{
                                        left: 10,
                                        top: 10,
                                        right: 10,
                                        bottom: 30,
                                    }}
                                    data={booksPerPublisher ?? undefined}
                                >
                                    <Tooltip />
                                    <XAxis
                                        dataKey="publisherName"
                                        label={{
                                            value: 'Publishers',
                                            position: 'bottom',
                                            textAnchor: 'middle',
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Number of Books',
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle',
                                        }}
                                        padding={{
                                            top: 30,
                                        }}
                                    />
                                    <Bar
                                        dataKey="numberOfBooks"
                                        label={{ position: 'top' }}
                                        fill={booksOptions?.color}
                                        name="Number of Books"
                                        barSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {booksOptions?.name === 'Category' && (
                            <ResponsiveContainer>
                                <BarChart
                                    margin={{
                                        left: 10,
                                        top: 10,
                                        right: 10,
                                        bottom: 30,
                                    }}
                                    data={booksPerCategory ?? undefined}
                                >
                                    <Tooltip />
                                    <XAxis
                                        dataKey="category"
                                        label={{
                                            value: 'Categories',
                                            position: 'bottom',
                                            textAnchor: 'middle',
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Number of Books',
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle',
                                        }}
                                        padding={{
                                            top: 30,
                                        }}
                                    />
                                    <Bar
                                        dataKey="numberOfBooks"
                                        label={{ position: 'top' }}
                                        fill={booksOptions?.color}
                                        name="Number of Books"
                                        barSize={50}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {booksOptions?.name === 'Grade' && (
                            <ResponsiveContainer>
                                <BarChart
                                    margin={{
                                        left: 10,
                                        top: 10,
                                        right: 10,
                                        bottom: 30,
                                    }}
                                    data={booksPerGrade ?? undefined}
                                >
                                    <Tooltip />
                                    <XAxis
                                        dataKey="grade"
                                        label={{
                                            value: 'Grades',
                                            position: 'bottom',
                                            textAnchor: 'middle',
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Number of Books',
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle',
                                        }}
                                        padding={{
                                            top: 30,
                                        }}
                                    />
                                    <Bar
                                        dataKey="numberOfBooks"
                                        label={{ position: 'top' }}
                                        fill={booksOptions?.color}
                                        name="Number of Books"
                                        barSize={50}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {booksOptions?.name === 'Language' && (
                            <ResponsiveContainer>
                                <BarChart
                                    margin={{
                                        left: 10,
                                        top: 10,
                                        right: 10,
                                        bottom: 30,
                                    }}
                                    data={booksPerLanguage ?? undefined}
                                >
                                    <Tooltip />
                                    <XAxis
                                        dataKey="language"
                                        label={{
                                            value: 'Languages',
                                            position: 'bottom',
                                            textAnchor: 'middle',
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Number of Books',
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: 'middle',
                                        }}
                                        padding={{
                                            top: 30,
                                        }}
                                    />
                                    <Bar
                                        dataKey="numberOfBooks"
                                        label={{ position: 'top' }}
                                        fill={booksOptions?.color}
                                        name="Number of Books"
                                        barSize={50}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </Container>
            <Container
                className={styles.reports}
                heading={`Number of Books per ${publisherValue}`}
                headingSize="extraSmall"
                headerDescriptionClassName={styles.filters}
                headerDescription={(
                    <>
                        <SelectInput
                            className={styles.filterInput}
                            name="categorizedNoOfBooks"
                            placeholder="Select"
                            keySelector={bookKeySelector}
                            labelSelector={bookLabelSelector}
                            options={categorizedPublisherOption}
                            value={publisherValue}
                            onChange={onPublisherSelectChange}
                            variant="general"
                        />
                    </>
                )}
            >
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                margin={{
                                    left: 10,
                                    top: 10,
                                    right: 10,
                                    bottom: 30,
                                }}
                                data={numberOfCategorizedBooksPerPublisher?.categories ?? undefined}
                            >
                                <Tooltip />
                                <XAxis
                                    dataKey="category"
                                    label={{
                                        value: 'Categories',
                                        position: 'bottom',
                                        textAnchor: 'middle',
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value: 'Number of Books',
                                        angle: -90,
                                        position: 'insideLeft',
                                        textAnchor: 'middle',
                                    }}
                                    padding={{
                                        top: 30,
                                    }}
                                />
                                <Bar
                                    dataKey="numberOfBooks"
                                    label={{ position: 'top' }}
                                    name="Number of Books"
                                    fill={publisherOptions?.color}
                                    barSize={50}
                                />
                                <Legend
                                    verticalAlign="top"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </Container>
        </Container>
    );
}

export default Books;
