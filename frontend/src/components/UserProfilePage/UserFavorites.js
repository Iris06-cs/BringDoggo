import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import {
  deleteFav,
  getAllFavs,
  getCurrentUserFavs,
  selectCurrUserFavs,
} from "../../store/favorites";
import LoadingSpinner from "../LoadingSpinner";
import OpenModalButton from "../OpenModalButton";
import EditFavModal from "./EditFavModal";
const UserFavorites = ({ setIsDeleted }) => {
  const dispatch = useDispatch();
  const userFavs = useSelector((state) => selectCurrUserFavs(state));
  useEffect(() => {
    dispatch(getAllFavs());
    dispatch(getCurrentUserFavs());
  }, [dispatch]);
  const handleDelete = async (e, favId) => {
    e.preventDefault();
    await dispatch(deleteFav(favId));
    setIsDeleted((prev) => prev + 1);
  };

  if (!userFavs) return <LoadingSpinner />;
  return (
    <>
      <h3>Favorites</h3>
      <div className="userprofile-fav-cards-container">
        {userFavs &&
          Object.values(userFavs).map((fav, idx) => (
            <div key={idx} className="fav-card-container">
              <div className="fav-card-left-container">
                <div className="fav-title-row">{fav.title}</div>
                <div>{fav.description}</div>
                <div className="fav-collection-info">
                  <div>{fav.isPublic ? "Public" : "Non-Public"}</div>
                  <div>{Object.values(fav.restaurants).length}</div>
                </div>
              </div>
              <div className="modify-fav-btns-container">
                <OpenModalButton
                  buttonText="Update Collection"
                  modalComponent={<EditFavModal fav={fav} />}
                />
                <button
                  onClick={(e) => handleDelete(e, fav.id)}
                  className="general-button"
                >
                  Delete Collection
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default UserFavorites;
