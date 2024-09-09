import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 max-w-sm w-full shadow-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>{title}</h2>
          <button 
            onClick={onClose} 
            className={`text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-in-out ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-900'}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-white transition-colors duration-150 ease-in-out ${
              darkMode 
                ? 'bg-sky-600 hover:bg-sky-700' 
                : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;