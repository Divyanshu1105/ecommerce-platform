import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import userEvent from '@testing-library/user-event';
import { PaymentSummary } from './PaymentSummary';
import axios from '../../api/axiosConfig';

vi.mock('axios');

describe('PaymentSummary component', () => {
    let paymentSummary;
    let loadCart;
    let user;

    beforeEach(() => {
        paymentSummary = {
            totalItems: 10,
            productCostCents: 16930,
            shippingCostCents: 998,
            totalCostBeforeTaxCents: 17928,
            taxCents: 1793,
            totalCostCents: 19721
        };

        loadCart = vi.fn();
        user = userEvent.setup();
    });


    it('displays the correct details', async () => {
        render(
            <MemoryRouter>
                <PaymentSummary
                    paymentSummary={paymentSummary}
                    loadCart={loadCart}
                />
            </MemoryRouter>
        )

        expect(
            screen.getByText('Items (10):')
        ).toBeInTheDocument();

        expect(
            within(screen.getByTestId('payment-summary-product-cost'))
                .getByText('$169.30')
        ).toBeInTheDocument();

        expect(
            within(screen.getByTestId('payment-summary-shipping-cost'))
                .getByText('$9.98')
        ).toBeInTheDocument();

        expect(
            screen.getByTestId('payment-summary-total-before-tax')
        ).toHaveTextContent('$179.28');

        expect(
            screen.getByTestId('payment-summary-tax')
        ).toHaveTextContent('$17.93');

        expect(
            screen.getByTestId('payment-summary-total')
        ).toHaveTextContent('$197.21');
    });

    it('places an order', async () => {
        function Location() {
            const location = useLocation();
            return <div data-testid="url-path">{location.pathname}</div>;
        }

        render(
            <MemoryRouter>
                <PaymentSummary
                    paymentSummary={paymentSummary}
                    loadCart={loadCart}
                />
                <Location />
            </MemoryRouter>
        );

        const placeOrderButton = screen.getByTestId('place-order-button');
        await user.click(placeOrderButton);

        expect(axios.post).toHaveBeenCalledWith('/api/orders');

        expect(loadCart).toHaveBeenCalled();

        expect(screen.getByTestId('url-path')).toHaveTextContent('/orders');
    });

});
