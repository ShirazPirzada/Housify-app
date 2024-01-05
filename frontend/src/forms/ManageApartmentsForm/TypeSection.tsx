import { useFormContext } from "react-hook-form";
import {apartmentTypes} from "../../config/apartment-options-config";

const TypeSection = ()=>{
    const {register} = useFormContext();

    return(
        <div>
            <h2 className="text-2xl font-bold mb-3">Type</h2>
            
        </div>
    )
}