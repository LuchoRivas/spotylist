import { SpotifyPlaylist } from '@spotylist/common';
import './playlist-grid.scss';

/* eslint-disable-next-line */
export interface PlaylistGridProps {
  onClick: ({
    playlistId,
    name,
    imageUrl,
  }: {
    playlistId: string;
    name: string;
    imageUrl: string;
  }) => void;
  userPlaylists: SpotifyPlaylist[];
}

export function PlaylistGrid({ userPlaylists, onClick }: PlaylistGridProps) {
  return (
    <div className="grid-container">
      {userPlaylists.map((userPlaylist) => (
        <div
          className="grid-item"
          key={userPlaylist.id}
          onClick={() =>
            onClick({
              playlistId: userPlaylist.id,
              name: userPlaylist.name,
              imageUrl: userPlaylist.images[1]
                ? userPlaylist.images[1].url
                : userPlaylist.images[0].url,
            })
          }
        >
          <strong>{userPlaylist.name}</strong>
          <img
            src={
              userPlaylist.images[1]
                ? userPlaylist.images[1].url
                : userPlaylist.images[0].url
            }
            alt={`${userPlaylist.id}-pl-cover`}
          />

          <span>{`${userPlaylist.tracks.total} tracks`}</span>
        </div>
      ))}
    </div>
  );
}

export default PlaylistGrid;
