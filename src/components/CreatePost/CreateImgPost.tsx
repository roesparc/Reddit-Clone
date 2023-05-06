import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";
import styles from "../../styles/createPost/createImgPost.module.css";

interface Props {
  setImgFile: React.Dispatch<React.SetStateAction<Blob | null>>;
}

const CreateImgPost = ({ setImgFile }: Props) => {
  const [imgPreview, setImgPreview] = useState<string>("");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        setImgPreview(URL.createObjectURL(file));
        setImgFile(file.slice(0, file.size, file.type));
      });
    },
  });

  return (
    <>
      {!imgPreview.length ? (
        <div
          {...getRootProps({
            className: `${styles.dragDropContainer} ${
              isDragActive && styles.dragActive
            }`,
          })}
        >
          <input {...getInputProps({ multiple: false })} />
          <p>
            {isDragActive
              ? "DROP IT!"
              : "Drag 'n' drop your image here, or click to select it"}
          </p>
        </div>
      ) : (
        <div>
          <div className={styles.imgContainer}>
            <img src={imgPreview} alt="" />
            <button
              onClick={() => {
                setImgFile(null);
                setImgPreview("");
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateImgPost;
