import { ChallengeResponse } from '../pages/api/challenge';
import styles from '../styles/components/ScoreList.module.css';

interface ScoreListProps {
  challenges: ChallengeResponse[];
}

const ScoreList: React.FC<ScoreListProps> = ({ challenges }) => {
  return (
    <table className={styles.container}>
      <thead>
        <tr>
          <th>Posição</th>
          <th>Usuário</th>
          <th>Desafios</th>
          <th>Experiência</th>
        </tr>
      </thead>
      <tbody>
        {challenges.map((challenge, index) => (
          <tr key={challenge.id}>
            <td>{index + 1}</td>
            <td>
              <img src={challenge.imageUrl} alt={challenge.username} />
              <div>
                <span>{challenge.username}</span>
                <p>
                  <img src="/icons/level.svg" alt="level up" /> Nível{' '}
                  {challenge.level}
                </p>
              </div>
            </td>
            <td>
              <p>
                <span>{challenge.challengeCompleted}</span> completados
              </p>
            </td>
            <td>
              <p>
                <span>
                  {Intl.NumberFormat('pt', { style: 'decimal' }).format(
                    challenge.totalExperience
                  )}
                </span>{' '}
                xp
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScoreList;
