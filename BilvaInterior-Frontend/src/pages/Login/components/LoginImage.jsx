import React, { useEffect } from 'react';

const LoginImage = () => {
  useEffect(() => {
    // Initialize Bootstrap carousel
    const carouselElement = document.querySelector('#heroCarousel');
    if (carouselElement && window.bootstrap) {
      new window.bootstrap.Carousel(carouselElement, { 
        interval: 3500, 
        pause: false 
      });
    }
  }, []);

  return (
    <div className="col-md-6 d-none d-md-block pe-md-3">
      <div id="heroCarousel" className="carousel slide rounded overflow-hidden h-100">
        <div className="carousel-inner h-100">
          <div className="carousel-item active h-100">
            <img 
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" 
              className="d-block w-100 h-100 object-fit-cover" 
              alt="Modern living room" 
            />
          </div>
          <div className="carousel-item h-100">
            <img 
              src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop" 
              className="d-block w-100 h-100 object-fit-cover" 
              alt="Interior moodboard" 
            />
          </div>
          <div className="carousel-item h-100">
            <img 
              src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop" 
              className="d-block w-100 h-100 object-fit-cover" 
              alt="Workspace" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginImage;