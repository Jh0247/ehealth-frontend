import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBlogpostById } from '../../redux/features/blogpostSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import noDataImage from '../../assets/noData.png';

export default function BlogpostDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { blogpost, status } = useSelector((state) => state.blogpost);

  useEffect(() => {
    dispatch(fetchBlogpostById(id));
  }, [dispatch, id]);

  if (status === 'loading') {
    return <Skeleton count={5} />;
  }

  return (
    <div className="p-5 md:p-9">
      {blogpost ? (
        <div className="bg-white rounded shadow-sm shadow-teal-800 p-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{blogpost.title}</h1>
          <div className="flex items-center mb-4">
            <img
              src={blogpost.user.profile_img || noDataImage}
              alt={blogpost.user.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{blogpost.user.name}</h2>
              <p className="text-gray-600">{new Date(blogpost.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <img
            src={blogpost.banner || noDataImage}
            alt={blogpost.title}
            className="w-full h-64 object-cover rounded mb-6"
          />
          <div className="text-gray-700 text-lg leading-relaxed">{blogpost.content}</div>
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