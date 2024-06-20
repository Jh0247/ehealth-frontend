import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { createBlogpost, fetchBlogpostById, updateBlogpost } from '../../redux/features/blogpostSlice';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor as WysiwygEditor } from 'react-draft-wysiwyg';

const CreationBlogpost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const blogId = location.state?.blogId;
  const { blogpost, status, error } = useSelector((state) => state.blogpost);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    banner: null,
    status: 'draft'
  });

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [errorState, setError] = useState('');
  const [bannerChanged, setBannerChanged] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogpostById(blogId));
    }
  }, [dispatch, blogId]);

  useEffect(() => {
    if (blogpost && blogId) {
      setFormData({
        title: blogpost.title || '',
        content: blogpost.content || '',
        banner: blogpost.banner || null,
        status: blogpost.status || 'draft'
      });
      setEditorState(EditorState.createWithContent(stateFromHTML(blogpost.content || '')));
      setBannerPreview(blogpost.banner || null);
    }
  }, [blogpost, blogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    const contentState = editorState.getCurrentContent();
    setFormData({ ...formData, content: stateToHTML(contentState) });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      setFormData((prev) => ({ ...prev, banner: null }));
      setBannerChanged(false);
    } else {
      setError('');
      setFormData((prev) => ({ ...prev, banner: file }));
      setBannerChanged(true);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('status', formData.status);
    if (bannerChanged && formData.banner) {
      formDataToSend.append('banner', formData.banner);
    }

    if (blogId) {
      dispatch(updateBlogpost({ id: blogId, formData: formDataToSend })).then(() => {
        navigate('/healthcare/my-blog');
      });
    } else {
      dispatch(createBlogpost(formDataToSend)).then(() => {
        navigate('/healthcare/my-blog');
      });
    }
  };

  return (
    <div className="flex flex-col p-5 md:p-9 bg-gray-50">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-center sm:text-left">
        {blogId ? 'Edit Blogpost' : 'Create Blogpost'}
      </h3>
      {errorState && <div className="text-red-500 mb-4">{errorState}</div>}
      {error && <div className="text-red-500 mb-4">{JSON.stringify(error)}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Banner</label>
          <input
            type="file"
            accept="image/*"
            name="banner"
            onChange={handleBannerChange}
            className="mt-1 p-2 w-full border rounded"
          />
          {bannerPreview && (
            <img src={bannerPreview} alt="Banner" className="mt-4 w-full h-48 object-cover" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <div className="border rounded p-2">
            <WysiwygEditor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
              toolbar={{
                options: ['inline', 'blockType', 'list', 'link', 'embedded', 'emoji', 'image', 'history'],
                inline: { options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'] },
                list: { options: ['unordered', 'ordered'] },
              }}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/my-blogposts')}
            className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6">
        <h4 className="text-xl font-bold mb-4">Preview</h4>
        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
      </div>
    </div>
  );
};

export default CreationBlogpost;
