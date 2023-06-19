import React, {useContext, useEffect ,useState,useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import Headers from '../components/Headers';
import { LoginContext } from "../ContextProvider/Context";
import { ToastContainer, toast } from 'react-toastify';
import {registercustomer,customerlist,uploadFileToS3} from "../services/Apis";
import "../styles/mix.css"
import axios from "axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const AdminDashboard = () => {

  const navigate = useNavigate();
  const { logindata, setLoginData } = useContext(LoginContext);
  const { userDetails, setUserDetails } = useContext(LoginContext);
  const [customerData,setCustomerData] = useState([])
  const [passhow,setPassShow] = useState(false);
  const [selectedFile,setSelectedFile] = useState();
  const [url,setUrl] = useState('');
  const [exportData,setExportData] =useState({})
  const [startDate, setStartDate] = useState( new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [entryValue,setEntryValue] = useState(10);
  

  const [inputdata,setInputdata] = useState({
    fileurl:"",
    email:"",
    downloads:0
  });
  const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    // XLSX.utils.sheet_add_aoa(ws, [["Custemer Email", "File URL", "Downloads", "Sales Email","Created Time"]], { origin: "A1" });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, 'test' + fileExtension);
  };
  const userValid = () => {
    let token = localStorage.getItem("userdbtoken");
    if (token) {
       getCustomerList()
    } else {
      navigate("*")
    }

  }
  const getCustomerList = async() => {
    // if(startDate === null || ' '){
    //   toast.error('Plaese select Start Date');
    // }else if(endDate=== null || ' '){
    //   toast.error('Plaese select End Date');
    // }else if(entryValue=== null || ' '){
    //   toast.error('Plaese Enter Entry value');
    // }else{
    
    const payload = {
      entry:entryValue,
      startDate:startDate,
      endDate:endDate

    }
    const response = await customerlist(payload);
    console.log('response',response)
    
    if(response.status === 200){
    console.log('response',response)
    setCustomerData(response && response.data && response.data.customerList)
    const customHeadings = response && response.data && response.data.customerList.map(item=>({
      "Custemer Email": item.email,
      "File URL": item.fileurl,
      "Downloads":item.downloads,
      "Sales Email":item.salesemail,
      "Created Time":item.time
    }))
    setExportData(customHeadings)
      // navigate("/")
    }else{
      toast.error('something went wrong');
    }
  }
// }

  useEffect(() => {
    userValid();
  }, [])
  useEffect(() => {
    // if(startDate === null || ' '){
    //   toast.error('Plaese select Start Date');
    // }else if(endDate=== null || ' '){
    //   toast.error('Plaese select End Date');
    // }else if(entryValue=== null || ' '){
    //   toast.error('Plaese Enter Entry value');
    // }else{
      getCustomerList();
    // }
   
  }, [startDate,endDate,entryValue])

console.log('customerData',customerData)
  // setinputvalue
  const handleChange = (e)=>{
    const {name,value} = e.target;
    setInputdata({...inputdata,[name]:value})
  }

  const handleChangeFile = (e)=>{
    
    // const {name,value} = e.target;
    console.log('haha',e)
    // const formData = new FormData();
    // formData.append(
    //   "myFile",
    //   selectedFile,
    //   selectedFile.name
    // );
   setSelectedFile(e.target.files[0])
    // setInputdata({...inputdata,[name]:value})
  }

  const handleSubmit = async(url1)=>{
    // e.preventDefault();
    const {email,downloads,salesemail} = inputdata;
console.log(inputdata)
// const {email,downloads,salesemail} = inputdata;

    // if(fileurl === ""){
    //   toast.error("Enter Your fileurl")
    // }else 
    if(email === ""){
      toast.error("Enter Email")
    }else if(!email.includes("@")){
      toast.error("Enter Valid Email")
    }else if(salesemail === ""){
        toast.error("Enter sales Email")
      }else if(!email.includes("@")){
        toast.error("Enter Valid sales Email")
      }
      else{
        const payload ={
          fileurl:url1,
          email:email,
          salesemail:salesemail,
          downloads:downloads
        }
      const response = await registercustomer(payload);
      console.log('response',response)
      
      if(response.status === 200){
        toast.success('user created successfully');
        setInputdata({fileurl:"",email:"",salesemail:""});
        // navigate("/")
        getCustomerList();
      }else{
        toast.error('something went wrong');
      }
    }
    // if(fileurl === ""){
    //   toast.error("Enter Your fileurl")
    // }else if(email === ""){
    //   toast.error("Enter Email")
    // }else if(!email.includes("@")){
    //   toast.error("Enter Valid Email")
    // }else if(salesemail === ""){
    //     toast.error("Enter sales Email")
    //   }else if(!email.includes("@")){
    //     toast.error("Enter Valid sales Email")
    //   }
    //   else{
    //   const response = await registercustomer(inputdata);
    //   console.log('response',response)
      
    //   if(response.status === 200){
    //     toast.success('user created successfully');
    //     setInputdata({fileurl:"",email:"",salesemail:""});
    //     // navigate("/")
    //     getCustomerList();
    //   }else{
    //     toast.error('something went wrong');
    //   }
    // }
  }
const setEntry = (e)=>{
  e.preventDefault();
  setEntryValue(e.target.value)
} 
  const onFileUpload = async(e)=>{
     e.preventDefault();
    //  console.log(' e.target', e.target)
    // Create an object of formData
    const formData = new FormData();

    formData.append('file', selectedFile);
    // formData.append('fileName', selectedFile.name);
    const payloaddata = {
        file: formData,
      }
    // Details of the uploaded file
    console.log('gaga',formData);
    const response = await uploadFileToS3(formData);

   console.log(response)
   if(response.status === 200){
    setUrl(response && response.data);
    handleSubmit(response && response.data);
    
    // const {email,downloads,salesemail} = inputdata;

    // // if(fileurl === ""){
    // //   toast.error("Enter Your fileurl")
    // // }else 
    // if(email === ""){
    //   toast.error("Enter Email")
    // }else if(!email.includes("@")){
    //   toast.error("Enter Valid Email")
    // }else if(salesemail === ""){
    //     toast.error("Enter sales Email")
    //   }else if(!email.includes("@")){
    //     toast.error("Enter Valid sales Email")
    //   }
    //   else{
    //     const payload ={
    //       fileurl:url,
    //       email:email,
    //       salesemail:salesemail,
    //       downloads:downloads
    //     }
    //   const response = await registercustomer(payload);
    //   console.log('response',response)
      
    //   if(response.status === 200){
    //     toast.success('user created successfully');
    //     setInputdata({fileurl:"",email:"",salesemail:""});
    //     // navigate("/")
    //     getCustomerList();
    //   }else{
    //     toast.error('something went wrong');
    //   }
    // }
  }else{
    toast.error('something went wrong');
  }
    
  };


  return (
    <>
    <Headers />
    <div class="mainDiv">
        <div class="row">
            <div class="col-9">
            <div class="row g-3 align-items-center filterHolder">
            <div class="col-6 tableHeader">
              Customer List
            </div>
            <div class="col-2">
              <label for="startDate" class="col-form-label">Start Date</label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div class="col-2">
              <label for="endDate" class="col-form-label">End Date</label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
            <div class="col-1">
             <label for="inputPassword6" class="col-form-label">Entries</label>
              <input type="number" id="inputPassword6" class="inputEntry" aria-describedby="passwordHelpInline" onChange={setEntry} value={entryValue} />
            </div>
            <div className='col-1 upperBtn'>
              <button className='btn' onClick={exportToCSV}>Export</button>
            </div>
          </div>
            

            {/* <table class="table">
                <thead>
                <tr>
                <th scope="col-4">Email</th>
                <th scope="col-6">File URL</th>
                <th scope="col-1">Downloads</th>
                <th scope="col-4">Sales Email</th>
                <th scope="col-4">Created Time</th>

                </tr>
            </thead>
            <tbody>
            {customerData && customerData.map && customerData.map((data) => (
                <tr>
                <td>{data.email}</td>
                <td>{data.fileurl}</td>
                <td>{data.downloads}</td>
                <td>{data.salesemail}</td>
                <td>{data.time}</td>
                </tr>
                  ))}
            </tbody>
            </table> */}
            <table id="dtBasicExample" class="table table-striped table-bordered table-sm tableHolder" cellspacing="0" width="100%" >
  <thead>
    <tr>
      <th class="th-sm">Email

      </th>
      <th class="th-sm">File URL

      </th>
      <th class="th-sm">Downloads

      </th>
      <th class="th-sm">Sales Email

      </th>
      <th class="th-sm">Created Time

      </th>
    </tr>
  </thead>
  <tbody>
  {customerData && customerData.map && customerData.map((data) => (
      <tr>
      <td>{data.email}</td>
      <td class="text-nowrap " style={{width: "90px"}}>{data.fileurl}</td>
      <td>{data.downloads}</td>
      <td>{data.salesemail}</td>
      <td>{data.time}</td>
      </tr>
        ))}
  </tbody>
  {/* <tfoot>
    <tr>
      <th>Name
      </th>
      <th>Position
      </th>
      <th>Office
      </th>
      <th>Age
      </th>
      <th>Start date
      </th>
     
    </tr>
  </tfoot> */}
</table>
               
            </div>
            <div class="col-3">
              
            <div className="form_data formContainer">
          <div className="form_heading">
            <h3>Register Customer</h3>
            {/* <p style={{textAlign:"center"}}>We are glad that you will be using Project Cloud to manage
              your tasks! We hope that you will get like it.</p> */}
          </div>
          <form className='formRegister'>
          <div className="form_input">
              <label htmlFor="email">Customer Email</label>
              <input type="email" name="email" id=""  onChange={handleChange}  placeholder='Enter Your Email Address' />
            </div>
            {/* <div className="form_input">
              <label htmlFor="fileurl">fileurl</label>
              <input type="text" name="fileurl" id="" onChange={handleChange} placeholder='Enter Your fileurl' />
            </div> */}
            <div className="form_input">
              <label htmlFor="salesemail">Sales Email</label>
              <input type="email" name="salesemail" id=""  onChange={handleChange}  placeholder='Enter sales Email Address' />
            </div>
            <div  className="form_input">
                <label class="form-label" for="customFile" > File</label>
                <input type="file" class="form-control"  onChange={handleChangeFile} id="customFile" />
            </div>
            {/* <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className='two'>
              <input type={!passhow ? "password" : "text"} name="password" id=""  onChange={handleChange}  placeholder='Enter Your password' />
              <div className='showpass' onClick={()=>setPassShow(!passhow)} >
              {!passhow ? "Show" : "Hide"}
              </div>
              </div>
            </div> */}
             <button className='btn' onClick={onFileUpload}>Add Customer</button>
            {/* <button className='btn' onClick={handleSubmit}>Add Customer</button> */}
            {/* <p>Don't have and account </p> */}
          </form>
        </div>
        <ToastContainer />
            </div>
            
        </div>
        </div>
     
    </>
  )
}


export default AdminDashboard