import { SpotifyTrackItem } from '@spotylist/common';
import { useSortable } from '@dnd-kit/sortable';

/* eslint-disable-next-line */
export interface SongItemProps {
  playlistTrack: SpotifyTrackItem;
  index: number;
}

export function SongItem({ playlistTrack }: SongItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: playlistTrack.id });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <tr ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <td>
        {playlistTrack.track.artists.map((artist) => artist.name).join(', ')}
      </td>
      <td>{playlistTrack.track.name}</td>
      <td>{playlistTrack.track.album.name}</td>
    </tr>
  );
}

export default SongItem;
