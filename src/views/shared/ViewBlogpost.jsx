import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogpost, fetchBlogpostsByName } from '../../redux/features/blogpostSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import noDataImage from '../../assets/noData.png';
import { rolePathMap } from '../../constants/rolePath';
import { Editor, EditorState, convertFromHTML, ContentState } from 'draft-js';

const ViewBlogpost = () => {
  const dispatch = useDispatch();
  const { user_info } = useSelector((state) => state.user);
  const { blogpost, status } = useSelector((state) => state.blogpost);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogpost({ status: 'published' }));
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      dispatch(fetchBlogpostsByName(searchQuery));
      setHasSearched(true);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    dispatch(fetchBlogpost({ status: 'published' }));
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

  const blogpostData = blogpost?.data || [];

  const renderBlogpostContent = (content) => {
    if (!content) {
      return null;
    }
    
    const blocksFromHTML = convertFromHTML(content);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );
    const editorState = EditorState.createWithContent(contentState);
    return <Editor editorState={editorState} readOnly={true} />;
  };

  return (
    <div className="p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Blog Posts</h3>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search by name..."
          className="p-2 w-full flex-1 mb-2 sm:mb-0 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={hasSearched ? handleClear : handleSearch}
          className={`w-full sm:w-fit sm:ml-2 px-4 py-2 rounded ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-2">
                  {renderBlogpostContent(post.content)}
                </div>
                <a href={rolePathMap[user_info?.user_role] + `/blogpost-details/${post.id}`} className="text-[#347576] hover:underline text-sm sm:text-base">
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

export default ViewBlogpost;