import { useChallenge } from '../context/ChallengeContext';
import styles from '../styles/components/CompletedChallenge.module.css';
const CompletedChallenge: React.FC = () => {
  const { challengeCompleted } = useChallenge();
  return (
    <div className={styles.completedChallengeContainer}>
      <span>Desafios completos</span>
      <span>{challengeCompleted}</span>
    </div>
  );
};

export default CompletedChallenge;
