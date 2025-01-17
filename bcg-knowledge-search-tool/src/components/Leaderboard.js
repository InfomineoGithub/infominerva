import React, { useState, useEffect } from 'react';
import { Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard = ({ darkMode }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}/get_leaderboard`);
            // const response = await fetch('http://localhost:8000/get_leaderboard');
            const data = await response.json();
            setLeaderboard(data.leaderboard);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'} flex items-center`}>
                        <Crown className="h-8 w-8 text-yellow-400 mr-2" />
                        Contributor Leaderboard
                    </h1>
                    <Link to="/search" className={`flex items-center ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Search
                    </Link>
                </header>

                {/* Leaderboard Content */}
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className={`h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                        ))}
                    </div>
                ) : (
                    <div className={`overflow-x-auto ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>
                        <table className="w-full">
                            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <tr>
                                    <th className="px-6 py-4 text-left">Rank</th>
                                    <th className="px-6 py-4 text-left">Contributor</th>
                                    <th className="px-6 py-4 text-right">Total Contributions</th>
                                    <th className="px-6 py-4 text-right">Expert Reviews</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => (
                                    <tr 
                                        key={entry.Submitter_email}
                                        className={`${
                                            index === 0 
                                                ? darkMode 
                                                    ? 'bg-gray-600/50' 
                                                    : 'bg-yellow-50'
                                                : ''
                                        } ${
                                            darkMode 
                                                ? 'border-gray-600 hover:bg-gray-600' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                        } border-b transition-colors duration-150`}
                                    >
                                        <td className="px-6 py-4">
                                            {index === 0 ? (
                                                <div className="flex items-center">
                                                    <Crown className="h-6 w-6 text-yellow-400 mr-2" fill="currentColor" />
                                                    <span className="font-bold">{index + 1}</span>
                                                </div>
                                            ) : (
                                                <span className={index < 3 ? 'font-semibold' : ''}>{index + 1}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={index < 3 ? 'font-semibold' : ''}>
                                                {entry.full_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            {entry.total_contributions}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            {entry.expert_opinions}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;