import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Axios from "axios";
import StateContext from "../Contexts/StateContext";
import { useImmerReducer } from "use-immer";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import stadiumIconPng from "./Assets/MapIcons/stadium.png";
import hospitalIconPng from "./Assets/MapIcons/hospital.png";
import CircleIcon from "@mui/icons-material/Circle";
import universityIconPng from "./Assets/MapIcons/university.png";
import { Icon } from "leaflet";
import ListingUpdate from "./ListingUpdate";
import {
  MapContainer,
  TileLayer,
  useMap,
  Polygon,
  Marker,
  Popup,
} from "react-leaflet";
import RoomIcon from "@mui/icons-material/Room";
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
  Breadcrumbs,
  Link,
  Dialog,
  Snackbar,
  Modal,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { current } from "immer";
import { map } from "leaflet";
import { fontWeight } from "@mui/system";
import { Girl } from "@mui/icons-material";

const useStyles = makeStyles({
  cardStyle: {
    margin: "1rem",
    position: "relative",
    borderRadius: "12px",
    width: 360,
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  sliderContainer: {
    position: "relative",
    marginTop: "1rem",
  },
  leftArrow: {
    position: "absolute",
    cursor: "pointer",
    fontSize: "3rem",
    color: "white",
    top: "85%",
    left: "40%",
    "&:hover": {
      color: "black",
    },
  },
  rightArrow: {
    position: "absolute",
    cursor: "pointer",
    fontSize: "3rem",
    color: "white",
    top: "85%",
    right: "40%",
    "&:hover": {
      color: "black",
    },
  },
});

function ListingDetail() {
  const [open, setOpen] = React.useState(false);
  const [sellerModalOpen, setSellerModalOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const stadiumIcon = new Icon({
    iconUrl: stadiumIconPng,
    iconSize: [40, 40],
  });
  const hospitalIcon = new Icon({
    iconUrl: hospitalIconPng,
    iconSize: [40, 40],
  });
  const universityIcon = new Icon({
    iconUrl: universityIconPng,
    iconSize: [40, 40],
  });
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const initialState = {
    dataIsLoading: true,
    listingInfo: "",
    sellerProfileInfo: "",
    openSnack: false,
    disabledBtn: false,
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchListingInfo":
        draft.listingInfo = action.listingObject;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
      case "catchsellerProfileInfo":
        draft.sellerProfileInfo = action.profileObject;
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
    async function GetProfileInfo() {
      if (state.listingInfo) {
        try {
          const response = await Axios.get(
            `http://localhost:8000/api/profiles/${state.listingInfo.seller}/`
          );
          console.log(response.data);
          dispatch({
            type: "catchsellerProfileInfo",
            profileObject: response.data,
          });
        } catch (e) {
          console.log(e.response);
        }
      }
    }
    GetProfileInfo();
  }, [state.listingInfo]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    }
  }, [state.openSnack]);

  useEffect(() => {
    async function GetListingInfo() {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/listings/${params.id}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchListingInfo",
          listingObject: response.data,
        });
        dispatch({
          type: "loadingDone",
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetListingInfo();
  }, []);

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture) => picture !== null);

  const [currentPicture, setCurrentPicture] = useState(0);

  function NextPicture() {
    if (currentPicture === listingPictures.length - 1) {
      return setCurrentPicture(0);
    } else {
      setCurrentPicture(currentPicture + 1);
    }
  }

  function PreviousPicture() {
    if (currentPicture === 0) {
      return setCurrentPicture(listingPictures.length - 1);
    } else {
      setCurrentPicture(currentPicture - 1);
    }
  }

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

  const enToPersian = {
    House: "خانه",
    Apartment: "آپارتمان",
    Office: "اداری",
    Day: "روزی",
    Week: "هفته‌ای",
    Month: "ماهی",
    University: "دانشگاه",
    Hospital: "بیمارستان",
    Stadium: "استادیوم",
  };

  const date = new Date(state.listingInfo.date_posted);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  async function DeleteHandler() {
    const confirmDelete = window.confirm(
      "بعد از تایید شما این ملک پاک خواهد شد!"
    );
    if (confirmDelete) {
      try {
        const response = await Axios.delete(
          `http://localhost:8000/api/listings/${params.id}/delete/`
        );
        console.log(response.data);
        dispatch({ type: "openTheSnack" });
        dispatch({ type: "disableTheButton" });
      } catch (e) {
        dispatch({ type: "allowTheButton" });
        console.log(e.response.data);
      }
    }
  }

  return (
    <>
      <div style={{ padding: "10px", margin: "30px" }}>
        <Grid
          item
          container
          style={{
            border: "2px solid black",
            marginLeft: "100px",
            position: "relative",
          }}
        >
          <Grid item xs={4}>
            {listingPictures.length > 0 ? (
              <Grid
                item
                container
                justifyContent="center"
                className={classes.sliderContainer}
              >
                {listingPictures.map((picture, index) => {
                  return (
                    <div key={index}>
                      {index === currentPicture ? (
                        <img
                          src={picture}
                          style={{
                            width: "470px",
                            height: "470px",
                            borderRadius: "20px",
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
                <ArrowCircleRightIcon
                  className={classes.rightArrow}
                  onClick={PreviousPicture}
                />
                <ArrowCircleLeftIcon
                  className={classes.leftArrow}
                  onClick={NextPicture}
                />
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={8} style={{ marginTop: "15px" }}>
            <Button
              variant="outlined"
              style={{
                position: "absolute",
                left: "10px",
                backgroundColor: "black",
                color: "white",
              }}
              onClick={() => setSellerModalOpen(true)}
            >
              نمایش اطلاعات آژانس
            </Button>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/listings")}
                style={{ cursor: "pointer" }}
              >
                لیست املاک
              </Link>
              <Typography color="text.primary">
                {state.listingInfo.title}
                {/* {state.sellerProfileInfo.seller} */}
              </Typography>
            </Breadcrumbs>
            <br></br>
            <Grid item>
              <Typography
                variant="h5"
                style={{ marginBottom: "7px", fontWeight: "bolder" }}
              >
                {state.listingInfo.title}
              </Typography>
            </Grid>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "7px",
              }}
            >
              <RoomIcon />
              <Typography variant="h6">
                {state.listingInfo.borough} &nbsp;| &nbsp;
              </Typography>

              <Typography variant="h6">{formattedDate}</Typography>
            </div>
            {state.listingInfo.rooms ? (
              <Grid xs={2} item style={{ display: "flex" }}>
                <Typography variant="h6">
                  تعداد اتاق: {state.listingInfo.rooms}
                </Typography>
              </Grid>
            ) : (
              ""
            )}
            <Typography
              variant="h6"
              style={{ fontWeight: "bolder", marginBottom: "7px" }}
            >
              {enToPersian[state.listingInfo.listing_type]} |{" "}
              {state.listingInfo.property_status === "Sale"
                ? `${state.listingInfo.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} `+"تومان"
                : `${state.listingInfo.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان ${
                    enToPersian[state.listingInfo.rental_frequency]
                  }`}
            </Typography>
            <Typography
              variant="h5"
              style={{ marginTop: "14px", fontWeight: "bolder" }}
            >
              ویژگی‌ها:
            </Typography>
            <ul>
              {state.listingInfo.furnished ? (
                <Grid xs={2} item style={{ display: "flex" }}>
                  <li>
                    <Typography variant="h6" style={{ marginBottom: "7px" }}>
                      وسایل کامل
                    </Typography>
                  </li>
                </Grid>
              ) : (
                ""
              )}
              {state.listingInfo.pool ? (
                <Grid xs={2} item style={{ display: "flex" }}>
                  <li>
                    <Typography variant="h6" style={{ marginBottom: "7px" }}>
                      استخر
                    </Typography>
                  </li>
                </Grid>
              ) : (
                ""
              )}
              {state.listingInfo.elevator ? (
                <Grid xs={2} item style={{ display: "flex" }}>
                  <li>
                    <Typography variant="h6" style={{ marginBottom: "7px" }}>
                      آسانسور
                    </Typography>
                  </li>
                </Grid>
              ) : (
                ""
              )}
              {state.listingInfo.parking ? (
                <Grid xs={2} item style={{ display: "flex" }}>
                  <li>
                    <Typography variant="h6" style={{ marginBottom: "7px" }}>
                      پارکنیگ
                    </Typography>
                  </li>
                </Grid>
              ) : (
                ""
              )}
              {state.listingInfo.cctv ? (
                <Grid xs={2} item style={{ display: "flex" }}>
                  <li>
                    <Typography variant="h6" style={{ marginBottom: "7px" }}>
                      دوربین مداربسته
                    </Typography>
                  </li>
                </Grid>
              ) : (
                ""
              )}
            </ul>
            {state.listingInfo.description ? (
              <Grid
                style={{
                  marginTop: "7px",
                }}
                item
              >
                <Typography
                  variant="h5"
                  style={{ marginBottom: "7px", fontWeight: "bolder" }}
                >
                  توضیحات:
                </Typography>
                <Typography variant="h6">
                  &emsp;{state.listingInfo.description}
                </Typography>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              borderTop: "1px solid black",
              marginBottom: "10px",
              position: "relative",
            }}
          >
            <div
              style={{
                right: 20,
                position: "absolute",
                top: 0,
                zIndex: 1900,
              }}
              className={classes.container}
            >
              {state.listingInfo.listing_pois.map((poi, index) => {
                console.log("yo" + state.listingInfo.listing_pois.length);
                function DegreeToRadian(coordinates) {
                  return (coordinates * Math.PI) / 180;
                }
                function CalculateDistance() {
                  const latitude1 = DegreeToRadian(state.listingInfo.latitude);
                  const latitude2 = DegreeToRadian(poi.location.coordinates[0]);
                  const longitude1 = DegreeToRadian(
                    state.listingInfo.longitude
                  );
                  const longitude2 = DegreeToRadian(
                    poi.location.coordinates[1]
                  );
                  // The formula
                  const latDiff = latitude2 - latitude1;
                  const lonDiff = longitude2 - longitude1;
                  const R = 6371000 / 1000;

                  const a =
                    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                    Math.cos(latitude1) *
                      Math.cos(latitude2) *
                      Math.sin(lonDiff / 2) *
                      Math.sin(lonDiff / 2);
                  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                  const d = R * c;

                  const dist =
                    Math.acos(
                      Math.sin(latitude1) * Math.sin(latitude2) +
                        Math.cos(latitude1) *
                          Math.cos(latitude2) *
                          Math.cos(lonDiff)
                    ) * R;
                  return dist.toFixed(2);
                }
                if (index > 6) return null;
                return (
                  <div style={{ marginBottom: "0.5rem", marginRight: "10px" }}>
                    <Card className={classes.cardStyle}>
                      <Typography variant="h6" style={{ marginRight: "10px" }}>
                        {poi.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        style={{ marginRight: "10px" }}
                      >
                        {enToPersian[poi.type]} |{" "}
                        <span style={{ fontWeight: "bolder" }}>
                          {CalculateDistance()} کیلومتر
                        </span>
                      </Typography>
                    </Card>
                  </div>
                );
              })}
            </div>
            <Grid item xs={12} style={{ height: "35rem" }}>
              <MapContainer
                center={[
                  state.listingInfo.latitude,
                  state.listingInfo.longitude,
                ]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    state.listingInfo.latitude,
                    state.listingInfo.longitude,
                  ]}
                >
                  <Popup>{state.listingInfo.title}</Popup>
                </Marker>
                {state.listingInfo.listing_pois.map((poi) => {
                  function poiIcon() {
                    if (poi.type === "Stadium") {
                      return stadiumIcon;
                    } else if (poi.type === "Hospital") {
                      return hospitalIcon;
                    } else if (poi.type === "University") {
                      return universityIcon;
                    }
                  }
                  return (
                    <Marker
                      icon={poiIcon()}
                      key={poi.id}
                      position={[
                        poi.location.coordinates[0],
                        poi.location.coordinates[1],
                      ]}
                    >
                      <Popup>{poi.name}</Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </Grid>
            {GlobalState.userId == state.listingInfo.seller ? (
              <Grid item container justifyContent="center">
                <Dialog
                  style={{ zIndex: "4000" }}
                  open={open}
                  onClose={handleClose}
                  fullScreen
                >
                  <ListingUpdate
                    listingData={state.listingInfo}
                    closeDialog={handleClose}
                  />
                </Dialog>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </div>
      {/* old */}
      <div
        style={{
          marginRight: "2rem",
          marginButtom: "2rem",
          marginLeft: "2rem",
        }}
      >
        <Grid
          item
          container
          xs={6}
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",

            marginTop: "1rem",
            padding: "5px",
          }}
        >
        </Grid>
        <Grid
          item
          container
          style={{ marginTop: "1rem" }}
          spacing={1}
          justifyContent="space-between"
        ></Grid>
        <Snackbar
          open={state.openSnack}
          message="ملک با موفقیت حذف گردید!"
          anchorOrigin={{
            vertical: "buttom",
            horizontal: "center",
          }}
        />
        <Modal
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "3000",
          }}
          open={sellerModalOpen}
          onClose={() => setSellerModalOpen(false)}
        >
          <div
            style={{
              border: "0",
              height: 300,
              width: 500,
              borderRadius: 12,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: 20,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <img
              style={{
                height: "15rem",
                width: "13rem",
                cursor: "pointer",
                borderRadius: "12px",
              }}
              src={
                state.sellerProfileInfo.profile_picture !== null
                  ? state.sellerProfileInfo.profile_picture
                  : defaultProfilePicture
              }
              onClick={() =>
                navigate(`/agencies/${state.sellerProfileInfo.seller}`)
              }
            />
            <div style={{ paddingRight: 12 }}>
              <Typography variant="h5" style={{ marginTop: "1rem" }}>
                <span style={{ color: "black", fontWeight: "bolder" }}>
                  {state.sellerProfileInfo.agency_name}
                </span>
              </Typography>
              <div
                variant="h5"
                style={{
                  textAlign: "right",
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  fontSize: 20,
                }}
              >
                <LocalPhoneIcon
                  style={{ marginLeft: 8, fontSize: 24, marginTop: -8 }}
                  color="primary"
                />
                {state.sellerProfileInfo.phone_number}
              </div>
              <div
                style={{ display: "flex", direction: "row", marginTop: "7rem" }}
              >
                {console.log(state)}
                {GlobalState.userId === state.sellerProfileInfo.seller ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClickOpen}
                      style={{ marginLeft: "20px", whiteSpace: "nowrap" }}
                    >
                      به روز رسانی
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={DeleteHandler}
                      disabled={state.disabledBtn}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      پاک کردن ملک
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      </div>
      {GlobalState.userId == state.listingInfo.seller ? (
            <Grid item container justifyContent="center">
              <Dialog style={{zIndex: 30000}} open={open} onClose={handleClose} fullScreen>
                <ListingUpdate
                  listingData={state.listingInfo}
                  closeDialog={handleClose}
                />
              </Dialog>
            </Grid>
          ) : null}
    </>
  );
}

export default ListingDetail;
