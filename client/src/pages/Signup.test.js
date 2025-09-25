
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'; 
import Signup from './Signup';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('Signup Page', () => {
    test('renders all required form elements for registration', () => {
        renderWithRouter(<Signup />);

        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toBeInTheDocument();
        
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toBeInTheDocument();
        
        const passwordInput = screen.getByLabelText(/password/i);
        expect(passwordInput).toBeInTheDocument();
        
        const submitButton = screen.getByRole('button', { name: /register|sign up/i });
        expect(submitButton).toBeInTheDocument();
    });
});

test('displays validation errors on empty submission', async () => {
    
    renderWithRouter(<Signup />);

    const submitButton = screen.getByRole('button', { name: /register/i });

    await userEvent.click(submitButton);

    
    const requiredErrorElements = await screen.findAllByText(/Name is required/i);
    expect(requiredErrorElements.length).toBeGreaterThanOrEqual(1);
    
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();

    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
});