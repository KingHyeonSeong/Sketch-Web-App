import axios from 'axios';

/*
export const PostPreview = async (Preview) => {
    try {
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'/api/paintings/upload',Preview);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};
*/
export const SavePainting = async (Painting) => {
    try {
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'/api/paintings/',Painting);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const LoadPainting= async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL+'/api/paintings/');
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const LoadPaintingbyId = async (ID) => {
    try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/paintings/${ID}`);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const LoadPaintingbyUser = async (User) => {
    try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/paintings/user/${User._id}`);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const LoadPaintingbyUser_Sorted = async (User) => {
    try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL+`/api/paintings/user/${User._id}/sorted`);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const UpdatePainting = async (ID, newPainting) => {
    try {
        const response = await axios.put(process.env.REACT_APP_SERVER_URL+`/api/paintings/${ID}`,newPainting);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const DeletePainting = async (ID) => {
    try {
        const response = await axios.delete(process.env.REACT_APP_SERVER_URL+`/api/paintings/${ID}`);
        console.log('>>>>>> RESPONSE: ', response.data);
        return response;
    } catch (error) {
        console.log(error);
    }
    return null;
};