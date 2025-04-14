import { render, screen } from '@testing-library/react';
import pucta marePage from '../page';

describe('pucta marePage', () => {
	it('renders correctly', () => {
		render(<pucta marePage />);
		expect(screen.getByRole('heading')).toHaveTextContent('pucta-mare Page');
	});
});
