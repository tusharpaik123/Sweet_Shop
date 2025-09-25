
import { render, screen } from '@testing-library/react';
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