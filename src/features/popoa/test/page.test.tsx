import { render, screen } from '@testing-library/react';
import popoaPage from '../page';

describe('popoaPage', () => {
	it('renders correctly', () => {
		render(<popoaPage />);
		expect(screen.getByRole('heading')).toHaveTextContent('popoa Page');
	});
});
