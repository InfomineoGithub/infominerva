import React, { useState, useEffect } from 'react';
import { User, Sun, Moon, Search, Save, ChevronLeft, ChevronRight, Loader, Check, X, Edit2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

function DataValidationPage({ user, darkMode, toggleDarkMode }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [saveStatus, setSaveStatus] = useState('');
    const [editedEntry, setEditedEntry] = useState(null);
    const [expandedCells, setExpandedCells] = useState({});
    const entriesPerPage = 5;

    const validationColumns = [
        'PA classification', 'Sector/Area', 'Sub-Sector', 'Source name',
        'Description', 'Type (General DB, specialized, ...)', 'Free/Paid?',
        'Geography', 'Regional data', 'Country data',
        'Frequency cover harmonized for all geos ? ', 'Frequency ', 'Years',
        'Latest year available', 'Forecasts?', 'Latest forecast year avalable',
        'Tags', 'Format ', 'Expert opinion', 'Submitter_email',
        'Submitter_role', 'Status', 'Reliability score (1-10) ', 'Link'
    ];

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}/get_pending_entries`);
            // const response = await fetch('http://localhost:8000/get_pending_entries');
            const data = await response.json();
            setEntries(data.entries || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setLoading(false);
        }
    };

    const toggleCellExpansion = (entryId, column) => {
        const key = `${entryId}-${column}`;
        setExpandedCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleEdit = (entry) => {
        setEditedEntry({...entry});
    };

    const handleUpdate = async () => {
        setSaveStatus('saving');
        try {
            const apiUrl = process.env.REACT_APP_URL;
            await fetch(`${apiUrl}/update_entry`, {
            // await fetch('http://localhost:8000/update_entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editedEntry.id,
                    data: editedEntry
                }),
            });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);
            await fetchEntries();
            setEditedEntry(null);
        } catch (error) {
            console.error('Error updating entry:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const handleValidate = async (entryId) => {
        try {
            console.log('Validating entry:', entryId);
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}/validate_entry`, {
            // const response = await fetch('http://localhost:8000/validate_entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: entryId }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchEntries(); // Refresh the list
        } catch (error) {
            console.error('Error validating entry:', error);
            alert('Error validating entry: ' + error.message);
        }
    };

    const handleReject = async (entryId) => {
        try {
            console.log('Rejecting entry:', entryId);
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}/delete_entry/${entryId}`, {
            // const response = await fetch(`http://localhost:8000/delete_entry/${entryId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchEntries(); // Refresh the list
        } catch (error) {
            console.error('Error rejecting entry:', error);
            alert('Error rejecting entry: ' + error.message);
        }
    };
    const handleFieldChange = (field, value) => {
        setEditedEntry(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSignOut = () => {
        signOut(auth).catch((error) => {
            console.error("Error signing out", error);
        });
    };

    // Filter entries based on search query
    const filteredEntries = entries.filter(entry =>
        Object.values(entry).some(value => 
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
    const renderCell = (entry, column) => {
        const key = `${entry.id}-${column}`;
        const value = entry[column] || '';
        const isExpanded = expandedCells[key];
        const needsExpansion = String(value).length > 100;
    
        // Check if this specific entry is being edited
        const isEditing = editMode && editedEntry && editedEntry.id === entry.id;
    
        if (isEditing) {
            return (
                <input
                    type="text"
                    value={editedEntry[column] || ''}
                    onChange={(e) => handleFieldChange(column, e.target.value)}
                    className={`w-full p-1 rounded ${
                        darkMode 
                            ? 'bg-gray-600 text-white border-gray-500' 
                            : 'bg-white text-gray-900 border-gray-300'
                    } border`}
                />
            );
        }
    
        if (needsExpansion) {
            return (
                <div className="relative">
                    <div className={`${isExpanded ? '' : 'max-h-24 overflow-hidden'}`}>
                        {value}
                    </div>
                    <button
                        onClick={() => toggleCellExpansion(entry.id, column)}
                        className={`absolute bottom-0 right-0 p-1 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        } rounded-full shadow-md`}
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>
                </div>
            );
        }
    
        return value;
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                {/* Header section - same as before */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        Data Validation
                    </h1>
                    <div className="flex items-center">
                        <Link to="/search" className={`mr-4 ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                            Back to Search
                        </Link>
                        <button 
                            onClick={toggleDarkMode} 
                            className={`mr-4 p-2 rounded-full transition-colors duration-300 ${
                                darkMode 
                                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <User className={`h-8 w-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mr-2`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{user?.displayName}</span>
                        <button 
                            onClick={handleSignOut}
                            className={`ml-4 px-3 py-1 rounded ${
                                darkMode
                                ? 'bg-sky-600 text-white hover:bg-sky-700'
                                : 'bg-sky-500 text-white hover:bg-sky-600'
                            }`}
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Control section */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-64">
                            <input
                                type="text"
                                className={`w-full p-2 pl-8 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg`}
                                placeholder="Search entries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <button
                            onClick={() => {
                                setEditMode(!editMode);
                                if (!editMode) setEditedEntry(null);
                            }}
                            className={`flex items-center px-4 py-2 rounded ${
                                editMode
                                    ? 'bg-yellow-500 hover:bg-yellow-600'
                                    : darkMode
                                        ? 'bg-sky-600 hover:bg-sky-700'
                                        : 'bg-sky-500 hover:bg-sky-600'
                            } text-white`}
                        >
                            {editMode ? (
                                <>
                                    <Eye className="h-5 w-5 mr-2" />
                                    View Mode
                                </>
                            ) : (
                                <>
                                    <Edit2 className="h-5 w-5 mr-2" />
                                    Edit Mode
                                </>
                            )}
                        </button>
                    </div>
                    {editedEntry && (
                        <button
                            onClick={handleUpdate}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                        >
                            {saveStatus === 'saving' ? (
                                <Loader className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Save className="h-5 w-5 mr-2" />
                            )}
                            {saveStatus === 'saving' ? 'Saving...' : 
                             saveStatus === 'saved' ? 'Saved!' :
                             saveStatus === 'error' ? 'Error!' : 'Save Changes'}
                        </button>
                    )}
                </div>

                {/* Content section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="h-8 w-8 animate-spin text-sky-500" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-12">
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No pending entries found
                        </p>
                    </div>
                ) : (
                    <>
                        <div className={`overflow-x-auto ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>
                            <table className="w-full">
                                <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className="px-6 py-3 text-left w-24">Actions</th>
                                        {validationColumns.map(column => (
                                            <th key={column} className="px-6 py-3 text-left">
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((entry, index) => (
                                        <tr key={index} className={`${
                                            darkMode 
                                                ? 'border-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                        } border-b`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editMode ? (
                                                    <button
                                                        onClick={() => handleEdit(entry)}
                                                        className="text-blue-500 hover:text-blue-600 p-2"
                                                    >
                                                        <Edit2 className="h-6 w-6" />
                                                    </button>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleValidate(entry.id)}
                                                            className="text-green-500 hover:text-green-600 p-2"
                                                        >
                                                            <Check className="h-8 w-8" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(entry.id)}
                                                            className="text-red-500 hover:text-red-600 p-2"
                                                        >
                                                            <X className="h-8 w-8" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            {validationColumns.map(column => (
                                                <td key={column} className="px-6 py-4 max-w-md">
                                                    {renderCell(entry, column)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`mr-2 p-2 rounded ${
                                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                    } disabled:opacity-50`}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="mx-4">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`ml-2 p-2 rounded ${
                                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                    } disabled:opacity-50`}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default DataValidationPage;