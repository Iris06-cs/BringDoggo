import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertTimeFormat from "../../utils/convertTimeFormat";
const ContactLocationCard = ({ restaurantDetail }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="contact-location-card-container">
      <div className="contact-card-container">
        <div className="contact-card-row-container">
          <a href={restaurantDetail.url}>
            {restaurantDetail.url.slice(0, 35)}...
          </a>
          <FontAwesomeIcon icon="fa-solid fa-arrow-up-right-from-square" />
        </div>
        <div className="contact-card-row-container">
          <p>{restaurantDetail.displayPhone}</p>
          <FontAwesomeIcon icon="fa-solid fa-phone-volume" />
        </div>
      </div>

      <div className="location-hours-card-container">
        <h3>Location & Hours</h3>
        <div className="location-hours-container">
          <div className="location-card-container">
            <p>map</p>
            <p>{restaurantDetail.address}</p>
            <p>
              {restaurantDetail.city},{restaurantDetail.state}{" "}
              {restaurantDetail.zipcode}
            </p>
            <p>get direction</p>
          </div>
          <div className="hours-card-container">
            <ul>
              {restaurantDetail.hours &&
                restaurantDetail.hours[0].open.map((day, idx) => (
                  <li key={idx} className="business-hour-row">
                    <span>{days[idx]}</span>{" "}
                    <span>
                      {convertTimeFormat(day.start)}-
                      {convertTimeFormat(day.end)}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactLocationCard;
