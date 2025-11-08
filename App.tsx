
import React, { useState, useCallback } from 'react';
import ConfettiCanvas from './components/ConfettiCanvas';

const App: React.FC = () => {
  const [audienceNames, setAudienceNames] = useState<string[]>([]);
  const [textAreaInput, setTextAreaInput] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaInput(e.target.value);
    setError(null);
  }, []);

  const handleAddAudience = useCallback(() => {
    const names = textAreaInput
      .split('\n')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      setError('Please enter at least one name.');
      return;
    }

    setAudienceNames((prevNames) => [...prevNames, ...names]);
    setTextAreaInput('');
    setError(null);
  }, [textAreaInput]);

  const handleDrawWinner = useCallback(() => {
    if (audienceNames.length === 0) {
      setError('Add some audience members first!');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    setShowConfetti(false);
    setError(null);

    // Simulate drawing delay for dramatic effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * audienceNames.length);
      const selectedWinner = audienceNames[randomIndex];
      setWinner(selectedWinner);
      setShowConfetti(true);
      setIsDrawing(false);

      // Turn off confetti after a few seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 7000);
    }, 2000); // 2 second delay
  }, [audienceNames]);

  const handleReset = useCallback(() => {
    setAudienceNames([]);
    setTextAreaInput('');
    setWinner(null);
    setIsDrawing(false);
    setShowConfetti(false);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-sans">
      <div className="bg-white text-gray-800 rounded-lg shadow-2xl p-6 md:p-10 w-full max-w-4xl transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-purple-700">
          Raffle Winner Picker
        </h1>

        {/* Input Section */}
        <div className="mb-8">
          <label htmlFor="audienceInput" className="block text-lg font-semibold mb-2 text-gray-700">
            Enter Audience Names (one per line):
          </label>
          <textarea
            id="audienceInput"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y min-h-[120px] bg-gray-50 text-gray-900"
            value={textAreaInput}
            onChange={handleTextAreaChange}
            placeholder="Alice Johnson&#10;Bob Smith&#10;Charlie Brown"
            aria-label="Enter audience names, one per line"
          ></textarea>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          <button
            onClick={handleAddAudience}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={textAreaInput.trim().length === 0}
            aria-live="polite"
          >
            Add Audience
          </button>
        </div>

        {/* Audience List & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              Current Audience ({audienceNames.length})
            </h2>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
              {audienceNames.length === 0 ? (
                <p className="text-gray-500 italic">No audience members added yet.</p>
              ) : (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {audienceNames.map((name, index) => (
                    <li key={index} className="truncate" aria-label={`Audience member: ${name}`}>
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <button
              onClick={handleDrawWinner}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 ${
                audienceNames.length === 0 || isDrawing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={audienceNames.length === 0 || isDrawing}
              aria-live="polite"
            >
              {isDrawing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Drawing...
                </span>
              ) : (
                'Draw Winner!'
              )}
            </button>
            <button
              onClick={handleReset}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              disabled={audienceNames.length === 0 && !winner}
              aria-live="polite"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Winner Display */}
        {winner && (
          <div className="mt-8 p-6 bg-yellow-400 rounded-lg text-center shadow-xl animate-fade-in-up">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">🎉 Congratulations! 🎉</h3>
            <p className="text-5xl font-extrabold text-purple-800 animate-pulse-winner" aria-live="assertive">
              {winner}
            </p>
            <p className="text-xl text-gray-800 mt-2">is the lucky winner!</p>
          </div>
        )}
      </div>

      <ConfettiCanvas show={showConfetti} />

      {/* Tailwind custom animations (add to tailwind.config.js if using local setup) */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-winner {
          0%, 100% {
            transform: scale(1);
            text-shadow: 0 0 8px rgba(139, 92, 246, 0.7);
          }
          50% {
            transform: scale(1.05);
            text-shadow: 0 0 15px rgba(139, 92, 246, 1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-pulse-winner {
          animation: pulse-winner 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
