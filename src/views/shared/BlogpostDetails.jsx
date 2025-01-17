import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor, EditorState, convertFromHTML, ContentState } from 'draft-js';
import { fetchBlogpostById, updateBlogpostStatus } from '../../redux/features/blogpostSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import noDataImage from '../../assets/noData.png';
import { Icon } from '@iconify/react';
import arrowBackIcon from '@iconify-icons/mdi/arrow-left';

const BlogpostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user_info } = useSelector((state) => state.user);
  const { blogpost, status } = useSelector((state) => state.blogpost);

  useEffect(() => {
    dispatch(fetchBlogpostById(id));
  }, [dispatch, id]);

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

  const handleStatusChange = () => {
    const newStatus = blogpost.status === 'terminated' ? 'published' : 'terminated';
    dispatch(updateBlogpostStatus({ id, status: newStatus })).then(() => {
      dispatch(fetchBlogpostById(id));
    });
  };

  if (status === 'loading') {
    return <Skeleton count={5} />;
  }

  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-row justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 underline flex items-center mb-4"
        >
          <Icon icon={arrowBackIcon} className="w-5 h-5 mr-2" />
          Back
        </button>
        
        {user_info?.user_role === 'e-admin' && (
          <button
            onClick={handleStatusChange}
            className={`py-2 px-4 rounded mb-5 ${
              blogpost.status === 'terminated'
                ? 'bg-green-600 hover:bg-green-800 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {blogpost.status === 'terminated' ? 'Publish' : 'Terminate'}
          </button>
        )}
      </div>
      {blogpost ? (
        <div className="bg-white rounded shadow-sm shadow-teal-800 p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-4">{blogpost.title}</h1>
          {blogpost.user && (
            <div className="flex items-center mb-4">
              <img
                src={blogpost.user.profile_img || noDataImage}
                alt={blogpost.user.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-md sm:text-lg font-bold">{blogpost.user.name}</h2>
                <p className="text-gray-600">{new Date(blogpost.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <img
            src={blogpost.banner || noDataImage}
            alt={blogpost.title}
            className="w-full h-64 object-cover rounded mb-6"
          />
          <div className="text-gray-700 text-lg leading-relaxed">
            {renderBlogpostContent(blogpost.content)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img src={noDataImage} alt="No Data" className="w-48 h-48 mb-4" />
          <p className="text-gray-500 text-lg">Blog post not found!</p>
        </div>
      )}
    </div>
  );
}

export default BlogpostDetails;