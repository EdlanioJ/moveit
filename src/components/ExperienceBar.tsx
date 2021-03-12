import { useChallenge } from '../context/ChallengeContext';
import styles from '../styles/components/ExperienceBar.module.css';
import { motion } from 'framer-motion';

const ExperienceBar: React.FC = () => {
  const { currentExperience, experienceToNextLevel } = useChallenge();

  const presentToNextLevel = Math.round(
    (currentExperience * 100) / experienceToNextLevel
  );
  return (
    <header className={styles.experienceBar}>
      <span>0 xp</span>
      <div>
        <motion.div
          style={{ transformOrigin: 'left' }}
          animate={{ width: `${presentToNextLevel}%` }}
          transition={{ duration: 0.5 }}
        />
        <motion.span
          animate={{ left: `${presentToNextLevel}%` }}
          transition={{ duration: 0.5 }}
          className={styles.currentExperience}
        >
          {currentExperience} px
        </motion.span>
      </div>
      <span>{experienceToNextLevel} xp</span>
    </header>
  );
};

export default ExperienceBar;
