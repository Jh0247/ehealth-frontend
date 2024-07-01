import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBlogpost } from '../../redux/features/blogpostSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Editor, EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Icon } from '@iconify/react';
import arrowDown from '@iconify-icons/mdi/arrow-down';
import arrowUp from '@iconify-icons/mdi/arrow-up';
import { rolePathMap } from '../../constants/rolePath';

const ManageBlogpost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user_info } = useSelector((state) => state.user);
  const { blogpost = { data: [], current_page: 1, last_page: 1 }, status } = useSelector((state) => state.blogpost);
  const [sortedBlogposts, setSortedBlogposts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (filterStatus === '') {
      dispatch(fetchBlogpost({ page: currentPage }));
    } else {
      dispatch(fetchBlogpost({ page: currentPage, status: filterStatus }));
    }
  }, [dispatch, currentPage, filterStatus]);

  useEffect(() => {
    if (blogpost?.data?.length > 0 && blogpost?.current_page === currentPage) {
      sortData(blogpost.data, sortConfig.key, sortConfig.direction);
    }
  }, [currentPage, blogpost, sortConfig]);

  const sortData = (data, key, direction) => {
    const sortedArray = [...data].sort((a, b) => {
      if (key === 'title') {
        return direction === 'ascending'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else if (key === 'created_at') {
        return direction === 'ascending'
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      return 0;
    });
    setSortedBlogposts(sortedArray);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
    sortData(blogpost?.data, key, direction);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <Icon className="ml-2" icon={arrowUp} /> : <Icon className="ml-2" icon={arrowDown} />;
  };

  const truncateContent = (content, limit) => {
    if (content?.length > limit) {
      return content.substring(0, limit) + '...';
    }
    return content;
  };

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
    const contentText = editorState.getCurrentContent().getPlainText();
    return truncateContent(contentText, 50);
  };

  const renderBlogpost = (blogpost, index) => (
    <li
      onClick={() => navigate(`${rolePathMap[user_info?.user_role] + `/blogpost-details/${blogpost.id}`}`)}
      key={index}
      className="flex justify-between items-center border-b py-2"
    >
      <div className="flex w-full my-2">
        <div className="flex flex-col w-2/4 sm:w-1/4 border-r-2 border-gray-300 pr-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            {blogpost?.title}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            {renderBlogpostContent(blogpost?.content)}
          </span>
        </div>
        <div className={`flex flex-col w-2/4 sm:w-1/4 border-r-2 border-gray-300 px-2 ${blogpost.status === 'terminated' ? 'bg-red-100' : blogpost.status === 'published' ? 'bg-green-100' : 'bg-gray-100'}`}>
          <span className={`capitalize text-sm sm:text-base my-1 md:my-0 ${blogpost.status === 'terminated' ? 'text-red-500' : blogpost.status === 'published' ? 'text-green-800' : 'text-gray-500'}`}>
            {blogpost?.status}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            {new Date(blogpost?.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </li>
  );

  const filteredBlogposts = sortedBlogposts.filter(blogpost => {
    return blogpost?.title.toLowerCase().includes(searchTerm.toLowerCase()) && (filterStatus === '' || blogpost?.status === filterStatus);
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col p-5 md:p-9">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between">
        <h3 className="text-xl md:text-2xl font-bold mb-6">Manage Blogposts</h3>
      </div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full sm:w-1/4"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>
      <div className="relative bg-gray-100 rounded-lg shadow-inner">
        <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
          <div className="flex justify-between mb-2">
            <div className="w-2/4 sm:w-1/4 sm:text-base cursor-pointer flex flex-row items-center" onClick={() => handleSort('title')}>
              <strong>Title</strong> {renderSortIcon('title')}
            </div>
            <div className="hidden sm:flex w-1/4 sm:text-base cursor-pointer">
              <strong>Content</strong>
            </div>
            <div className="flex w-2/4 sm:w-1/4 sm:text-base cursor-pointer">
              <strong>Status</strong>
            </div>
            <div className="hidden sm:flex w-1/4 sm:text-base cursor-pointer flex-row items-center" onClick={() => handleSort('created_at')}>
              <strong>Date</strong> {renderSortIcon('created_at')}
            </div>
          </div>
        </div>
        <ul className="max-h-[70vh] overflow-y-auto px-4 py-2">
          {status === 'loading' ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <Skeleton width={200} height={20} />
              </li>
            ))
          ) : filteredBlogposts?.length > 0 ? (
            filteredBlogposts.map((blogpost, index) => renderBlogpost(blogpost, index))
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-center text-gray-500 py-2">No Blogposts Found</span>
            </div>
          )}
        </ul>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-[#285D5E] hover:text-white disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(blogpost?.last_page).keys()].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-[#347576] text-white' : 'bg-gray-300 text-gray-700 hover:bg-[#285D5E] hover:text-white'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === blogpost?.last_page}
          className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-[#285D5E] hover:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageBlogpost;
