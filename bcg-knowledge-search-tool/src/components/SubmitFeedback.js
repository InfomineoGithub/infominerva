import React, { useState } from 'react';
import { Loader, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmitFeedback = ({ darkMode }) => {
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            setStatus('empty');
            return;
        }

        setStatus('submitting');
        try {
            const apiUrl = process.env.REACT_APP_URL;
            const response = await fetch(`${apiUrl}submit-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback })
            });

            if (response.ok) {
                setStatus('success');
                setFeedback('');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
            <div className={`max-w-2xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className={`text-xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        Submit Feedback
                    </h1>
                    <Link to="/search" className={`flex items-center text-sm ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Search
                    </Link>
                </div>

                <textarea
                    rows={6}
                    className={`w-full p-3 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring`}
                    placeholder="Type your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    disabled={status === 'submitting'}
                    className={`mt-4 px-4 py-2 flex items-center rounded ${darkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-500 hover:bg-sky-600'} text-white`}
                >
                    {status === 'submitting' ? (
                        <>
                            <Loader className="h-5 w-5 animate-spin mr-2" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5 mr-2" />
                            Submit
                        </>
                    )}
                </button>

                {status === 'success' && (
                    <p className="mt-2 text-green-500">Feedback submitted. Thank you!</p>
                )}
                {status === 'error' && (
                    <p className="mt-2 text-red-500">Something went wrong. Please try again.</p>
                )}
                {status === 'empty' && (
                    <p className="mt-2 text-yellow-500">Please enter feedback before submitting.</p>
                )}
            </div>
        </div>
    );
};

export default SubmitFeedback;
