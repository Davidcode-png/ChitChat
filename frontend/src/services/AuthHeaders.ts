import { RawAxiosRequestHeaders,AxiosRequestHeaders,AxiosHeaders } from "axios";

function authHeaders():AxiosRequestHeaders|{}{
    const localstorageUser = localStorage.getItem("user");
    if(!localstorageUser){
        return {};
    }
    const user = JSON.parse(localstorageUser);
    if (user && user.token){
        return {Authorization: `Token ${user.token}`};
    }
    return {};
}


export default authHeaders;