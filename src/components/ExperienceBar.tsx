import { useChallenge } from '../context/ChallengeContext';
import styles from '../styles/components/ExperienceBar.module.css';

const ExperienceBar: React.FC = () => {
  const { currentExperience, experienceToNextLevel } = useChallenge();

  const presentToNextLevel = Math.round(
    (currentExperience * 100) / experienceToNextLevel
  );
  return (
    <header className={styles.experienceBar}>
      <span>0 xp</span>
      <div>
        <div
          style={{ transformOrigin: 'left', width: `${presentToNextLevel}%` }}
        />
        <span
          style={{ left: `${presentToNextLevel}%` }}
          className={styles.currentExperience}
        >
          {currentExperience} px
        </span>
      </div>
      <span>{experienceToNextLevel} xp</span>
    </header>
  );
};

export default ExperienceBar;
