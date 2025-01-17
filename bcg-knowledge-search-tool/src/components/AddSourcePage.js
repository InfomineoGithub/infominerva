import React, { useState } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from './Modal';

const AddSourcePage = ({ darkMode }) => {
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [formData, setFormData] = useState({
        'PA classification': '', 'Sector/Area': '', 'Sub-Sector': '', 'Source name': '',
        'Description': '', 'Type (General DB, specialized, ...)': '', 'Free/Paid?': '',
        'Geography': '', 'Regional data': '', 'Country data': '',
        'Frequency cover harmonized for all geos ? ': '', 'Frequency ': '', 'Years': '',
        'Tags': '', 'Format ': '', 'Reliability score (1-10) ': '', 'Link': ''
    });

    const handleLinkChange = (e) => {
        setLink(e.target.value);
        setFormData(prev => ({ ...prev, 'Link': e.target.value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setModalOpen(true);
    };

    const handleAIAssist = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}/llm?link=${encodeURIComponent(link)}`);
            const data = await response.json();
            if (!response.ok) {
                // Handle HTTP errors (including 400)
                if (data.detail === "Link already exists in the database") {
                    showModal("Duplicate Link", "This link already exists in the database.");
                } else if (data.detail === "Failed to fetch website content") {
                    showModal("Fetch Error", "Failed to fetch website content. Please check the link and try again.");
                } else {
                    showModal("Error", data.detail || "An unexpected error occurred.");
                }
            } else {
                // Handle successful response
                setFormData(prev => ({
                    ...prev,
                    'Sector/Area': data['Sector/Area'] || '',
                    'Sub-Sector': data['Sub-Sector'] || '',
                    'Source name': data['Source name'] || '',
                    'Description': data['Description'] || '',
                    'Years': data['Years'] || '',
                    'Tags': data['Tags'] || '',
                    'Link': link
                }));
            }
        } catch (error) {
            console.error('Error fetching AI assistance:', error);
            showModal("Error", "An error occurred while fetching AI assistance. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (Object.values(formData).some(value => value === '')) {
            showModal("Incomplete Form", "Please fill all fields before submitting.");
            return;
        }

        showModal("Confirm Submission", "Are you sure you want to add this data to the database?");
    };

    const confirmSubmit = async () => {
        setModalOpen(false);
        try {
            const apiUrl = process.env.REACT_APP_URL;
            //const response = await fetch(`${apiUrl}/add_data`, {
            // use local 8000 for now
            const response = await fetch(`http://localhost:8000/add_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            });
           
 
            const result = await response.json();
            showModal("Success", result.message);
            // Reset form after successful submission
            setFormData({
                'PA classification': '', 'Sector/Area': '', 'Sub-Sector': '', 'Source name': '',
                'Description': '', 'Type (General DB, specialized, ...)': '', 'Free/Paid?': '',
                'Geography': '', 'Regional data': '', 'Country data': '',
                'Frequency cover harmonized for all geos ? ': '', 'Frequency ': '', 'Years': '',
                'Tags': '', 'Format ': '', 'Reliability score (1-10) ': '', 'Link': ''
            });
            setLink('');
        } catch (error) {
            console.error('Error adding data:', error);
            showModal("Error", "An error occurred while adding the data. Please try again.");
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
                <header className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>Add New Source</h1>
                    <Link to="/search" className={`flex items-center ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Search
                    </Link>
                </header>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Enter source link"
                        value={link}
                        onChange={handleLinkChange}
                        className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                    />
                    <button
                        onClick={handleAIAssist}
                        disabled={loading || !link}
                        className={`mt-2 px-4 py-2 ${darkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-500 hover:bg-sky-600'} text-white rounded-md disabled:opacity-50`}
                    >
                        {loading ? <Loader className="animate-spin h-5 w-5" /> : 'AI Assisted Fill'}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium mb-1">{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className={`mt-6 px-4 py-2 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md`}
                >
                    Add to Database
                </button>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalContent.title} darkMode={darkMode}>
                <p>{modalContent.message}</p>
                {modalContent.title === "Confirm Submission" && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setModalOpen(false)}
                            className={`mr-2 px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} rounded-md`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmSubmit}
                            className={`px-4 py-2 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md`}
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AddSourcePage;