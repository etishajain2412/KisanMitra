import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserProfile(token);
    }
  }, [navigate]);

  // Fetch user profile details
  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfilePic(res.data.profileImage);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle Profile Upload
  const handleUpload = async () => {
    if (!image) return alert('Please select an image');
    if (isUploading) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('profileImage', image);

    const token = localStorage.getItem('token');
    if (!token) return alert('User not authenticated');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/upload-profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Profile picture updated successfully');
      setPreview('');
      setProfilePic(res.data.imageUrl);
    } catch (error) {
      setMessage('Upload failed: ' + error.response?.data?.message || 'An error occurred');
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove Profile Picture
  const handleRemovePicture = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('User not authenticated');

    try {
      await axios.delete('http://localhost:5000/api/users/remove-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfilePic('');
      setMessage('Profile picture removed successfully');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setMessage('Failed to remove profile picture: ' + error.response?.data?.message || 'An error occurred');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white shadow-lg rounded-lg'>
        <h2 className='text-3xl font-bold text-center text-gray-700 mb-4'>Welcome to Your Dashboard</h2>
        <p className='text-center text-gray-600 mb-4'>You're logged in successfully!</p>

        {/* Profile Picture Section */}
        <div className='flex flex-col items-center mb-4'>
          {profilePic ? (
            <img
              src={profilePic}
              alt='Profile'
              className='w-32 h-32 rounded-full mb-2 shadow-md object-cover'
            />
          ) : (
            <div className='w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600'>
              No Image
            </div>
          )}
          <input type='file' onChange={handleImageChange} className='mt-2' disabled={isUploading} />
          {preview && (
            <img src={preview} alt='Preview' className='w-24 h-24 mt-2 rounded-full object-cover' />
          )}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='w-full p-3 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600'
        >
          Logout
        </button>

        {/* Remove Profile Picture Button */}
        {profilePic && (
          <button
            onClick={handleRemovePicture}
            className='mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
          >
            Remove Profile Picture
          </button>

        )}

        {message && <p className='text-center mt-2 text-green-500'>{message}</p>}
        <button
          onClick={() => navigate('/display')}
          className="w-full p-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          View All Products
        </button>
         {/* My Products Button */}
      <button
        onClick={() => navigate('/my-products')}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        My Products
      </button>
        <button
          onClick={() => navigate('/product')}
          className="w-full p-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}

export default Dashboard;