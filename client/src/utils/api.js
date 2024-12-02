import axios from "axios";

const token = localStorage.getItem("token");

const params = {
  headers: {
    Authorization: `Bearer ${token}`, // Include your API key in the Authorization header
    "Content-Type": "application/json", // Adjust the content type as needed
  },
};

export const fetchDataFromApi = async (url) => {
  const { data } = await axios.get(process.env.REACT_APP_API_URL + url, params);
  return data;
};

export const postData = async (url, formData) => {
  const response = await fetch(process.env.REACT_APP_API_URL + url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Include your API key in the Authorization header
      "Content-Type": "application/json", // Adjust the content type as needed
    },

    body: JSON.stringify(formData),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorData = await response.json();
    return errorData;
  }
};

export const editData = async (url, updatedData) => {
  try {
    const { res } = await axios.put(
      `${process.env.REACT_APP_API_URL}${url}`,
      updatedData,
      params
    );
    return res;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteData = async (url) => {
  const { res } = await axios.delete(
    `${process.env.REACT_APP_API_URL}${url}`,
    params
  );
  return res;
};

export const uploadImage = async (url, formData) => {
  const { res } = await axios.post(
    process.env.REACT_APP_API_URL + url,
    formData
  );
  return res;
};

export const deleteImages = async (url, image) => {
  const { res } = await axios.delete(
    `${process.env.REACT_APP_API_URL}${url}`,
    params,
    image
  );
  return res;
};
