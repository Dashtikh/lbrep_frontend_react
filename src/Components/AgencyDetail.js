import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Axios from "axios";
import StateContext from "../Contexts/StateContext";
import { useImmerReducer } from "use-immer";
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import login from "./Assets/login.jpg";
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
const useStyles = makeStyles({
  cardContainer: {
    overflow: 'auto',
    height:'40rem',
    scrollbarWidth: "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none" /* Safari and Chrome */,
    },
  },
  
  fullPage: {
    backgroundImage: `url(${login})`,
    width: "100%",
    height: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    flexDirection: "column",
    paddingTop: 64
  },
  profileCard: {
    position: "relative",
    borderRadius: "12px",
    display: "flex",
    width: "100%",
    padding: "1rem",
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
  },
  cardStyle: {
    borderRadius: "20px",
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    height: '20rem',
    width: '16rem',
    
  },
});

function AgencyDetail() {
  const enToPersian = {
    House: "خانه",
    Apartment: "آپارتمان",
    Office: "اداری",
    Day: "روزانه",
    Week: "هفتگی",
    Month: "ماهانه",
  };
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/profiles/${params.id}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({
          type: "loadingDone",
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetProfileInfo();
  }, []);
  if (state.dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "90vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <div className={classes.fullPage}>
      <div>
        <div className={classes.profileCard}>
          <Grid xs={6} item>
            <img
              style={{ height: "15rem", width: "15rem" }}
              src={
                state.userProfile.profilePic !== null
                  ? state.userProfile.profilePic
                  : defaultProfilePicture
              }
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            xs={6}
          >
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                <span style={{ color: "black", fontWeight: "bolder" }}>
                  {state.userProfile.agencyName}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                <IconButton>
                  <LocalPhoneIcon color="primary" />
                  {state.userProfile.phoneNumber}
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
          <Grid item style={{ marginTop: "1rem", padding: "5px" }}>
            {state.userProfile.bio}
          </Grid>
        </div>
          <div className={classes.cardContainer}>
        <Grid
          container
          justifyContent="space-around"
          spacing={2}
          xs={12}
          
        >
          {state.userProfile.sellerListings.map((listing) => {
            return (
              <Grid
                key={listing.id}
                item
                style={{ marginTop: "1rem", maxWidth: "20rem", paddingLeft: 0 }}
              >
                <Card className={classes.cardStyle}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={
                      `http://localhost:8000/${listing.picture1}`
                        ? `http://localhost:8000/${listing.picture1}`
                        : defaultProfilePicture
                    }
                    title="عکس لیست"
                    onClick={() => navigate(`/listings/${listing.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {listing.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {listing.description.substring(0, 100)} ...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {listing.property_status === "Sale"
                      ? `${enToPersian[listing.listing_type]}: $ ${listing.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : `${enToPersian[listing.listing_type]}: $ ${listing.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                          enToPersian[listing.rental_frequency]
                        }`}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        </div>
      </div>
    </div>
  );
}

export default AgencyDetail;
