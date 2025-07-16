import React, { useRef } from 'react';
import { Download, Upload, RotateCcw, Save } from 'lucide-react';

interface DataManagerProps {
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onReset: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ onExport, onImport, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onImport(file);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      onReset();
      alert('All data has been reset to default values.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Save className="h-6 w-6 text-indigo-600 mr-2" />
        Data Management
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onExport}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium"
        >
          <Download className="h-5 w-5" />
          <span>Export Data</span>
        </button>
        
        <button
          onClick={handleImportClick}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
        >
          <Upload className="h-5 w-5" />
          <span>Import Data</span>
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Reset Data</span>
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Data Storage Info</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All data is stored locally in your browser</li>
          <li>• Export your data regularly as backup</li>
          <li>• Data persists across browser sessions</li>
          <li>• Clearing browser data will remove your progress</li>
        </ul>
      </div>
    </div>
  );
};

export default DataManager;