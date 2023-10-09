import { render } from '@testing-library/react';

import PlaylistGrid from './playlist-grid';

describe('PlaylistGrid', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlaylistGrid />);
    expect(baseElement).toBeTruthy();
  });
});
