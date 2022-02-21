import React, { ReactNode, useMemo, useState, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoBanOutline, IoClose, IoCheckmark } from 'react-icons/io5';
import { VscLoading } from 'react-icons/vsc';
import {
    Container,
    Pager,
    Tag,
    TagProps,
    TableView,
    TableColumn,
    TableHeaderCell,
    TableHeaderCellProps,
    createStringColumn,
    createNumberColumn,
    useModalState,
} from '@the-deep/deep-ui';

import Actions, { Props as ActionsProps } from './Actions';
import UpdatePaymentModal from './UpdatePaymentModal';

export interface Payment {
    id: string;
    date: string;
    school: {
        id: string;
        name: string;
    }
    amount: number;
    status: 'verified' | 'pending' | 'canceled';
}

const statusIconMap: { [key in Payment['status']]: ReactNode } = {
    verified: <IoCheckmark />,
    canceled: <IoClose />,
    pending: <VscLoading />,
};

const statusVariantMap: Record<Payment['status'], 'default' | 'gradient1' | 'complement1'> = {
    verified: 'default',
    pending: 'gradient1',
    canceled: 'complement1',
};

function paymentKeySelector(payment: Payment) {
    return payment.id;
}

interface Props {
    className?: string;
}

function SchoolPayments(props: Props) {
    const {
        className,
    } = props;

    const [activePage, setActivePage] = useState<number>(1);
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(10);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | undefined | null>();
    const payments: Payment[] = [];
    const [
        updatePaymentModalShown,
        showUpdatePaymentModal,
        hideUpdatePaymentModal,
    ] = useModalState(false);

    const handleEditPayment = useCallback((data: Payment) => {
        setSelectedPaymentId(data.id);
        showUpdatePaymentModal();
    }, [showUpdatePaymentModal]);

    const handleUpdateSuccess = useCallback(() => {
        console.warn('payment successfully updated');
    }, []);

    const columns = useMemo(() => {
        const statusColumn: TableColumn<
            Payment, string, TagProps, TableHeaderCellProps
        > = {
            id: 'status',
            title: 'Status',
            headerCellRenderer: TableHeaderCell,
            headerCellRendererParams: {
                sortable: false,
            },
            cellRenderer: Tag,
            cellRendererParams: (_, data) => ({
                actions: statusIconMap[data.status],
                variant: statusVariantMap[data.status],
                children: data.status,
            }),
        };
        const actionsColumn: TableColumn<
            Payment, string, ActionsProps, TableHeaderCellProps
        > = {
            id: 'actions',
            title: '',
            headerCellRenderer: TableHeaderCell,
            headerCellRendererParams: {
                sortable: false,
            },
            cellRenderer: Actions,
            cellRendererParams: (_, data) => ({
                data,
                onVerifyClick: handleEditPayment,
            }),
        };
        return [
            createStringColumn<Payment, string>(
                'paymentId',
                'Payment Id',
                (item) => item.id,
            ),
            createStringColumn<Payment, string>(
                'schoolName',
                'School',
                (item) => item.school.name,
            ),
            createNumberColumn<Payment, string>(
                'amount',
                'Amount',
                (item) => item.amount,
            ),
            statusColumn,
            actionsColumn,
        ];
    }, [handleEditPayment]);

    const selectedPayment = payments.find((payment) => payment.id === selectedPaymentId);
    return (
        <Container
            className={_cs(className)}
            heading="Payments"
            footerActions={(
                <Pager
                    activePage={activePage}
                    itemsCount={0}
                    maxItemsPerPage={maxItemsPerPage}
                    onItemsPerPageChange={setMaxItemsPerPage}
                    onActivePageChange={setActivePage}
                />
            )}
        >
            <TableView
                data={payments}
                keySelector={paymentKeySelector}
                emptyMessage="No payments available"
                columns={columns}
                filtered={false}
                errored={false}
                pending={false}
                emptyIcon={(
                    <IoBanOutline />
                )}
                messageShown
                messageIconShown
            />
            {updatePaymentModalShown && (
                <UpdatePaymentModal
                    onUpdateSuccess={handleUpdateSuccess}
                    paymentDetails={selectedPayment}
                    onModalClose={hideUpdatePaymentModal}
                />
            )}
        </Container>
    );
}

export default SchoolPayments;
