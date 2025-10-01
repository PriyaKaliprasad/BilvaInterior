import React from 'react'

const Avatar = ({src, height, onClick}) => {
  return (
    <div>
      {src ? (
        <img
          src={src}
          alt="avatar"
          height={height}
          width={height}
          style={{ borderRadius: '10%', objectFit: 'cover', display: 'block', cursor: onClick ? 'pointer' : undefined }}
          onClick={onClick}
        />
      ) : (
        <div
          style={{
            width: height,
            height: height,
            borderRadius: '10%',
            background: '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            userSelect: 'none',
            cursor: onClick ? 'pointer' : undefined
          }}
          onClick={onClick}
        >
          no image
        </div>
      )}
    </div>
  )
}

export default Avatar