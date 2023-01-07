import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Axios from "axios";
import StateContext from "../Contexts/StateContext";
import { useImmerReducer } from "use-immer";
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import { typography } from "@mui/system";
const useStyles = makeStyles({
  formContainer: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "3rem",
    borderRadius: '20px',
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "3rem",
  },
  loginBtn: {
    backgroundColor: "black",
    color: "white",
    fontSize: "1.1rem",
    marginLeft: "1rem",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },
  picturesBtn: {
    backgroundColor: "black",
    color: "white",
    fontSize: "0.8rem",
    marginLeft: "1rem",
  },
});

function ProfileUpdate(props) {
  console.log(props.userProfile);
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    agencyNameValue: props.userProfile.agencyName,
    phoneNumberValue: props.userProfile.phoneNumber,
    bioValue: props.userProfile.bio,
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic,
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchAgencyNameChange":
        draft.agencyNameValue = action.agencyNameChosen;
        break;
      case "catchPhoneNumberChange":
        draft.phoneNumberValue = action.phoneNumberChosen;
        break;
      case "catchBioChange":
        draft.bioValue = action.bioChosen;
        break;
      case "catchUploadedPictureChange":
        draft.uploadedPicture = action.uploadedPictureChosen;
        break;
      case "catchUploadedPicture":
        draft.profilePictureValue = action.profilePictureChosen;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "openTheSnack":
        draft.openSnack = true;
        break;
      case "disableTheButton":
        draft.disabledBtn = true;
        break;
      case "allowTheButton":
        draft.disabledBtn = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    if (state.uploadedPicture[0]) {
      dispatch({
        type: "catchUploadedPicture",
        profilePictureChosen: state.uploadedPicture[0],
      });
    }
  }, [state.uploadedPicture[0]]);

  useEffect(() => {
    if (state.sendRequest) {
      async function UpdateProfile() {
        const formData = new FormData();
        if (
          typeof state.profilePictureValue === "string" ||
          typeof state.profilePictureValue === null
        ) {
          formData.append("agency_name", state.agencyNameValue);
          formData.append("phone_number", state.phoneNumberValue);
          formData.append("bio", state.bioValue);
          formData.append("seller", GlobalState.userId);
        } else {
          formData.append("agency_name", state.agencyNameValue);
          formData.append("phone_number", state.phoneNumberValue);
          formData.append("bio", state.bioValue);
          formData.append("profile_picture", state.profilePictureValue);
          formData.append("seller", GlobalState.userId);
        }

        try {
          const response = await Axios.patch(
            `http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
            formData
          );
          console.log(response.data);
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          dispatch({ type: "allowTheButton" });
          console.log(e.response);
        }
      }
      UpdateProfile();
    }
  }, [state.sendRequest]);

  function FormSubmit(e) {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
  }

  function ProfilePictureDisplay() {
    if (typeof state.profilePictureValue !== "string") {
      return (
        <ul>
          {state.profilePictureValue ? (
            <li>{state.profilePictureValue.name}</li>
          ) : (
            ""
          )}
          {console.log(state.profilePictureValue)}
        </ul>
      );
    } else if (typeof state.profilePictureValue === "string") {
      return (
        <Grid
          item
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <img
            src={props.userProfile.profilePic}
            style={{ height: "5rem", width: "5rem" }}
          />
        </Grid>
      );
    }
  }

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  }, [state.openSnack]);

  return (
    <>
      <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
          <Grid item container justifyContent="center">
            <Typography variant="h4">پروفایل من</Typography>
          </Grid>
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="agencyName"
              label="نام ملک*"
              variant="outlined"
              fullWidth
              value={state.agencyNameValue}
              onChange={(e) =>
                dispatch({
                  type: "catchAgencyNameChange",
                  agencyNameChosen: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="phoneNumber"
              label="شماره تلفن*"
              variant="outlined"
              fullWidth
              value={state.phoneNumberValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPhoneNumberChange",
                  phoneNumberChosen: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="bio"
              label="درباره آژانس"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={state.bioValue}
              onChange={(e) =>
                dispatch({
                  type: "catchBioChange",
                  bioChosen: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container>
            {ProfilePictureDisplay()}
          </Grid>

          <Grid
            item
            container
            xs={6}
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              component="label"
              className={classes.picturesBtn}
            >
              عکس کاربر
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                hidden
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  dispatch({
                    type: "catchUploadedPictureChange",
                    uploadedPictureChosen: e.target.files,
                  });
                }}
              />
            </Button>
          </Grid>

          <Grid
            item
            container
            xs={8}
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              type="submit"
              className={classes.loginBtn}
              disabled={state.disabledBtn}
            >
              به‌روز رسانی
            </Button>
          </Grid>
        </form>
        <Snackbar
          open={state.openSnack}
          message="با موفقیت به‌روز شد !"
          anchorOrigin={{
            vertical: "buttom",
            horizontal: "center",
          }}
        />
      </div>
    </>
  );
}

export default ProfileUpdate;
