import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import login from "./Assets/login.jpg";
import Axios from "axios";

import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import { useImmerReducer } from "use-immer";
import {
  MapContainer,
  TileLayer,
  useMap,
  Polygon,
  Marker,
} from "react-leaflet";
import StateContext from "../Contexts/StateContext";
import { Filter, Opacity } from "@mui/icons-material";
const useStyles = makeStyles({
  fullPage: {
    backgroundImage: `url(${login})`,
    width: "100%",
    height: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    
  },
  formContainer: {
    width: "75%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "1rem",
    borderRadius: '20px',
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "3rem",
    height: "55rem",
    overflow: "auto",
    scrollbarWidth: "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none" /* Safari and Chrome */,
    },
    // backgroundImage: `url('${brick}')`,
    // Opacity: '0.1',
    // backdropFilter: "blur(100px)",
  },
  registerBtn: {
    backgroundColor: "black",
    color: "white",
    fontSize: "1.1rem",
    marginLeft: "1rem",
    "&:hover": {
      boxShadow: "3px 3px 3px 3px 3px black",
      backgroundColor: "white",
      color: "black",
    },
  },
  picturesBtn: {
    backgroundColor: "black",
    color: "white",
    fontSize: "0.8rem",
    marginLeft: "1rem",
    "&:hover": {
      boxShadow: "3px 3px 3px 3px 3px black",
      backgroundColor: "white",
      color: "black",
    },
  },
  
});
const areaOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Inner Tehran",
    label: "داخل تهران",
  },
  {
    value: "Outer Tehran",
    label: "خارج تهران",
  },
];
const innerTehranOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "تجریش",
    label: "تجریش",
  },
  {
    value: "نیاوران",
    label: "نیاوران",
  },
  {
    value: "قلهک",
    label: "قلهک",
  },
  {
    value: "دروس",
    label: "دروس",
  },
  {
    value: "زرگنده",
    label: "زرگنده",
  },
  {
    value: "جماران",
    label: "جماران",
  },
  {
    value: "ازگل",
    label: "ازگل",
  },
  {
    value: "لویزان",
    label: "لویزان",
  },
  {
    value: "مینی سیتی",
    label: "مینی سیتی",
  },
  {
    value: "سوهانک",
    label: "سوهانک",
  },
  {
    value: "حسین آباد",
    label: "حسین آباد",
  },
  {
    value: "مبارک آباد",
    label: "مبارک آباد",
  },
  {
    value: "اقدسیه",
    label: "اقدسیه",
  },
  {
    value: "زعفرانیه",
    label: "زعفرانیه",
  },
  {
    value: "آجودانیه",
    label: "آجودانیه",
  },
  {
    value: "محمودیه",
    label: "محمودیه",
  },
  {
    value: "فرمانیه",
    label: "فرمانیه",
  },
  {
    value: "کامرانیه",
    label: "کامرانیه",
  },
  {
    value: "داوودیه",
    label: "داوودیه",
  },
  {
    value: "دزاشیب",
    label: "دزاشیب",
  },
  {
    value: "جردن",
    label: "جردن",
  },
  {
    value: "الهیه",
    label: "الهیه",
  },
  {
    value: "ولنجک",
    label: "ولنجک",
  },
  {
    value: "اوین",
    label: "اوین",
  },
  {
    value: "ظفر",
    label: "ظفر",
  },
  {
    value: "درکه",
    label: "درکه",
  },
  {
    value: "ونک",
    label: "ونک",
  },
  {
    value: "تهران نو",
    label: "تهران نو",
  },
  {
    value: "تهران پارس",
    label: "تهران پارس",
  },
  {
    value: "نارمک",
    label: "نارمک",
  },
  {
    value: "شهرک امید",
    label: "شهرک امید",
  },
  {
    value: "شهرک زیتون",
    label: "شهرک زیتون",
  },
  {
    value: "سرخه حصار",
    label: "سرخه حصار",
  },
  {
    value: "پیروزی",
    label: "پیروزی",
  },
  {
    value: "گرگان",
    label: "گرگان",
  },
  {
    value: "وحیدیه",
    label: "وحیدیه",
  },
  {
    value: "کالاد",
    label: "کالاد",
  },
  {
    value: "شمس آباد",
    label: "شمس آباد",
  },
  {
    value: "حکیمیه",
    label: "حکیمیه",
  },
  {
    value: "پاسداران",
    label: "پاسداران",
  },
  {
    value: "نیروی هوایی",
    label: "نیروی هوایی",
  },
  {
    value: "نظام آباد",
    label: "نظام آباد",
  },
  {
    value: "مجیدیه",
    label: "مجیدیه",
  },
  {
    value: "حشمتیه",
    label: "حشمتیه",
  },
  {
    value: "منصورآباد",
    label: "منصورآباد",
  },
  {
    value: "جنت آباد",
    label: "جنت آباد",
  },
  {
    value: "پونک",
    label: "پونک",
  },
  {
    value: "شهرک آزادی",
    label: "شهرک آزادی",
  },
  {
    value: "ستارخان",
    label: "ستارخان",
  },
  {
    value: "آریاشهر",
    label: "آریاشهر",
  },
  {
    value: "شهر زیبا",
    label: "شهر زیبا",
  },
  {
    value: "شهران",
    label: "شهران",
  },
  {
    value: "طرشت",
    label: "طرشت",
  },
  {
    value: "گیشا",
    label: "گیشا",
  },
  {
    value: "چیتگر",
    label: "چیتگر",
  },
  {
    value: "شهرک اکباتان",
    label: "شهرک اکباتان",
  },
  {
    value: "کوی بیمه",
    label: "کوی بیمه",
  },
  {
    value: "حصارک",
    label: "حصارک",
  },
  {
    value: "آزادی",
    label: "آزادی",
  },
  {
    value: "فردوس",
    label: "فردوس",
  },
  {
    value: "دهکده المپیک",
    label: "دهکده المپیک",
  },
  {
    value: "شهرک امیرکبیر",
    label: "شهرک امیرکبیر",
  },
  {
    value: "کن",
    label: "کن",
  },
  {
    value: "ورداورد",
    label: "ورداورد",
  },
  {
    value: "شهرک گلستان",
    label: "شهرک گلستان",
  },
  {
    value: "تهران ویلا",
    label: "تهران ویلا",
  },
  {
    value: "سعادت آباد",
    label: "سعادت آباد",
  },
  {
    value: "شهرک غرب",
    label: "شهرک غرب",
  },
  {
    value: "فرحزاد",
    label: "فرحزاد",
  },
  {
    value: "چهاردیواری",
    label: "چهاردیواری",
  },
  {
    value: "جیحون",
    label: "جیحون",
  },
  {
    value: "هاشمی",
    label: "هاشمی",
  },
  {
    value: "دامپزشکی",
    label: "دامپزشکی",
  },
  {
    value: "مهرآباد",
    label: "مهرآباد",
  },
  {
    value: "سرو آزاد",
    label: "سرو آزاد",
  },
  {
    value: "مشیریه",
    label: "مشیریه",
  },
  {
    value: "شهرک مسعودیه",
    label: "شهرک مسعودیه",
  },
  {
    value: "افسریه",
    label: "افسریه",
  },
  {
    value: "خانی آباد نو",
    label: "خانی آباد نو",
  },
  {
    value: "نازی آباد",
    label: "نازی آباد",
  },
  {
    value: "نعمت آباد",
    label: "نعمت آباد",
  },
  {
    value: "یاخچی آباد",
    label: "یاخچی آباد",
  },
  {
    value: "امیر بهادر",
    label: "امیر بهادر",
  },
  {
    value: "اتابک",
    label: "اتابک",
  },
  {
    value: "خراسان",
    label: "خراسان",
  },
  {
    value: "خزانه فلاح",
    label: "خزانه فلاح",
  },
  {
    value: "خزانه بخارایی",
    label: "خزانه بخارایی",
  },
  {
    value: "شاپور",
    label: "شاپور",
  },
  {
    value: "مولوی",
    label: "مولوی",
  },
  {
    value: "سیروس",
    label: "سیروس",
  },
  {
    value: "دروازه غار",
    label: "دروازه غار",
  },
  {
    value: "جوادیه",
    label: "جوادیه",
  },
  {
    value: "یافت آباد",
    label: "یافت آباد",
  },
  {
    value: "منیریه",
    label: "منیریه",
  },
  {
    value: "امیریه",
    label: "امیریه",
  },
  {
    value: "شوش",
    label: "شوش",
  },
  {
    value: "بازار تهران",
    label: "بازار تهران",
  },
  {
    value: "شهر ری",
    label: "شهر ری",
  },
  {
    value: "کوی ۱۳ آبان",
    label: "کوی ۱۳ آبان",
  },
  {
    value: "دولت آباد",
    label: "دولت آباد",
  },
  {
    value: "شهرک رسالت",
    label: "شهرک رسالت",
  },
  {
    value: "بازار چینی فروشان",
    label: "بازار چینی فروشان",
  },
  {
    value: "کیان شهر",
    label: "کیان شهر",
  },
  {
    value: "یوسف آباد",
    label: "یوسف آباد",
  },
  {
    value: "امیرآباد",
    label: "امیرآباد",
  },
  {
    value: "عباس آباد",
    label: "عباس آباد",
  },
  {
    value: "جلفا",
    label: "جلفا",
  },
  {
    value: "خواجه عبدالله",
    label: "خواجه عبدالله",
  },
  {
    value: "بهارشیراز",
    label: "بهارشیراز",
  },
  {
    value: "زرتشت",
    label: "زرتشت",
  },
  {
    value: "بهجت آباد",
    label: "بهجت آباد",
  },
  {
    value: "طالقانی",
    label: "طالقانی",
  },
  {
    value: "تخت طاووس",
    label: "تخت طاووس",
  },
  {
    value: "سهروردی",
    label: "سهروردی",
  },
  {
    value: "آپادانا",
    label: "آپادانا",
  },
  {
    value: "توحید",
    label: "توحید",
  },
  {
    value: "جمهوری",
    label: "جمهوری",
  },
  {
    value: "نادری",
    label: "نادری",
  },
  {
    value: "استانبول",
    label: "استانبول",
  },
  {
    value: "توپ خانه",
    label: "توپ خانه",
  },
  {
    value: "لاله زار",
    label: "لاله زار",
  },
  {
    value: "باغ صبا",
    label: "باغ صبا",
  },
  {
    value: "فاطمی",
    label: "فاطمی",
  },
  {
    value: "آرژانتین",
    label: "آرژانتین",
  },
  {
    value: "آذربایجان",
    label: "آذربایجان",
  },
];

const outerTehranOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "شهریار",
    label: "شهریار",
  },
  {
    value: "اسلامشهر",
    label: "اسلامشهر",
  },
  {
    value: "بهارستان",
    label: "بهارستان",
  },
  {
    value: "ملارد",
    label: "ملارد",
  },
  {
    value: "پاکدشت",
    label: "پاکدشت",
  },
  {
    value: "ری",
    label: "ری",
  },
  {
    value: "قدس",
    label: "قدس",
  },
  {
    value: "رباط کریم",
    label: "رباط کریم",
  },
  {
    value: "ورامین",
    label: "ورامین",
  },
  {
    value: "قرچک",
    label: "قرچک",
  },
  {
    value: "پردیس",
    label: "پردیس",
  },
  {
    value: "دماوند",
    label: "دماوند",
  },
  {
    value: "پیشوا",
    label: "پیشوا",
  },
  {
    value: "شمیرانات",
    label: "شمیرانات",
  },
  {
    value: "فیروزکوه",
    label: "فیروزکوه",
  },
];

const listingTypeOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Apartment",
    label: "آپارتمان",
  },
  {
    value: "House",
    label: "خانه",
  },
  {
    value: "Office",
    label: "اداری",
  },
];

const propertyStatusOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Sale",
    label: "فروش",
  },
  {
    value: "Rent",
    label: "اجاره",
  },
];

const rentalFrequencyOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Month",
    label: "ماهانه",
  },
  {
    value: "Week",
    label: "هفتگی",
  },
  {
    value: "Day",
    label: "روزانه",
  },
];

function AddProperty() {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    titleValue: "",
    listingTypeValue: "",
    descriptionValue: "",
    areaValue: "",
    areaValue: "",
    boroughValue: "",
    latitudeValue: "",
    longitudeValue: "",
    propertyStatusValue: "",
    priceValue: "",
    rentalFrequencyValue: "",
    roomsValue: "",
    furnishedValue: false,
    poolValue: false,
    elevatorValue: false,
    cctvValue: false,
    parkingValue: false,
    picture1Value: "",
    picture2Value: "",
    picture3Value: "",
    picture4Value: "",
    picture5Value: "",
    mapInstance: null,
    markerPosition: {
      lat: "35.71928029807354",
      lng:"51.373214994509354",
    },
    uploadedPictures: [],
    sendRequest: 0,
    userProfile: {
      agencyName: "",
      phoneNumber: "",
    },
    openSnack: false,
    disabledBtn: false,
    titleErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    listingTypeErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    propertyStatusErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    priceErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    areaErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    boroughErrors: {
      hasErrors: false,
      errorMessage: "",
    },
  };
  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.titleChosen;
        draft.titleErrors.hasErrors = false;
        draft.titleErrors.errorMessage = "";
        break;
      case "catchListingTypeChange":
        draft.listingTypeValue = action.listingTypeChosen;
        draft.listingTypeErrors.hasErrors = false;
        draft.listingTypeErrors.errorMessage = "";
        break;
      case "catchDescriptionChange":
        draft.descriptionValue = action.descriptionChosen;
        break;
      case "catchAreaChange":
        draft.areaValue = action.areaChosen;
        draft.areaErrors.hasErrors = false;
        draft.areaErrors.errorMessage = "";
        break;
      case "catchBoroughChange":
        draft.boroughValue = action.boroughChosen;
        draft.boroughErrors.hasErrors = false;
        draft.boroughErrors.errorMessage = "";
        break;
      case "catchLatitudeChange":
        draft.latitudeValue = action.latitudeChosen;
        break;
      case "catchLongitudeChange":
        draft.longitudeValue = action.longitudeChosen;
        break;
      case "catchPropertyStatusChange":
        draft.propertyStatusValue = action.propertyStatusChosen;
        draft.propertyStatusErrors.hasErrors = false;
        draft.propertyStatusErrors.errorMessage = "";
        break;
      case "catchPriceChange":
        draft.priceValue = action.priceChosen;
        draft.priceErrors.hasErrors = false;
        draft.priceErrors.errorMessage = "";
        break;
      case "catchRentalFrequencyChange":
        draft.rentalFrequencyValue = action.rentalFrequencyChosen;
        break;
      case "catchRoomsChange":
        draft.roomsValue = action.roomsChosen;
        break;
      case "catchFurnishedChange":
        draft.furnishedValue = action.furnishedChosen;
        break;
      case "catchPoolChange":
        draft.poolValue = action.poolChosen;
        break;
      case "catchElevatorChange":
        draft.elevatorValue = action.elevatorChosen;
        break;
      case "catchCctvChange":
        draft.cctvValue = action.cctvChosen;
        break;
      case "catchParkingChange":
        draft.parkingValue = action.parkingChosen;
        break;
      case "catchPicture1Change":
        draft.picture1Value = action.picture1Chosen;
        break;
      case "catchPicture2Change":
        draft.picture2Value = action.picture2Chosen;
        break;
      case "catchPicture3Change":
        draft.picture3Value = action.picture3Chosen;
        break;
      case "catchPicture4Change":
        draft.picture4Value = action.picture4Chosen;
        break;
      case "catchPicture5Change":
        draft.picture5Value = action.picture5Chosen;
        break;
      case "getMap":
        draft.mapInstance = action.mapData;
        break;
      case "changeMarkerPosition":
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;

        break;
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        break;
      case "catchUploadedPictures":
        draft.uploadedPictures = action.picturesChosen;
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
      case "catchTitleErrors":
        if (action.titleChosen.length === 0) {
          draft.titleErrors.hasErrors = true;
          draft.titleErrors.errorMessage = "این قسمت نباید خالی بماند!";
        }
        break;
      case "catchListingTypeErrors":
        if (action.listingTypeChosen.length === 0) {
          draft.listingTypeErrors.hasErrors = true;
          draft.listingTypeErrors.errorMessage = "این قسمت نباید خالی بماند!";
        }
        break;
      case "catchPropertyStatusErrors":
        if (action.propertyStatusChosen.length === 0) {
          draft.propertyStatusErrors.hasErrors = true;
          draft.propertyStatusErrors.errorMessage =
            "این قسمت نباید خالی بماند!";
        }
        break;
      case "catchPriceErrors":
        if (action.priceChosen.length === 0) {
          draft.priceErrors.hasErrors = true;
          draft.priceErrors.errorMessage = "این قسمت نباید خالی بماند!";
        }
        break;
      case "catchAreaErrors":
        if (action.areaChosen.length === 0) {
          draft.areaErrors.hasErrors = true;
          draft.areaErrors.errorMessage = "این قسمت نباید خالی بماند!";
        }
        break;
      case "catchBoroughErrors":
        if (action.boroughChosen.length === 0) {
          draft.boroughErrors.hasErrors = true;
          draft.boroughErrors.errorMessage = "این قسمت نباید خالی بماند!";
        }
        break;
      case "emptyTitle":
        draft.titleErrors.hasErrors = true;
        draft.titleErrors.errorMessage = "این قسمت نباید خالی بماند!";
        break;
      case "emptyListingType":
        draft.listingTypeErrors.hasErrors = true;
        draft.listingTypeErrors.errorMessage = "این قسمت نباید خالی بماند!";
        break;
      case "emptyPropertyStatus":
        draft.propertyStatusErrors.hasErrors = true;
        draft.propertyStatusErrors.errorMessage = "این قسمت نباید خالی بماند!";
        break;
      case "emptyPrice":
        draft.priceErrors.hasErrors = true;
        draft.priceErrors.errorMessage = "این قسمت نباید خالی بماند!";
        break;
      case "emptyArea":
        draft.areaErrors.hasErrors = true;
        draft.areaErrors.errorMessage = "این قسمت نباید خالی بماند!";
        break;
      case "emptyBorough":
        draft.boroughErrors.hasErrors = true;
        draft.boroughErrors.errorMessage = "این قسمت نباید خالی بماند!";
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
    if (state.boroughValue === "تجریش") {
      state.mapInstance.setView([35.79533135899488, 51.43178703880068], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.79533135899488,
        changeLongitude: 51.43178703880068,
      });
    } else if (state.boroughValue === "نیاوران") {
      state.mapInstance.setView([35.81594334648146, 51.470324579408675], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.81594334648146,
        changeLongitude: 51.470324579408675,
      });
    } else if (state.boroughValue === "قلهک") {
      state.mapInstance.setView([35.77239064444908, 51.45357191091636], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.77239064444908,
        changeLongitude: 51.45357191091636,
      });
    } else if (state.boroughValue === "زرگنده") {
      state.mapInstance.setView([35.77673914204477, 51.432302027751525], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.77673914204477,
        changeLongitude: 51.432302027751525,
      });
    } else if (state.boroughValue === "جماران") {
      state.mapInstance.setView([35.81596077266491, 51.459978329054266], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.81596077266491,
        changeLongitude: 51.459978329054266,
      });
    } else if (state.boroughValue === "ازگل") {
      state.mapInstance.setView([35.78974144107997, 51.511652410085254], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.78974144107997,
        changeLongitude: 51.511652410085254,
      });
    } else if (state.boroughValue === "لویزان") {
      state.mapInstance.setView([35.77307995936542, 51.49918530641285], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.77307995936542,
        changeLongitude: 51.49918530641285,
      });
    } else if (state.boroughValue === "مینی سیتی") {
      state.mapInstance.setView([35.79594221750622, 51.50610522283417], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.79594221750622,
        changeLongitude: 51.50610522283417,
      });
    } else if (state.boroughValue === "سوهانک") {
      state.mapInstance.setView([35.80226005112883, 51.533671903753486], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.80226005112883,
        changeLongitude: 51.533671903753486,
      });
    } else if (state.boroughValue === "حسین آباد") {
      state.mapInstance.setView([35.77726566038497, 51.48231976878357], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.77726566038497,
        changeLongitude: 51.48231976878357,
      });
    } else if (state.boroughValue === "مبارک آباد") {
      state.mapInstance.setView([35.76524688838668, 51.47649272939012], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76524688838668,
        changeLongitude: 51.47649272939012,
      });
    } else if (state.boroughValue === "اقدسیه") {
      state.mapInstance.setView([35.795010576473786, 51.48828775683789], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.795010576473786,
        changeLongitude: 51.48828775683789,
      });
    } else if (state.boroughValue === "زعفرانیه") {
      state.mapInstance.setView([35.80620271675248, 51.41510172887111], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.80620271675248,
        changeLongitude: 51.41510172887111,
      });
    } else if (state.boroughValue === "آجودانیه") {
      state.mapInstance.setView([35.8078925578314, 51.48643869706688], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.8078925578314,
        changeLongitude: 51.48643869706688,
      });
    } else if (state.boroughValue === "محمودیه") {
      state.mapInstance.setView([35.79690297030874, 51.41180636691303], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.79690297030874,
        changeLongitude: 51.41180636691303,
      });
    } else if (state.boroughValue === "فرمانیه") {
      state.mapInstance.setView([35.80301925083838, 51.46018662466785], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.80301925083838,
        changeLongitude: 51.46018662466785,
      });
    } else if (state.boroughValue === "کامرانیه") {
      state.mapInstance.setView([35.683748754097664, 51.40244903634573], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.683748754097664,
        changeLongitude: 51.40244903634573,
      });
    } else if (state.boroughValue === "داوودیه") {
      state.mapInstance.setView([35.762142474177104, 51.435239044731425], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.762142474177104,
        changeLongitude: 51.435239044731425,
      });
    } else if (state.boroughValue === "دزاشیب") {
      state.mapInstance.setView([35.807923296221766, 51.45326602780245], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.807923296221766,
        changeLongitude: 51.45326602780245,
      });
    } else if (state.boroughValue === "جردن") {
      state.mapInstance.setView([35.771531452418444, 51.42035539274575], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.771531452418444,
        changeLongitude: 51.42035539274575,
      });
    } else if (state.boroughValue === "الهیه") {
      state.mapInstance.setView([35.79048418038843, 51.42802573229972], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.79048418038843,
        changeLongitude: 51.42802573229972,
      });
    } else if (state.boroughValue === "ولنجک") {
      state.mapInstance.setView([35.80683985325942, 51.39942593894513], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.80683985325942,
        changeLongitude: 51.39942593894513,
      });
    } else if (state.boroughValue === "اوین") {
      state.mapInstance.setView([35.795215248180284, 51.391533022300145], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.795215248180284,
        changeLongitude: 51.391533022300145,
      });
    } else if (state.boroughValue === "ظفر") {
      state.mapInstance.setView([35.76511131687479, 51.44124800720318], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76511131687479,
        changeLongitude: 51.44124800720318,
      });
    } else if (state.boroughValue === "درکه") {
      state.mapInstance.setView([35.80999092607294, 51.38151474634911], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.80999092607294,
        changeLongitude: 51.38151474634911,
      });
    } else if (state.boroughValue === "ونک") {
      state.mapInstance.setView([35.76248553923622, 51.391242628998214], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76248553923622,
        changeLongitude: 51.391242628998214,
      });
    } else if (state.boroughValue === "تهران نو") {
      state.mapInstance.setView([35.711992510029404, 51.49692810417251], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.711992510029404,
        changeLongitude: 51.49692810417251,
      });
    } else if (state.boroughValue === "تهران پارس") {
      state.mapInstance.setView([35.73313627648117, 51.548663715515396], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.73313627648117,
        changeLongitude: 51.548663715515396,
      });
    } else if (state.boroughValue === "نارمک") {
      state.mapInstance.setView([35.75098048995167, 51.51225475392123], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.75098048995167,
        changeLongitude: 51.51225475392123,
      });
    } else if (state.boroughValue === "شهرک امید") {
      state.mapInstance.setView([35.76299060751251, 51.53179320420095], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76299060751251,
        changeLongitude: 51.53179320420095,
      });
    } else if (state.boroughValue === "شهرک زیتون") {
      state.mapInstance.setView([35.70995497528217, 51.58593349598959], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.70995497528217,
        changeLongitude: 51.58593349598959,
      });
    } else if (state.boroughValue === "سرخه حصار") {
      state.mapInstance.setView([35.7208452810888, 51.603544046408715], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.7208452810888,
        changeLongitude: 51.603544046408715,
      });
    } else if (state.boroughValue === "پیروزی") {
      state.mapInstance.setView([35.69245533577971, 51.469929841166234], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.69245533577971,
        changeLongitude: 51.469929841166234,
      });
    } else if (state.boroughValue === "گرگان") {
      state.mapInstance.setView([35.71147467972565, 51.447935958018476], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.71147467972565,
        changeLongitude: 51.447935958018476,
      });
    } else if (state.boroughValue === "وحیدیه") {
      state.mapInstance.setView([35.714286386951976, 51.47107927801301], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.714286386951976,
        changeLongitude: 51.47107927801301,
      });
    } else if (state.boroughValue === "کالاد") {
      state.mapInstance.setView([35.738071469922545, 51.49287610485873], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.738071469922545,
        changeLongitude: 51.49287610485873,
      });
    } else if (state.boroughValue === "شمس آباد") {
      state.mapInstance.setView([35.7462542287868, 51.47596449470107], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.7462542287868,
        changeLongitude: 51.47596449470107,
      });
    } else if (state.boroughValue === "حکیمیه") {
      state.mapInstance.setView([35.74000607917306, 51.584014474680785], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.74000607917306,
        changeLongitude: 51.584014474680785,
      });
    } else if (state.boroughValue === "پاسداران") {
      state.mapInstance.setView([35.78142695645223, 51.46795190989709], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.78142695645223,
        changeLongitude: 51.46795190989709,
      });
    } else if (state.boroughValue === "نیروی هوایی") {
      state.mapInstance.setView([35.701976792163826, 51.474332088374545], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.701976792163826,
        changeLongitude: 51.474332088374545,
      });
    } else if (state.boroughValue === "نظام آباد") {
      state.mapInstance.setView([35.70869935110564, 51.45600588328108], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.70869935110564,
        changeLongitude: 51.45600588328108,
      });
    } else if (state.boroughValue === "مجیدیه") {
      state.mapInstance.setView([35.73618623476705, 51.46912435414751], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.73618623476705,
        changeLongitude: 51.46912435414751,
      });
    } else if (state.boroughValue === "حشمتیه") {
      state.mapInstance.setView([35.72151082266081, 51.45848617107257], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.72151082266081,
        changeLongitude: 51.45848617107257,
      });
    } else if (state.boroughValue === "منصورآباد") {
      state.mapInstance.setView([35.615225373856646, 51.442891676303056], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.615225373856646,
        changeLongitude: 51.442891676303056,
      });
    } else if (state.boroughValue === "جنت آباد") {
      state.mapInstance.setView([35.75288105403359, 51.30758454044701], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.75288105403359,
        changeLongitude: 51.30758454044701,
      });
    } else if (state.boroughValue === "پونک") {
      state.mapInstance.setView([35.76147757134108, 51.33906832885448], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76147757134108,
        changeLongitude: 51.33906832885448,
      });
    } else if (state.boroughValue === "شهرک آزادی") {
      state.mapInstance.setView([35.71180950245512, 51.27196411124258], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.71180950245512,
        changeLongitude: 51.27196411124258,
      });
    } else if (state.boroughValue === "ستارخان") {
      state.mapInstance.setView([35.72139383551846, 51.3633155934168], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.72139383551846,
        changeLongitude: 51.3633155934168,
      });
    } else if (state.boroughValue === "آریاشهر") {
      state.mapInstance.setView([35.72663281587081, 51.341693735115], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.72663281587081,
        changeLongitude: 51.341693735115,
      });
    } else if (state.boroughValue === "شهر زیبا") {
      state.mapInstance.setView([35.748802811616144, 51.29091219001237], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.748802811616144,
        changeLongitude: 51.29091219001237,
      });
    } else if (state.boroughValue === "شهران") {
      state.mapInstance.setView([35.76352488602155, 51.2892688873646], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76352488602155,
        changeLongitude: 51.2892688873646,
      });
    } else if (state.boroughValue === "طرشت") {
      state.mapInstance.setView([35.70586578540012, 51.34363619835262], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.70586578540012,
        changeLongitude: 51.34363619835262,
      });
    } else if (state.boroughValue === "گیشا") {
      state.mapInstance.setView([35.733437967961024, 51.375852411668426], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.733437967961024,
        changeLongitude: 51.375852411668426,
      });
    } else if (state.boroughValue === "چیتگر") {
      state.mapInstance.setView([35.71513126482331, 51.18258264975349], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.71513126482331,
        changeLongitude: 51.18258264975349,
      });
    } else if (state.boroughValue === "شهرک اکباتان") {
      state.mapInstance.setView([35.71139890049286, 51.31004337960144], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.71139890049286,
        changeLongitude: 51.31004337960144,
      });
    } else if (state.boroughValue === "کوی بیمه") {
      state.mapInstance.setView([35.705915334751595, 51.3187051703408], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.705915334751595,
        changeLongitude: 51.3187051703408,
      });
    } else if (state.boroughValue === "پونک") {
      state.mapInstance.setView([35.76147757134108, 51.33906832885448], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76147757134108,
        changeLongitude: 51.33906832885448,
      });
    } else if (state.boroughValue === "حصارک") {
      state.mapInstance.setView([35.78178622663956, 51.30808326220148], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.78178622663956,
        changeLongitude: 51.30808326220148,
      });
    } else if (state.boroughValue === "آزادی") {
      state.mapInstance.setView([35.70048986657446, 51.33791893833958], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.70048986657446,
        changeLongitude: 51.33791893833958,
      });
    } else if (state.boroughValue === "فردوس") {
      state.mapInstance.setView([35.72093431544464, 51.317794080211904], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.72093431544464,
        changeLongitude: 51.317794080211904,
      });
    } else if (state.boroughValue === "دهکده المپیک") {
      state.mapInstance.setView([35.76046913335456, 51.26327451584208], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76046913335456,
        changeLongitude: 51.26327451584208,
      });
    } else if (state.boroughValue === "شهرک امیرکبیر") {
      state.mapInstance.setView([35.747739980065035, 51.24658586268993], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.747739980065035,
        changeLongitude: 51.24658586268993,
      });
    } else if (state.boroughValue === "کن") {
      state.mapInstance.setView([35.76085327364137, 51.27686783778675], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76085327364137,
        changeLongitude: 51.27686783778675,
      });
    } else if (state.boroughValue === "ورداورد") {
      state.mapInstance.setView([35.73734192493722, 51.1360732991899], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.73734192493722,
        changeLongitude: 51.1360732991899,
      });
    } else if (state.boroughValue === "شهرک گلستان") {
      state.mapInstance.setView([35.76003977995365, 51.522751147924865], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76003977995365,
        changeLongitude: 51.522751147924865,
      });
    } else if (state.boroughValue === "تهران ویلا") {
      state.mapInstance.setView([35.72399673815101, 51.36634569599172], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.72399673815101,
        changeLongitude: 51.36634569599172,
      });
    } else if (state.boroughValue === "سعادت آباد") {
      state.mapInstance.setView([35.78629557469269, 51.38129708756715], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.78629557469269,
        changeLongitude: 51.38129708756715,
      });
    } else if (state.boroughValue === "شهرک غرب") {
      state.mapInstance.setView([35.75707196324812, 51.376158051601756], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.75707196324812,
        changeLongitude: 51.376158051601756,
      });
    } else if (state.boroughValue === "فرحزاد") {
      state.mapInstance.setView([35.786469675573215, 51.345031503213896], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.786469675573215,
        changeLongitude: 51.345031503213896,
      });
    } else if (state.boroughValue === "چهاردیواری") {
      state.mapInstance.setView([35.77851497508394, 51.3356083928088], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.77851497508394,
        changeLongitude: 51.3356083928088,
      });
    } else if (state.boroughValue === "جیحون") {
      state.mapInstance.setView([35.69150708782906, 51.3636127823241], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.69150708782906,
        changeLongitude: 51.3636127823241,
      });
    } else if (state.boroughValue === "هاشمی") {
      state.mapInstance.setView([35.69128016001222, 51.359861525943685], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.69128016001222,
        changeLongitude: 51.359861525943685,
      });
    } else if (state.boroughValue === "دامپزشکی") {
      state.mapInstance.setView([35.76147757134108, 51.33906832885448], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.76147757134108,
        changeLongitude: 51.33906832885448,
      });
    } else if (state.boroughValue === "مهرآباد") {
      state.mapInstance.setView([35.68279957146092, 51.310131450219785], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.68279957146092,
        changeLongitude: 51.310131450219785,
      });
    } else if (state.boroughValue === "سرو آزاد") {
      state.mapInstance.setView([35.73576803390507, 51.18978098699272], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.73576803390507,
        changeLongitude: 51.18978098699272,
      });
    } else if (state.boroughValue === "مشیریه") {
      state.mapInstance.setView([35.625119116635915, 51.47806308651477], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.625119116635915,
        changeLongitude: 51.47806308651477,
      });
    } else if (state.boroughValue === "شهرک مسعودیه") {
      state.mapInstance.setView([35.62694659315526, 51.50172331064197], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.62694659315526,
        changeLongitude: 51.50172331064197,
      });
    } else if (state.boroughValue === "افسریه") {
      state.mapInstance.setView([35.64530200337879, 51.49039735671733], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.64530200337879,
        changeLongitude: 51.49039735671733,
      });
    } else if (state.boroughValue === "خانی آباد نو") {
      state.mapInstance.setView([35.63244457334395, 51.3899722191081], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.63244457334395,
        changeLongitude: 51.3899722191081,
      });
    } else if (state.boroughValue === "نازی آباد") {
      state.mapInstance.setView([35.64546912936445, 51.40155047360914], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.64546912936445,
        changeLongitude: 51.40155047360914,
      });
    } else if (state.boroughValue === "نعمت آباد") {
      state.mapInstance.setView([35.632089622256174, 51.35523813106312], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.632089622256174,
        changeLongitude: 51.35523813106312,
      });
    } else if (state.boroughValue === "یاخچی آباد") {
      state.mapInstance.setView([35.626887858708294, 51.40175643834885], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.626887858708294,
        changeLongitude: 51.40175643834885,
      });
    } else if (state.boroughValue === "امیر بهادر") {
      state.mapInstance.setView([35.670417166565514, 51.4032765673433], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.670417166565514,
        changeLongitude: 51.4032765673433,
      });
    } else if (state.boroughValue === "اتابک") {
      state.mapInstance.setView([35.650408121975474, 51.461409645993115], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.650408121975474,
        changeLongitude: 51.461409645993115,
      });
    } else if (state.boroughValue === "خراسان") {
      state.mapInstance.setView([35.66610348735863, 51.4453113443674], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.66610348735863,
        changeLongitude: 51.4453113443674,
      });
    } else if (state.boroughValue === "خزانه فلاح") {
      state.mapInstance.setView([35.65295352169956, 51.36010481164058], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.65295352169956,
        changeLongitude: 51.36010481164058,
      });
    } else if (state.boroughValue === "خزانه بخارایی") {
      state.mapInstance.setView([35.644523777800316, 51.421083495526744], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.644523777800316,
        changeLongitude: 51.421083495526744,
      });
    } else if (state.boroughValue === "شاپور") {
      state.mapInstance.setView([35.64258864467449, 51.34104443678274], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.64258864467449,
        changeLongitude: 51.34104443678274,
      });
    } else if (state.boroughValue === "مولوی") {
      state.mapInstance.setView([35.66476190823616, 51.423241637110955], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.66476190823616,
        changeLongitude: 51.423241637110955,
      });
    } else if (state.boroughValue === "سیروس") {
      state.mapInstance.setView([35.673081401747304, 51.433410213549195], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.673081401747304,
        changeLongitude: 51.433410213549195,
      });
    } else if (state.boroughValue === "دروازه غار") {
      state.mapInstance.setView([35.6596218966064, 51.42129414315173], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.6596218966064,
        changeLongitude: 51.42129414315173,
      });
    } else if (state.boroughValue === "جوادیه") {
      state.mapInstance.setView([35.6536516634547, 51.390134227152856], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.6536516634547,
        changeLongitude: 51.390134227152856,
      });
    } else if (state.boroughValue === "یافت آباد") {
      state.mapInstance.setView([35.665929901224146, 51.31853786961163], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.665929901224146,
        changeLongitude: 51.31853786961163,
      });
    } else if (state.boroughValue === "منیریه") {
      state.mapInstance.setView([35.684421798862715, 51.40103753883045], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.684421798862715,
        changeLongitude: 51.40103753883045,
      });
    } else if (state.boroughValue === "امیریه") {
      state.mapInstance.setView([35.67888585195863, 51.40066968772563], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.67888585195863,
        changeLongitude: 51.40066968772563,
      });
    } else if (state.boroughValue === "شوش") {
      state.mapInstance.setView([35.65849769275599, 51.43998196532111], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.65849769275599,
        changeLongitude: 51.43998196532111,
      });
    } else if (state.boroughValue === "بازار تهران") {
      state.mapInstance.setView([35.67191054781425, 51.42271646437426], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.67191054781425,
        changeLongitude: 51.42271646437426,
      });
    } else if (state.boroughValue === "شهر ری") {
      state.mapInstance.setView([35.577751071745766, 51.46104494139835], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.577751071745766,
        changeLongitude: 51.46104494139835,
      });
    } else if (state.boroughValue === "کوی ۱۳ آبان") {
      state.mapInstance.setView([35.607068779682734, 51.4040648190283], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.607068779682734,
        changeLongitude: 51.4040648190283,
      });
    } else if (state.boroughValue === "دولت آباد") {
      state.mapInstance.setView([35.62184616192987, 51.44280032785104], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.62184616192987,
        changeLongitude: 51.44280032785104,
      });
    } else if (state.boroughValue === "شهرک رسالت") {
      state.mapInstance.setView([35.73953269651196, 51.482459300566404], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.73953269651196,
        changeLongitude: 51.482459300566404,
      });
    } else if (state.boroughValue === "بازار چینی فروشان") {
      state.mapInstance.setView([35.60668816007208, 51.38885899075608], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.60668816007208,
        changeLongitude: 51.38885899075608,
      });
    } else if (state.boroughValue === "کیان شهر") {
      state.mapInstance.setView([35.63252699165554, 51.45461219834718], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.63252699165554,
        changeLongitude: 51.45461219834718,
      });
    } else if (state.boroughValue === "یوسف آباد") {
      state.mapInstance.setView([35.730978883586296, 51.40306588098177], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.730978883586296,
        changeLongitude: 51.40306588098177,
      });
    } else if (state.boroughValue === "امیرآباد") {
      state.mapInstance.setView([35.73960263656618, 51.39147705788841], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.73960263656618,
        changeLongitude: 51.39147705788841,
      });
    } else if (state.boroughValue === "عباس آباد") {
      state.mapInstance.setView([35.73044142433577, 51.426386925033526], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.73044142433577,
        changeLongitude: 51.426386925033526,
      });
    } else if (state.boroughValue === "جلفا") {
      state.mapInstance.setView([35.74903476421705, 51.444034998255155], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.74903476421705,
        changeLongitude: 51.444034998255155,
      });
    } else if (state.boroughValue === "خواجه عبدالله") {
      state.mapInstance.setView([35.74459528421899, 51.456067427090936], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.74459528421899,
        changeLongitude: 51.456067427090936,
      });
    } else if (state.boroughValue === "بهارشیراز") {
      state.mapInstance.setView([35.717596260987946, 51.43371246941876], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.717596260987946,
        changeLongitude: 51.43371246941876,
      });
    } else if (state.boroughValue === "زرتشت") {
      state.mapInstance.setView([35.71680621863966, 51.40640272288971], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.71680621863966,
        changeLongitude: 51.40640272288971,
      });
    } else if (state.boroughValue === "بهجت آباد") {
      state.mapInstance.setView([35.722665678552, 51.413345772709064], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.722665678552,
        changeLongitude: 51.413345772709064,
      });
    } else if (state.boroughValue === "طالقانی") {
      state.mapInstance.setView([35.709841835614995, 51.43548998703338], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.709841835614995,
        changeLongitude: 51.43548998703338,
      });
    } else if (state.boroughValue === "تخت طاووس") {
      state.mapInstance.setView([35.724222391723494, 51.43929945592655], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.724222391723494,
        changeLongitude: 51.43929945592655,
      });
    } else if (state.boroughValue === "سهروردی") {
      state.mapInstance.setView([35.754410929159484, 51.35468544058348], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.754410929159484,
        changeLongitude: 51.35468544058348,
      });
    } else if (state.boroughValue === "آپادانا") {
      state.mapInstance.setView([35.74083570745646, 51.43367751954677], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.74083570745646,
        changeLongitude: 51.43367751954677,
      });
    } else if (state.boroughValue === "توحید") {
      state.mapInstance.setView([35.70641166572213, 51.37744288189888], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.70641166572213,
        changeLongitude: 51.37744288189888,
      });
    } else if (state.boroughValue === "جمهوری") {
      state.mapInstance.setView([35.69669323421329, 51.381806783630864], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.69669323421329,
        changeLongitude: 51.381806783630864,
      });
    } else if (state.boroughValue === "نادری") {
      state.mapInstance.setView([35.68592412837127, 51.36451450711847], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.68592412837127,
        changeLongitude: 51.36451450711847,
      });
    } else if (state.boroughValue === "استانبول") {
      state.mapInstance.setView([35.79486222702479, 51.42864218476385], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.79486222702479,
        changeLongitude: 51.42864218476385,
      });
    } else if (state.boroughValue === "توپ خانه") {
      state.mapInstance.setView([35.6862323508416, 51.41169828291027], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.6862323508416,
        changeLongitude: 51.41169828291027,
      });
    } else if (state.boroughValue === "لاله زار") {
      state.mapInstance.setView([35.69389040154717, 51.423052525238745], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.69389040154717,
        changeLongitude: 51.423052525238745,
      });
    } else if (state.boroughValue === "باغ صبا") {
      state.mapInstance.setView([35.72018888629789, 51.439503049960464], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.72018888629789,
        changeLongitude: 51.439503049960464,
      });
    } else if (state.boroughValue === "فاطمی") {
      state.mapInstance.setView([35.72017573787807, 51.4057013289416], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.72017573787807,
        changeLongitude: 51.4057013289416,
      });
    } else if (state.boroughValue === "آرژانتین") {
      state.mapInstance.setView([35.738244650952005, 51.41547808152428], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.738244650952005,
        changeLongitude: 51.41547808152428,
      });
    } else if (state.boroughValue === "آذربایجان") {
      state.mapInstance.setView([35.69186140303017, 51.397883710315774], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.69186140303017,
        changeLongitude: 51.397883710315774,
      });
    } else if (state.boroughValue === "شهریار") {
      state.mapInstance.setView([35.66755631543502, 51.03464404539037], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.66755631543502,
        changeLongitude: 51.03464404539037,
      });
    } else if (state.boroughValue === "اسلامشهر") {
      state.mapInstance.setView([35.552180675877025, 51.22955538587505], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.552180675877025,
        changeLongitude: 51.22955538587505,
      });
    } else if (state.boroughValue === "بهارستان") {
      state.mapInstance.setView([35.51625149459538, 51.15946599446249], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.51625149459538,
        changeLongitude: 51.15946599446249,
      });
    } else if (state.boroughValue === "ملارد") {
      state.mapInstance.setView([35.667253144882714, 50.97919369072885], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.667253144882714,
        changeLongitude: 50.97919369072885,
      });
    } else if (state.boroughValue === "پاکدشت") {
      state.mapInstance.setView([35.45896406596161, 51.76860116303449], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.45896406596161,
        changeLongitude: 51.76860116303449,
      });
    } else if (state.boroughValue === "ری") {
      state.mapInstance.setView([35.57698317573761, 51.46267572445274], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.57698317573761,
        changeLongitude: 51.46267572445274,
      });
    } else if (state.boroughValue === "قدس") {
      state.mapInstance.setView([35.7150971550743, 51.113940966363025], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.7150971550743,
        changeLongitude: 51.113940966363025,
      });
    } else if (state.boroughValue === "رباط کریم") {
      state.mapInstance.setView([35.47985134662505, 51.08741275050205], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.47985134662505,
        changeLongitude: 51.08741275050205,
      });
    } else if (state.boroughValue === "ورامین") {
      state.mapInstance.setView([35.34585279508827, 51.64612717582132], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.34585279508827,
        changeLongitude: 51.64612717582132,
      });
    } else if (state.boroughValue === "قرچک") {
      state.mapInstance.setView([35.43733175886955, 51.57154074761969], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.43733175886955,
        changeLongitude: 51.57154074761969,
      });
    } else if (state.boroughValue === "پردیس") {
      state.mapInstance.setView([35.74829561544567, 51.80269923021476], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.74829561544567,
        changeLongitude: 51.80269923021476,
      });
    } else if (state.boroughValue === "دماوند") {
      state.mapInstance.setView([35.71300324023036, 52.05716716518886], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.71300324023036,
        changeLongitude: 52.05716716518886,
      });
    } else if (state.boroughValue === "پیشوا") {
      state.mapInstance.setView([35.30794096889437, 51.72955505217579], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.30794096889437,
        changeLongitude: 51.72955505217579,
      });
    } else if (state.boroughValue === "شمیرانات") {
      state.mapInstance.setView([35.92095566112133, 51.63007041948113], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.92095566112133,
        changeLongitude: 51.63007041948113,
      });
    } else if (state.boroughValue === "فیروزکوه") {
      state.mapInstance.setView([35.75942497410444, 52.77560332938726], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 35.75942497410444,
        changeLongitude: 52.77560332938726,
      });
    }
  }, [state.boroughValue]);

  
  

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        dispatch({
          type: "catchLatitudeChange",
          latitudeChosen: marker.getLatLng().lat,
        });
        dispatch({
          type: "catchLongitudeChange",
          longitudeChosen: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

  useEffect(() => {
    if (state.uploadedPictures[0]) {
      dispatch({
        type: "catchPicture1Change",
        picture1Chosen: state.uploadedPictures[0],
      });
    }
  }, [state.uploadedPictures[0]]);

  useEffect(() => {
    if (state.uploadedPictures[1]) {
      dispatch({
        type: "catchPicture2Change",
        picture2Chosen: state.uploadedPictures[1],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2]) {
      dispatch({
        type: "catchPicture3Change",
        picture3Chosen: state.uploadedPictures[2],
      });
    }
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3]) {
      dispatch({
        type: "catchPicture4Change",
        picture4Chosen: state.uploadedPictures[3],
      });
    }
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4]) {
      dispatch({
        type: "catchPicture5Change",
        picture5Chosen: state.uploadedPictures[4],
      });
    }
  }, [state.uploadedPictures[4]]);

  function PriceDisplay() {
    if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Day"
    ) {
      return "قیمت روزانه*";
    } else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Week"
    ) {
      return "قیمت هفتگی*";
    } else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Month"
    ) {
      return "قیمت ماهانه*";
    } else {
      return "قیمت*";
    }
  }

  function SubmitButtonDisplay() {
    if (
      GlobalState.userIsLogged &&
      state.userProfile.agencyName !== null &&
      state.userProfile.agencyName !== "" &&
      state.userProfile.phoneNumber !== null &&
      state.userProfile.phoneNumber !== ""
    ) {
      return (
        <Button
          variant="contained"
          fullWidth
          type="submit"
          className={classes.registerBtn}
          disabled={state.disabledBtn}
        >
          اضافه کردن
        </Button>
      );
    } else if (
      GlobalState.userIsLogged &&
      (state.userProfile.agencyName === null ||
        state.userProfile.agencyName === "" ||
        state.userProfile.phoneNumber === null ||
        state.userProfile.phoneNumber === "")
    ) {
      return (
        <Button
          variant="outlined"
          onClick={() => navigate("/profile")}
          fullWidth
          className={classes.registerBtn}
        >
          اول پروفایل خود را کامل کنید
        </Button>
      );
    } else if (!GlobalState.userIsLogged) {
      return (
        <Button
          variant="outlined"
          fullWidth
          className={classes.registerBtn}
          onClick={() => navigate("/login")}
        >
          ورود به اکانت برای اضافه کردن ملک
        </Button>
      );
    }
  }

  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/profiles/${GlobalState.userId}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
      } catch (e) {
        console.log(e.response);
        dispatch({ type: "allowTheButton" });
      }
    }
    GetProfileInfo();
  }, []);

  function FormSubmit(e) {
    e.preventDefault();
    console.log("submitted");
    if (
      !state.titleErrors.hasErrors &&
      !state.listingTypeErrors.hasErrors &&
      !state.propertyStatusErrors.hasErrors &&
      !state.priceErrors.hasErrors &&
      !state.areaErrors.hasErrors &&
      !state.boroughErrors.hasErrors &&
      state.latitudeValue &&
      state.longitudeValue
    ) {
      dispatch({ type: "changeSendRequest" });
      dispatch({ type: "disableTheButton" });
    } else if (state.titleValue === "") {
      dispatch({ type: "emptyTitle" });
      window.scrollTo(0, 0);
    } else if (state.listingTypeValue === "") {
      dispatch({ type: "emptyListingType" });
      window.scrollTo(0, 0);
    } else if (state.propertyStatusValue === "") {
      dispatch({ type: "emptyPropertyStatus" });
      window.scrollTo(0, 0);
    } else if (state.priceValue === "") {
      dispatch({ type: "emptyPrice" });
      window.scrollTo(0, 0);
    } else if (state.areaValue === "") {
      dispatch({ type: "emptyArea" });
      window.scrollTo(0, 0);
    } else if (state.boroughValue === "") {
      dispatch({ type: "emptyBorough" });
      window.scrollTo(0, 0);
    }
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function AddProperty() {
        const formData = new FormData();
        formData.append("title", state.titleValue);
        formData.append("description", state.descriptionValue);
        formData.append("area", state.areaValue);
        formData.append("borough", state.boroughValue);
        formData.append("rental_frequency", state.rentalFrequencyValue);
        formData.append("listing_type", state.listingTypeValue);
        formData.append("property_status", state.propertyStatusValue);
        formData.append("price", state.priceValue);
        formData.append("rooms", state.roomsValue);
        formData.append("furnished", state.furnishedValue);
        formData.append("pool", state.poolValue);
        formData.append("elevator", state.elevatorValue);
        formData.append("cctv", state.cctvValue);
        formData.append("parking", state.parkingValue);
        formData.append("latitude", state.latitudeValue);
        formData.append("longitude", state.longitudeValue);
        formData.append("picture1", state.picture1Value);
        formData.append("picture2", state.picture2Value);
        formData.append("picture3", state.picture3Value);
        formData.append("picture4", state.picture4Value);
        formData.append("picture5", state.picture5Value);
        formData.append("seller", GlobalState.userId);
        try {
          const response = await Axios.post(
            "http://127.0.0.1:8000/api/listings/create/",
            formData
          );
          console.log(response.data);
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          console.log(e.response);
        }
      }
      AddProperty();
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    }
  }, [state.openSnack]);

  return (
    <div  className={classes.fullPage}>
      <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
          <Grid item container justifyContent="center">
            <Typography variant="h4">ملک خود را اضافه کنید</Typography>
          </Grid>
          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="title"
              inputProps={{ style: { textAlign: "right" } }}
              label="نام*"
              variant="standard"
              fullWidth
              value={state.titleValue}
              onChange={(e) =>
                dispatch({
                  type: "catchTitleChange",
                  titleChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchTitleErrors",
                  titleChosen: e.target.value,
                })
              }
              error={state.titleErrors.hasErrors ? true : false}
              helperText={state.titleErrors.errorMessage}
            />
          </Grid>
          <Grid item container justifyContent="space-between">
            <Grid item xs={5} style={{ marginTop: "1rem" }}>
              <TextField
                id="listingType"
                label="نوع ملک*"
                variant="standard"
                fullWidth
                value={state.listingTypeValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchListingTypeChange",
                    listingTypeChosen: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatch({
                    type: "catchListingTypeErrors",
                    listingTypeChosen: e.target.value,
                  })
                }
                SelectProps={{
                  native: true,
                }}
                select
                error={state.listingTypeErrors.hasErrors ? true : false}
                helperText={state.listingTypeErrors.errorMessage}
              >
                {listingTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={5} style={{ marginTop: "1rem" }}>
              <TextField
                id="propertyStatus"
                label="وضعیت ملک*"
                variant="standard"
                fullWidth
                value={state.propertyStatusValue}
                SelectProps={{
                  native: true,
                }}
                select
                onChange={(e) =>
                  dispatch({
                    type: "catchPropertyStatusChange",
                    propertyStatusChosen: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatch({
                    type: "catchPropertyStatusErrors",
                    propertyStatusChosen: e.target.value,
                  })
                }
                error={state.propertyStatusErrors.hasErrors ? true : false}
                helperText={state.propertyStatusErrors.errorMessage}
              >
                {propertyStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid item container justifyContent="space-between">
            <Grid item xs={5} style={{ marginTop: "1rem" }}>
              <TextField
                disabled={state.propertyStatusValue === "Sale" ? true : false}
                id="rentalFrequency"
                label="مدت اجاره"
                variant="standard"
                fullWidth
                SelectProps={{
                  native: true,
                }}
                select
                value={state.rentalFrequencyValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchRentalFrequencyChange",
                    rentalFrequencyChosen: e.target.value,
                  })
                }
              >
                {rentalFrequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={5} style={{ marginTop: "1rem" }}>
              <TextField
                inputProps={{ style: { textAlign: "left" } }}
                id="price"
                type="number"
                label={PriceDisplay()}
                variant="standard"
                fullWidth
                value={state.priceValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPriceChange",
                    priceChosen: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatch({
                    type: "catchPriceErrors",
                    priceChosen: e.target.value,
                  })
                }
                error={state.priceErrors.hasErrors ? true : false}
                helperText={state.priceErrors.errorMessage}
              />
            </Grid>
          </Grid>

          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="description"
              label="توضیحات"
              variant="outlined"
              multiline
              rows={6}
              fullWidth
              value={state.descriptionValue}
              onChange={(e) =>
                dispatch({
                  type: "catchDescriptionChange",
                  descriptionChosen: e.target.value,
                })
              }
            />
          </Grid>
          {state.listingTypeValue === "Office" ? (
            ""
          ) : (
            <Grid item xs={3} container style={{ marginTop: "1rem" }}>
              <TextField
                id="rooms"
                label="تعداد اتاق‌ها"
                type="number"
                variant="standard"
                fullWidth
                value={state.roomsValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchRoomsChange",
                    roomsChosen: e.target.value,
                  })
                }
              />
            </Grid>
          )}
          <Grid item container justifyContent="space-between">
            <Grid item xs={2} style={{ marginTop: "1rem" }}>
              <FormControlLabel
                control={<Checkbox checked={state.furnishedValue} />}
                onChange={(e) =>
                  dispatch({
                    type: "catchFurnishedChange",
                    furnishedChosen: e.target.checked,
                  })
                }
                label="وسایل کامل"
              />
            </Grid>
            <Grid item xs={2} style={{ marginTop: "1rem" }}>
              <FormControlLabel
                control={<Checkbox checked={state.poolValue} />}
                onChange={(e) =>
                  dispatch({
                    type: "catchPoolChange",
                    poolChosen: e.target.checked,
                  })
                }
                label="استخر"
              />
            </Grid>
            <Grid item xs={2} style={{ marginTop: "1rem" }}>
              <FormControlLabel
                control={<Checkbox checked={state.elevatorValue} />}
                onChange={(e) =>
                  dispatch({
                    type: "catchElevatorChange",
                    elevatorChosen: e.target.checked,
                  })
                }
                label="آسانسور"
              />
            </Grid>
            <Grid item xs={2} style={{ marginTop: "1rem" }}>
              <FormControlLabel
                control={<Checkbox checked={state.cctvValue} />}
                onChange={(e) =>
                  dispatch({
                    type: "catchCctvChange",
                    cctvChosen: e.target.checked,
                  })
                }
                label="دوربین مداربسته"
              />
            </Grid>
            <Grid item xs={2} style={{ marginTop: "1rem" }}>
              <FormControlLabel
                control={<Checkbox checked={state.parkingValue} />}
                onChange={(e) =>
                  dispatch({
                    type: "catchParkingChange",
                    parkingChosen: e.target.checked,
                  })
                }
                label="پارکنیگ"
              />
            </Grid>
          </Grid>

          <Grid item container justifyContent="space-between">
            <Grid item xs={5} style={{ marginTop: "1rem" }}>
              <TextField
                id="area"
                label="منطقه*"
                variant="standard"
                fullWidth
                value={state.areaValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchAreaChange",
                    areaChosen: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatch({
                    type: "catchAreaErrors",
                    areaChosen: e.target.value,
                  })
                }
                SelectProps={{
                  native: true,
                }}
                select
                error={state.areaErrors.hasErrors ? true : false}
                helperText={state.areaErrors.errorMessage}
              >
                {areaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={5} style={{ marginTop: "1rem" }}>
              <TextField
                id="borough"
                label="محله*"
                variant="standard"
                fullWidth
                value={state.boroughValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchBoroughChange",
                    boroughChosen: e.target.value,
                  })
                }
                onBlur={(e) =>
                  dispatch({
                    type: "catchBoroughErrors",
                    boroughChosen: e.target.value,
                  })
                }
                error={state.boroughErrors.hasErrors ? true : false}
                helperText={state.boroughErrors.errorMessage}
                SelectProps={{
                  native: true,
                }}
                select
              >
                {state.areaValue === "Inner Tehran"
                  ? innerTehranOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  : ""}
                {state.areaValue === "Outer Tehran"
                  ? outerTehranOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  : ""}
              </TextField>
            </Grid>
          </Grid>
          <Grid item style={{ marginTop: "30px" }}>
            {state.latitudeValue && state.longitudeValue ? (
              <Alert severity="success">
                ملک شما در مختصات مکانی {state.latitudeValue} ,{" "}
                {state.longitudeValue} قرار دارد.
              </Alert>
            ) : (
              <Alert severity="warning">
                لطفا مختصات مکانی ملک خود را مشخص کنید!
              </Alert>
            )}
          </Grid>
          <Grid item container style={{ height: "35rem", marginTop: "30px" }}>
            <MapContainer
              center={[35.71928029807354, 51.373214994509354]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <TheMapComponent />
              
              <Marker
                draggable
                eventHandlers={eventHandlers}
                position={state.markerPosition}
                ref={markerRef}
              ></Marker>
            </MapContainer>
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
              بارگذاری عکس (حداکثر ۵)
              <input
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                hidden
                onChange={(e) =>
                  dispatch({
                    type: "catchUploadedPictures",
                    picturesChosen: e.target.files,
                  })
                }
              />
            </Button>
          </Grid>
          <Grid item container>
            <ul>
              {state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
              {state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
              {state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
              {state.picture4Value ? <li>{state.picture4Value.name}</li> : ""}
              {state.picture5Value ? <li>{state.picture5Value.name}</li> : ""}
            </ul>
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
            {SubmitButtonDisplay()}
          </Grid>
        </form>
        <Snackbar
          open={state.openSnack}
          message="ملک شما با موفقیت اضافه شد!"
          anchorOrigin={{
            vertical: "buttom",
            horizontal: "center",
          }}
        />
      </div>
    </div>
  );
}

export default AddProperty;
