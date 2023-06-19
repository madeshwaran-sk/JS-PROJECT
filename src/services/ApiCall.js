import axios from "axios";

export const commonrequest = async(methods,url,body,header)=>{
    let config = {
        method:methods,
        url,
        mode: "cors",
        headers:header ? header 
        :{
            "Content-Type":"application/json",
            "Acces-Control-Allow-Origin": "*",
            authorization: `Bearer ${localStorage.getItem("userdbtoken")}`,
        },
        data:body
    }

    // axios instance
    return axios(config).then((data)=>{
        return data
    }).catch((error)=>{
        return error
    })
}
export const fileUploaderMethod = async(methods,url,body,header)=>{
    
    let config = {
        method:methods,
        url,
        mode: "cors",
        headers: { 'Content-Type': 'multipart/form-data',
        "Acces-Control-Allow-Origin": "*",
        authorization: `Bearer ${localStorage.getItem("userdbtoken")}`,
    },
        data:body,
    }

    // axios instance
    return axios(config).then((data)=>{
        return data
    }).catch((error)=>{
        return error
    })
}