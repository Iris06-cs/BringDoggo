import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Footer.css";
import haru from "../../image/haru.png";
import douding from "../../image/douding.png";
const Footer = () => {
  const currentYear = new Date(Date.now()).getFullYear();

  return (
    <footer>
      <div className="footer-img-container">
        <img alt="my-dog" src={haru} />
        <img alt="my-dog" src={douding} />
      </div>
      <div className="footer-text-container">
        <p>
          Copyright{" "}
          <span>
            <FontAwesomeIcon icon="fa-solid fa-copyright" />
          </span>{" "}
          {currentYear} BringDoggo
        </p>
        <p>Restaurants Data From Yelp Fusion API</p>
        <p> Map Data From Google Map API</p>
      </div>
    </footer>
  );
};
export default Footer;
