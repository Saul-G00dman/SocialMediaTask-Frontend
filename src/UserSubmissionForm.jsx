import React, { useState } from 'react';
import { Upload, User, AtSign, X, AlertCircle, CheckCircle, Facebook, Instagram, Twitter, Linkedin, Youtube, Github } from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { id: 'github', name: 'GitHub', icon: Github, color: 'text-gray-800' },
];

const UserSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    socialPlatform: 'instagram', // default platform
    socialHandle: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setNotification({
        type: 'error',
        message: 'Some files were skipped. Images must be under 5MB.'
      });
    }

    setFormData({
      ...formData,
      images: validFiles
    });

    const previewUrls = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreview(previewUrls);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });

    const newPreview = [...preview];
    URL.revokeObjectURL(newPreview[index].url);
    newPreview.splice(index, 1);
    setPreview(newPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ type: '', message: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('socialPlatform', formData.socialPlatform);
      formDataToSend.append('socialHandle', formData.socialHandle.trim());
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('http://localhost:3000/api/submissions', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        preview.forEach(p => URL.revokeObjectURL(p.url));
        setFormData({ 
          name: '', 
          socialPlatform: 'instagram', 
          socialHandle: '', 
          images: [] 
        });
        setPreview([]);
        setNotification({
          type: 'success',
          message: 'Your submission was successful!'
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Error: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.id === formData.socialPlatform);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {notification.message && (
        <div className={`mb-4 p-4 rounded-md flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{notification.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline mr-2 w-4 h-4" />
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            minLength={2}
            maxLength={50}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SOCIAL_PLATFORMS.map(platform => (
              <button
                key={platform.id}
                type="button"
                onClick={() => setFormData({ ...formData, socialPlatform: platform.id })}
                className={`flex items-center justify-center gap-2 p-2 rounded-md border ${
                  formData.socialPlatform === platform.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <platform.icon className={`w-5 h-5 ${platform.color}`} />
                <span className="text-sm">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <AtSign className="inline mr-2 w-4 h-4" />
            {selectedPlatform.name} Handle
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <selectedPlatform.icon className={`w-5 h-5 ${selectedPlatform.color}`} />
            </div>
            <input
              type="text"
              name="socialHandle"
              value={formData.socialHandle}
              onChange={handleInputChange}
              required
              minLength={2}
              maxLength={30}
              className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter your ${selectedPlatform.name} handle`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Upload className="inline mr-2 w-4 h-4" />
            Upload Images
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Max file size: 5MB. Allowed formats: JPG, PNG, GIF
          </p>
        </div>

        {preview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {preview.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={file.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || formData.images.length === 0}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default UserSubmissionForm;