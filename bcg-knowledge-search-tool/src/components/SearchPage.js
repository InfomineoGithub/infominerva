import React, { useState } from 'react';
import { Search, User, Check, Loader, X, ChevronLeft, ChevronRight, Sun, Moon, HelpCircle, PlusCircle } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Users } from 'lucide-react';


function SearchPage({ user, darkMode, toggleDarkMode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchState, setSearchState] = useState('idle');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;
    const [showHelp, setShowHelp] = useState(true);

  const simulateSearch = async () => {
    setSearchState('searching');
    setResults([]);
    
    try {
            const apiUrl = process.env.REACT_APP_URL;
            // console.log('Sending request to:', `${apiUrl}/search?query=${encodeURIComponent(searchQuery)}`);
            // const response = await fetch(`${apiUrl}/search?query=${encodeURIComponent(searchQuery)}`);
            // writing the fetch to localhost:8000 instead to test
            console.log('Sending request to:', `http://localhost:8000/search?query=${encodeURIComponent(searchQuery)}`);
            const response = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(searchQuery)}`);

        const text = await response.text();
        console.log('Response text:', text);
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            setSearchState('not found');
            return;
        }
        
        console.log('Parsed data:', data);

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
        <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
        <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
        <img 
            src={process.env.PUBLIC_URL + '/infominerva_transparent.png'} 
            alt="Infominerva Logo" 
            className="h-14"  // Adjust height as needed
        />
        </div>
        <div className="flex items-center">
                {localStorage.getItem('userRole') === 'admin' && (
                    <>
                        <Link to="/validate-data" className={`mr-4 flex items-center ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                            <ClipboardCheck className="h-5 w-5 mr-2" />
                            Validate Data
                        </Link>
                        <Link to="/UserManagement" className={`mr-4 flex items-center ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                            <Users className="h-5 w-5 mr-2" />
                            Manage Users
                        </Link>
                    </>
                )}
                                
                <Link to="/add-source" className={`mr-4 flex items-center ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Add Source
                        </Link>

                    
                    <button 
                        onClick={toggleDarkMode} 
                        className={`mr-4 p-2 rounded-full shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            darkMode 
                            ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600 focus:ring-yellow-500' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
                        }`}
                        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <User className={`h-8 w-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mr-2`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{user.displayName}</span>
                    <button 
                        onClick={handleSignOut} 
                        className={`ml-4 px-3 py-1 rounded transition-colors duration-300 ${
                            darkMode
                            ? 'bg-sky-600 text-white hover:bg-sky-700'
                            : 'bg-sky-500 text-white hover:bg-sky-600'
                        }`}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="flex mb-6">
                <div className={`transition-all duration-300 ease-in-out ${showHelp ? 'w-3/4 pr-6' : 'w-full'}`}>
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

                    {searchState !== 'idle' && (
                        <div className="mt-4">
                            <div className="flex items-center mb-2">
                                {searchState === 'searching' ? (
                                    <Loader className="h-5 w-5 text-sky-500 animate-spin mr-2" />
                                ) : searchState === 'found' ? (
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                ) : (
                                    <X className="h-5 w-5 text-red-500 mr-2" />
                                )}
                                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {searchState === 'searching' ? 'Searching Knowledge database...' : 
                                    searchState === 'found' ? `Found ${results.length} results` : 
                                    'Results not found, LLM feature coming soon'}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 mt-6">
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

                {showHelp ? (
    <div className="w-1/4 pl-6">
        <div className={`${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'} p-4 rounded-lg`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Search Guide</h3>
                <button onClick={() => setShowHelp(false)} className={`text-sm ${darkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-yellow-700 hover:text-yellow-900'}`}>
                    Hide
                </button>
            </div>
            <ul className={`text-sm space-y-2 ${darkMode ? 'text-yellow-100' : 'text-yellow-800'}`}>
                <li><strong>Default Search:</strong> Words with spaces are treated as phrases. e.g. "market analysis" will search for that exact phrase.</li>
                <li><strong>OR Operator:</strong> Use "OR" between terms to find either. e.g., "internet OR penetration" will find results with either term.</li>
                <li><strong>AND Operator:</strong> Use "AND" for multiple required terms. e.g., "market analysis AND trends" will find results containing both.</li>
                <li><strong>Combined Search:</strong> Mix operators for complex searches. e.g., "financial data AND (market share OR penetration)" will find entries with "financial data" and either "market share" or "penetration".</li>
            </ul>
            <h4 className={`text-sm font-semibold mt-4 ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Upcoming Features:</h4>
            <ul className={`text-sm ${darkMode ? 'text-yellow-100' : 'text-yellow-800'}`}>
                <li>- Search filters (by category, date, etc.)</li>
                <li>- Advanced sorting options</li>
                <li>- Search history and saved searches</li>
            </ul>
        </div>
    </div>
) : (
    <button 
        onClick={() => setShowHelp(true)} 
        className={`ml-4 flex items-center ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'}`}
    >
        <HelpCircle className="h-5 w-5 mr-2" />
        Show Search Guide
    </button>
)}
            </div>
        </div>
    </div>
);
}

export default SearchPage;