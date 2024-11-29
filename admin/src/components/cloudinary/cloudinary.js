import axios from "axios";

export const uploadCloudinary = async (file, formData) => {
  formData.append("images", file);
  formData.append(
    "upload_preset",
    `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`
  );
  const { data } = await axios.post(
    `${process.env.REACT_APP_CLOUDINARY_URL}`,
    formData
  );

  return { publicId: data?.public_id, url: data?.secure_url, formData };
};
