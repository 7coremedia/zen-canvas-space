const FullScreenImage = ({ imageSrc, alt = "Full screen image" }) => {
  return (
    <section className="relative w-full">
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-auto"
      />
    </section>
  );
};

export default FullScreenImage;
