import React from 'react';
import rolling from '../assets/Rolling.svg';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <img src={rolling} alt="Loading..." className="w-24 h-24 animate-spin" />
    </div>
  );
};

export default Loading;