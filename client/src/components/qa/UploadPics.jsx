import React, {useState} from 'react';
import axios from 'axios';

const UploadPics = (props) => {

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  const handleDelete = (index) => {
    if (images.length === 1) {
      setImages([]);
    } else {
      setImages(images.splice(index, 1));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    return axios.post('/upload', {images: images})
      .then((results) => {
        let urls = results.data.map(result => (result.secure_url));
        return props.handleUpload(urls);
      })
      .catch(err =>  console.log('submit err: ', err))
      .then(() => {
        props.close();
      })
  }
  
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImages(images.concat(reader.result));
    }
  }
  
  const handleChange = (file) => {
    setFiles(files.concat(file));
    previewFile(file);
  }

  return (
    <div className="sub-modal">
      <span className="close" onClick={props.close}>
        &times;
      </span>
      <div>
        <div className="upload-sub-div">Upload Your Pictures</div>
        {images.length < 5 &&
          <input className="upload-sub-div" type="file" name="myImage" onChange={(e) => {handleChange(e.target.files[0])}} required accept="image/png, image/jpeg, image/jpg, image/jfjf"/>
        }
      </div>
      {!images.length ? null :
        images.map((image, index) => {
          return (
            <div key={index}>
              <img className="thumbnail" alt="previewImage" src={image}/>
              <button onClick={(e)=>{
                e.preventDefault();;
                handleDelete(index)
                }}>Remove</button>
            </div>
          )
        })}
      <div className="upload-sub-div-btn"></div>
      <span className="sm-btn" syle={{marginLeft: "45%"}} onClick={(e) => handleSubmit(e)}>Upload!</span>
    </div>
  )
}

export default UploadPics;
