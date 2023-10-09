import { useEffect, useState } from 'react';
import './header.scss';
import { useAuth } from '../../app/auth-context';

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const { appUser } = useAuth();

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsHeaderSticky(true);
    } else {
      setIsHeaderSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`sticky-header${isHeaderSticky ? ' sticky' : ''}`}>
      <div>Listofy</div>
      <div>Hola {appUser?.display_name}</div>
      {isHeaderSticky && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Volver Arriba
        </button>
      )}
    </header>
  );
}

export default Header;
