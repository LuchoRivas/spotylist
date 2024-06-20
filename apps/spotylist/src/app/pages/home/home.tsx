// /* eslint-disable no-eval */
import PlaylistTable from 'apps/spotylist/src/components/playlist-table/playlist-table';
import Header from '../../../components/header/header';
import PlaylistGrid from '../../../components/playlist-grid/playlist-grid';
import useHomeLogic from './home.logic';

function Home() {
  const {
    accessToken,
    playlist,
    userPlaylists,
    setPlaylist,
    onLoginClicked,
    onLoadMyPlaylistsClicked,
    onPlaylistClicked,
    onColumnChange,
    onDragPlaylistItemOrder,
  } = useHomeLogic();

  return (
    <div>
      {!accessToken && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignSelf: 'center',
            flex: 1,
          }}
        >
          <span className="button-rechoncho" onClick={onLoginClicked}>
            Login con Spotify
          </span>
        </div>
      )}
      {accessToken && (
        <div>
          <Header />
          <div>
            {!playlist && (
              <div>
                <button className="button" onClick={onLoadMyPlaylistsClicked}>
                  Cargar mis playlists
                </button>
              </div>
            )}
            {userPlaylists && !playlist && (
              <PlaylistGrid
                onClick={onPlaylistClicked}
                userPlaylists={userPlaylists}
              />
            )}
            {playlist && (
              <div>
                <h3>{playlist.name}</h3>
                <br />

                <button className="button" onClick={() => setPlaylist(null)}>
                  volver
                </button>
                <br />
                <br />
                <PlaylistTable
                  onChange={onColumnChange}
                  onDrag={onDragPlaylistItemOrder}
                  playlist={playlist}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
