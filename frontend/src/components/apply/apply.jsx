import React from "react";
import "./apply.css";
import { useState, useEffect, useContext } from "react";
import { toggleContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function apply() {
  const navigate = useNavigate();
  const {
    resultMessage,
    setResultMessage,
    showeAlertMessage,
    setShoweAlertMessage,
  } = useContext(toggleContext);
  const { applyJob, setApplyJob } = useContext(toggleContext);
  const [education, setEducation] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const submitApplication = () => {
    if (!file) return alert("Select a PDF first");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploadCv");
    data.append("resource_type", "raw");

    fetch("https://api.cloudinary.com/v1_1/dcq4kfehy/raw/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((json) => {
        setCvUrl(json.secure_url);
        axios
          .post(
            `http://localhost:5000/jobs/${applyJob._id}`,
            { firstName, lastName, email, education, cvUrl: json.secure_url },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((result) => {
            setShoweAlertMessage(true);
            setResultMessage(result.data.message);

            setTimeout(() => {
              setShoweAlertMessage(false);
              navigate("/");
            }, 2000);
          })
          .catch((error) => {
            setShoweAlertMessage(true);
            setResultMessage(error.response.data.message);
            setTimeout(() => {
              setShoweAlertMessage(false);
              navigate("/");
            }, 2000);
          });
      })
      .catch((error) => {});
  };

  return (
    <div className="applicationDetailsAndApplyForJob">
      <div className="applicationDetails">
        <strong className="enterDetails">
          <strong className="star">*</strong> Please Enter The Required Detials{" "}
        </strong>
        <div className="inputs">
          <div className="firstNameSec">
            <div className="firstNameText"> First Name</div>
            <input
              className="input"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              placeholder="Enter FirstName ID"
            ></input>
          </div>
          <div className="lastNameSec">
            <div className="lastNameText"> Last Name</div>
            <input
              className="input"
              placeholder="Enter Your lastName"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            ></input>
          </div>
          <div className="emailSec">
            <div className="emailText"> Email</div>
            <input
              className="input"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter Email ID"
            ></input>
          </div>
          <div className="educationSec">
            <div className="educationText"> Education</div>
            <input
              className="input"
              placeholder="Enter Your Education"
              onChange={(e) => {
                setEducation(e.target.value);
              }}
            ></input>
          </div>
          <div className="cvSection">
            <div className=" uploadYourCvText"> Upload Your CV</div>
            <input
              type="file"
              accept=".pdf"
              className="uploadCv"
              onChange={(e) => setFile(e.target.files[0])}
            ></input>
          </div>

          <button
            className="submitButton"
            onClick={() => {
              submitApplication();
            }}
          >
            {" "}
            Submit{" "}
          </button>
        </div>
      </div>

      <div className="applyForJob">
        <div>
          <strong className="JobTitleH"> Job Title</strong>: {applyJob.title}
        </div>
        <div>
          <strong className="DescriptionH">Description</strong>:{" "}
          {applyJob.description}
        </div>
        <div>
          <strong className="requirmentsH">Requirments</strong>:{" "}
          {applyJob.requirements}
        </div>
        <div className="locationPart">
          <svg
            className="locationIcon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
          </svg>
          <strong className="LocationH">Location</strong>: {applyJob.location}
        </div>
        <div>
          <strong className="LocationH">Poster Email</strong>:{" "}
          {applyJob.jobPoster.email}
        </div>
        <div>
          <strong className="LocationH">Experience</strong>:{" "}
          {applyJob.experince}
        </div>
        <div>
          <strong className="LocationH">Role</strong>: {applyJob.role}
        </div>
        <div>
          <strong className="LocationH">Salary Range</strong>:{" "}
          {applyJob.salaryRange}
        </div>
      </div>

      {showeAlertMessage && <div className="alertMessage">{resultMessage}</div>}
    </div>
  );
}

export default apply;
