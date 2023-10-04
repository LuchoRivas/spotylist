import { render } from '@testing-library/react';

import PlaylistTable from './playlist-table';

describe('PlaylistTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlaylistTable />);
    expect(baseElement).toBeTruthy();
  });
});
