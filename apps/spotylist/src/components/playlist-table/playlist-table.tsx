import { Playlist } from '@spotylist/common';
import styles from './playlist-table.module.scss';
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

/* eslint-disable-next-line */
export interface PlaylistTableProps {
  playlist: Playlist;
  onChange: any;
}

export function PlaylistTable({ playlist, onChange }: PlaylistTableProps) {
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ active, over }) => {
        if (!over) return; // No hubo cambio de orden

        const activeIndex = playlist.items.findIndex(
          ({ id }) => id === active.id
        );
        const overIndex = playlist.items.findIndex(({ id }) => id === over.id);

        onChange(arrayMove(playlist.items, activeIndex, overIndex));
      }}
    >
      <SortableContext
        items={playlist.items}
        strategy={verticalListSortingStrategy}
      >
        <table>
          <thead>
            <tr>
              <th>Artistas</th>
              <th>Canción</th>
              <th>Álbum</th>
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
