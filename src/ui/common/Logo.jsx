import { Link } from "react-router-dom";
// import { image } from "../../config/constant/image";

const Logo = () => {
  return (
    <Link to="/user">
      <div
        className={`flex justify-center items-center w-fit p-1 gap-2 cursor-pointer `}
      >
        {/* <img src={image.logo} alt="" width={150} /> */}
        <h1 className="text-4xl font-bold text-center border-b-4 border-t-4 border-white">
          IMS
        </h1>
      </div>
    </Link>
  );
};

export default Logo;
