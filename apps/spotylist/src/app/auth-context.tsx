import { SpotifyUser } from "@spotylist/common";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AppAuth {
  accessToken: string | null;
  refreshToken: string | null;
  appUser: SpotifyUser | null;
}

interface AuthContextType extends AppAuth {
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setAppUser: (appUser: SpotifyUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessTokenStore] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenStore] = useState<string | null>(null);
  const [appUser, setAppUserStore] = useState<SpotifyUser | null>(null);

  // Utilizamos useEffect para cargar los tokens desde sessionStorage cuando se monta el componente.
  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem("access_token");
    const storedRefreshToken = sessionStorage.getItem("refresh_token");
    const storedApplicationUser = sessionStorage.getItem("app_user");

    if (storedAccessToken && storedRefreshToken) {
      setAccessTokenStore(storedAccessToken);
      setRefreshTokenStore(storedRefreshToken);
      setAppUserStore(
        storedApplicationUser && JSON.parse(storedApplicationUser)
      );
    }
  }, []);

  // Utilizamos useEffect para almacenar los tokens en sessionStorage cuando cambian.
  useEffect(() => {
    if (accessToken && refreshToken) {
      sessionStorage.setItem("access_token", accessToken);
      sessionStorage.setItem("refresh_token", refreshToken);
      sessionStorage.setItem("app_user", JSON.stringify(appUser));
    }
  }, [accessToken, refreshToken, appUser]);

  const setAccessToken = (token: string | null) => {
    setAccessTokenStore(token);
  };

  const setRefreshToken = (refreshToken: string | null) => {
    setRefreshTokenStore(refreshToken);
  };

  const setAppUser = (user: SpotifyUser | null) => {
    setAppUserStore(user);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        appUser,
        setAccessToken,
        setRefreshToken,
        setAppUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokenProvider");
  }
  return context;
};