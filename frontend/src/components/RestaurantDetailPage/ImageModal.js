const ImageModal = ({ currResImges, name }) => {
  console.log(name);
  return (
    <div className="images-modal-container">
      <h1>Photos for {name}</h1>
      <div className="iamges-card-container">
        {currResImges.length > 0 ? (
          currResImges.map((img, idx) => (
            <div key={idx} className="image-wrapper">
              <img src={img.url} alt="*" />
            </div>
          ))
        ) : (
          <h2>No Images Yet.</h2>
        )}
      </div>
    </div>
  );
};
export default ImageModal;
