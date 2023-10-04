import { render } from '@testing-library/react';

import SongItem from './song-item';

describe('SongItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SongItem />);
    expect(baseElement).toBeTruthy();
  });
});
