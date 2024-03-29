import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar-default.png';
import { useSignUpMutation } from '../services/appApi';

export default function SignUp() {
  // img upload state
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  //hooks
  const [signupUser, { isLoading, error }] = useSignUpMutation();
  const navigate = useNavigate();

  // profile info state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateImg = (e) => {
    //access image
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert('Max file size is 1mb');
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    console.log('clicked');
  };

  const uploadImage = async () => {
    const data = new FormData();
    //.append('key','value') to form data
    data.append('file', image);
    data.append('upload_preset', 'my-uploads');
    console.log(data);
    try {
      setUploadingImage(true);
      //sending post request to upload img to cloudinary
      let res = await fetch(
        'https://api.cloudinary.com/v1_1/ddln8havk/image/upload',
        {
          method: 'post',
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImage(false);
      return urlData.url;
    } catch (error) {
      setUploadingImage(false);
      console.log(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please upload your profile picture');
    const url = await uploadImage(image);
    console.log(url);
    signupUser({ name, email, password, picture: url }).then((data) => {
      if (data) {
        console.log(data);
        navigate('/chat');
      }
    });
  };

  return (
    <Row>
      <Col md={5} className="signup_bg"></Col>

      <Col
        md={7}
        className="d-flex flex-direction-column align-items-center justify-content-center mt-5"
      >
        <Form onSubmit={handleSignup}>
          <h1 className="text-center"> Create account </h1>
          <div className="signup-profile-pic-container">
            <img
              src={imagePreview || avatar}
              alt="default avatar"
              className="signup-avatar"
            />
            <label htmlFor="image-upload" className="img-upload-label">
              <i className="fas fa-plus-circle add-picture-icon"></i>
            </label>
            <input
              type="file"
              id="image-upload"
              hidden
              accept="image/png,image/jpeg"
              onChange={validateImg}
            ></input>
          </div>

          <Form.Group className="mb-3 mt-4" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {uploadingImage || isLoading ? 'Loading...' : 'Sign Up'}
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
