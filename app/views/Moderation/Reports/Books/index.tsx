import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Label,
} from 'recharts';
import { Container, SelectInput, InformationCard } from '@the-deep/deep-ui';
import styles from './styles.css';
import { enumKeySelector, enumLabelSelector } from '#utils/types';

interface Option {
    name: string;
    description: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const options: Option[] = [{
    name: 'publisher',
    description: 'Publisher',
},
{
    name: 'category',
    description: 'Category',
},
{
    name: 'grade',
    description: 'Grade',
},
{
    name: 'language',
    description: 'language',
},
{
    name: 'per_category_each_publisher',
    description: 'Per Category for each publisher',
},

];
const grade: any = [

    {
        dataKeyX: 1,
        numberOfBooks: 50,
    },
    {
        dataKeyX: 2,
        numberOfBooks: 46,
    },
    {
        dataKeyX: 3,
        numberOfBooks: 46,
    },
];

const category: any = [
    {
        dataKeyX: 'Story',
        numberOfBooks: 47,
    },
    {
        dataKeyX: 'Poem',
        numberOfBooks: 12,
    },
    {
        dataKeyX: 'Picture Story',
        numberOfBooks: 2,
    },
    {
        dataKeyX: 'Song',
        numberOfBooks: 3,
    },
    {
        dataKeyX: 'Picture',
        numberOfBooks: 1,
    },
];

const publisher: any = [
    {
        dataKeyX: 'Bhundipuran',
        numberOfBooks: 47,
    },
    {
        dataKeyX: 'Ekta',
        numberOfBooks: 12,
    },
    {
        dataKeyX: 'Kathalaya',
        numberOfBooks: 2,
    },
    {
        dataKeyX: 'Parichaya',
        numberOfBooks: 3,
    },
];

const categoryEkta: any = [{
    id: 1,
    name: 'story',
    number: 11,
},
{
    id: 2,
    name: 'poem',
    number: 15,
},
{
    id: 3,
    name: 'song',
    number: 20,
},
];

const categoryBhudipuran: any = [{
    id: 1,
    name: 'story',
    number: 13,
},
{
    id: 2,
    name: 'poem',
    number: 17,
},
{
    id: 3,
    name: 'song',
    number: 25,
},
];

const highestLowestBook: any = [{
    publisher: 'Ekta',
    Highest_book: 150,
    lowest_book: 50,
},
{
    publisher: 'bhudipuran',
    highest_book: 200,
    lowest_book: 30,
},
];

function Books() {
    const [data, setData] = useState<string[]>(publisher);
    const [value, setValue] = useState<string>('publisher');

    const onBooksSelectChange = (e: any) => {
        setValue(e);
        if (e === 'publisher') {
            setData(publisher);
        } else if (e === 'category') {
            setData(category);
        } else if (e === 'grade') {
            setData(grade);
        }
    };

    return (
        <Container
            className={styles.reports}
            heading="Books"
            headingSize="extraSmall"
        >
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of publishers"
                    value={10}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of incentive books"
                    value={14}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of books on the Platform"
                    value={154}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
            <Container
                className={styles.reports}
                heading="Choose Category"
                headingSize="extraSmall"
                headerDescriptionClassName={styles.filters}
                headerDescription={(
                    <>
                        <SelectInput
                            className={styles.filterInput}
                            name="books"
                            placeholder="Select"
                            keySelector={enumKeySelector}
                            labelSelector={enumLabelSelector}
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
                        <ResponsiveContainer>
                            <BarChart
                                width={150}
                                height={40}
                                data={data}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dataKeyX" />
                                <YAxis />
                                <Bar
                                    dataKey="numberOfBooks"
                                    fill="#82ca9d"
                                    label={{ position: 'top' }}
                                />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <PieChart
                                width={150}
                                height={40}
                            >
                                <Pie
                                    dataKey="number"
                                    data={categoryEkta}
                                    label
                                    cx={120}
                                    cy={200}
                                    paddingAngle={5}
                                    innerRadius={60}
                                    outerRadius={80}
                                >
                                    {categoryEkta.map((entry: any) => (
                                        <Cell
                                            key={`cell-${entry.id}`}
                                            fill={COLORS[entry.id % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                                <Pie
                                    dataKey="number"
                                    data={categoryBhudipuran}
                                    label
                                    cx={350}
                                    cy={200}
                                    paddingAngle={5}
                                    innerRadius={60}
                                    outerRadius={80}
                                >
                                    {categoryBhudipuran.map((entry: any) => (
                                        <Cell
                                            key={`cell-${entry.id}`}
                                            fill={COLORS[entry.id % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Container>
        </Container>
    );
}

export default Books;
