import { commonrequest,fileUploaderMethod } from "./ApiCall";
import {BACKEND_URL} from "./helper";


export const registerfunction = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/register`,data)
}

export const registercustomer = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/customerregister`,data)
}

export const sentOtpFunction = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/sendotp`,data)
}

export const userVerify = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/login`,data)
}
export const adminVerify = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/adminLogin`,data)
}
export const logout = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/user/logout`,data)
}
export const customerlist = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/customerList`,data)
}
export const userDetails = async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/userDetails`,data)
}
export const updateDownloads =async(data)=>{
    return await commonrequest("POST",`${BACKEND_URL}/updateDownloads`,data)
}
export const uploadFileToS3 =async(FormData)=>{
    return await fileUploaderMethod("POST",`${BACKEND_URL}/uploadFile`,FormData)
}
