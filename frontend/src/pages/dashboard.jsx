import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
function Dashboard() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch user profile details (Uses cookies)
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/users/me`, {
        withCredentials: true, // Sends the auth token from cookies
      });
      setProfilePic(res.data.profileImage);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/login'); // Redirect if unauthorized
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

    try {
      const res = await axios.post(
        `${backendUrl}/api/users/upload-profile`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true, // Send cookies
        }
      );

      setMessage('Profile picture updated successfully');
      setPreview('');
      setProfilePic(res.data.imageUrl);
    } catch (error) {
      setMessage('Upload failed: ' + (error.response?.data?.message || 'An error occurred'));
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove Profile Picture
  const handleRemovePicture = async () => {
    try {
      await axios.delete(`${backendUrl}/api/users/remove-profile`, {
        withCredentials: true,
      });

      setProfilePic('');
      setMessage('Profile picture removed successfully');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      setMessage('Failed to remove profile picture: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  // Logout handler (Clears Cookie)
  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      Cookies.remove('token'); // Remove token from cookies
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='w-full max-w-md p-8 bg-white shadow-lg rounded-lg'>
        <h2 className='text-3xl font-bold text-center text-gray-700 mb-4'>Welcome to Your Dashboard</h2>
        <p className='text-center text-gray-600 mb-4'>You're logged in successfully!</p>

        {/* Profile Picture Section */}
        <div className='flex flex-col items-center mb-6'>
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

        {/* Buttons Section */}
        <div className='flex flex-col space-y-3'>
          <div>
            <button
              onClick={() => navigate('/display')}
              className='w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
            >
              View All Products
            </button>
          </div>

          <div>
            <button
              onClick={() => navigate('/my-products')}
              className='w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600'
            >
              My Products
            </button>
          </div>

          <div>
            <button
              onClick={() => navigate('/product')}
              className='w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600'
            >
              Add Product
            </button>
          </div>

          <div>
            <button
              onClick={() => navigate('/news')}
              className='w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600'
            >
              View News
            </button>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className='w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600'
            >
              Logout
            </button>
          </div>

          {profilePic && (
            <div>
              <button
                onClick={handleRemovePicture}
                className='w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600'
              >
                Remove Profile Picture
              </button>
            </div>
          )}
        </div>

        {message && <p className='text-center mt-4 text-green-500'>{message}</p>}
      </div>
    </div>
  );
}

export default Dashboard;
