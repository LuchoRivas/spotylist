import { Playlist, SpotifyTrackItem } from '@spotylist/common';
import SongItem from '../song-item/song-item';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface PlaylistTableProps {
  playlist: Playlist;
  onDrag: (orderedPlaylist: SpotifyTrackItem[]) => void;
  onChange: any;
}

export type SortColumn = 'artist' | 'song' | 'album';
export type SortDirection = 'asc' | 'desc';

export function PlaylistTable({
  playlist,
  onDrag,
  onChange,
}: PlaylistTableProps) {
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc'); // 'asc' o 'desc'

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSort = (columnName: SortColumn) => {
    let newDirection: SortDirection = 'asc';

    if (sortedColumn === columnName) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    setSortedColumn(columnName);
    setSortDirection(newDirection);

    onChange(playlist.items, columnName, newDirection);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ active, over }) => {
        if (!over) return;

        const activeIndex = playlist.items.findIndex(
          ({ id }) => id === active.id
        );
        const overIndex = playlist.items.findIndex(({ id }) => id === over.id);

        onDrag(arrayMove(playlist.items, activeIndex, overIndex));
      }}
    >
      <SortableContext
        items={playlist.items}
        strategy={verticalListSortingStrategy}
      >
        <table>
          <thead>
            <tr>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('artist')}
              >
                Artistas
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('song')}
              >
                Canción
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('album')}
              >
                Álbum
              </th>
            </tr>
          </thead>
          <tbody>
            {playlist &&
              playlist.items.map((playlistTrack, index) => (
                <SongItem
                  key={playlistTrack.id}
                  playlistTrack={playlistTrack}
                  index={index}
                />
              ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}

export default PlaylistTable;
