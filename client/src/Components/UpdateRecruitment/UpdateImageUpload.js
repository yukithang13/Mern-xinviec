import React, { useState } from "react";
import Dropzone from "react-dropzone";
import RecruimentService from "../../Services/RecruimentService";

function UpdateImageUpload(props) {
  const [images, setImages] = useState([]);
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    RecruimentService.ImageUpload(formData, config).then((data) => {
      if (data.success) {
        setImages([...images, data.url]);
        props.reLoadImages([...images, data.url]);
      } else {
        alert("tải hình lên gặp lỗi!!!");
      }
    });
  };

  const maxFiles = (files) => {
    if (images.length > 3) {
      alert("Cảnh Báo!!! hiện tại web chỉ hổ trợ tải lên tối đa 4 ảnh");
    } else if (images.length <= 3) {
      onDrop(files);
    }
  };

  const onDelete = (image) => {
    let idx = images.indexOf(image);
    let newImages = [...images];

    newImages.splice(idx, 1);
    setImages(newImages);
    props.reLoadImages(newImages);
  };

  return (
    <>
      <div className="row pt-5 d-flex justify-content-center">
        <div className="col">
          <Dropzone onDrop={maxFiles} multiple={false} maxSize={80000000}>
            {({ getRootProps, getInputProps }) => (
              <div className="drop-zone" {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="content-dropzone no-select">
                  Thêm ảnh đại diện cho công việc
                </p>
                <br />
                <p className="content-dropzone no-select">
                  (Có thể kéo ảnh vào đây)
                </p>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
      <hr />
      {images.length > 0 ? (
        <>
          <h4 className="text-uppercase text-secondary mt-5">hình ảnh:</h4>
          <div className="row pt-3 d-flex justify-content-center">
            <div
              className="col"
              style={{
                textAlign: "center",
                width: "300px",
                height: "270px",
                overflowX: "scroll",
              }}
            >
              {images.map((image, index) => (
                <img
                  alt={`hinh-${index}`}
                  onClick={() => onDelete(image)}
                  style={{ width: "300px", height: "240px", margin: "5px" }}
                  src={image}
                  key={index}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default UpdateImageUpload;
