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
    ScatterChart,
    Scatter,
    ZAxis,
} from 'recharts';
import { Container, SelectInput } from '@the-deep/deep-ui';
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

const orderedAndCost: any = [{
    name: 'School A',
    noOfBooksOrdered: 55,
    totalCost: 2000,
},
{
    name: 'School B',
    noOfBooksOrdered: 78,
    totalCost: 3000,
},
{
    name: 'School C',
    noOfBooksOrdered: 78,
    totalCost: 2500,
},
{
    name: 'School D',
    noOfBooksOrdered: 78,
    totalCost: 2750,
},
];

const highestLowestBook: any = [{
    publisher: 'Ekta',
    Highest_book: 150,
    lowest_book: 50,
},
{
    publisher: 'bhudipuran',
    Highest_book: 180,
    lowest_book: 30,
},
];

let categoryEkta: any[] = [];
let categoryBhudipuran: any[] = [];

const categoryBooks: any = [
    categoryEkta = [
        {
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
    ],

    categoryBhudipuran = [
        {
            id: 1,
            name: 'story',
            number: 21,
        },
        {
            id: 2,
            name: 'poem',
            number: 25,
        },
        {
            id: 3,
            name: 'song',
            number: 40,
        },
    ],
];

function Books() {
    const [data, setData] = useState<string[]>(publisher);
    const [value, setValue] = useState<string>('publisher');
    const [color, setColor] = useState<string>('#0088FE');

    const onBooksSelectChange = (e: any) => {
        setValue(e);
        if (e === 'publisher') {
            setData(publisher);
            setColor('#0088FE');
        } else if (e === 'category') {
            setData(category);
            setColor('#00C49F');
        } else if (e === 'grade') {
            setData(grade);
            setColor('#FFBB28');
        }
    };

    const customizedPieLegend = () => (
        <ul>
            {
                categoryEkta.map((entry: any) => (
                    <li
                        key={`item-${entry.id}`}
                    >
                        {entry.name}
                    </li>
                ))
            }
        </ul>
    );

    return (
        <Container
            className={styles.reports}
            heading="Books"
            headingSize="extraSmall"
        >
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
                                data={data}
                            >
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dataKeyX" />
                                <YAxis />
                                <Bar
                                    dataKey="numberOfBooks"
                                    label={{ position: 'top' }}
                                    fill={color}
                                    name="Number of Books"
                                />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>Number of books per</div>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Tooltip />
                                <Legend content={customizedPieLegend} />
                                {categoryBooks.map((entry: any) => (
                                    <Pie
                                        dataKey="number"
                                        data={entry}
                                        label
                                        paddingAngle={5}
                                        innerRadius={60}
                                        outerRadius={80}
                                        cx="50%"
                                        cy="50%"
                                    >
                                        {entry.map((el: any) => (
                                            <Cell
                                                key={`cell-${el.id}`}
                                                fill={COLORS[el.id % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                ))}
                            </PieChart>
                        </ResponsiveContainer>
                        <div>Number of books per category for each publisher</div>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <ScatterChart>
                                <Tooltip />
                                <ZAxis dataKey="name" name="Name" />
                                <XAxis dataKey="noOfBooksOrdered" name="Number of Books Ordered" />
                                <YAxis dataKey="totalCost" name="Total Cost" />
                                <Scatter fill="#F87060" name="name" data={orderedAndCost} />
                            </ScatterChart>
                        </ResponsiveContainer>
                        <div>Number of books and total cost per school</div>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                data={highestLowestBook}
                            >
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dataKeyX" />
                                <YAxis />
                                <Bar
                                    dataKey="Highest_book"
                                    label={{ position: 'top' }}
                                    fill="#CF5C36"
                                    name="Number of highest selling books"
                                />
                                <Bar
                                    dataKey="lowest_book"
                                    label={{ position: 'top' }}
                                    fill="#1E3888"
                                    name="Number of lowest selling books"
                                />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>Number of Highest and Lowest selling books by publisher</div>
                    </div>
                </div>
            </Container>
        </Container>
    );
}

export default Books;
