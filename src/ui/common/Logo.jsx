import { Box } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <div
        className={`flex justify-center items-center w-fit p-1 gap-2 cursor-pointer `}
      >
        <img src="" alt="" />
      </div>
    </Link>
  );
};

export default Logo;
