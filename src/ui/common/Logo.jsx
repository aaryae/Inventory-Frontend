import { Link } from "react-router-dom";
import { image } from "../../config/constant/image";

const Logo = () => {
  return (
    <Link to="/">
      <div
        className={`flex justify-center items-center w-fit p-1 gap-2 cursor-pointer `}
      >
        <img src={image.logo} alt="" width={150} />
      </div>
    </Link>
  );
};

export default Logo;
