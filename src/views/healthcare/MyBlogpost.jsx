import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Editor, EditorState, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import { fetchUserBlogposts } from '../../redux/features/blogpostSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import noDataImage from '../../assets/noData.png';

const MyBlogpost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogpost, status, error } = useSelector((state) => state.blogpost);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchUserBlogposts());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderBlogpostContent = (content) => {
    const blocksFromHTML = convertFromHTML(content);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );
    const editorState = EditorState.createWithContent(contentState);
    return <Editor editorState={editorState} readOnly={true} />;
  };

  const renderBlogpost = (blogpost, index) => (
    <li 
      key={index} 
      className="flex flex-col sm:flex-row items-center border-b py-4"
      onClick={() => navigate('/healthcare/creation-blog', { state: { blogId: blogpost.id } })}
    >
      {blogpost.banner && (
        <img src={blogpost.banner} alt={blogpost.title} className="w-20 h-20 mr-4 object-cover rounded" />
      )}
      <div className="flex-grow">
        <h4 className="text-lg font-semibold mb-2">{blogpost.title}</h4>
        <div className="text-gray-600 mb-2 line-clamp-2">
          {renderBlogpostContent(blogpost.content)}
        </div>
        <p className="text-sm text-gray-500">{formatDate(blogpost.created_at)}</p>
      </div>
      <div className="sm:ml-4 mt-5">
        {blogpost.status === 'draft' && (
          <span className="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full">Draft</span>
        )}
        {blogpost.status === 'published' && (
          <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full">Published</span>
        )}
        {blogpost.status === 'terminated' && (
          <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full">Terminated</span>
        )}
      </div>
    </li>
  );

  const filteredBlogposts = blogpost?.data?.filter((bp) =>
    (statusFilter === 'all' || bp.status === statusFilter) &&
    bp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col p-5 md:p-9">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-center sm:text-left">My Blogposts</h3>
        <button
          onClick={() => navigate('/healthcare/creation-blog')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Create Blogpost
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by title..."
          className="p-2 w-full sm:w-auto flex-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="p-2 w-full sm:w-auto border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 min-h-[200px]">
        <ul>
          {status === 'loading' ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="border-b py-4">
                <Skeleton width={200} height={20} />
              </li>
            ))
          ) : status === 'failed' ? (
            <div className="flex flex-col items-center">
              <img src={noDataImage} alt="Error loading data" className="w-32 h-32" />
              <span className="text-center text-gray-500 py-2">{JSON.stringify(error)}</span>
            </div>
          ) : filteredBlogposts?.length > 0 ? (
            filteredBlogposts.map((blogpost, index) => renderBlogpost(blogpost, index))
          ) : (
            <div className="flex flex-col items-center">
              <img src={noDataImage} alt="No Blogposts Found" className="w-32 h-32" />
              <span className="text-center text-gray-500 py-2">No Blogposts Found</span>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyBlogpost;
