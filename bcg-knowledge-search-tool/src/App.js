import React, { useState, useEffect } from 'react';
import { Search, User, Check, Loader, X } from 'lucide-react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState('idle');
  const [llmState, setLlmState] = useState('idle');
  const [results, setResults] = useState([]);
  const [streamingIndex, setStreamingIndex] = useState(0);
  const [streamingText, setStreamingText] = useState(['', '']);

  const simulateSearch = () => {
    setSearchState('searching');
    setLlmState('idle');
    setResults([]);
    setStreamingIndex(0);
    setStreamingText(['', '']);
    
    setTimeout(() => {
      if (searchQuery.toLowerCase() === 'automotive') {
        setSearchState('found');
        setResults([
          {
            title: 'OICA Global Sales Statistics',
            description: 'Provides data on sale of cars, including both passengers and commercial vehicles',
            years: 'From 2019 to 2023',
            source: 'OICA Global Sales Statistics',
            link: 'https://www.oica.net/category/sales-statistics/'
          },
          {
            title: 'OICA Global Production Statistics',
            description: 'Provides data on production of cars, including both passengers and commercial vehicles',
            years: 'From 1999 to 2023',
            source: 'OICA Global Production Statistics',
            link: 'https://www.oica.net/production-statistics/'
          }
        ]);
      } else if (searchQuery.toLowerCase() === 'ai') {
        setSearchState('not found');
        setTimeout(() => {
          setLlmState('generating');
          simulateStreamingText();
        }, 1000);
      } else {
        setSearchState('not found');
      }
    }, 1000);
  };

  const simulateStreamingText = () => {
    const llmResults = [
      {
        title: 'AI Overview',
        description: 'A comprehensive introduction to Artificial Intelligence and its applications',
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-sky-600">BCG Knowledge Search Tool</h1>
          <div className="flex items-center">
            <User className="h-8 w-8 text-gray-500 mr-2" />
            <span className="text-gray-700">Youssef Moutaouakkil</span>
          </div>
        </header>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pr-12 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500"
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
              <span className="text-gray-700">
                {searchState === 'searching' ? 'Searching Knowledge database...' : 
                 searchState === 'found' ? 'Results found in database' :
                 'Results not found in database'}
              </span>
            </div>
            {llmState !== 'idle' && (
              <div className="flex items-center">
                {llmState === 'generating' ? (
                  <Loader className="h-5 w-5 text-sky-500 animate-spin mr-2" />
                ) : (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                )}
                <span className="text-gray-700">
                  {llmState === 'generating' ? 'Generating response with LLM...' : 'LLM response generated'}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {(llmState !== 'idle' ? streamingText : results).map((result, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              {llmState !== 'idle' ? (
                <div>
                  {result.split('|').map((part, i) => {
                    if (i === 0) return <h2 key={i} className="text-xl font-semibold text-sky-700 mb-2">{part}</h2>;
                    if (i === 1) return <p key={i} className="text-gray-600 mb-2">{part}</p>;
                    if (i === 2) return <p key={i} className="text-sm text-gray-500 mb-2">Years covered: {part}</p>;
                    return null;
                  })}
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-sky-700 mb-2">{result.title}</h2>
                  <p className="text-gray-600 mb-2">{result.description}</p>
                  <p className="text-sm text-gray-500 mb-2">Years covered: {result.years}</p>
                  <a href={result.link} className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {result.source}
                  </a>
                </>
              )}
              {llmState === 'done' && index < streamingIndex && (
                <div className="mt-2">
                  <p className="text-sm text-gray-700">Add to Knowledge Database?</p>
                  <div className="mt-1">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-600">Yes</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">No</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;