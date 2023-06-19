import React, { useContext, useEffect ,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserHeaders from '../components/UserHeader';
import {userDetails,updateDownloads} from "../services/Apis";
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {

  const navigate = useNavigate();
  const [customerData,setCustomerData] = useState({});
  const [downloadBtnDisable,setDownloadBtnDisable] = useState(false)
  const [noOfDownloads,setNoOfDownloads] = useState(0)

  

  const userValid = () => {
    let token = localStorage.getItem("userdbtoken");
    if (token) {
      getUserDetails();
    } else {
      navigate("*")
    }
  }
  const getUserDetails = async() => {
    let token = localStorage.getItem("userdbtoken");
    const data = {
      token: token
  }
    const response = await userDetails(data);
    console.log('response',response)
    
    if(response.status === 201){
    if(response && response.data && response.data.userDetails[0].downloads < 3 ){
      setCustomerData(response && response.data && response.data.userDetails[0])
      setDownloadBtnDisable(false)
      setNoOfDownloads(response && response.data && response.data.userDetails[0] && response.data.userDetails[0].downloads)
    }else{
      setDownloadBtnDisable(true)
      toast.success('You have download file 3 times.For more downloads please contat sales person')
    }
   

      // navigate("/")
    }else{
      toast.error('something went wrong');
    }
  }
  console.log('CustomerData',customerData)

  const downloadFile = async() => {
    if(noOfDownloads <3){
      setNoOfDownloads(noOfDownloads+1)
          let token = localStorage.getItem("userdbtoken");
    const data = {
      downloads: noOfDownloads+1,
      token:token,
  }
  if(noOfDownloads === 3){
    setDownloadBtnDisable(true);
    toast.success('You have download file 3 times.For more downloads please contat sales person')
  }
    const response = await updateDownloads(data);
    console.log('response',response)
    
    if(response.status === 201){
    console.log('response',response)
    getUserDetails();
    // setCustomerData(response && response.data && response.data.customerList)
      // navigate("/")
    }else{
      toast.error('something went wrong');
    }
    }else{
      setDownloadBtnDisable(true)
    }
  }

  useEffect(() => {
    userValid();
  }, [])
  return (
    <>
    <UserHeaders />
    <div class=" main">
    <div class="row ">
      <div class=" mainHeader">
      Project Description
      </div>
     
    </div>
    <div class="row ">
    <div class=" mainSubHeader">
    
     We have various products to promote our product categories where customer can see them. The three products are
    </div>
    </div>
  <div class="row">
    <div class="col holder">
      <div class="iconHolder">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-envelope-check-fill" viewBox="0 0 16 16">
          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z"/>
          <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
        </svg>
      </div>
    <div class="textHolder">
    Email Template(customized)- with 2 iterations
    </div>
     
    </div>
    <div class="col holder">
      <div class="iconHolder">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-envelope-check-fill" viewBox="0 0 16 16">
          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z"/>
          <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
        </svg>
      </div>
    <div class="textHolder">
      Email Campaign Assistance - With one-hour Consulting
    </div>
    </div>
    <div class="col holder">
      <div class="iconHolder">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-envelope-check-fill" viewBox="0 0 16 16">
          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z"/>
          <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
        </svg>
      </div>
    <div class="textHolder">
      Email Campaign Platform - With additional Follow up
    </div>
    </div>
  </div>
  <div class="row">
    <div class="lastSection">
    If anybody chooses to buy any product, it should lead to payment gateway where they can complete the payment.The project will be added to our webpage as an aditional section.We would love to undestand how your technology will adapt to our web environment.
    
    </div>
     </div>
</div>
<div class="row">
<div class=" mainHeader">
<a href={customerData.fileurl} download="proposed_file_name">
  <button type="button" class="btn btn-primary " disabled={downloadBtnDisable} onClick={downloadFile}>Download</button>
  </a>

      </div>

</div>
<ToastContainer />
    </>
  
  )
}

export default Dashboard