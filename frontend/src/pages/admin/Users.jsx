import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, getUsersFailure, getUsersStart, getUsersSuccess } from '../../redux/slices/userSlice';

const Users = () => {
  const dispatch = useDispatch();
  const { users, currentUser, loading, error } = useSelector(state => state.user);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 10

  useEffect(() => {
    fetchUsers(currentPage)
    return () => {
      dispatch(getUsersSuccess([]))
    }
  }, [currentPage]);

  // Remove incorrect totalUsers calculation from local array length
  /*
  useEffect(() => {
    if (users.length > 0) {
      setTotalUsers(users.length);
    }
  }, [users])
  */

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const renderPagination = () => {
    const disableNext = currentPage * pageSize >= totalUsers;
    return (
      <div className='w-[100%] flex justify-between items-center my-8 pt-6 border-t border-gray-100'>
        <button 
          className='bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors disabled:opacity-50' 
          onClick={prevPage} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase"> Page {currentPage} </span>
        <button 
          className='bg-black text-white px-6 py-2 rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50' 
          onClick={nextPage} 
          disabled={currentPage * pageSize >= totalUsers}
        >
          Next
        </button>
      </div>
    );
  };

  const handleDelete = async (userId) => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        // Handling non-successful status codes
        const errorData = await res.json();
      }

      dispatch(deleteUserSuccess());

    }
    catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const fetchUsers = async (page) => {

    dispatch(getUsersStart());

    try {
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/getusers?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
      }

      const data = await res.json();
      setTotalUsers(data.totalUsers);
      dispatch(getUsersSuccess(data));
    } catch (error) {
      dispatch(getUsersFailure(error.message));
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UserId</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">userType</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users && Object.values(users).map((user, key) => (
            <tr key={key}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">{user._id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.password.length>10 ? "********" : user.password}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.userType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {currentUser && currentUser._id === user._id ? (
                  <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">You</span>
                ) : (
                  <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(user._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      {renderPagination()}
    </>
  );
};

export default Users;
