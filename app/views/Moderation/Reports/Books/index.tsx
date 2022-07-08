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
import { ReportsQuery } from '#generated/types';
import styles from './styles.css';

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
    description: string;
    color: string | undefined;
}

export const bookKeySelector = (d: Option) => d.name;
export const bookLabelSelector = (d: Option) => d.description;

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

function Books(props: BooksProps) {
    const {
        booksPerCategory,
        booksPerLanguage,
        booksPerPublisher,
        booksPerGrade,
        booksPerPublisherPerCategory,
        publisherColor,
    } = props;

    const [booksOptionValue, setBooksOptionValue] = useState<string | undefined>('Publisher');
    const [publisherOptionValue, setPublisherOptionValue] = useState<string | undefined>('Parichaya');

    const categorizedPublisherOption = useMemo(() => (
        booksPerPublisherPerCategory
            ?.map((publisher) => {
                const color = publisherColor?.find(
                    (item) => item.publisher === publisher?.publisherName,
                );

                return {
                    name: publisher?.publisherName ?? '',
                    description: publisher?.publisherName ?? '',
                    color: color?.fill,
                };
            })
    ), [booksPerPublisherPerCategory, publisherColor]);

    const publisherOption = categorizedPublisherOption?.find(
        (newOptions) => newOptions.name === publisherOptionValue,
    );

    const booksOption = options.find((newOptions) => newOptions.name === booksOptionValue);

    const categorizedBooksPerPublisher = booksPerPublisherPerCategory
        ?.find((item) => item?.publisherName === publisherOptionValue);

    return (
        <Container
            className={styles.reports}
            heading="Books"
            headingSize="small"
        >
            <Container
                className={styles.reports}
                heading={`Number of Books per ${booksOptionValue}`}
                headingSize="extraSmall"
                headerDescriptionClassName={styles.filters}
                headerDescription={(
                    <SelectInput
                        className={styles.filterInput}
                        name="books"
                        placeholder="Select"
                        keySelector={bookKeySelector}
                        labelSelector={bookLabelSelector}
                        options={options}
                        value={booksOptionValue}
                        onChange={
                            (newOption) => { setBooksOptionValue(newOption); }
                        }
                        variant="general"
                    />
                )}
            >
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        {booksOption?.name === 'Publisher' && (
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
                                        fill={booksOption?.color}
                                        name="Number of Books"
                                        barSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {booksOption?.name === 'Category' && (
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
                                        fill={booksOption?.color}
                                        name="Number of Books"
                                        barSize={50}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {booksOption?.name === 'Grade' && (
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
                                        fill={booksOption?.color}
                                        name="Number of Books"
                                        barSize={50}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {booksOption?.name === 'Language' && (
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
                                        fill={booksOption?.color}
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
                heading={`Number of Books per ${publisherOptionValue}`}
                headingSize="extraSmall"
                headerDescriptionClassName={styles.filters}
                headerDescription={(
                    <SelectInput
                        className={styles.filterInput}
                        name="categorizedNoOfBooks"
                        placeholder="Select"
                        keySelector={bookKeySelector}
                        labelSelector={bookLabelSelector}
                        options={categorizedPublisherOption}
                        value={publisherOptionValue}
                        onChange={
                            (newOption) => { setPublisherOptionValue(newOption); }
                        }
                        variant="general"
                    />
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
                                data={categorizedBooksPerPublisher?.categories ?? undefined}
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
                                    fill={publisherOption?.color}
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
