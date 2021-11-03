import React from "react";
import ec1 from "./images/ec1.jpg";
import ec2 from "./images/ec2.jpg";
import ec3 from "./images/ec3.jpg";
import ec4 from "./images/ec4.jpeg";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const HomeCarousel = () => {
  return (
    <Carousel
      dynamicHeight={true}
      showStatus={false}
      showThumbs={false}
      showArrows={true}
      autoPlay
      infiniteLoop
    >
      <div>
        <img src={ec3} alt="shoppy" />
      </div>

      <div>
        <img src={ec1} alt="shoppy" />
      </div>
      <div>
        <img src={ec4} alt="shoppy" />
      </div>
      <div>
        <img src={ec2} alt="shoppy" />
      </div>
    </Carousel>
  );
};

export default HomeCarousel;
