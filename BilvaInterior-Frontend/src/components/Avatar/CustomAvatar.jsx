import React from 'react'

const Avatar = ({src, height}) => {
  return (
    <div>
      {src ? (
        <img
          src={src}
          alt="avatar"
          height={height}
          width={height}
          style={{ borderRadius: '10%', objectFit: 'cover', display: 'block' }}
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
            // fontSize: typeof height === 'number' ? Math.max(12, height / 5) : 16,
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            userSelect: 'none'
          }}
        >
          no image
        </div>
      )}
    </div>
  )
}

export default Avatar