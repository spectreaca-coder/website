import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <video autoPlay loop muted className="background-video">
        <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>Education for the Future</h1>
        <p>Placeholder text about the importance of modern education and how our programs can help you succeed.</p>
      </div>
    </div>
  );
};

export default HomePage;
