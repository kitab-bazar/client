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

import UserSelectInput, { SearchUserType } from '#components/UserSelectInput';
import MunicipalityMultiSelectInput, { SearchMunicipalityType } from '#components/MunicipalityMultiSelectInput';
import DistrictMultiSelectInput, { SearchDistrictType } from '#components/DistrictMultiSelectInput';
import OrderWindowMultiSelectInput, { SearchOrderWindowType } from '#components/OrderWindowMultiSelectInput';
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

    const [userOptions, setUserOptions] = useState<SearchUserType[] | undefined | null>();
    const [selectedUser, setSelectedUser] = useState<string | undefined>();
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [districtFilter, setDistrictFilter] = useState<string[] | undefined>();
    const [municipalityFilter, setMunicipalityFilter] = useState<string[] | undefined>();
    const [orderWindowFilter, setOrderWindowFilter] = useState<string[] | undefined>();
    const [
        municipalityOptions,
        setMunicipalityOptions,
    ] = useState<SearchMunicipalityType[] | undefined | null>();
    const [
        orderWindowOptions,
        setOrderWindowOptions,
    ] = useState<SearchOrderWindowType[] | undefined | null>();

    const [
        districtOptions,
        setDistrictOptions,
    ] = useState<SearchDistrictType[] | undefined | null>();

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
                    <UserSelectInput
                        name="user"
                        label="User"
                        variant="general"
                        onChange={setSelectedUser}
                        value={selectedUser}
                        options={userOptions}
                        onOptionsChange={setUserOptions}
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
                    <OrderWindowMultiSelectInput
                        name="orderWindows"
                        label="Order Windows"
                        variant="general"
                        onChange={setOrderWindowFilter}
                        value={orderWindowFilter}
                        options={orderWindowOptions}
                        onOptionsChange={setOrderWindowOptions}
                    />
                    <MunicipalityMultiSelectInput
                        name="municipalities"
                        label="Municipalities"
                        variant="general"
                        onChange={setMunicipalityFilter}
                        value={municipalityFilter}
                        options={municipalityOptions}
                        onOptionsChange={setMunicipalityOptions}
                    />
                    <DistrictMultiSelectInput
                        name="districts"
                        label="Districts"
                        variant="general"
                        onChange={setDistrictFilter}
                        value={districtFilter}
                        options={districtOptions}
                        onOptionsChange={setDistrictOptions}
                    />
                </>
            )}
        >
            <OrderList
                user={selectedUser}
                status={statusFilter}
                municipalities={municipalityFilter}
                districts={districtFilter}
                orderWindows={orderWindowFilter}
            />
        </Container>
    );
}

export default Orders;
