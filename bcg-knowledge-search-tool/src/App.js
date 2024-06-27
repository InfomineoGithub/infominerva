import React, { useState } from 'react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchState, setSearchState] = useState('idle');

  const handleSearch = () => {
    setSearchState('searching');
    setTimeout(() => {
      if (searchQuery.toLowerCase() === 'automotive') {
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
        setSearchState('found');
      } else if (searchQuery.toLowerCase() === 'ai') {
        setResults([]);
        setSearchState('not found');
        // Here you would typically trigger the LLM response
      } else {
        setResults([]);
        setSearchState('not found');
      }
    }, 1000); // Simulate network delay
  };

  return (
    <div className="App">
      <h1>BCG Knowledge Search Tool</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search knowledge database..."
      />
      <button onClick={handleSearch}>Search</button>
      
      {searchState === 'searching' && <p>Searching...</p>}
      {searchState === 'not found' && <p>No results found</p>}
      
      {results.map((result, index) => (
        <div key={index}>
          <h2>{result.title}</h2>
          <p>{result.description}</p>
          <p>Years covered: {result.years}</p>
          <a href={result.link} target="_blank" rel="noopener noreferrer">{result.source}</a>
        </div>
      ))}
    </div>
  );
}

export default App;