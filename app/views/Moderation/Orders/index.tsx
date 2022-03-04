import React, { useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    SelectInput,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    OrderStatusOptionsQuery,
    OrderStatusOptionsQueryVariables,
} from '#generated/types';
import { enumKeySelector, enumLabelSelector } from '#utils/types';

import SchoolSelectInput, { SearchUserType } from '#components/SchoolSelectInput';
import OrderList from '#views/Profile/OrderList';
import styles from './styles.css';

interface Props {
    className?: string;
}

const ORDER_STATUS_OPTIONS = gql`
    query OrderStatusOptions {
        orderStatusEnum: __type(name: "OrderStatusEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;

function Orders(props: Props) {
    const {
        className,
    } = props;

    const [schoolOptions, setSchoolOptions] = useState<SearchUserType[] | undefined | null>();
    const [selectedSchool, setSelectedSchool] = useState<string | undefined>();
    const [statusFilter, setStatusFilter] = useState<string | undefined>();

    const {
        data: orderStatusOptionsResponse,
        loading: paymentFieldOptionsLoading,
    } = useQuery<OrderStatusOptionsQuery, OrderStatusOptionsQueryVariables>(
        ORDER_STATUS_OPTIONS,
    );

    return (
        <Container
            className={_cs(styles.orders, className)}
            heading="Orders"
            headingSize="small"
            headerDescriptionClassName={styles.filters}
            headerDescription={(
                <>
                    <SchoolSelectInput
                        name="school"
                        label="School"
                        variant="general"
                        onChange={setSelectedSchool}
                        value={selectedSchool}
                        options={schoolOptions}
                        onOptionsChange={setSchoolOptions}
                    />
                    <SelectInput
                        name="status"
                        label="Status"
                        placeholder="All"
                        className={styles.filterInput}
                        keySelector={enumKeySelector}
                        labelSelector={enumLabelSelector}
                        options={orderStatusOptionsResponse?.orderStatusEnum?.enumValues}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        disabled={paymentFieldOptionsLoading}
                        variant="general"
                    />
                </>
            )}
        >
            <OrderList
                school={selectedSchool}
                status={statusFilter}
            />
        </Container>
    );
}

export default Orders;
