import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import {
  getAllFavs,
  getCurrentUserFavs,
  selectCurrUserFavs,
} from "../../store/favorites";
import LoadingSpinner from "../LoadingSpinner";

const UserFavorites = () => {
  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.session.user);
  const userFavs = useSelector((state) => selectCurrUserFavs(state));
  useEffect(() => {
    dispatch(getAllFavs());
    dispatch(getCurrentUserFavs());
  }, [dispatch]);
  if (!userFavs) <LoadingSpinner />;
  return (
    <>
      <h3>Favorites</h3>
      <div>
        {userFavs &&
          Object.values(userFavs).map((fav, idx) => (
            <div key={idx} className="fav-card-container">
              <div>
                <h4>{fav.title}</h4>
                <div className="fav-collection-info">
                  <div>{fav.isPublic ? "Public" : "Non-Public"}</div>
                  <div>{Object.values(fav.restaurants).length}</div>
                </div>
              </div>
              <div className="modify-fav-btns-container">
                <button>Update Collection</button>
                <button>Delete Collection</button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default UserFavorites;
