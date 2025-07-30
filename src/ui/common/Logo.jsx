import { Link } from "react-router-dom";
// import { image } from "../../config/constant/image";

const Logo = () => {
  return (
    <Link to="/">
      <div
        className={`flex justify-center items-center w-fit p-1 gap-2 cursor-pointer `}
      >
        {/* <img src={image.logo} alt="" width={150} /> */}
        <h1 className="text-3xl font-bold text-center">IMS</h1>

      </div>
    </Link>
  );
};

export default Logo;
