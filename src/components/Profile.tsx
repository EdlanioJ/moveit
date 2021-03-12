import { useChallenge } from '../context/ChallengeContext';
import styles from '../styles/components/Profile.module.css';

interface ProfileProps {
  name: string;
  image: string;
}

const Profile: React.FC<ProfileProps> = ({ image, name }) => {
  const { level } = useChallenge();
  return (
    <div className={styles.profileContainer}>
      <img src={image} alt={name} />
      <div>
        <strong>{name}</strong>
        <p>
          <img src="icons/level.svg" alt="Level icon" />
          Level {level}
        </p>
      </div>
    </div>
  );
};

export default Profile;
