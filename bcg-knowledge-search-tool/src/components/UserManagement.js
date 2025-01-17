import React, { useState, useEffect } from 'react';
import { User, Sun, Moon, Search, Save, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

function UserManagementPage({ user, darkMode, toggleDarkMode }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [saveStatus, setSaveStatus] = useState('');
    const usersPerPage = 10;

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const apiUrl = process.env.REACT_APP_URL
            // const response = await fetch(`${apiUrl}/get_all_users`);
            // local 8000
            const response = await fetch(`http://localhost:8000/get_all_users`);
            const data = await response.json();
            setUsers(data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleRoleChange = (email, newRole) => {
        setUsers(users.map(u => 
            u.email === email ? { ...u, role: newRole } : u
        ));
    };

    const saveChanges = async () => {
        setSaveStatus('saving');
        try {
            const apiUrl = process.env.REACT_APP_URL 
            for (const user of users) {
                // await fetch(`${apiUrl}/update_user_role`, {
                await fetch(`http://localhost:8000/update_user_role`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        target_email: user.email,
                        new_role: user.role
                    }),
                });
            }
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error('Error saving changes:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const handleSignOut = () => {
        signOut(auth).catch((error) => {
            console.error("Error signing out", error);
        });
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <header className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        User Management
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

                <div className="mb-6 flex justify-between items-center">
                    <div className="relative w-64">
                        <input
                            type="text"
                            className={`w-full p-2 pl-8 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg`}
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    <button
                        onClick={saveChanges}
                        disabled={saveStatus === 'saving'}
                        className={`flex items-center px-4 py-2 rounded ${
                            saveStatus === 'saving' 
                                ? 'bg-gray-400'
                                : darkMode
                                    ? 'bg-sky-600 hover:bg-sky-700'
                                    : 'bg-sky-500 hover:bg-sky-600'
                        } text-white`}
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
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="h-8 w-8 animate-spin text-sky-500" />
                    </div>
                ) : (
                    <>
                        <div className={`overflow-x-auto ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>
                            <table className="w-full">
                                <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className="px-6 py-3 text-left">Email</th>
                                        <th className="px-6 py-3 text-left">Role</th>
                                        <th className="px-6 py-3 text-left">Expert Domain</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((userData, index) => (
                                        <tr key={userData.email} className={`${
                                            darkMode 
                                                ? 'border-gray-700 hover:bg-gray-600' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                        } border-b`}>
                                            <td className="px-6 py-4">{userData.email}</td>
                                            <td className="px-6 py-4">
                                                {userData.email === user?.email ? (
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        {userData.role}
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={userData.role}
                                                        onChange={(e) => handleRoleChange(userData.email, e.target.value)}
                                                        className={`p-1 rounded ${
                                                            darkMode 
                                                                ? 'bg-gray-600 text-white border-gray-500' 
                                                                : 'bg-white text-gray-900 border-gray-300'
                                                        } border`}
                                                    >
                                                        <option value="contributor">Contributor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {userData.expert_domain || 'N/A'}
                                            </td>
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

export default UserManagementPage;