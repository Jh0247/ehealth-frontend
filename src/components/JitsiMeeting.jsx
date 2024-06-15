import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const loadJitsiScript = () => {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) {
      resolve(window.JitsiMeetExternalAPI);
    } else {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => resolve(window.JitsiMeetExternalAPI);
      script.onerror = () => reject(new Error('Jitsi script loading error'));
      document.head.appendChild(script);
    }
  });
};

const JitsiMeeting = ({ roomName, displayName, email }) => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    loadJitsiScript().then((JitsiMeetExternalAPI) => {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: displayName,
          email: email
        }
      };

      const api = new JitsiMeetExternalAPI(domain, options);

      return () => api.dispose();
    }).catch((error) => {
      console.error('Failed to load Jitsi API', error);
    });
  }, [roomName, displayName, email]);

  return (
    <div
      ref={jitsiContainerRef}
      style={{ width: '100%', height: '600px' }}
    />
  );
};

JitsiMeeting.propTypes = {
  roomName: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  email: PropTypes.string,
};

export default JitsiMeeting;
