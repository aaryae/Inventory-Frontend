import { axiosInstance } from '../../config/axios';

const token = localStorage.getItem("token");
 console.log("Token in batchservices:", token);
export const batch = async (formData) => {
    console.log("Creating batch with payload:", formData);
    const response = await axiosInstance.post('/api/batches', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });
    console.log("batch create Response:", response.data);

    return response.data;
};

export const getBatches = async () => {
    const response = await axiosInstance.get('/api/batches',{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
    
}


const UploadBatch = async (file) => {
     
}

