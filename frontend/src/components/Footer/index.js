import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Footer.css";
import haru from "../../image/haru.jpeg";
import douding from "../../image/douding.jpeg";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
const Footer = () => {
  const currentYear = new Date(Date.now()).getFullYear();

  return (
    <footer>
      <div className="footer-img-container">
        <img alt="my-dog" src={haru} />
        <img alt="my-dog" src={douding} />
      </div>
      <div className="footer-contact-container">
        <a href="https://github.com/Iris06-cs">
          <FontAwesomeIcon icon={faGithub} />
        </a>

        <a href="mailto:swang458@asu.edu">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>

        <a href="https://www.linkedin.com/in/iris-wsy">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </div>
      <div className="footer-text-container">
        <p>
          Copyright{" "}
          <span>
            <FontAwesomeIcon icon={faCopyright} />
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
