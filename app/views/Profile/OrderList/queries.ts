import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const ORDER_SUMMARY = gql`
query OrderSummary {
    orderSummary {
        totalBooks
        totalBooksQuantity
        totalPrice
    }
}
`;
