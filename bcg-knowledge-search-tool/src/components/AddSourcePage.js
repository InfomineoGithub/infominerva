import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from './Modal';

// Constants for dropdown options
const FORM_OPTIONS = {
    Geography: ['Global', 'Regional', 'Sub-regional', 'Country', 'Sub-country', 'City'],
    'Frequency ': ['Annual', 'Quarterly', 'Monthly', 'Weekly', 'Ad-hoc'],  // Added space
    'Type (General DB, specialized, ...)': [
        'Government Publications',
        'NGOs/Nonprofits',
        'Industry Association',
        'Think Tanks/Research Institutions',
        'Company Filings',
        'Academic Journals',
        'News/Media',
        'International Organizations (e.g., World Bank, IMF)',
        'Industry Reports'
    ],
    'Free/Paid?': ['Free', 'Paid', 'Freemium'],
    'Regional data': ['Yes', 'Partial', 'No'],
    'Country data': ['Yes', 'Partial', 'No'],
    'Forecasts?': ['Yes', 'No'],
    'Format ': ['PDF', 'xls/CSV', 'Tableau/Power BI', 'Web', 'Visuals', 'Presentation']  // Added space
};

const AddSourcePage = ({ darkMode }) => {
    const [classifications, setClassifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [availablePAs, setAvailablePAs] = useState([]);
    
    // States for cascading dropdowns
    const [selectedPA, setSelectedPA] = useState('');
    const [availableSectors, setAvailableSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [availableSubSectors, setAvailableSubSectors] = useState([]);

    const [formData, setFormData] = useState({
        'PA classification': '',
        'Sector/Area': '',
        'Sub-Sector': '',
        'Source name': '',
        'Description': '',
        'Type (General DB, specialized, ...)': '',
        'Free/Paid?': '',
        'Geography': '',
        'Regional data': '',
        'Country data': '',
        'Frequency cover harmonized for all geos ? ': '',
        'Frequency ': '',
        'Years': '',
        'Latest year available': '',
        'Forecasts?': '',
        'Latest forecast year avalable': '',
        'Tags': '',
        'Format ': '',
        'Expert opinion': '',
        'Link': '',
        'Status': 'pending', // Default value
        'Reliability score (1-10) ': '',
        'Submitter_email': '', // Will be filled from user context
        'Submitter_role': '' // Will be filled from user context
    });

    // Fetch classifications data on mount
    useEffect(() => {
        const fetchClassifications = async () => {
            try {
                const response = await fetch('/classifications.json');
                const data = await response.json();
                setClassifications(data);
                
                // Get unique PA classifications
                const uniquePAs = [...new Set(data.map(item => item['PA classification']))].sort();
                setAvailablePAs(uniquePAs);
            } catch (error) {
                console.error('Error loading classifications:', error);
            }
        };
        fetchClassifications();
    }, []);

    // Update available sectors when PA changes
    useEffect(() => {
        if (selectedPA) {
            const sectors = [...new Set(
                classifications
                    .filter(item => item['PA classification'] === selectedPA)
                    .map(item => item['Sector/Area'])
            )].sort();
            setAvailableSectors(sectors);
            setSelectedSector('');
            setFormData(prev => ({
                ...prev,
                'PA classification': selectedPA,
                'Sector/Area': '',
                'Sub-Sector': ''
            }));
        }
    }, [selectedPA, classifications]); 

    // Update available sub-sectors when sector changes
    useEffect(() => {
        if (selectedPA && selectedSector) {
            const subSectors = [...new Set(
                classifications
                    .filter(item => 
                        item['PA classification'] === selectedPA && 
                        item['Sector/Area'] === selectedSector
                    )
                    .map(item => item['Sub-Sector'])
            )].sort();
            setAvailableSubSectors(subSectors);
            setFormData(prev => ({
                ...prev,
                'Sector/Area': selectedSector,
                'Sub-Sector': ''
            }));
        }
    }, [selectedSector, selectedPA, classifications]); 

    const handlePAChange = (e) => {
        setSelectedPA(e.target.value);
    };

    const handleSectorChange = (e) => {
        setSelectedSector(e.target.value);
    };

    const handleSubSectorChange = (e) => {
        setFormData(prev => ({
            ...prev,
            'Sub-Sector': e.target.value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLinkAIAssist = async () => {
        if (!formData.Link) {
            showModal("Error", "Please enter a link first.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/llm?link=${encodeURIComponent(formData.Link)}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || "Failed to get AI assistance");
            }

            // Update only allowed fields from AI
            setFormData(prev => ({
                ...prev,
                'Description': data.Description || '',
                'Source name': data['Source name'] || '',
                'Years': data.Years || '',
                'Tags': data.Tags || '',
                'PA classification': data['PA classification'] || ''
            }));

            // Update PA dropdown if value returned
            if (data['PA classification']) {
                setSelectedPA(data['PA classification']);
            }

        } catch (error) {
            console.error('Error fetching AI assistance:', error);
            showModal("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setModalOpen(true);
    };

    const validateForm = () => {
        const requiredFields = [
            'PA classification', 'Sector/Area', 'Sub-Sector', 'Source name',
            'Description', 'Type (General DB, specialized, ...)', 'Free/Paid?',
            'Geography', 'Regional data', 'Country data', 'Frequency ', 'Years',
            'Latest year available', 'Forecasts?', 'Format ', 'Link'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            showModal("Incomplete Form", `Please fill in the following fields: ${missingFields.join(', ')}`);
            return false;
        }

        // Validate reliability score
        const reliabilityScore = parseInt(formData['Reliability score (1-10) ']);
        if (isNaN(reliabilityScore) || reliabilityScore < 1 || reliabilityScore > 10) {
            showModal("Invalid Input", "Reliability score must be between 1 and 10");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        showModal("Confirm Submission", "Are you sure you want to add this data to the database?");
    };

    const confirmSubmit = async () => {
        setModalOpen(false);
        try {
            const response = await fetch('http://localhost:8000/add_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.detail || "Failed to add data");
            }

            showModal("Success", "Data added successfully!");
            // Reset form
            setFormData({
                'PA classification': '',
                'Sector/Area': '',
                'Sub-Sector': '',
                'Source name': '',
                'Description': '',
                'Type (General DB, specialized, ...)': '',
                'Free/Paid?': '',
                'Geography': '',
                'Regional data': '',
                'Country data': '',
                'Frequency cover harmonized for all geos ? ': '',
                'Frequency ': '',
                'Years': '',
                'Latest year available': '',
                'Forecasts?': '',
                'Latest forecast year avalable': '',
                'Tags': '',
                'Format ': '',
                'Expert opinion': '',
                'Link': '',
                'Status': 'pending',
                'Reliability score (1-10) ': '',
                'Submitter_email': '',
                'Submitter_role': ''
            });
            setSelectedPA('');
            setSelectedSector('');
        } catch (error) {
            console.error('Error adding data:', error);
            showModal("Error", error.message);
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <header className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        Add New Source
                    </h1>
                    <Link to="/search" className={`flex items-center ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Search
                    </Link>
                </header>

                {/* Link and AI Assist Section */}
                <div className="mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="Link"
                            placeholder="Enter source link"
                            value={formData.Link}
                            onChange={handleInputChange}
                            className={`flex-1 p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                        <button
                            onClick={handleLinkAIAssist}
                            disabled={loading || !formData.Link}
                            className={`px-4 py-2 ${darkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-500 hover:bg-sky-600'} text-white rounded-md disabled:opacity-50 flex items-center`}
                        >
                            {loading ? <Loader className="animate-spin h-5 w-5" /> : 'AI Assist'}
                        </button>
                    </div>
                </div>

                {/* Main Form */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Cascading Dropdowns Section */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">PA Classification *</label>
                        <select
                            value={selectedPA}
                            onChange={handlePAChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select PA Classification</option>
                            {availablePAs.map(pa => (
                                <option key={pa} value={pa}>{pa}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Sector/Area *</label>
                        <select
                            value={selectedSector}
                            onChange={handleSectorChange}
                            disabled={!selectedPA}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select Sector/Area</option>
                            {availableSectors.map(sector => (
                                <option key={sector} value={sector}>{sector}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Sub-Sector *</label>
                        <select
                            name="Sub-Sector"
                            value={formData['Sub-Sector']}
                            onChange={handleSubSectorChange}
                            disabled={!selectedSector}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select Sub-Sector</option>
                            {availableSubSectors.map(subSector => (
                                <option key={subSector} value={subSector}>{subSector}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fixed Dropdown Options */}
                    {Object.entries(FORM_OPTIONS).map(([key, options]) => (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium mb-1">{key} *</label>
                            <select
                                name={key}
                                value={formData[key]}
                                onChange={handleInputChange}
                                className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                            >
                                <option value="">Select {key}</option>
                                {options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {/* Text Input Fields */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Source Name *</label>
                        <input
                            type="text"
                            name="Source name"
                            value={formData['Source name']}
                            onChange={handleInputChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="block text-sm font-medium mb-1">Description *</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleInputChange}
                            rows="3"
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Years *</label>
                        <input
                            type="text"
                            name="Years"
                            value={formData.Years}
                            onChange={handleInputChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                            placeholder="Either since xxxx or xxxx;xxxx;xxxx;... or xxxx-xxxx"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Latest Year Available *</label>
                        <input
                            type="text"
                            name="Latest year available"
                            value={formData['Latest year available']}
                            onChange={handleInputChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Latest Forecast Year Available</label>
                        <input
                            type="text"
                            name="Latest forecast year avalable"
                            value={formData['Latest forecast year avalable']}
                            onChange={handleInputChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Frequency Cover Harmonized?</label>
                        <input
                            type="text"
                            name="Frequency cover harmonized for all geos ? "
                            value={formData['Frequency cover harmonized for all geos ? ']}
                            onChange={handleInputChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Tags</label>
                        <input
                            type="text"
                            name="Tags"
                            value={formData.Tags}
                            onChange={handleInputChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                            placeholder="Comma-separated tags"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Expert Opinion</label>
                        <textarea
                            name="Expert opinion"
                            value={formData['Expert opinion']}
                            onChange={handleInputChange}
                            rows="2"
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Reliability Score (1-10) *</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            name="Reliability score (1-10) "
                            value={formData['Reliability score (1-10) ']}
                            onChange={handleInputChange}
                            className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md`}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        className={`w-full px-4 py-2 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md transition-colors duration-300`}
                    >
                        Submit Entry
                    </button>
                </div>
            </div>

            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                title={modalContent.title}
                darkMode={darkMode}
            >
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