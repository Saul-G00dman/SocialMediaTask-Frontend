import React, { useState, useEffect } from 'react';
import { RefreshCcw, Inbox, Facebook, Instagram, Twitter, Linkedin, Youtube, Github, Trash2, AlertCircle } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const SOCIAL_PLATFORMS = {
  instagram: { icon: Instagram, color: 'text-pink-500', name: 'Instagram' },
  facebook: { icon: Facebook, color: 'text-blue-600', name: 'Facebook' },
  twitter: { icon: Twitter, color: 'text-blue-400', name: 'Twitter' },
  linkedin: { icon: Linkedin, color: 'text-blue-700', name: 'LinkedIn' },
  youtube: { icon: Youtube, color: 'text-red-600', name: 'YouTube' },
  github: { icon: Github, color: 'text-gray-800', name: 'GitHub' }
};

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ show: false, message: '', isError: false });

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('https://socialmediatask-backend-knus.onrender.com/api/submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      console.log(data);
      
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://socialmediatask-backend-knus.onrender.com/api/submissions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete submission');

      setDeleteStatus({
        show: true,
        message: 'Submission deleted successfully',
        isError: false
      });

      setSubmissions(submissions.filter(sub => sub._id !== id));

      setTimeout(() => {
        setDeleteStatus({ show: false, message: '', isError: false });
      }, 3000);

    } catch (err) {
      setDeleteStatus({
        show: true,
        message: `Error: ${err.message}`,
        isError: true
      });

      setTimeout(() => {
        setDeleteStatus({ show: false, message: '', isError: false });
      }, 3000);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin">
          <RefreshCcw className="w-8 h-8 text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
    // If it's already a full URL (Cloudinary), return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise, construct the full URL for local uploads
    return `https://socialmediatask-backend-knus.onrender.com/${imagePath}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {deleteStatus.show && (
        <div className={`mb-4 p-4 rounded-md flex items-center space-x-2 ${
          deleteStatus.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {deleteStatus.isError ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <p>{deleteStatus.message}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Submissions</h1>
        <button
          onClick={fetchSubmissions}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
          <Inbox className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-500">Submissions will appear here once users start submitting their information.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => {
            const platform = SOCIAL_PLATFORMS[submission.socialPlatform.toLowerCase()];
            const IconComponent = platform?.icon || Github; // Default to Github if platform not found
            
            return (
              <div
                key={submission._id}
                className="border rounded-lg overflow-hidden shadow-md bg-white relative group"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(submission._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{submission.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <IconComponent className={`w-4 h-4 ${platform?.color || 'text-gray-800'}`} />
                    <p className={platform?.color || 'text-gray-800'}>
                      @{submission.socialHandle}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 p-4">
                  {submission.images.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`Upload by ${submission.name}`}
                      className="w-full h-32 object-cover rounded-md cursor-pointer"
                      onClick={() => window.open(getImageUrl(image), '_blank')}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;