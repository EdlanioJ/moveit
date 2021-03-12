import { createContext, useContext, useEffect, useState } from 'react';

import challenges from '../../challenges.json';
import LevelUpModal from '../components/LevelUpModal';
import api from '../utils/api';
import { ChallengeResponse } from '../pages/api/challenge';

interface ChallengeProps {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}
interface ChallengeContextData {
  level: number;
  currentExperience: number;
  challengeCompleted: number;
  experienceToNextLevel: number;
  activeChallenge: ChallengeProps;
  closeLevelUpModal: () => void;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => Promise<void>;
}

const ChallengeContext = createContext({} as ChallengeContextData);

export interface ChallengeResultProps {
  id: string;
  level: number;
  currentExperience: number;
  challengeCompleted: number;
}

interface ChallengeProviderProps {
  sessionToken: string;
  challenge: ChallengeResultProps;
}

export const ChallengeProvider: React.FC<ChallengeProviderProps> = ({
  children,
  challenge,
  sessionToken,
}) => {
  const [level, setLevel] = useState(challenge.level);
  const [currentExperience, setCurrentExperience] = useState(
    challenge.currentExperience
  );
  const [challengeCompleted, setChallengeCompleted] = useState(
    challenge.challengeCompleted
  );
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  async function levelUp() {
    try {
      setLevel(level + 1);
      setIsLevelUpModalOpen(true);

      const updatedChallenge = await api.put<ChallengeResponse>(
        `/api/challenge/${challenge.id}`,
        { level: level + 1 },
        { headers: { cookie: `next-auth.session-token=${sessionToken}` } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false);
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio :)', {
        body: `valendo ${challenge.amount}xp!`,
      });
    }
  }

  async function completeChallenge() {
    try {
      if (!activeChallenge) {
        return;
      }

      const { amount } = activeChallenge;

      let finalExperience = currentExperience + amount;

      if (finalExperience >= experienceToNextLevel) {
        finalExperience = finalExperience - experienceToNextLevel;

        await levelUp();
      }

      const getChallengeRes = await api.get<ChallengeResponse>(
        `/api/challenge/${challenge.id}`,
        {
          headers: { cookie: `next-auth.session-token=${sessionToken}` },
        }
      );

      setCurrentExperience(finalExperience);

      setActiveChallenge(null);
      setChallengeCompleted(challengeCompleted + 1);

      const { data } = getChallengeRes;

      const totalExperience = amount + data.totalExperience;

      await api.put<ChallengeResponse>(
        `/api/challenge/${challenge.id}`,
        {
          totalExperience: totalExperience,
          currentExperience: finalExperience,
          challengeCompleted: challengeCompleted + 1,
        },
        { headers: { cookie: `next-auth.session-token=${sessionToken}` } }
      );
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <ChallengeContext.Provider
      value={{
        level,
        currentExperience,
        challengeCompleted,
        experienceToNextLevel,
        levelUp,
        closeLevelUpModal,
        startNewChallenge,
        activeChallenge,
        resetChallenge,
        completeChallenge,
      }}
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengeContext.Provider>
  );
};

export function useChallenge() {
  const context = useContext(ChallengeContext);

  return context;
}
