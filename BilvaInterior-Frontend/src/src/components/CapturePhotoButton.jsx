// src/components/CapturePhotoButton.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

export default function CapturePhotoButton({ onFiles }) {
  const ref = useRef();

  const onChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length && onFiles) onFiles(files);
    e.target.value = null; // reset so same file can be picked again
  };

  return (
    <div>
      <label className="btn btn-outline-primary w-100 mb-2" style={{ cursor: 'pointer' }}>
        Capture Photo
        <input
          ref={ref}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onChange}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
}

CapturePhotoButton.propTypes = {
  onFiles: PropTypes.func.isRequired,
};
