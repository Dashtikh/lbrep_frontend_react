import React, { useState, useEffect } from "react";
import {

  TileLayer,
  useMap,
  Marker,
  Popup,
  MapContainer,
} from "react-leaflet";
import RoomIcon from "@mui/icons-material/Room";
import { useImmerReducer } from "use-immer";
import {
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
  CardActions,
} from "@mui/material";
import houseIconPng from "./Assets/MapIcons/house.png";
import apartmentIconPng from "./Assets/MapIcons/apartment.png";
import officeIconPng from "./Assets/MapIcons/office.png";
import { Icon } from "leaflet";

import myListings from "./Assets/Data/Dummydata";
import { makeStyles } from "@mui/styles";
import { border } from "@mui/system";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles({
  cardStyle: {
    margin: "1rem",
    position: "relative",
    borderRadius: "12px",
    width: 360,
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  pictureStyle: {
    paddingRight: "1rem",
    paddingLeft: "1rem",
    height: "12rem",
    cursor: "pointer",
  },
  priceOverlay: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: "1000",
    color: "black",
    top: "70px",
    right: "20px",
    padding: "6px 12px",
    borderRadius: 12,
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  container: {
    scrollbarWidth: "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none" /* Safari and Chrome */,
    },
  },
});
function Listing() {
  const navigate = useNavigate();
  const classes = useStyles();
  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });
  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40],
  });
  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });
  const [latitude, setLatitude] = useState(35.723660224406515);
  const [longitude, setLongitude] = useState(51.34627495539672);
  const [allListings, setAllListing] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  const initialState = {
    mapInstance: null,
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "getMap":
        draft.mapInstance = action.mapData;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: "getMap", mapData: map });
    return null;
  }

  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function GetAllListings() {
      try {
        const response = await Axios.get(
          "http://127.0.0.1:8000/api/listings/",
          {
            cancelToken: source.token,
          }
        );
        setAllListing(response.data);
        setDataIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    }
    GetAllListings();
    return () => {
      source.cancel();
    };
  }, []);
  if (dataIsLoading === true) {
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
  //House Apartment Office
  const enToPersian = {
    House: "خانه",
    Apartment: "آپارتمان",
    Office: "اداری",
    Day: "روزی",
    Week: "هفته‌ای",
    Month: "ماهی",
  };
  return (
    <>
      <div container style={{ position: "relative" }}>
        <div
          style={{
            height: "calc(100vh - 64px)",
            position: "absolute",
            top: 0,
            zIndex: 1900,
            overflowY: "scroll",
          }}
          className={classes.container}
        >
          {allListings.map((listing) => {
            return (
              <Card key={listing.id} className={classes.cardStyle}>
                <CardHeader
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={() =>
                        state.mapInstance.flyTo(
                          [listing.latitude, listing.longitude],
                          16
                        )
                      }
                    >
                      <RoomIcon />
                    </IconButton>
                  }
                  title={listing.title}
                />

                <CardMedia
                  className={classes.pictureStyle}
                  component="img"
                  image={listing.picture1}
                  alt={listing.title}
                  onClick={() => navigate(`/listings/${listing.id}`)}
                />
                <CardContent>
                  <Typography variant="body2">
                    {listing.description.substring(0, 120)}...
                  </Typography>
                </CardContent>
                {listing.property_status === "Sale" ? (
                  <Typography className={classes.priceOverlay}>
                    {enToPersian[listing.listing_type]}:
                    {listing.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    تومان
                  </Typography>
                ) : (
                  <Typography className={classes.priceOverlay}>
                    {enToPersian[listing.listing_type]}:
                    {listing.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    تومان {enToPersian[listing.rental_frequency]}
                  </Typography>
                )}

                <CardActions
                  onClick={() =>
                    navigate(`/agencies/${listing.seller}`)
                  }
                  disableSpacing
                  style={{ marginRight: 10, cursor: "pointer" }}
                >
                  <b style={{ paddingLeft: 8 }}>آژانس: </b>
                  {listing.seller_agency_name}
                </CardActions>
              </Card>
            );
          })}
        </div>
        <div>
          <AppBar position="sticky">
            <div style={{ height: "calc(100vh - 64px)" }}>
              <MapContainer
                center={[35.723660224406515, 51.34627495539672]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TheMapComponent />
                {allListings.map((listing) => {
                  function IconDisplay() {
                    if (listing.listing_type === "House") {
                      return houseIcon;
                    } else if (listing.listing_type === "Apartment") {
                      return apartmentIcon;
                    } else if (listing.listing_type === "Office") {
                      return officeIcon;
                    }
                  }
                  return (
                    <Marker
                      key={listing.id}
                      icon={IconDisplay()}
                      position={[listing.latitude, listing.longitude]}
                    >
                      <Popup>
                        <Typography variant="h4">{listing.title}</Typography>
                        <img
                          src={listing.picture1}
                          style={{
                            width: "18rem",
                            height: "14rem",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate(`/listings/${listing.id}`)}
                        />
                        <Typography variant="h6">
                          {listing.description.substring(0, 150)}...
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => navigate(`/listings/${listing.id}`)}
                        >
                          اطلاعات بیشتر
                        </Button>
                      </Popup>
                    </Marker>
                  );
                })}
                {/* <Marker position={[latitude, longitude]}>
                  <Popup>
                    <Typography variant="h4">A Title</Typography>
                    <img
                      src={img}
                      style={{ width: "18rem", height: "14rem" }}
                    />
                    <Typography variant="h6">A text for location</Typography>
                    <Button variant="contained" fullWidth>
                      See Details
                    </Button>
                  </Popup>
                </Marker> */}
              </MapContainer>
            </div>
          </AppBar>
        </div>
      </div>
    </>
  );
}

export default Listing;
