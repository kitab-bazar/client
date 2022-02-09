import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const CART_ITEMS = gql`
query CartItemsMeta {
    cartItems {
        totalCount
        grandTotalPrice
    }
}
`;
