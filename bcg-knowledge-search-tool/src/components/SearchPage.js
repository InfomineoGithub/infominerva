import React, { useState } from 'react';
import { Search, User, Check, Loader, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';


function SearchPage({ user }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchState, setSearchState] = useState('idle');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => setDarkMode(!darkMode);

  const simulateSearch = async () => {
    setSearchState('searching');
    setResults([]);
    
    try {
      const response = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSearchState('found');
        setResults(data.results);
      } else {
        setSearchState('not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchState('not found');
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error("Error signing out", error);
    });
  };

  // Commented out LLM-related code
  /*
  const [llmState, setLlmState] = useState('idle');
  const [streamingIndex, setStreamingIndex] = useState(0);
  const [streamingText, setStreamingText] = useState(['', '']);

  const simulateStreamingText = () => {
    const llmResults = [
      {
        title: 'AI Placeholder result',
        description: 'A comprehensive placeholder to Artificial Intelligence and its applications',
        years: '2020-2024',
        source: 'LLM Generated',
        link: '#'
      },
      {
        title: 'Machine Learning Trends',
        description: 'Recent developments and future prospects in machine learning technologies',
        years: '2022-2024',
        source: 'LLM Generated',
        link: '#'
      }
    ];

    let currentIndex = 0;
    let textIndex = [0, 0];

    const streamInterval = setInterval(() => {
      if (currentIndex >= llmResults.length) {
        clearInterval(streamInterval);
        setResults(llmResults);
        setLlmState('done');
        return;
      }

      const result = llmResults[currentIndex];
      const fullText = `${result.title}|${result.description}|${result.years}`;

      if (textIndex[currentIndex] < fullText.length) {
        setStreamingText(prev => {
          const newText = [...prev];
          newText[currentIndex] = fullText.slice(0, textIndex[currentIndex] + 1);
          return newText;
        });
        textIndex[currentIndex]++;
      } else {
        currentIndex++;
        setStreamingIndex(currentIndex);
      }
    }, 30);
  };
  */
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
      <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>


        <header className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>BCG Knowledge Search Tool</h1>
          <div className="flex items-center">
            <button onClick={toggleDarkMode} className="mr-4">
          {darkMode ? '☀️' : '🌙'}
            </button>
            <User className={`h-8 w-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mr-2`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{user.displayName}</span>
            <button onClick={handleSignOut} className="ml-4 text-red-500 hover:text-red-700">Sign Out</button>
          </div>
        </header>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              className={`w-full p-4 pr-12 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg focus:ring-sky-500 focus:border-sky-500`}
              placeholder="Search knowledge database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && simulateSearch()}
            />
            <button
              className="absolute right-2.5 bottom-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg text-sm px-4 py-2"
              onClick={simulateSearch}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {searchState !== 'idle' && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              {searchState === 'searching' ? (
                <Loader className="h-5 w-5 text-sky-500 animate-spin mr-2" />
              ) : searchState === 'found' ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`text-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {searchState === 'searching' ? 'Searching Knowledge database...' : 
                 searchState === 'found' ? `Found ${results.length} results` : 
                 'Results not found, LLM feature coming soon'}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {currentResults.map((result, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded mb-2">
                 {result.words_found.join(', ')}
              </div>

              <h2 className={`text-xl font-semibold ${darkMode ? 'text-sky-400' : 'text-sky-700'} mb-2`}>{result.title}</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{result.description}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Years covered: {result.years}</p>
              <a href={result.link} className={`${darkMode ? 'text-sky-400' : 'text-sky-600'} hover:underline`} target="_blank" rel="noopener noreferrer">
                {result.source}

              </a>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2 px-3 py-1 bg-sky-500 text-white rounded-md disabled:bg-gray-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2 px-3 py-1 bg-sky-500 text-white rounded-md disabled:bg-gray-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;