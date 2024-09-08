import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { backend } from '../../../../declarations/backend';
import { profile_nft } from "../../../../declarations/profile_nft";
import { tower_nft } from "../../../../declarations/tower_nft";
import { useAppSelector } from '@/store/hooks/useAppSelector';
import { walls } from './ascii_art/walls';
import { library } from './ascii_art/library';
import { tower } from './ascii_art/tower';

const factions = ['earth', 'fire', 'wind', 'water'];

const Home = () => {
  const auth = useAppSelector(state => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [faction, setFaction] = useState('');
  const [hasProfileNFT, setHasProfileNFT] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    setIsAuthenticated(auth.user !== "");
    if (auth.user) {
      checkNFT();
    }
  }, [auth]);

  const checkNFT = async () => {
    try {
      const tokens = await profile_nft.icrc7_tokens_of({
        owner: Principal.fromText(auth.user),
        subaccount: []
      }, [], []);
      setHasProfileNFT(tokens.length > 0);
      console.log("Has profile NFT:", tokens);
    } catch (error) {
      console.error("Error checking NFT:", error);
    }
  };

  const handleProfileMint = async () => {
    if (!isAuthenticated || !name || !faction) return;

    try {
      const result = await backend.mint_profile(
        Principal.fromText(auth.user),
        name,
        faction
      );
      console.log(result);
      await checkNFT();
    } catch (error) {
      console.error(error);
    }
  };

  const build_tower = async () => {
    if (!isAuthenticated || selectedSlot === null) return;

    try {
      const result = await backend.mint_tower(
        Principal.fromText(auth.user),
        BigInt(selectedSlot)
      );
      console.log("Tower built:", result);
      // You might want to add some state update or user feedback here
    } catch (error) {
      console.error("Error building tower:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <h1 className="text-6xl font-mono text-white tracking-widest">
          AETHER WARS
        </h1>
      </div>
    );
  }

  if (hasProfileNFT) {
    return <RealmView isAuthenticated={isAuthenticated} auth={auth} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Create Your Profile</h1>
      <div className="w-full max-w-md space-y-6">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
          maxLength={25}
        />
        <div className="grid grid-cols-2 gap-4">
          {factions.map((f) => (
            <button
              key={f}
              onClick={() => setFaction(f)}
              className={`p-4 rounded-lg ${
                faction === f ? 'bg-blue-600' : 'bg-gray-700'
              } hover:bg-blue-500 transition-colors`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-yellow-400 text-sm">
          Warning: These decisions are irreversible. You will need to delete your account to switch factions.
        </div>
        <button
          onClick={handleProfileMint}
          className="w-full p-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
          disabled={!name || !faction}
        >
          Mint Profile NFT
        </button>
      </div>
    </div>
  );
};

interface RealmViewProps {
  isAuthenticated: boolean;
  auth: { user: string };
}

const RealmView: React.FC<RealmViewProps> = ({ isAuthenticated, auth }) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [userTowers, setUserTowers] = useState<number[]>([]);

  useEffect(() => {
    fetchUserTowers();
  }, []);

  const fetchUserTowers = async () => {
    if (!isAuthenticated) return;

    try {
      const tokens = await tower_nft.icrc7_tokens_of({
        owner: Principal.fromText(auth.user),
        subaccount: []
      }, [], []);
      setUserTowers(tokens.map(Number));
    } catch (error) {
      console.error("Error fetching user towers:", error);
    }
  };

  const build_tower = async () => {
    if (!isAuthenticated || selectedSlot === null) return;

    try {
      const result = await backend.mint_tower(
        Principal.fromText(auth.user),
        BigInt(selectedSlot)
      );
      console.log("Tower built:", result);
      // Refresh the user's towers after building
      await fetchUserTowers();
    } catch (error) {
      console.error("Error building tower:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-white text-black p-4 overflow-hidden">
      <pre className="text-[10px] leading-[10px] font-mono whitespace-pre">
        {walls.top}
        {walls.emptyRow.repeat(2)}
        {userTowers.map((_, index) => (
          <React.Fragment key={index}>
            {walls.left}{tower}{walls.right}
          </React.Fragment>
        ))}
        {walls.emptyRow.repeat(2)}
        {library.map((row, index) => (
          <React.Fragment key={index}>
            {walls.left}{row}{walls.right}
          </React.Fragment>
        ))}
        {walls.emptyRow.repeat(2)}
        {walls.bottom}
      </pre>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-4">Build a Tower</h2>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[...Array(10)].map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedSlot(index)}
              className={`p-2 rounded ${
                userTowers.includes(index)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : selectedSlot === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
              disabled={userTowers.includes(index)}
            >
              {userTowers.includes(index) ? 'Built' : `Slot ${index}`}
            </button>
          ))}
        </div>
        <button
          onClick={build_tower}
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={selectedSlot === null || userTowers.includes(selectedSlot)}
        >
          Build Tower
        </button>
      </div>
    </div>
  );
};

export default Home;
