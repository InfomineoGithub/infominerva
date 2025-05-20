import React, { useState, useEffect } from 'react';
import { Loader, Save, Edit2, Eye, ChevronLeft, ChevronRight, Search, Sun, Moon, User } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

const ExpertOpinionPage = ({ user, darkMode, toggleDarkMode }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editedOpinion, setEditedOpinion] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // Adding this line moving the update to sql:
    const [editedEntryId, setEditedEntryId] = useState(null);

    const entriesPerPage = 5;

    const searchColumns = ["Source name", "Sector/Area", "Sub-Sector", "Description"];


    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}expert-opinion`);
            const data = await response.json();
            setEntries(data.entries || []);
        } catch (error) {
            console.error('Error fetching expert opinion entries:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleEditClick = (currentOpinion, entryId) => { // Add entryId param
        setEditedOpinion(currentOpinion || '');
        setEditedEntryId(entryId);
    };

    const handleSave = async () => {

        // Add these lines for sql intended behavior:
        if (editedEntryId === null) {
            console.error("No entry ID selected for saving.");
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
            return;
        }

        setSaveStatus('saving');
        try {
            const apiUrl = process.env.REACT_APP_URL;
            await fetch(`${apiUrl}update-expert-opinion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editedEntryId, expert_opinion: editedOpinion })
            });
            setEntries(prev =>
                prev.map(entry =>
                    entry.id === editedEntryId // Match using the database ID
                        ? { ...entry, "Expert opinion": editedOpinion }
                        : entry
                )
            );
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);
            setEditedEntryId(null);
        } catch (error) {
            console.error('Error saving opinion:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const allFilteredEntries = entries.filter(entry =>
        searchColumns.some(col =>
            (entry[col] || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Retain current page only if search query is empty (to avoid mismatch)
    const filteredEntries = searchQuery ? allFilteredEntries : entries;


    const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
    const currentEntries = filteredEntries.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );


    // After you compute `filteredEntries` and `totalPages`...
    useEffect(() => {
        const newTotalPages = Math.ceil(filteredEntries.length / entriesPerPage);

        // If the user’s current page is beyond what’s valid for the new filtered list,
        // clamp them to the last page so they see the results (rather than an empty slice).
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
    }, [filteredEntries, currentPage, entriesPerPage]);

    const handleSignOut = () => signOut(auth).catch(console.error);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        Expert Opinion Review
                    </h1>
                    <div className="flex items-center">
                        <Link to="/search" className={`mr-4 ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                            Back to Search
                        </Link>
                        <button onClick={toggleDarkMode} className={`mr-4 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}>
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <User className={`h-8 w-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mr-2`} />
                        <span>{user?.displayName}</span>
                        <button onClick={handleSignOut} className={`ml-4 px-3 py-1 rounded ${darkMode ? 'bg-sky-600' : 'bg-sky-500'} text-white`}>
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Search and Save */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-64">
                        <input
                            type="text"
                            className={`w-full p-2 pl-8 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border rounded-lg`}
                            placeholder="Search entries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    {editedEntryId !== null && (
                        <button
                            onClick={handleSave}
                            className="ml-4 flex items-center px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                        >
                            {saveStatus === 'saving' ? (
                                <>
                                    <Loader className="h-5 w-5 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5 mr-2" />
                                    Save
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center p-10">
                        <Loader className="h-8 w-8 animate-spin text-sky-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                            <tr>
                                {searchColumns.map(col => (
                                    <th key={col} className="px-4 py-2 text-left text-sm font-medium">{col}</th>
                                ))}
                                <th className="px-4 py-2 text-left text-sm font-medium">Expert Opinion</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentEntries.map((entry, index) => {
                                return (
                                    <tr key={entry.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                        {searchColumns.map(col => (
                                            <td key={col} className="px-4 py-2 text-sm">{entry[col]}</td>
                                        ))}
                                        <td className="px-4 py-2 text-sm">
                                            {editedEntryId === entry.id ? (
                                                <input
                                                    type="text"
                                                    value={editedOpinion}
                                                    onChange={(e) => setEditedOpinion(e.target.value)}
                                                    className={`w-full p-1 rounded border ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                                />
                                            ) : (
                                                entry["Expert opinion"] || <span className="italic text-gray-400">No opinion yet</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {editedEntryId === entry.id ? (
                                                <Eye className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <button
                                                    onClick={() => handleEditClick(entry["Expert opinion"], entry.id)}>
                                                    <Edit2 className="h-5 w-5 text-blue-500 hover:text-blue-600"/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                                className={`mr-2 p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} disabled:opacity-50`}>
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="mx-4">Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                                className={`ml-2 p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} disabled:opacity-50`}>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertOpinionPage;
