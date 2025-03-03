import axios from 'axios';

/*
    if (error.response){
    console.log("response "+JSON.stringify(error.response));
    }else if(error.request){
        console.log("request "+JSON.stringify(error.request));
    }else if(error.message){
        console.log("message "+JSON.stringify(error.message));
    }
*/

export const CreateAccount = async (User) => {
    let tmp = User;
    tmp.email = tmp.username;
    try {
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'/api/users/',tmp);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const GetAccount = async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL+'/api/users/');
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const GetUserbyName = async (name) => {
    try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/users/username/${name}`);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const UpdateAccount = async (name, newUser) => {
    let User = await GetUserbyName(name);
    let tmp = newUser;
    tmp.email = tmp.username;
    try {
        const response = await axios.put(process.env.REACT_APP_SERVER_URL+`/api/users/${User.data._id}`,tmp);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const DeleteAccount = async (name) => {
    let User = await GetUserbyName(name);
    try {
        const response = await axios.delete(process.env.REACT_APP_SERVER_URL+`/api/users/${User.data._id}`);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};