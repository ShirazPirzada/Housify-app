import { ApartmentType } from "../../../backend/src/shared/types"
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
type Props = {
    apartment: ApartmentType;
}

const SearchResultCard = ({apartment}:Props)=>{
return(
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      <div className="w-full h-[300px]">
        <img
          src={apartment.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: apartment.Rating }).map(() => (
                <AiFillStar className="fill-yellow-400" />
              ))}
            </span>
            <span className="ml-1 text-sm">{apartment.type}</span>
          </div>
          <Link
            to={`/detail/${apartment._id}`}
            className="text-2xl font-bold cursor-pointer"
          >
            {apartment.name}
          </Link>
        </div>

        <div>
          <div className="line-clamp-4">{apartment.description}</div>
        </div>

        <div className="grid grid-cols-2 items-end whitespace-nowrap">
          <div className="flex gap-1 items-center">
            {apartment.facilities.slice(0, 3).map((facility) => (
              <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {apartment.facilities.length > 3 &&
                `+${apartment.facilities.length - 3} more`}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-bold">£{apartment.pricePerMonth} per month</span>
            <Link
              to={`/detail/${apartment._id}`}
              className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
)
}

export default SearchResultCard;