import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router-dom";
import "./UserProfilePage.css";
import placeHoderImg from "../../image/user-icon.png";
import UserFavorites from "./UserFavorites";
import UserReviews from "./UserReviews";
import {
  getAllReviews,
  getCurrentUserReviews,
  selectCurrentUserReviews,
} from "../../store/reviews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import dateFormater from "../../utils/dateFormater";
import { NavLink } from "react-router-dom";
import ProfileOverview from "./ProfileOverview";
const UserProfilePage = () => {
  const { currUser, currUserReviews } = useSelector((state) => ({
    currUser: state.session.user,
    currUserReviews: selectCurrentUserReviews(state),
  }));
  const dispatch = useDispatch();
  useEffect(() => {
    getAllReviews();
    if (currUser) {
      getCurrentUserReviews();
    }
  }, [dispatch, currUser]);
  if (!currUser) return <h1>loading...</h1>;
  return (
    <div className="user-profile-container">
      <div className="user-profile-top-section-container">
        <img
          alt="user-profile"
          src={placeHoderImg}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <div className="userInfo-container">
          <h3>
            {currUser.firstname} {currUser.lastname[0]}.
          </h3>
          <div>Member Since {dateFormater(currUser.createdAt)}</div>
          <div className="userInfo-summary-container">
            <div>{currUser.reviewsCount} Reviews</div>
            <div>{currUser.favorites.length} Favorites Collection</div>
          </div>
        </div>
      </div>
      <div className="user-profile-bottom-section-container">
        <h3>
          {currUser.firstname} {currUser.lastname[0]}.'s profile
        </h3>
        <div className="overview-container">
          <div className="user-profile-tabs-container">
            <NavLink className="tab-link first" to="/users/current/profile">
              <i className="fas fa-user-circle" />
              Profile Overview
            </NavLink>
            <NavLink className="tab-link" to="/users/current/reviews">
              <FontAwesomeIcon icon="fa-solid fa-bone" />
              Reviews
            </NavLink>
            <NavLink className="tab-link last" to="/users/current/favorites">
              <FontAwesomeIcon
                icon="fa-solid fa-heart"
                className="display-bone"
              />
              Favorites
            </NavLink>
          </div>
          <div className="user-favs-container">
            <Route path="/users/current/profile">
              <ProfileOverview />
            </Route>
            <Route path="/users/current/reviews">
              <UserReviews />
            </Route>
            <Route path="/users/current/favorites">
              <UserFavorites />
            </Route>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;