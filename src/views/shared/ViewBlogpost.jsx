import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogposts, fetchBlogpostsByName } from '../../redux/features/blogpostSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Icon } from '@iconify/react';
import noDataImage from '../../assets/noData.png';

export default function ViewBlogpost() {
  const dispatch = useDispatch();
  const { blogposts, status } = useSelector((state) => state.blogpost);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogposts());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      dispatch(fetchBlogpostsByName(searchQuery));
      setHasSearched(true);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    dispatch(fetchBlogposts());
    setHasSearched(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (hasSearched) {
      setHasSearched(false);
    }
  };

  if (status === 'loading') {
    return <Skeleton count={5} />;
  }

  const blogpostData = blogposts?.data || [];

  return (
    <div className="p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Blog Posts</h3>
      <div className="flex justify-between items-center mb-6 border rounded p-0 sm:p-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search by name..."
          className="p-2 flex-1 max-w-40"
        />
        <button
          onClick={hasSearched ? handleClear : handleSearch}
          className={`ml-2 px-1 sm:px-4 py-2 rounded ${
            hasSearched ? 'bg-blue-500 text-white' : 'bg-[#347576] text-white'
          }`}
        >
          {hasSearched ? 'Clear' : 'Search'}
        </button>
      </div>

      {blogpostData.length === 0 ? (
        <div className="flex flex-col items-center">
          <img src={noDataImage} alt="No Data" className="w-48 h-48 mb-4" />
          <p className="text-gray-500 text-lg">Stay tuned, things are coming soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogpostData.map((post) => (
            <div key={post.id} className="bg-white rounded shadow-sm shadow-teal-800">
              <img
                src={post.banner || noDataImage}
                alt={post.title}
                className="w-full h-32 sm:h-48 object-cover rounded mb-4 border-b"
              />
              <div className="px-4 pb-2">
                <div className="text-gray-600 text-sm mb-2">{new Date(post.created_at).toLocaleDateString()}</div>
                <h4 className="text-base sm:text-lg font-bold mb-2 truncate">{post.title}</h4>
                <p className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-2">{post.content}</p>
                <a href={`/user/blogpost-details/${post.id}`} className="text-[#347576] hover:underline text-sm sm:text-base">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
