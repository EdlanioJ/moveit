import styles from '../styles/components/Sidebar.module.css';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Power from './icons/Power';
import { signOut } from 'next-auth/client';

const Sidebar: React.FC = () => {
  const routes = useRouter();

  function isActive(value: string) {
    return routes.pathname === value;
  }
  return (
    <div className={styles.container}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Logo" />
        </a>
      </Link>
      <div>
        <Link href="/">
          <a className={isActive('/') ? styles.active : ''}>
            <img
              src={`/icons/${isActive('/') ? 'home-active' : 'home'}.svg`}
              alt="Home"
            />
          </a>
        </Link>
        <Link href="/leaderboard">
          <a className={isActive('/leaderboard') ? styles.active : ''}>
            <img
              src={`/icons/${
                isActive('/leaderboard') ? 'award-active' : 'award'
              }.svg`}
              alt="Award"
            />
          </a>
        </Link>
      </div>
      <button type="button" onClick={() => signOut()}>
        <Power />
      </button>
    </div>
  );
};

export default Sidebar;
