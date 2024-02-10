import mongoose from "mongoose";
export type NIC = {
    _id?:string;
    National_Identity_CardNumber:string;
  };
  
  const cnicSchema = new mongoose.Schema({
    National_Identity_CardNumber: {type: String,required:true},
});



const Model_CNIC = mongoose.model<NIC>("Nadra_NIC_Data",cnicSchema);
// Add dummy data
export default Model_CNIC;



// const dummyData: NIC[] = [
//     {
      //Used
//       National_Identity_CardNumber: "",
//     },
//     {
      
//       National_Identity_CardNumber: "49876-5432109-8",
//     },
//     {
      
//       National_Identity_CardNumber: "",
//     },
//     {
      
//       National_Identity_CardNumber: "48765-4321098-7",
//     },
//     {
      
//       National_Identity_CardNumber: "42345-6789012-3",
//     },
//     {
      
//       National_Identity_CardNumber: "47890-1234567-8",
//     },
//     {
      
//       National_Identity_CardNumber: "43456-7890123-4",
//     },
//     {
      
//       National_Identity_CardNumber: "42109-8765432-1",
//     },
//     {
      
//       National_Identity_CardNumber: "46543-2109876-5",
//     },
//     {
      
//       National_Identity_CardNumber: "41098-7654321-0",
//     },
//     {
      
//       National_Identity_CardNumber: "",
//     },
//     {
     
//       National_Identity_CardNumber: "43210-9876543-2",
//     },
//     {
      
//       National_Identity_CardNumber: "47654-3210987-6",
//     },
//     {
      
//       National_Identity_CardNumber: "43210-9876543-2",
//     },
//     {
      
//       National_Identity_CardNumber: "46543-2109876-5",
//     },
//     {
      
//       National_Identity_CardNumber: "",
//     },
//     {
      
//       National_Identity_CardNumber: "",
//     },
//     {
//       // Use mongoose.Types.ObjectId for _id
//       National_Identity_CardNumber: "48765-4321098-7"
//     },
//   ];
  
//   Model_CNIC.insertMany(dummyData)
//     .then(() => {
//       console.log("Dummy data added successfully");
//       // Close the connection after adding data (optional)
      
//     })
//     .catch((error) => {
//       console.error("Error adding dummy data:", error);
//     });