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

const locationOptions: Option[] = [
    {
        name: 'per_district',
        description: 'Per district',
    },
    {
        name: 'per_municipality',
        description: 'Per municipality',
    },
];

const usersPerDistrict: any = [{
    name: 'Gulmi',
    number: 100,
},
{
    name: 'kathmandu',
    number: 50,
},
];

const usersPerMunicipality: any = [{
    name: 'KMC',
    number: 100,
},
{
    name: 'Madhyapur Thimi',
    number: 50,
},
];

const deliveryDistrict: any = [{
    name: 'Gulmi',
    number: 25,
},
{
    name: 'kailali',
    number: 30,
},
{
    name: 'Bajhang',
    number: 41,
},
];
function Locations() {
    const [locationValue, setLocationValue] = useState<string>('per_district');
    const [locationData, setLocationData] = useState<string[]>(usersPerDistrict);

    const onLocationSelectChange = (e: any) => {
        setLocationValue(e);
        if (e === 'per_district') {
            setLocationData(usersPerDistrict);
        } else if (e === 'per_municipality') {
            setLocationData(usersPerMunicipality);
        }
    };

    return (
        <Container
            className={styles.reports}
            heading="Location"
            headingSize="extraSmall"
        >
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of districts reached"
                    value={55}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of municipalities"
                    value={200}
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
                            className={styles.filterInputMedium}
                            name="location"
                            label="Choose Category"
                            placeholder="Select"
                            keySelector={enumKeySelector}
                            labelSelector={enumLabelSelector}
                            options={locationOptions}
                            value={locationValue}
                            onChange={onLocationSelectChange}
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
                                data={locationData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Bar
                                    dataKey="number"
                                    fill="#82ca9d"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                width={150}
                                height={40}
                                data={deliveryDistrict}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Bar
                                    dataKey="number"
                                    fill="#82ca9d"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Container>
        </Container>
    );
}
export default Locations;
