// src/components/ImagePreview.jsx
import React from 'react';
import PropTypes from 'prop-types';

const formatSize = (size) => {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ImagePreview({ image }) {
  if (!image) return null;

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column align-items-center">
        <div className="mb-2 text-center" style={{ fontWeight: 500 }}>
          {image.name} <small className="text-muted">({formatSize(image.size)})</small>
        </div>
        <img
          src={image.base64}
          alt={image.name}
          className="img-fluid"
          style={{ maxHeight: 320, objectFit: 'contain', borderRadius: 8, border: '1px solid #e9e9e9' }}
        />
      </div>
    </div>
  );
}

ImagePreview.propTypes = {
  image: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    base64: PropTypes.string,
  }),
};
