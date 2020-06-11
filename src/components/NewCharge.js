//Package Imports
import React, { Component } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { withRouter } from "react-router-dom";
import { Tabs, Tab } from "react-tab-view";
import ReactTooltip from "react-tooltip";
import Swal from "sweetalert2";
import { MDBDataTable, MDBBtn } from "mdbreact";
import $ from "jquery";
import axios from "axios";
import { isNull, isNullOrUndefined } from "util";
import { totalmem } from "os";
import Dropdown from "react-dropdown";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { TimePicker } from "@material-ui/pickers";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import moment from "moment";
import Timer from "@material-ui/icons/Timer";
import backIcon from "../images/icons/back-icon.png";
import frontIcon from "../images/icons/front-icon.png";

//Component Imports
import Input from "./Input";
import GPopup from "./GPopup";
import SearchHeading from "./SearchHeading";
import EditCharge from "./EditCharge";
import NewHistoryPractice from "./NewHistoryPractice";
import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import NewPOS from "./NewPOS";
import NewRefferingProvider from "./NewRefferingProvider";
import NewICD from "./NewICD";
import NewInsurancePlan from "./NewInsurancePlan";
import NewCPT from "./NewCPT";
import NewModifier from "./NewModifier";
import BatchDocumentPopup from "./BatchDocumentPopup";
import PagePDF from "./PagePDF";
//Icon Imports
import Label from "./Label";
import dob_icon from "../images/dob-icon.png";
import samll_doc_icon from "../images/dob-small-icon.png";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";
import plusIconImage from "../images/plus-ico.png";
import arrowBlue from "../images/select-arrow-blue1.svg";
import plusSrc from "../images/plus-icon.png";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import Hotkeys from "react-hot-keys";

//New Charge Class
export class NewCharge extends Component {
  constructor(props) {
    super(props);

    //Api URL's
    this.errorField = "errorField";
    this.visitUrl = process.env.REACT_APP_URL + "/visit/";
    this.patientPlanUrl = process.env.REACT_APP_URL + "/patientPlan/";
    this.patientUrl = process.env.REACT_APP_URL + "/Patient/";
    this.chargeUrl = process.env.REACT_APP_URL + "/charge/";
    this.Notesurl = process.env.REACT_APP_URL + "/Notes/";
    this.patientPaymentURL = process.env.REACT_APP_URL + "/PatientPayment/";
    this.authURL = process.env.REACT_APP_URL + "/PatientAuthorization/";
    this.batchURL = process.env.REACT_APP_URL + "/BatchDocument/";
    this.patientInfoUrl = process.env.REACT_APP_URL + "/patientappointment/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.copay = 0;
    this.primaryPlanBalance = 0;
    this.primaryPatientBalance = 0;
    let popupVisitId = this.props.popupVisitId;
    this.saveVisitCount = 0;
    this.currentIndex = 0;
    this.advancePatientPayment = 0;
    this.visitSubmitted = false;
    this.advancePatientPayment = 0;

    //Charge Validation Model
    this.chargeValidationModel = {
      dosFromValField: "",
      dosToValField: "",
      cptCodeValField: "",
      pointer1ValField: "",
      unitsValField: "",
      amountValField: "",
      validation: false,
    };

    //Validation Model
    this.validationModel = {
      posValField: "",
      descriptionValField: "",
      patientValField: "",
      practiceValField: "",
      locationValField: "",
      posValField: "",
      providerValField: "",
      cliaNumberValField: "",

      icd1ValField: "",
      icd2ValField: "",
      icd3ValField: "",
      icd4ValField: "",
      icd5ValField: "",
      icd6ValField: "",
      icd7ValField: "",
      icd8ValField: "",
      icd9ValField: "",
      icd10ValField: "",
      icd11ValField: "",
      icd12ValField: "",

      lastSeenDateFDValField: "",
      unableToWorkFromDateFDValField: "",
      unableToWorkFromDateValField: "",
      unableToWorkToDateValFDField: null,
      unableToWorkToDateValField: null,
      dischargeDateValField: "",
      dischargeDateFDValField: "",
      onsetDateOfIllnessValField: null,
      onSetDateOfSimiliarIllnessValField: "",
      firstDateOfSimiliarIllnessValField: null,
      initialTreatementDateValField: null,
      dateOfPregnancyValField: null,
      admissionDateValField: null,
      laxtXRayValField: null,
      accidentDateValField: null,
      batchDocumentIDValField: "",
      responsepagesValField: "",
      pageNumberValField: "",
    };

    //Charge Model
    this.chargeModel = {
      id: 0,
      visitID: 0,
      clientID: this.props.userInfo1.clientID,

      // practiceID: "",
      // locationID: "",
      // posid: "",
      // providerID: "",
      // patientID: "",
      // primaryPatientPlanID: null,
      primaryBilledAmount: "",
      totalAmount: 0.0,
      isSubmitted: false,

      dateOfServiceFrom: "",
      dateOfServiceTo: "",

      cptid: null,
      cptObj: {},

      modifier1ID: null,
      modifier2ID: null,
      modifier3ID: null,
      modifier4ID: null,

      modifier1Obj: {},
      modifier2Obj: {},
      modifier3Obj: {},
      modifier4Obj: {},

      pointer1: "",
      pointer2: "",
      pointer3: "",
      pointer4: "",

      units: null,
      unitsEntered: false,
      unitOfMeasurement: null,
      totalAmount: "",
      perUnitAmount: 0,

      isDontPrint: false,
      category: null,
      startDate: "",
      endDate: "",

      validationModel: { ...this.validationModel },
      dosFromValField: "",
      dosFromFDValField: "",
      dosToValField: "",
      dosToFDValField: "",
      cptCodeValField: "",
      modifierValField: "",
      pointer1ValField: "",
      unitsValField: "",
      posValField: "",
      amountValField: "",
      timeValField: "",
      startTime: null,
      endTime: null,
      startTimeValdation: false,
      endTimeValidation: false,
      cptUnits: 0,
      modifier1AnsUnits: 0,
      modifier2AnsUnits: 0,
      modifier3AnsUnits: 0,
      modifier4AnsUnits: 0,
      modifier1Amount: 0,
      modifier2Amount: 0,
      modifier3Amount: 0,
      modifier4Amount: 0,
      timeUnits: 0,
      baseUnits: 0,
      modifierUnits: 0,
      timeUnits: 0,
      authorizationNum: "",
      validation: false,
    };

    //Visit Model
    this.visitModel = {
      id: 0,
      patientID: "",
      patient: "",
      batchDocumentID: null,
      batchNumber: "",
      pageNumber: "",
      clientID: this.props.userInfo1.clientID,

      primaryPatientPlanID: null,
      secondaryPatientPlanID: null,
      tertiaryPatientPlanID: null,

      //Promary Plan Fields
      primaryBilledAmount: "",
      primaryAllowed: "",
      primaryWriteOff: "",
      primaryPaid: "",
      primaryPatientBal: "",
      primaryBal: "",
      primaryTransferred: "",
      primaryStatus: "",

      //Secondary Plan Fields
      secondaryBilledAmount: "",
      secondaryAllowed: "",
      secondaryWriteOff: "",
      secondaryPaid: "",
      secondaryPatResp: "",
      secondaryBal: "",
      secondaryTransferred: "",
      secondaryStatus: "",

      movedToAdvancePayment: 0,

      // primaryBilledAmount: "",
      // primaryPlanAmount: "",
      // primaryPlanAllowed: "",
      // primaryPlanPaid: "",
      // primaryWriteOff: "",

      practiceID: this.props.userInfo1.practiceID,
      locationID: null,
      posid: null,
      providerID: null,
      refProviderID: null,
      supervisingProvID: null,
      attendingProviderID: null,
      prescribingMD: null,

      icD1ID: null,
      icD2ID: null,
      icD3ID: null,
      icD4ID: null,
      icD5ID: null,
      icD6ID: null,
      icD7ID: null,
      icD8ID: null,
      icD9ID: null,
      icD10ID: null,
      icD11ID: null,
      icD12ID: null,

      icd1Obj: {},
      icd2Obj: {},
      icd3Obj: {},
      icd4Obj: {},
      icd5Obj: {},
      icd6Obj: {},
      icd7Obj: {},
      icd8Obj: {},
      icd9Obj: {},
      icd10Obj: {},
      icd11Obj: {},
      icd12Obj: {},

      totalAmount: "",
      coPay: "",

      isSubmitted: false,
      submittedDate: "",
      submissionLogID: null,
      rejectionReason: "",

      isForcePaper: false,
      isDontPrint: false,

      authorizationNum: "",
      lastSeenDate: "",
      outsideReferral: false,
      referralNum: "",
      onsetDateOfIllness: "",
      firstDateOfSimiliarIllness: "",
      illnessTreatmentDate: "",
      dateOfPregnancy: "",
      admissionDate: "",
      dischargeDate: "",
      lastXrayDate: "",
      lastXrayType: "",
      unableToWorkFromDate: "",
      unableToWorkToDate: "",

      accidentDate: "",
      accidentType: "",
      accidentState: "",
      cliaNumber: "",
      outsideLab: false,
      labCharges: "",

      payerClaimControlNum: "",
      claimNotes: "",
      claimFrequencyCode: "1",
      serviceAuthExcpCode: "",
      emergency: false,
      epsdt: false,
      familyPlan: false,
      externalInvoiceNumber: null,
      holdStatement: false,

      charges: [],
      patientPayments: [],

      note: [],
      //isActive: true
    };

    //Notes Model-------Charges
    this.notesModel = {
      id: 0,
      patientID: null,
      notesDate: null,
      note: null,
      noteValField: "",
      validation: false,
      addedBy: null,
      addedDate: null,
      updatedBy: null,
      updatedDate: null,
    };

    //Patient Payment Model
    this.patientPaymentModel = {
      id: 0,
      visitID: null,
      patientID: null,
      addedDate: moment(Date.now()).format().slice(0, 10),
      paymentDate: null,
      type: null,
      status: "N",
      paymentMethod: null,
      checkNumber: null,
      paymentAmount: null,
      remainingAmount: null,

      //validations
      dateValField: "",
      paymentDateFDValField: "",
      typeValField: "",
      methodValField: "",
      amountValField: "",
    };

    //State Object
    this.state = {
      chargeModel: { ...this.chargeModel },
      visitModel: this.visitModel,
      validationModel: { ...this.validationModel },
      patientPaymentModel: this.patientPaymentModel,
      patientPayments: [],
      chargeValidationModel: [],
      patientDropDown: [],
      patientPlanDropdown: [],
      chargeModelArray: [],
      practice: [],
      location: [],
      provider: [],
      refProvider: [],
      supProvider: [],
      pos: [],
      patientObj: {},
      editId: popupVisitId > 0 ? this.props.popupVisitId : this.props.id,
      popupPatientId: 0,
      maxHeight: "361",
      activeItem: "1",
      diagnosisRow: false,
      cptRows: [],
      dob: "",
      gender: "",
      primaryPlanName: "",
      secondaryPlanName: "",
      tertiaryPlanName: "",
      primarySubscriberID: "",
      secondarySubscriberID: "",
      showPopup: false,
      chargeId: 0,
      icd1: "",
      ide2: "",
      icd3: "",
      icd4: "",
      modifierOptions: [],
      options: [],
      cptOptions: [],
      popupName: "",
      id: 0,
      items: [],
      icdArr: [],
      selectedDate: new Date("2014-08-18T21:11:54"),
      loading: false,
      isAns: false,
      visitSubmitted: false,
      batchdocumentID: "",

      showRPopup: false,
      showPPopup: false,
      showLPopup: false,
      showPOSPopup: false,

      showICDPopup: false,
      batchDocumentID: null,
      pageNumber: "",
      patientName: "",
      currentFocus: -1,
      searchSelected: false,
      fileURL: "",
    };

    //Funxtion Bindings
    this.handleOutsideRefCheck = this.handleOutsideRefCheck.bind(this);
    this.saveCharge = this.saveCharge.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addDiagnosisRow = this.addDiagnosisRow.bind(this);
    this.addCPTRow = this.addCPTRow.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleOutsideLabCheck = this.handleOutsideLabCheck.bind(this);
    this.handleEmergencyCheck = this.handleEmergencyCheck.bind(this);
    this.handleEPSDTCheck = this.handleEPSDTCheck.bind(this);
    this.handleFamilyPlanCheck = this.handleFamilyPlanCheck.bind(this);
    this.handleChargeChange = this.handleChargeChange.bind(this);
    this.handlePatientDropDownChange = this.handlePatientDropDownChange.bind(
      this
    );
    this.isDontPrintCB = this.isDontPrintCB.bind(this);
    this.getPatientID = this.getPatientID.bind(this);
    this.setPatientetails = this.setPatientetails.bind(this);
    this.deleteCPTRow = this.deleteCPTRow.bind(this);
    this.deleteVisit = this.deleteVisit.bind(this);
    this.resubmitVisit = this.resubmitVisit.bind(this);
    this.handleModifierChange = this.handleModifierChange.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);

    this.openBatchDoc = this.openBatchDoc.bind(this);
    this.closeBatchDoc = this.closeBatchDoc.bind(this);

    this.openPage = this.openPage.bind(this);
    this.closePage = this.closePage.bind(this);

    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCPTAmountChange = this.handleCPTAmountChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.calculateChargesTotalAmount = this.calculateChargesTotalAmount.bind(
      this
    );
    this.addNewVisit = this.addNewVisit.bind(this);
    this.newPatientPopup = this.newPatientPopup.bind(this);
    this.openRefProviderPopup = this.openRefProviderPopup.bind(this);
    this.closeRefProviderPopup = this.closeRefProviderPopup.bind(this);
    this.openProviderPopup = this.openProviderPopup.bind(this);
    this.closeProviderPopup = this.closeProviderPopup.bind(this);
    this.openLocationPopup = this.openLocationPopup.bind(this);
    this.closeLocationPopup = this.closeLocationPopup.bind(this);
    this.openICDPopup = this.openICDPopup.bind(this);
    this.closeICDPopup = this.closeICDPopup.bind(this);
    this.addRowNotes = this.addRowNotes.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.nextVisit = this.nextVisit.bind(this);
    this.previousVisit = this.previousVisit.bind(this);
    this.addPaymentRow = this.addPaymentRow.bind(this);
    this.handleBatchChange = this.handleBatchChange.bind(this);
    this.handleBatchCheck = this.handleBatchCheck.bind(this);
    this.openBPopup = this.openBPopup.bind(this);
    this.closeBPopup = this.closeBPopup.bind(this);
  }

  onKeyUp(keyName, e, handle) {
    if (e) {
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+m") {
      // alert("Dia key")
      this.addDiagnosisRow();
    } else if (keyName == "alt+c") {
      // alert("Cpt Row key")
      this.addCPTRow();
    } else if (keyName == "alt+p") {
      //  / alert("payment key")
      this.addPaymentRow();
    } else if (keyName == "alt+x") {
    } else if (keyName == "alt+n") {
      // alert("New Visit key")
      this.addNewVisit();
    } else if (keyName == "alt+s") {
      // alert("save key")
      this.saveCharge();
    } else if (keyName == "alt+r") {
      // alert("Resubmit key")
      this.resubmitVisit();
    } else if (keyName == "alt+t") {
      // alert("Delate Visit key")
      this.deleteVisit();
    } else if (keyName == "alt+x") {
      if (this.state.popupVisitId > 0) {
        this.props.onClose();
      } else this.closeNewCharge.bind(this);
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  //Component Did Mount

  componentDidMount() {
    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });
  }

  //Component Will Mount
  async UNSAFE_componentWillMount() {
    window.scrollTo(0, 0);
    await this.setState({
      popupVisitId: this.props.popupVisitId,
      loading: true,
    });

    // if (this.state.visitModel.id > 0) {
    //   this.setState({ loading: false });
    // }

    try {
      if (this.props.popupVisitId) {
      } else {
        // try {
        //   await axios
        //     .get(this.visitUrl + "GetProfiles", this.config)
        //     .then((response) => {
        //       this.setState({
        //         supProvider: response.data.refProvider,
        //         patientDropDown: response.data.patientInfo,
        //       });
        //     })
        //     .catch((error) => {});
        // } catch {}
      }

      if (this.state.editId > 0 || this.state.visitModel.id > 0) {
        var visitId = 0;
        if (this.state.visitModel.id > 0) {
          visitId = this.state.visitModel.id;
        } else {
          visitId = this.state.editId;
        }

        var newVisitmodel;
        await axios
          .get(this.visitUrl + "FindVisit/" + visitId, this.config)
          .then(async (response) => {
            this.copay = response.data.copay ? response.data.copay : 0;
            this.primaryPlanBalance = response.data.primaryBal
              ? response.data.primaryBal
              : 0;
            this.primaryPatientBalance = response.data.primaryPatientBal
              ? response.data.primaryPatientBal
              : 0;

            let patientDropDown = this.state.patientDropDown;
            try {
              await axios
                .get(
                  this.patientUrl +
                    "FindPatientOnly/" +
                    response.data.patientID,
                  this.config
                )
                .then((response) => {
                  let patient = response.data[0];
                  patient.patientID = patient.id;
                  patient.label =
                    (patient.lastName ? patient.lastName : "") +
                    (patient.firstName ? "," + patient.firstName : "");
                  patientDropDown = patientDropDown.concat(patient);
                  this.setState({
                    patientDropDown: this.state.patientDropDown.concat(patient),
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } catch {}
            var patientInfo = await patientDropDown.filter(
              (patient) => patient.patientID == response.data.patientID
            );
            patientInfo = patientInfo.length > 0 ? patientInfo[0] : {};
            console.log("Patient Info : ", patientInfo);

            newVisitmodel = response.data;

            if (newVisitmodel.note === null) {
              newVisitmodel.note = [];
            }

            this.setState({
              dob: patientInfo ? patientInfo.dob : null,
              gender: patientInfo
                ? patientInfo.gender === "M"
                  ? "Male"
                  : patientInfo.gender === "F"
                  ? "Female"
                  : ""
                : "",
              patientObj: patientInfo ? patientInfo : null,
              visitSubmitted: newVisitmodel.isSubmitted === true ? true : false,
            });

            await axios
              .get(
                this.patientPlanUrl +
                  "GetActivePatientPlansByPatientID/" +
                  response.data.patientID,
                this.config
              )
              .then(async (res) => {
                let primaryPatientPlan = await res.data.filter(
                  (patientPlan) => patientPlan.description === "P"
                );
                let secondaryPatientPlan = await res.data.filter(
                  (patientPlan) => patientPlan.description === "S"
                );
                this.setState({
                  patientPlanDropdown: res.data,
                  primaryPlanName:
                    primaryPatientPlan.length > 0
                      ? "Primary - " + primaryPatientPlan[0].description2
                      : "",
                  primarySubscriberID:
                    primaryPatientPlan.length > 0
                      ? primaryPatientPlan[0].subscriberID
                      : "",
                  secondaryPlanName:
                    secondaryPatientPlan.length > 0
                      ? "Secondary - " + secondaryPatientPlan[0].description2
                      : "",
                  secondarySubscriberID:
                    secondaryPatientPlan.length > 0
                      ? secondaryPatientPlan[0].subscriberID
                      : "",
                });
              });

            newVisitmodel.icd1Obj = this.filterICDObject(response.data.icD1ID);
            newVisitmodel.icd2Obj = this.filterICDObject(response.data.icD2ID);
            newVisitmodel.icd3Obj = this.filterICDObject(response.data.icD3ID);
            newVisitmodel.icd4Obj = this.filterICDObject(response.data.icD4ID);
            newVisitmodel.icd5Obj = this.filterICDObject(response.data.icD5ID);
            newVisitmodel.icd6Obj = this.filterICDObject(response.data.icD6ID);
            newVisitmodel.icd7Obj = this.filterICDObject(response.data.icD7ID);
            newVisitmodel.icd8Obj = this.filterICDObject(response.data.icD8ID);
            newVisitmodel.icd9Obj = this.filterICDObject(response.data.icD9ID);
            newVisitmodel.icd10Obj = this.filterICDObject(
              response.data.icD10ID
            );
            newVisitmodel.icd11Obj = this.filterICDObject(
              response.data.icD11ID
            );
            newVisitmodel.icd12Obj = this.filterICDObject(
              response.data.icD12ID
            );

            var ICdArr = [...this.state.icdArr];
            response.data.icD1ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD1ID))
              : ICdArr.concat(0);
            response.data.icD2ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD2ID))
              : ICdArr.concat(0);
            response.data.icD3ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD3ID))
              : ICdArr.concat(0);
            response.data.icD4ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD4ID))
              : ICdArr.concat(0);
            response.data.icD5ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD5ID))
              : ICdArr.concat(0);
            response.data.icD6ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD6ID))
              : ICdArr.concat(0);
            response.data.icD7ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD7ID))
              : ICdArr.concat(0);
            response.data.icD8ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD8ID))
              : ICdArr.concat(0);
            response.data.icD9ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD9ID))
              : ICdArr.concat(0);
            response.data.icD10ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD10ID))
              : ICdArr.concat(0);
            response.data.icD11ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD11ID))
              : ICdArr.concat(0);
            response.data.icD12ID != null
              ? (ICdArr = ICdArr.concat(response.data.icD12ID))
              : ICdArr.concat(0);

            // this.setState({ icdArr: ICdArr });

            newVisitmodel.charges.map((charge, index) => {
              var cpt = [];
              cpt = this.props.cptCodes.filter(
                (option) => option.id == charge.cptid
              );
              var modifier1 = {};
              modifier1 = this.props.modifiers.filter(
                (option) => option.id == charge.modifier1ID
              );
              var modifier2 = {};
              modifier2 = this.props.modifiers.filter(
                (option) => option.id == charge.modifier2ID
              );
              var modifier3 = {};
              modifier3 = this.props.modifiers.filter(
                (option) => option.id == charge.modifier3ID
              );
              var modifier4 = {};
              modifier4 = this.props.modifiers.filter(
                (option) => option.id == charge.modifier4ID
              );

              charge.dateOfServiceFrom = charge.dateOfServiceTo
                ? charge.dateOfServiceFrom.slice(0, 10)
                : "";
              charge.dateOfServiceTo = charge.dateOfServiceTo
                ? charge.dateOfServiceTo.slice(0, 10)
                : "";

              if (cpt.length > 0) {
                charge.cptObj = cpt.length > 0 ? cpt[0] : {};
                charge.perUnitAmount = cpt[0].description2;
                charge.cptUnits = cpt[0].description1;
                charge.anesthesiaUnits = cpt[0].anesthesiaUnits;
                charge.category = cpt[0].category;
              }
              charge.modifier1Obj = modifier1.length > 0 ? modifier1[0] : null;
              charge.modifier1AnsUnits =
                modifier1.length > 0 ? modifier1[0].anesthesiaUnits : null;
              charge.modifier1Amount =
                modifier1.length > 0 ? modifier1[0].description2 : null;

              charge.modifier2Obj = modifier2.length > 0 ? modifier2[0] : 0;
              charge.modifier2AnsUnits =
                modifier2.length > 0 ? modifier2[0].anesthesiaUnits : null;
              charge.modifier2Amount =
                modifier2.length > 0 ? modifier2[0].description2 : null;

              charge.modifier3Obj = modifier3.length > 0 ? modifier3[0] : null;
              charge.modifier3AnsUnits =
                modifier3.length > 0 ? modifier3[0].anesthesiaUnits : null;
              charge.modifier3Amount =
                modifier3.length > 0 ? modifier3[0].description2 : null;

              charge.modifier4Obj = modifier4.length > 0 ? modifier4[0] : null;
              charge.modifier4AnsUnits =
                modifier4.length > 0 ? modifier4[0].anesthesiaUnits : null;
              charge.modifier4Amount =
                modifier4 > 0 ? modifier4[0].description2 : null;

              newVisitmodel.charges = [
                ...newVisitmodel.charges.slice(0, index),
                Object.assign({}, newVisitmodel.charges[index], charge),
                ...newVisitmodel.charges.slice(index + 1),
              ];
            });

            this.setState({
              loading: false,
              visitModel: newVisitmodel,
              icdArr: ICdArr,
            });

            //Get Advance Payment
            axios
              .get(
                this.patientPaymentURL +
                  "GetAdvancePayment/" +
                  newVisitmodel.patientID,
                this.config
              )
              .then((res) => {
                this.advancePatientPayment =
                  res.data.length > 0 ? res.data[0].paymentAmount : -1;
              })
              .catch((error) => console.log(error));
          })
          .catch((error) => {
            this.setState({ loading: false });
            console.log(error);
          });
      } else {
        if (this.props.patientInfo) {
          if (this.props.patientInfo.ID > 0) {
            //Get Patient Info
            let patientDropDown = this.state.patientDropDown;
            try {
              await axios
                .get(
                  this.patientUrl +
                    "FindPatientOnly/" +
                    this.props.patientInfo.ID,
                  this.config
                )
                .then((response) => {
                  let patient = response.data[0];
                  patient.patientID = patient.id;
                  patient.label =
                    (patient.lastName ? patient.lastName : "") +
                    (patient.firstName ? "," + patient.firstName : "");
                  patientDropDown = patientDropDown.concat(patient);
                  this.setState({
                    patientDropDown: this.state.patientDropDown.concat(patient),
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } catch {}
            var patientInfo = await patientDropDown.filter(
              (patient) => patient.patientID == this.props.patientInfo.ID
            );
            // patientInfo = patientInfo.length > 0 ? patientInfo[0] : {};

            if (patientInfo.length > 0) {
              var gender = "";
              if (patientInfo[0].gender == "M") {
                gender = "Male";
              } else if (patientInfo[0].gender == "F") {
                gender = "Female";
              } else {
                gender = "";
              }
            }

            //Get Advance Payment
            axios
              .get(
                this.patientPaymentURL +
                  "GetAdvancePayment/" +
                  this.props.patientInfo.ID,
                this.config
              )
              .then((res) => {
                this.advancePatientPayment =
                  res.data.length > 0 ? res.data[0].paymentAmount : -1;
              })
              .catch((error) => console.log(error));

            //Get Patient Plans
            axios
              .get(
                this.patientPlanUrl +
                  "GetActivePatientPlansByPatientID/" +
                  this.props.patientInfo.ID,
                this.config
              )
              .then((res) => {
                let primaryPatientPlan = res.data.filter(
                  (patientPlan) => patientPlan.description == "P"
                );
                let secondaryPatientPlan = res.data.filter(
                  (patientPlan) => patientPlan.description == "S"
                );

                if (primaryPatientPlan.length > 0) {
                  this.setState({
                    dob: patientInfo.length > 0 ? patientInfo[0].dob : "",
                    gender: gender,
                    patientObj: patientInfo.length > 0 ? patientInfo[0] : null,
                    visitModel: {
                      ...this.state.visitModel,
                      patientID: this.props.patientInfo.ID,
                      primaryPatientPlanID: primaryPatientPlan[0].id,
                    },
                    patientPlanDropdown: res.data,
                    primaryPlanName:
                      "Primary - " + primaryPatientPlan[0].description2,
                  });
                } else {
                  Swal.fire(
                    "PatientPlan Does'nt Exists",
                    "Visit can't be created",
                    "error"
                  );
                }
                if (secondaryPatientPlan.length > 0) {
                  this.setState({
                    dob: patientInfo.length > 0 ? patientInfo[0].dob : "",
                    gender: gender,
                    patientObj: patientInfo.length > 0 ? patientInfo[0] : null,
                    visitModel: {
                      ...this.state.visitModel,
                      patientID: this.props.patientInfo.ID,
                      secondaryPatientPlanID: secondaryPatientPlan[0].id,
                    },
                    patientPlanDropdown: res.data,
                    secondaryPlanName:
                      "Secondary - " + secondaryPatientPlan[0].description2,
                  });
                }
              });

            await this.setState({
              chargeValidationModel: this.state.chargeValidationModel.concat(
                this.chargeValidationModel
              ),
              dob: patientInfo[0].dob,
              gender: gender,
              patientObj: patientInfo[0],
              visitModel: {
                ...this.state.visitModel,
                patientID: this.props.patientInfo.ID,
                charges: this.state.visitModel.charges.concat({
                  ...this.chargeModel,
                }),
              },
              loading: false,
            });

            await this.setPatientetails(this.props.patientInfo.ID);
          } else {
            await this.setState({
              chargeValidationModel: this.state.chargeValidationModel.concat(
                this.chargeValidationModel
              ),
              visitModel: {
                ...this.state.visitModel,
                charges: this.state.visitModel.charges.concat({
                  ...this.chargeModel,
                }),
              },
              loading: false,
            });
          }
        } else {
          await this.setState({
            chargeValidationModel: this.state.chargeValidationModel.concat(
              this.chargeValidationModel
            ),
            visitModel: {
              ...this.state.visitModel,
              charges: this.state.visitModel.charges.concat({
                ...this.chargeModel,
              }),
            },
            loading: false,
          });
        }
      }

      // if(this.props.icdCodes.length == 0){
      //   await this.setState({loading:true})
      // }else{
      //   await this.setState({loading:false})
      // }
    } catch {
      this.setState({ loading: false });
    }

    if (this.state.visitModel.batchDocumentID) {
      var myVal = { ...this.validationModel };
      axios
        .get(
          this.batchURL +
            "FindBatchDocumentPath/" +
            this.state.visitModel.batchDocumentID,
          this.config
        )
        .then((response) => {
          // this.setState({ fileURL: response.data.documentFilePath });
          // console.log("Pages", response.data.numberOfPages);

          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span
              className="validationMsg"
              style={{ color: "green"}}
            >
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
            validationModel: myVal,
          });
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                console.log("Not Found");
                var myVal = { ...this.validationModel };

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ textAlign: "left" }}>
                    Invalid Batch # {this.state.visitModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 400) {
                console.log("Not Found");
                var myVal = { ...this.validationModel };

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ textAlign: "left" }}>
                    Invalid Batch # {this.state.visitModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              }
            }
          }
        });
    }
  }

  //auto complete
  filter(e) {
    this.setState({ filter: e.target.value });
  }

  //Open ICD Popup
  openICDPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showICDPopup: true, id: id });
  };

  //close ICd popup
  closeICDPopup = (event) => {
    event.preventDefault();
    $("#myICDModa1").hide();
    this.setState({ showICDPopup: false });
  };

  //Open NewPatient Popup
  newPatientPopup(event, id) {
    event.preventDefault();
    this.props.selectTabAction("NewPatient", id);
    this.props.history.push("/NewPatient");
  }

  //open RefProvider popup
  openRefProviderPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showRPopup: true, id: id });
  };

  //close RefProvider popup
  closeRefProviderPopup = () => {
    $("#refModal").hide();
    this.setState({ showRPopup: false });
  };

  //Open Provider Popup
  openProviderPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPPopup: true, id: id });
  };

  //close Provider popup
  closeProviderPopup = () => {
    $("#providerModal").hide();
    this.setState({ showPPopup: false });
  };

  //Open Location Popup
  openLocationPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showLPopup: true, id: id });
  };

  //Close Location Popup
  closeLocationPopup = () => {
    $("#locationModal").hide();
    this.setState({ showLPopup: false });
  };

  //Open POS Popup
  openPOSPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPOSPopup: true, id: id });
  };

  //close POS popup
  closePOSPopup = () => {
    $("#myModal1").hide();
    this.setState({ showPOSPopup: false });
  };

  //Open Popup
  openPopup = (event, name, id) => {
    event.preventDefault();
    console.log("Popup Name : ", name, id);
    if (name === "insuranceplan") {
      axios
        .get(this.patientPlanUrl + "findpatientplan/" + id, this.config)
        .then((response) => {
          this.setState({
            id: response.data.insurancePlanID,
            popupName: name,
          });
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Error", "No Primary Patient Plan", "error");
        });
    } else {
      this.props.selectTabAction("ManualPosting", 0);
      this.setState({ popupName: name, id: id == "Please Select" ? 0 : id });
    }
  };

  //Close Popup
  closePopup = (name) => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  openBatchDoc = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name });
  };

  closeBatchDoc = (name) => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  openPage = (event, name, id) => {
    event.preventDefault();
    var pageNumber = this.state.visitModel.pageNumber;
    var listOfNum, matchComme, matchDash, singleNum, loadPage;
    matchComme = pageNumber.indexOf(",");
    matchDash = pageNumber.indexOf("-");
    if (matchComme > 0) {
      listOfNum = pageNumber.split(",", 1);
    } else if (matchDash > 0) {
      listOfNum = pageNumber.split("-", 1);
    } else {
      singleNum = pageNumber;
    }
    console.log("Entered Page Refine : ", listOfNum);
    if (listOfNum) {
      loadPage = listOfNum;
    } else {
      loadPage = singleNum;
    }
    console.log("Entered Page Refine : ", listOfNum);
    this.setState({
      popupName: name,
      pageNumber: loadPage,
    });
  };

  closePage = (name) => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  //Handle Numeric check
  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  //Handle OutsideRef Check
  async handleOutsideRefCheck() {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        outsideReferral: !this.state.visitModel.outsideReferral,
      },
    });
  }

  //Handle ForcePaper Check
  async handleforcePaperChkBox() {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        isForcePaper: !this.state.visitModel.isForcePaper,
      },
    });
  }

  //Handle Dont Print Check
  handledontPrintChkBox() {
    this.setState({
      visitModel: {
        ...this.state.visitModel,
        isDontPrint: !this.state.visitModel.isDontPrint,
      },
    });
  }

  //handle Hold Statement Checkbox
  handleholdStatementChkBox = () => {
    this.setState({
      visitModel: {
        ...this.state.visitModel,
        holdStatement: !this.state.visitModel.holdStatement,
      },
    });
  };

  //Handle OutsideLab Check
  async handleOutsideLabCheck(event) {
    event.preventDefault();
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        outsideLab: !this.state.visitModel.outsideLab,
      },
    });
  }

  //Handle Emergency Check
  async handleEmergencyCheck(event) {
    event.preventDefault();
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        emergency: !this.state.visitModel.emergency,
      },
    });
  }

  //Handle EPSDT Check
  async handleEPSDTCheck(event) {
    event.preventDefault();
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        epsdt: !this.state.visitModel.epsdt,
      },
    });
  }

  //Handle Family Check
  async handleFamilyPlanCheck(event) {
    event.preventDefault();
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        familyPlan: !this.state.visitModel.familyPlan,
      },
    });
  }

  //Handle Change
  handleChange(event) {
    event.preventDefault();
    var eventName = event.target.name;
    var eventValue = event.target.value;

    if (
      eventName == "onsetDateOfIllness" ||
      eventName == "firstDateOfSimiliarIllness" ||
      eventName == "illnessTreatmentDate" ||
      eventName == "dateOfPregnancy" ||
      eventName == "admissionDate" ||
      eventName == "lastXrayDate" ||
      eventName == "unableToWorkFromDate" ||
      eventName == "unableToWorkToDate" ||
      eventName == "accidentDate" ||
      eventName == "dischargeDate" ||
      eventName == "posid" ||
      eventName == "lastSeenDate"
    ) {
    } else {
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }

    this.setState({
      visitModel: {
        ...this.state.visitModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });

    if (eventName == "posid") {
      let newChargeList = [...this.state.visitModel.charges];

      if (newChargeList.length > 0) {
        newChargeList[0].posid = eventValue;
        newChargeList[0].pointer1 = 1;
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            posid: event.target.value.toUpperCase(),
            charges: newChargeList,
          },
        });
      }
    }

    if (eventName === "providerID") {
      if (this.state.visitModel.charges.length > 0) {
        if (
          this.isNull(this.state.visitModel.providerID) == false &&
          this.isNull(this.state.visitModel.charges[0].cptid) == false &&
          this.isNull(this.state.visitModel.charges[0].dosFrom) == false &&
          this.isNull(this.state.visitModel.charges[0].dosTo) == false
        ) {
          //Auth# changes
          let authModel = {
            cptId: this.state.visitModel.charges[0].cptid,
            providerId: this.state.visitModel.providerID,
            patientId: this.state.visitModel.patientID,
            patientPlanId: this.state.visitModel.primaryPatientPlanID,
            dateOfServiceFrom: this.state.visitModel.charges[0]
              .dateOfServiceFrom
              ? this.state.visitModel.charges[0].dateOfServiceFrom
              : null,
            dateOfServiceTo: this.state.visitModel.charges[0].dateOfServiceTo
              ? this.state.visitModel.charges[0].dateOfServiceTo
              : null,
          };

          axios
            .post(
              this.authURL + "GetAuthorizationNumber/",
              authModel,
              this.config
            )
            .then((response) => {
              if (this.isNull(response.data) == false) {
                this.setState({
                  ...this.state.visitModel,
                  authorizationNum: response.data,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }

    if(eventName === "primaryStatus"){
      if(eventValue == "N"){
        this.setPrimaryStatusOfAllChrges("N")
      }      
    }

  }
  setPrimaryStatusOfAllChrges = async  (status) =>{
    let charges = [...this.state.visitModel.charges];
    await charges.map(charge =>{
      charge.primaryStatus = "N"
    });

    await this.setState({
      visitModel:{
        ...this.state.visitModel,
        charges:charges
      }
    })

  }

  async handleBatchChange(event) {
    var eventValue = event.target.value;
    var eventName = event.target.name;
    console.log(eventValue , eventName)
    var valueOfPage;
    if (eventName == "pageNumber") {
      valueOfPage = this.state.visitModel.batchDocumentID
        ? this.state.visitModel.batchDocumentID
        : "";

      var myVal = { ...this.validationModel };
      axios
        .get(
          this.batchURL + "FindBatchDocumentPath/" + valueOfPage,
          this.config
        )
        .then((response) => {
          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span
              className="validationMsg"
              style={{ color: "green"}}
            >
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
            validationModel: myVal,
          });
          return;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                console.log("Not Found");
                var myVal = { ...this.validationModel };

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ textAlign: "left" }}>
                    Invalid Batch # {this.state.visitModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 400) {
                console.log("Not Found");
                var myVal = { ...this.validationModel };

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ textAlign: "left" }}>
                    Invalid Batch # {this.state.visitModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              }
            }
          }
        });
    }

    if (this.isNull(eventValue)) {
      var myVal = { ...this.validationModel };
      myVal.responsepagesValField = "";
      myVal.batchDocumentIDValField = "";
      myVal.pageNumberValField = "";

      this.setState({ validationModel: myVal });
    }
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        [eventName]: eventValue.trim(),
      },
      batchDocumentID: eventName == "batchDocumentID" ? eventValue : null,
    });

    if (this.isNull(this.state.visitModel.batchDocumentID)) {
      var myVal = { ...this.validationModel };
      myVal.responsepagesValField = "";
    }
  }

  handleBatchCheck = (event) => {
    var eventValue = event.target.value;
    if (event.target.name == "pageNumber") {
      eventValue = this.state.visitModel.batchDocumentID;
    } else {
      eventValue = eventValue;
    }
    var myVal = { ...this.validationModel };
    axios
      .get(this.batchURL + "FindBatchDocumentPath/" + eventValue, this.config)
      .then((response) => {
        myVal.batchDocumentIDValField = "";
        myVal.responsepagesValField = (
          <span
            className="validationMsg"
            style={{ color: "green" }}
          >
            Number of Pages: {response.data.numberOfPages}
          </span>
        );
        this.setState({
          pageNumber: response.data.numberOfPages,
          fileURL: response.data.documentFilePath,
          validationModel: myVal,
        });
        return;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 404) {
              console.log("Not Found");
              var myVal = { ...this.validationModel };

              myVal.batchDocumentIDValField = (
                <span>
                  Invalid Batch # {this.state.visitModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });

              return;
            }
            // else if (error.response.status == 400) {
            //   console.log("Not Found");
            //   var myVal = this.validationModel;

            //   myVal.batchDocumentIDValField = (
            //     <span className="validationMsg" style={{ marginLeft: "-30%" }}>
            //       Invalid Batch # {this.state.visitModel.batchDocumentID}
            //     </span>
            //   );
            //   myVal.responsepagesValField = "";
            //   this.setState({validationModel:myVal});

            //   return;
            // }
          }
        }
      });
  };
  //Handle Amount Change
  async handleAmountChange(e) {
    e.preventDefault();
    const name = e.target.name;
    const amount = e.target.value;
    var regexp = /^\d+(\.(\d{1,2})?)?$/;
    // let useAdvancePayment = false
    // if(name == "copay"){
    //   if(this.advancePatientPayment > 0){
    //    await  Swal.fire({
    //       title: "Your Advance Payment is Available.Do you want to use that?",
    //       text: "",
    //       type: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#3085d6",
    //       cancelButtonColor: "#d33",
    //       confirmButtonText: "Yes"
    //     }).then(result => {
    //       if(result.value){
    //         this.setState({
    //           visitModel: {
    //             ...this.state.visitModel,
    //             [name]: this.advancePatientPayment
    //           }
    //         });
    //        useAdvancePayment = true
    //       }
    //     })
    //   }
    // }

    // if(useAdvancePayment == true)return
    if (amount.length < 15) {
      if (regexp.test(amount)) {
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            [name]: amount,
          },
        });
      } else if (amount == "") {
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            [name]: "",
          },
        });
      }
    }
  }

  //Set Patient Details
  async setPatientetails(id) {
    var patient = await this.state.patientDropDown.filter(
      (patient) => patient.patientID == id
    )[0];

    var charges = this.state.visitModel.charges;
    if ((this.state.editId > 0 || this.state.visitModel.id > 0) == false) {
      if (charges.length > 0) {
        charges[0].posid = patient.posid;
      }
    }
    await this.setState({
      dob: patient.dob,
      gender:
        patient.gender == "M" ? "MALE" : patient.gender == "F" ? "FEMALE" : "",

      visitModel: {
        ...this.state.visitModel,
        practiceID: patient.practiceID,
        locationID: patient.locationID,
        posid: patient.posid,
        providerID: patient.providerID,
        refProviderID: patient.refProviderID,
        charges: charges,
      },
    });
  }

  loadOptions = async (inputText, callback) => {
    const response = await fetch(
      this.patientUrl +
        "PatientAdvInstantSearch?criteria=" +
        inputText.toUpperCase(),
      this.config
    );
    const json = await response.json();
    this.setState({ patientDropDown: json });
    callback(json);
  };
  //Handle Patient Dropdown Change
  async handlePatientDropDownChange(event) {
    if (event == null) {
      await this.setState({
        patientObj: null,
        visitModel: {
          ...this.state.visitModel,
          patientID: null,
        },
      });
      return;
    }

    await this.setState({
      patientObj: event,
      visitModel: {
        ...this.state.visitModel,
        patientID: event.patientID,
      },
    });

    //Set Patient Details
    await this.setPatientetails(event.patientID);

    //Get Advance PAtient  Payment
    axios
      .get(
        this.patientPaymentURL + "GetAdvancePayment/" + event.patientID,
        this.config
      )
      .then((res) => {
        this.advancePatientPayment =
          res.data.length > 0 ? res.data[0].paymentAmount : -1;
      })
      .catch((error) => console.log(error));

    //Get Patient Plans By Patient ID
    await axios
      .get(
        this.patientPlanUrl +
          "GetpatientActivePlansByPatientID/" +
          event.patientID,
        this.config
      )
      .then((res) => {
        var primaryPractices = [];
        primaryPractices = res.data.filter((plan) => plan.description == "P");
        if (primaryPractices.length > 0) {
          this.setState({
            patientPlanDropdown: res.data,
            primaryPlanName: "Primary - " + primaryPractices[0].description2,
            visitModel: {
              ...this.state.visitModel,
              primaryPatientPlanID: primaryPractices[0].id,
            },
          });
        } else {
          this.setState({
            patientPlanDropdown: res.data,
            primaryPlanName: "",
            visitModel: {
              ...this.state.visitModel,
              primaryPatientPlanID: null,
            },
          });
          Swal.fire(
            "PatientPlan Does'nt Exists",
            "Visit can't be created",
            "error"
          );
        }
      })
      .catch((error) => {});

    // const id = event.target.value == "Please Select" ?null   : event.target.value;
    // await this.setState({
    //   visitModel: {
    //     ...this.state.visitModel,
    //     [event.target.name]: id
    //   }
    // });

    // await this.setPatientetails(id);

    // await axios
    //   .get(
    //     this.patientPlanUrl + "GetpatientActivePlansByPatientID/" + id,
    //     this.config
    //   )
    //   .then(res => {
    //     this.setState({
    //       patientPlanDropdown: res.data
    //     });
    //   })
    //   .catch(error => {
    //   });

    // var primaryPractices = [];
    // primaryPractices = await this.state.patientPlanDropdown.filter(
    //   plan => plan.description == "P"
    // );
    // if (primaryPractices.length > 0) {
    //   await this.setState({
    //     primaryPlanName: "Primary - " + primaryPractices[0].description2,
    //     visitModel: {
    //       ...this.state.visitModel,
    //       primaryPatientPlanID: primaryPractices[0].id
    //     }
    //   });
    // } else {
    //   await this.setState({
    //     primaryPlanName: "",
    //     visitModel: {
    //       ...this.state.visitModel,
    //       primaryPatientPlanID: null
    //     }
    //   });
    //   Swal.fire(
    //     "PatientPlan Does'nt Exists",
    //     "Visit can't be created",
    //     "error"
    //   );
    // }
    // var charge = { ...this.state.visitModel.charges[0] };
    // charge.posid = this.state.visitModel.posid;

    // await this.setState({
    //   visitModel: {
    //     ...this.state.visitModel,
    //     charges: [
    //       // ...this.state.visitModel.charges.slice(0 , index),
    //       Object.assign({}, this.state.visitModel.charges[0], charge),
    //       ...this.state.visitModel.charges.slice(1)
    //     ]
    //   }
    // });
  }

  //isDont Print CheckBox
  async isDontPrintCB(event, i) {
    event.preventDefault();
    let newChargeList = await [...this.state.visitModel.charges];
    newChargeList[i].isDontPrint = !newChargeList[i].isDontPrint;

    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: newChargeList,
      },
    });
  }

  //Handle Charge Change
  async handleChargeChange(event, i) {
    console.log("Event  : ", event.target);
    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;
    let newChargeList = [...this.state.visitModel.charges];

    if (name == "units") {
      newChargeList[index].unitsEntered = true;
    }

    if (
      event.target.name == "dateOfServiceFrom" ||
      event.target.name == "dateOfServiceTo"
    ) {
      if (new Date(event.target.value).getFullYear() >= 1000) {
        var year = new Date(event.target.value).getFullYear();
        if ((year + "").length > 4) {
          newChargeList[index]["dateOfServiceFrom"] =
            newChargeList[index]["dateOfServiceFrom"];
          newChargeList[index]["dateOfServiceTo"] =
            newChargeList[index]["dateOfServiceTo"];
          await this.setState({
            visitModel: {
              ...this.state.visitModel,
              charges: newChargeList,
            },
          });
          return;
        }
      }
    }

    if (
      event.target.name == "dateOfServiceFrom" ||
      event.target.name == "dateOfServiceTo"
    ) {
      newChargeList[index][name] = value;
      if (new Date(event.target.value).getFullYear() >= 1900) {
        if (newChargeList[index]["dateOfServiceTo"] == "") {
          newChargeList[index]["dateOfServiceTo"] = value;
        }
      }
      await this.setState({
        visitModel: {
          ...this.state.visitModel,
          charges: newChargeList,
        },
      });
      return;
    }

    if (name == "isDontPrint") {
      newChargeList[i].isDontPrint = !newChargeList[i].isDontPrint;
      await this.setState({
        visitModel: {
          ...this.state.visitModel,
          charges: newChargeList,
        },
      });
    } else {
      newChargeList[index][name] = value > 0 ? value : "";
      // if (name == "dateOfServiceFrom") {
      //   newChargeList[index]["dateOfServiceTo"] = value;
      // }
      newChargeList[index].totalAmount =
        name == "units"
          ? Number(newChargeList[index].perUnitAmount).toFixed(2) *
            Number(value).toFixed(2)
          : newChargeList[index].totalAmount;
      var totalAmount = 0;
      await newChargeList.map((charge) => {
        totalAmount = Number(totalAmount) + Number(charge.totalAmount);
      });
      newChargeList[index].primaryBilledAmount =
        newChargeList[index].totalAmount;
      await this.setState({
        visitModel: {
          ...this.state.visitModel,
          totalAmount: Number(totalAmount).toFixed(2),
          primaryBilledAmount: totalAmount,
          charges: newChargeList,
        },
      });
    }

    if (name == "dateOfServiceFrom" || name == "dateOfServiceTo") {
      if (
        this.isNull(this.state.visitModel.providerID) == false &&
        this.isNull(newChargeList[index].cptid) == false
      ) {
        //Auth# changes
        let authModel = {
          cptId: this.state.visitModel.charges[index].cptid,
          providerId: this.state.visitModel.providerID,
          patientId: this.state.visitModel.patientID,
          patientPlanId: this.state.visitModel.primaryPatientPlanID,
          dateOfServiceFrom: this.state.visitModel.charges[index]
            .dateOfServiceFrom
            ? this.state.visitModel.charges[index].dateOfServiceFrom
            : null,
          dateOfServiceTo: this.state.visitModel.charges[index].dateOfServiceTo
            ? this.state.visitModel.charges[index].dateOfServiceTo
            : null,
        };

        await axios
          .post(
            this.authURL + "GetAuthorizationNumber/",
            authModel,
            this.config
          )
          .then((response) => {
            if (this.isNull(response.data) == false) {
              this.setState({
                ...this.state.visitModel,
                authorizationNum: response.data,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    event.preventDefault();
  }

  //Handle Patient Payment Change
  handlePatientPaymentChange = (event, i) => {
    // event.preventDefault();

    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;
    let patientPayments = [...this.state.visitModel.patientPayments];
    patientPayments[index][name] = value;
    this.setState({
      visitModel: {
        ...this.state.visitModel,
        patientPayments: patientPayments,
      },
    });
  };

  //Handle CPT Amount Change
  async handleCPTAmountChange(e) {
    e.preventDefault();
    let newChargeList = [...this.state.visitModel.charges];
    const index = e.target.id;
    const name = e.target.name;
    const amount = e.target.value;
    var regexp = /^\d*(\.\d{0,2})?$/;

    var totalAmount = 0;
    await newChargeList.map((charge) => {
      if (
        charge.totalAmount == undefined ||
        charge.totalAmount == "" ||
        charge.totalAmount < 0
      ) {
        totalAmount += 0;
      } else {
        totalAmount += parseFloat(charge.totalAmount);
      }
    });

    if (
      newChargeList[index][name] == undefined ||
      newChargeList[index][name] == "" ||
      newChargeList[index][name] < 0
    ) {
      totalAmount += 0;
    } else {
      totalAmount = totalAmount - Number(newChargeList[index][name]).toFixed(2);
    }

    if (amount.length < 15) {
      if (regexp.test(amount)) {
        newChargeList[index][name] = amount >= 0 ? amount : null;
        if (name == "totalAmount") {
          newChargeList[index].primaryBilledAmount =
            amount >= 0 ? amount : null;
        }
        newChargeList[index].primaryBilledAmount = amount >= 0 ? amount : null;
        totalAmount += parseFloat(amount);
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            totalAmount: totalAmount > 0 ? totalAmount.toFixed(2) : null,
            primaryBilledAmount:
              totalAmount > 0 ? totalAmount.toFixed(2) : null,
            // primaryBal: (this.state.visitModel.primaryBal ? (Number(this.state.visitModel.primaryBal)).toFixed(2) : 0 )- (this.state.visitModel.copay ? (Number(this.state.visitModel.copay)).toFixed(2) : 0 ),
            // primaryPatientBal: (this.state.visitModel.primaryPatientBal ? (Number(this.state.visitModel.primaryPatientBal)).toFixed(2) : 0 ) - (this.state.visitModel.copay ? (Number(this.state.visitModel.copay)).toFixed(2) : 0 ),
            charges: newChargeList,
          },
        });
      } else if (amount == "") {
        newChargeList[index][name] = "";
        if (name == "totalAmount") {
          newChargeList[index].primaryBilledAmount = amount > 0 ? amount : null;
        }
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            totalAmount: totalAmount > 0 ? totalAmount.toFixed(2) : null,
            primaryBilledAmount:
              totalAmount > 0 ? totalAmount.toFixed(2) : null,
            // primaryBal: (this.state.visitModel.primaryBal ? (Number(this.state.visitModel.primaryBal)).toFixed(2) : 0 )- (this.state.visitModel.copay ? (Number(this.state.visitModel.copay)).toFixed(2) : 0 ),
            // primaryPatientBal: (this.state.visitModel.primaryPatientBal ? (Number(this.state.visitModel.primaryPatientBal)).toFixed(2) : 0 ) - (this.state.visitModel.copay ? (Number(this.state.visitModel.copay)).toFixed(2) : 0 ),
            // charges: newChargeList
          },
        });
      }
    }
  }

  //handle Patient Payments Amount Change
  handlePatPaymentAmountChange = (e) => {
    e.preventDefault();
    let patientPayments = [...this.state.visitModel.patientPayments];
    const index = e.target.id;
    const name = e.target.name;
    const amount = e.target.value;
    var regexp = /^\d*(\.\d{0,2})?$/;

    if (amount.length < 15) {
      if (regexp.test(amount)) {
        patientPayments[index][name] = amount;
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            patientPayments: patientPayments,
          },
        });
      } else if (amount == "") {
        patientPayments[index][name] = "";
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            patientPayments: patientPayments,
          },
        });
      }
    }
  };

  //Open Edit Charge Popup
  openEditChargePopup = (event, index, id) => {
    event.preventDefault();
    var icd1, icd2, icd3, icd4, icdId;
    if (this.state.visitModel.charges[index].pointer1 != "") {
      icdId = "icD" + this.state.visitModel.charges[index].pointer1 + "ID";
      icd1 = this.state.visitModel[icdId];
    }
    if (this.state.visitModel.charges[index].pointer2 != "") {
      icdId = "icD" + this.state.visitModel.charges[index].pointer2 + "ID";
      icd2 = this.state.visitModel[icdId];
    }
    if (this.state.visitModel.charges[index].pointer3 != "") {
      icdId = "icD" + this.state.visitModel.charges[index].pointer3 + "ID";
      icd3 = this.state.visitModel[icdId];
    }
    if (this.state.visitModel.charges[index].pointer4 != "") {
      icdId = "icD" + this.state.visitModel.charges[index].pointer4 + "ID";
      icd4 = this.state.visitModel[icdId];
    }
    // icd1Obj: this.state.options.filter(
    //   option => option.id == response.data.icD1ID
    // )
    this.setState({
      showPopup: true,
      chargeId: id,
      icd1: icd1,
      icd2: icd2,
      icd3: icd3,
      icd4: icd4,
    });
  };

  //resubmit Visit
  resubmitVisit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.state.visitModel.isSubmitted === true) {
      axios
        .get(
          this.visitUrl + "ResubmitVisit/" + this.state.visitModel.id,
          this.config
        )
        .then((response) => {
          Swal.fire("SUCCESS", "Visit Re-Submited Successfully", "success");
          this.setState({ visitModel: response.data, loading: false });
          this.UNSAFE_componentWillMount();
        })
        .catch((error) => {
          // Swal.fire("FAILED", "Visit Re-Submited Failed", "error");
          Swal.fire(
            "SOMETHING WRONG",
            "Visit can not be Re-Submitted,First Submit the Visit",
            "error"
          );
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire(
        "SOMETHING WRONG",
        "Visit can not be Re-Submitted,First Submit the Visit",
        "error"
      );
    }
  }

  //Mark As Submit
  markAsSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.state.editId > 0 || this.state.visitModel.id > 0) {
      axios
        .get(
          this.visitUrl + "MarkAsSubmitted/" + this.state.visitModel.id,
          this.config
        )
        .then((response) => {
          Swal.fire(
            "SUCCESS",
            "Visit Marked As Submited Successfully",
            "success"
          );
          this.setState({
            visitModel: response.data,
            loading: false,
            visitSubmitted: true,
          });
          this.UNSAFE_componentWillMount();
        })
        .catch((error) => {
          // Swal.fire("FAILED", "Visit Re-Submited Failed", "error");
          Swal.fire("SOMETHING WRONG", "Please Try Again", "error");
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("SOMETHING WRONG", "Please Try Again", "error");
    }
  };

  //Transferred To Patient
  transferredToPatient = async (event) => {
    event.preventDefault();
    await this.setState({ loading: true });
    await axios
      .get(
        this.visitUrl + "TransferToPatient/" + this.state.visitModel.id,
        this.config
      )
      .then((response) => {
        Swal.fire("SUCCESS", "Transferred To Paient Successfully", "success");
        this.setState({ visitModel: response.data, loading: false });
        this.UNSAFE_componentWillMount();
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 400) {
              Swal.fire("SOMETHING WRONG", error.response.data, "error");
              return;
            } else {
              Swal.fire("SOMETHING WRONG", "Please Try Again", "error");
              return;
            }
          }
        }
        Swal.fire("SOMETHING WRONG", "Please Try Again", "error");
      });
  };

  //http://96.69.218.154:8020/api/Visit/TransfertoPlan/32
  transferredToPlan = async (event) => {
    event.preventDefault();
    await this.setState({ loading: true });
    await axios
      .get(
        this.visitUrl + "TransfertoPlan/" + this.state.visitModel.id,
        this.config
      )
      .then((response) => {
        Swal.fire("SUCCESS", "Transferred To Plan Successfully", "success");
        this.setState({ visitModel: response.data, loading: false });
        this.UNSAFE_componentWillMount();
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 400) {
              Swal.fire("SOMETHING WRONG", error.response.data, "error");
              return;
            } else {
              Swal.fire("SOMETHING WRONG", "Please Try Again", "error");
              return;
            }
          }
        }
        Swal.fire("SOMETHING WRONG", "Please Try Again", "error");
      });
  };

  //Handle Date Change
  async handleDateChange(event) {
    event.preventDefault();
    await this.setState({
      chargeModel: {
        ...this.state.chargeModel,
        [event.target.name]: event.target.value,
      },
    });
  }

  //Handle IsNull
  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select"
    )
      return true;
    return false;
  }

  //Save Visit
  async saveCharge(event) {
    event.preventDefault();
    if (this.saveVisitCount == 1) {
      return;
    }
    this.saveVisitCount = 1;
    await this.setState({ loading: true });
    // , (res) => {
    // this.visitInput.focus();

    var myVal = { ...this.validationModel };

    myVal.validation = false;

    if (this.isNull(this.state.visitModel.batchDocumentID) == false) {
      if (this.isNull(this.state.visitModel.pageNumber)) {
        myVal.pageNumberValField = (
          <span className="validationMsg" style={{ textAlign: "initial" }}>
            Enter Valid Page #
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.pageNumberValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }

    //Batch number Validatoin
    if (this.isNull(this.state.visitModel.batchDocumentID) == false) {
      axios
        .get(
          this.batchURL +
            "FindBatchDocumentPath/" +
            this.state.visitModel.batchDocumentID,
          this.config
        )
        .then((response) => {
          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span
              className="validationMsg"
              style={{ color: "green"}}
            >
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
            validationModel: myVal,
          });
          return;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                console.log("Not Found");
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ textAlign: "left" }}>
                    Invalid Batch # {this.state.visitModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 400) {
                console.log("Not Found");
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ textAlign: "left" }}>
                    Invalid Batch # {this.state.visitModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              }
            }
          }
        });
    }

    //icd1 validation
    if (this.isNull(this.state.visitModel.icD1ID)) {
      myVal.icd1ValField = (
        <span style={{ maringTop: "30px" }} className="validationMsg">
          Enter ICD1
        </span>
      );
      myVal.validation = true;
    } else {
      myVal.icd1ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd2 validation
    if (this.isNull(this.state.visitModel.icD1ID)) {
      if (!this.isNull(this.state.visitModel.icD2ID)) {
        myVal.icd2ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd2ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd2ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd3 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD3ID)) {
        myVal.icd3ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd3ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd3ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd4 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD4ID)) {
        myVal.icd4ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd4ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd4ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd5 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD5ID)) {
        myVal.icd5ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd5ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd5ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd6 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID) ||
      this.isNull(this.state.visitModel.icD5ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD6ID)) {
        myVal.icd6ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4 & ICD5
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd6ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd6ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd7 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID) ||
      this.isNull(this.state.visitModel.icD5ID) ||
      this.isNull(this.state.visitModel.icD6ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD7ID)) {
        myVal.icd7ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4 & ICD5 & ICD6
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd7ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd7ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd8 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID) ||
      this.isNull(this.state.visitModel.icD5ID) ||
      this.isNull(this.state.visitModel.icD6ID) ||
      this.isNull(this.state.visitModel.icD7ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD8ID)) {
        myVal.icd8ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4 & ICD5 & ICD6 & ICD7
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd8ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd8ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd9 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID) ||
      this.isNull(this.state.visitModel.icD5ID) ||
      this.isNull(this.state.visitModel.icD6ID) ||
      this.isNull(this.state.visitModel.icD7ID) ||
      this.isNull(this.state.visitModel.icD8ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD9ID)) {
        myVal.icd9ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4 & ICD5 & ICD6 & ICD7
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd9ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd9ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd10 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID) ||
      this.isNull(this.state.visitModel.icD5ID) ||
      this.isNull(this.state.visitModel.icD6ID) ||
      this.isNull(this.state.visitModel.icD7ID) ||
      this.isNull(this.state.visitModel.icD8ID) ||
      this.isNull(this.state.visitModel.icD9ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD10ID)) {
        myVal.icd10ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4 & ICD5 & ICD6 & ICD7 & ICD8 &
            ICD9
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd10ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd10ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd11 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID) ||
      this.isNull(this.state.visitModel.icD5ID) ||
      this.isNull(this.state.visitModel.icD6ID) ||
      this.isNull(this.state.visitModel.icD7ID) ||
      this.isNull(this.state.visitModel.icD8ID) ||
      this.isNull(this.state.visitModel.icD9ID) ||
      this.isNull(this.state.visitModel.icD10ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD11ID)) {
        myVal.icd11ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4 & ICD5 & ICD6 & ICD7 & ICD8 &
            ICD9 & ICD10
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd11ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd11ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //icd12 validation
    if (
      this.isNull(this.state.visitModel.icD1ID) ||
      this.isNull(this.state.visitModel.icD2ID) ||
      this.isNull(this.state.visitModel.icD3ID) ||
      this.isNull(this.state.visitModel.icD4ID) ||
      this.isNull(this.state.visitModel.icD5ID) ||
      this.isNull(this.state.visitModel.icD6ID) ||
      this.isNull(this.state.visitModel.icD7ID) ||
      this.isNull(this.state.visitModel.icD8ID) ||
      this.isNull(this.state.visitModel.icD9ID) ||
      this.isNull(this.state.visitModel.icD10ID) ||
      this.isNull(this.state.visitModel.icD11ID)
    ) {
      if (!this.isNull(this.state.visitModel.icD12ID)) {
        myVal.icd12ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            First Enter ICD1 & ICD2 & ICD3 & ICD4 & ICD5 & ICD6 & ICD7 & ICD8 &
            ICD9 & ICD10 & ICD11
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd12ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.icd12ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //patient validation
    if (this.isNull(this.state.visitModel.patientID)) {
      myVal.patientValField = (
        <span className="validationMsg">Select Patient</span>
      );
      myVal.validation = true;
    } else {
      myVal.patientValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //practice validation
    if (this.isNull(this.state.visitModel.practiceID)) {
      myVal.practiceValField = (
        <span className="validationMsg">Select Practice</span>
      );
      myVal.validation = true;
    } else {
      myVal.practiceValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //location validation
    if (this.isNull(this.state.visitModel.locationID)) {
      myVal.locationValField = (
        <span className="validationMsg">Select Location</span>
      );
      myVal.validation = true;
    } else {
      myVal.locationValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //pos validation
    if (this.isNull(this.state.visitModel.posid)) {
      myVal.posValField = <span className="validationMsg">Select POS</span>;
      myVal.validation = true;
    } else {
      myVal.posValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //provider validation
    if (this.isNull(this.state.visitModel.providerID)) {
      myVal.providerValField = (
        <span className="validationMsg">Select Provider</span>
      );
      myVal.validation = true;
    } else {
      myVal.providerValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //OnsetDateOfSimilarIllness validation
    if (
      !this.isNull(this.state.visitModel.onsetDateOfIllness) &&
      !isNull(this.state.visitModel.firstDateOfSimiliarIllness)
    ) {
      if (
        new Date(
          moment(this.state.visitModel.firstDateOfSimiliarIllness)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.visitModel.onsetDateOfIllness).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.onSetDateOfSimiliarIllnessValField = (
          <span className="validationMsg">
            Onset Date of Current Illness Must Be Greater Than or Equal To First
            Date Of Similar Illness
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.onSetDateOfSimiliarIllnessValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.onSetDateOfSimiliarIllnessValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Unable To Work To Greater Than validation
    if (
      !this.isNull(this.state.visitModel.unableToWorkFromDate) &&
      !isNull(this.state.visitModel.unableToWorkToDate) &&
      this.state.visitModel.unableToWorkToDate <
        this.state.visitModel.unableToWorkFromDate
    ) {
      myVal.unableToWorkFromDateValField = (
        <span className="validationMsg">
          Unable To Work To Date Must Be Greater Than or Equal To Unable From
          Work From Date
        </span>
      );
      myVal.validation = true;
    } else {
      myVal.unableToWorkFromDateValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Discharge Date Greater Than validation
    if (
      !this.isNull(this.state.visitModel.admissionDate) &&
      !isNull(this.state.visitModel.dischargeDate)
    ) {
      if (
        new Date(
          moment(this.state.visitModel.admissionDate).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.visitModel.dischargeDate).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.dischargeDateValField = (
          <span className="validationMsg">
            Discharge Must Be Greater Than or Equal To Admission Date
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.dischargeDateValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.dischargeDateValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Onset Date of Current illness Future Date Validation
    if (this.isNull(this.state.visitModel.onsetDateOfIllness) == false) {
      if (
        new Date(
          moment(this.state.visitModel.onsetDateOfIllness).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.onsetDateOfIllnessValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.onsetDateOfIllnessValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.onsetDateOfIllnessValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //First Date of Similar illness Future Date Validation
    if (
      this.isNull(this.state.visitModel.firstDateOfSimiliarIllness) == false
    ) {
      if (
        new Date(
          moment(this.state.visitModel.firstDateOfSimiliarIllness)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.firstDateOfSimiliarIllnessValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.firstDateOfSimiliarIllnessValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.firstDateOfSimiliarIllnessValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Initial Treatement Date Future Date Validation
    if (this.isNull(this.state.visitModel.illnessTreatmentDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.illnessTreatmentDate)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.initialTreatementDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.initialTreatementDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.initialTreatementDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Date Of Pragnancy Future Date Validation
    if (this.isNull(this.state.visitModel.dateOfPregnancy) == false) {
      if (
        new Date(
          moment(this.state.visitModel.dateOfPregnancy).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.dateOfPregnancyValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dateOfPregnancyValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dateOfPregnancyValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Admission Date Future Date Validation
    if (this.isNull(this.state.visitModel.admissionDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.admissionDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.admissionDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.admissionDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.admissionDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Discharge Date Future Date Validation
    if (this.isNull(this.state.visitModel.dischargeDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.dischargeDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.dischargeDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dischargeDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dischargeDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Last X-ray Date Future Date Validation
    if (this.isNull(this.state.visitModel.lastXrayDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.lastXrayDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.laxtXRayValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.laxtXRayValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.laxtXRayValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Unable to Work From Date Future Date Validation
    if (this.isNull(this.state.visitModel.unableToWorkFromDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.unableToWorkFromDate)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.unableToWorkFromDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.unableToWorkFromDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.unableToWorkFromDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Unable To Work To Date Future Date Validation
    if (this.isNull(this.state.visitModel.unableToWorkToDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.unableToWorkToDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.unableToWorkToDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.unableToWorkToDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.unableToWorkToDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Accident Date Future Date Validation
    if (this.isNull(this.state.visitModel.accidentDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.accidentDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.accidentDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.accidentDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.accidentDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Last Seen  Date Future Date Validation
    if (this.isNull(this.state.visitModel.lastSeenDate) == false) {
      if (
        new Date(
          moment(this.state.visitModel.lastSeenDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.lastSeenDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.lastSeenDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.lastSeenDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    if (this.isNull(this.state.visitModel.pageNumber) == false) {
      var listOfNum, matchComme, matchDash, singleNum;
      var pageNumber = this.state.visitModel.pageNumber;
      matchComme = pageNumber.indexOf(",");
      matchDash = pageNumber.indexOf("-");
      if (matchComme > 0) {
        listOfNum = pageNumber.split(",");
      } else if (matchDash > 0) {
        listOfNum = pageNumber.split("-");
        console.log(listOfNum);
      } else {
        singleNum = pageNumber;
      }

      if (singleNum) {
        console.log("Single Number", singleNum);
        for (var i = 0; i < singleNum.length; i++) {
          if (singleNum > this.state.pageNumber) {
            myVal.pageNumberValField = (
              <span className="validationMsg" style={{ textAlign: "initial" }}>
                Invalid Page # {singleNum}
              </span>
            );
            myVal.validation = true;
            // break;
          } else {
            myVal.pageNumberValField = "";
            if (myVal.validation === false) myVal.validation = false;
          }
        }
      }
      if (listOfNum) {
        console.log("In case of list Numbers are", listOfNum);
        for (var i = 0; i < listOfNum.length; i++) {
          if (listOfNum[i] > this.state.pageNumber) {
            myVal.pageNumberValField = (
              <span className="validationMsg" style={{ textAlign: "initial" }}>
                Invalid Page # {listOfNum[i]}
              </span>
            );
            myVal.validation = true;
            // break;
          } else {
            myVal.pageNumberValField = "";
            if (myVal.validation === false) myVal.validation = false;
          }
        }
      }
    }
    this.setState({
      validationModel: myVal,
    });

    // if (myVal.validation === true) {
    //   Swal.fire(
    //     "SOMETHING WRONG",
    //     "Please Select All Fields Properly",
    //     "error"
    //   );
    //   return;
    // }

    //Charge  Model Validation
    var chargeVal;
    for (var i = 0; i < this.state.visitModel.charges.length; i++) {
      chargeVal = { ...this.state.visitModel.charges[i] };
      chargeVal.validation = false;

      //Clia Number Validation
      if (this.isNull(this.state.visitModel.cliaNumber) == false) {
        if (
          this.state.visitModel.cliaNumber.length > 0 &&
          this.state.visitModel.cliaNumber.length < 10
        ) {
          myVal.cliaNumberValField = (
            <span className="validationMsg">CLIA length should be 10</span>
          );
          myVal.validation = true;
        } else {
          myVal.cliaNumberValField = "";
          if (myVal.validation === false) myVal.validation = false;
        }
      }

      //dos from validation
      if (this.isNull(this.state.visitModel.charges[i].dateOfServiceFrom)) {
        chargeVal.dosFromValField = (
          <span className="validationMsg">Enter DOS From</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.dosFromValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //DOS To Validation
      if (this.isNull(this.state.visitModel.charges[i].dateOfServiceTo)) {
        chargeVal.dosToValField = (
          <span className="validationMsg">Enter DOS To</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.dosToValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //DOS To greater than check
      if (
        !this.isNull(this.state.visitModel.charges[i].dateOfServiceFrom) &&
        !this.isNull(this.state.visitModel.charges[i].dateOfServiceTo)
      ) {
        var dosFrom = new Date(
          this.state.visitModel.charges[i].dateOfServiceFrom
        );
        var dosTo = new Date(this.state.visitModel.charges[i].dateOfServiceTo);
        if (dosFrom > dosTo) {
          chargeVal.dosToValField = (
            <span className="validationMsg">
              DOS To must be greater than DOS From
            </span>
          );
          chargeVal.validation = true;
        } else {
          chargeVal.dosToValField = "";
          if (chargeVal.validation === false) chargeVal.validation = false;
        }
      } else {
        chargeVal.dosToValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //dos from future date validation
      if (
        this.isNull(this.state.visitModel.charges[i].dateOfServiceFrom) ==
          false &&
        new Date(
          moment(this.state.visitModel.charges[i].dateOfServiceFrom)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        chargeVal.dosFromFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.dosFromFDValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //dos to future date  validation
      if (
        this.isNull(this.state.visitModel.charges[i].dateOfServiceTo) ==
          false &&
        new Date(
          moment(this.state.visitModel.charges[i].dateOfServiceTo)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        chargeVal.dosToFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.dosToFDValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //CPT Code Validation
      if (this.isNull(this.state.visitModel.charges[i].cptid)) {
        chargeVal.cptCodeValField = (
          <span className="validationMsg">Enter CPT Code</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.cptCodeValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //Units Validation
      if (
        this.isNull(this.state.visitModel.charges[i].units) ||
        this.state.visitModel.charges[i].units <= 0
      ) {
        chargeVal.unitsValField = (
          <span className="validationMsg">Enter Units</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.unitsValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //POS Validation
      if (this.isNull(this.state.visitModel.charges[i].posid)) {
        chargeVal.posValField = (
          <span className="validationMsg">Select POS</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.posValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //Total Amount Validation
      if (
        this.isNull(this.state.visitModel.charges[i].totalAmount) ||
        this.state.visitModel.charges[i].totalAmount <= 0
      ) {
        chargeVal.amountValField = (
          <span className="validationMsg">Enter Amount</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.amountValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //Time Validation
      if (
        this.state.visitModel.charges[i].startTimeValdation == true ||
        this.state.visitModel.charges[i].endTimeValidation == true
      ) {
        chargeVal.timeValField = (
          <span className="validationMsg">Invalid Time</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.timeValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }
      if (
        this.isNull(this.state.visitModel.charges[i].startTime) == false &&
        this.isNull(this.state.visitModel.charges[i].endTime) == false
      ) {
        if (
          this.state.visitModel.charges[i].endTime <
          this.state.visitModel.charges[i].startTime
        ) {
          chargeVal.timeValField = (
            <span className="validationMsg">
              EndTime must be greater than StarTime
            </span>
          );
          chargeVal.validation = true;
        } else {
          chargeVal.timeValField = "";
          if (chargeVal.validation === false) chargeVal.validation = false;
        }
      }

      //pointers validation
      if (this.isNull(this.state.visitModel.charges[i].pointer1)) {
        chargeVal.pointer1ValField = (
          <span className="validationMsg">Enter Pointer1</span>
        );
        chargeVal.validation = true;
      } else if (
        chargeVal.pointer1 > 12 ||
        chargeVal.pointer2 > 12 ||
        chargeVal.pointer3 > 12 ||
        chargeVal.pointer4 > 12
      ) {
        chargeVal.pointer1ValField = (
          <span className="validationMsg">Enter Valid Pointer(s) 12</span>
        );
        chargeVal.validation = true;
      } else if (
        (this.isNull(this.state.visitModel.icD1ID) &&
          (chargeVal.pointer1 == "1" ||
            chargeVal.pointer2 == "1" ||
            chargeVal.pointer3 == "1" ||
            chargeVal.pointer4 == "1")) ||
        (this.isNull(this.state.visitModel.icD2ID) &&
          (chargeVal.pointer1 == "2" ||
            chargeVal.pointer2 == "2" ||
            chargeVal.pointer3 == "2" ||
            chargeVal.pointer4 == "2")) ||
        (this.isNull(this.state.visitModel.icD3ID) &&
          (chargeVal.pointer1 == "3" ||
            chargeVal.pointer2 == "3" ||
            chargeVal.pointer3 == "3" ||
            chargeVal.pointer4 == "3")) ||
        (this.isNull(this.state.visitModel.icD4ID) &&
          (chargeVal.pointer1 == "4" ||
            chargeVal.pointer2 == "4" ||
            chargeVal.pointer3 == "4" ||
            chargeVal.pointer4 == "4")) ||
        (this.isNull(this.state.visitModel.icD5ID) &&
          (chargeVal.pointer1 == "5" ||
            chargeVal.pointer2 == "5" ||
            chargeVal.pointer3 == "5" ||
            chargeVal.pointer4 == "5")) ||
        (this.isNull(this.state.visitModel.icD6ID) &&
          (chargeVal.pointer1 == "6" ||
            chargeVal.pointer2 == "6" ||
            chargeVal.pointer3 == "6" ||
            chargeVal.pointer4 == "6")) ||
        (this.isNull(this.state.visitModel.icD7ID) &&
          (chargeVal.pointer1 == "7" ||
            chargeVal.pointer2 == "7" ||
            chargeVal.pointer3 == "7" ||
            chargeVal.pointer4 == "7")) ||
        (this.isNull(this.state.visitModel.icD8ID) &&
          (chargeVal.pointer1 == "8" ||
            chargeVal.pointer2 == "8" ||
            chargeVal.pointer3 == "8" ||
            chargeVal.pointer4 == "8")) ||
        (this.isNull(this.state.visitModel.icD9ID) &&
          (chargeVal.pointer1 == "9" ||
            chargeVal.pointer2 == "9" ||
            chargeVal.pointer3 == "9" ||
            chargeVal.pointer4 == "9")) ||
        (this.isNull(this.state.visitModel.icD10ID) &&
          (chargeVal.pointer1 == "10" ||
            chargeVal.pointer2 == "10" ||
            chargeVal.pointer3 == "10" ||
            chargeVal.pointer4 == "10")) ||
        (this.isNull(this.state.visitModel.icD11ID) &&
          (chargeVal.pointer1 == "11" ||
            chargeVal.pointer2 == "11" ||
            chargeVal.pointer3 == "11" ||
            chargeVal.pointer4 == "11")) ||
        (this.isNull(this.state.visitModel.icD12ID) &&
          (chargeVal.pointer1 == "12" ||
            chargeVal.pointer2 == "12" ||
            chargeVal.pointer3 == "12" ||
            chargeVal.pointer4 == "12"))
      ) {
        chargeVal.pointer1ValField = (
          <span className="validationMsg">Enter Valid Pointer(s)</span>
        );
        chargeVal.validation = true;
      } else if (
        (this.isNull(this.state.visitModel.charges[i].pointer1) == false &&
          (this.state.visitModel.charges[i].pointer1 ==
            this.state.visitModel.charges[i].pointer2 ||
            this.state.visitModel.charges[i].pointer1 ==
              this.state.visitModel.charges[i].pointer3 ||
            this.state.visitModel.charges[i].pointer1 ==
              this.state.visitModel.charges[i].pointer4)) ||
        (this.isNull(this.state.visitModel.charges[i].pointer2) == false &&
          (this.state.visitModel.charges[i].pointer2 ==
            this.state.visitModel.charges[i].pointer3 ||
            this.state.visitModel.charges[i].pointer2 ==
              this.state.visitModel.charges[i].pointer4)) ||
        (this.isNull(this.state.visitModel.charges[i].pointer3) == false &&
          this.state.visitModel.charges[i].pointer3 ==
            this.state.visitModel.charges[i].pointer4)
      ) {
        chargeVal.pointer1ValField = (
          <span className="validationMsg">Enter Unique Pointer(s)</span>
        );
        chargeVal.validation = true;
      } else if (
        (this.isNull(this.state.visitModel.charges[i].pointer2) == false &&
          this.isNull(this.state.visitModel.charges[i].pointer1) == true) ||
        (this.isNull(this.state.visitModel.charges[i].pointer3) == false &&
          this.isNull(this.state.visitModel.charges[i].pointer2) == true) ||
        (this.isNull(this.state.visitModel.charges[i].pointer4) == false &&
          this.isNull(this.state.visitModel.charges[i].pointer3) == true)
      ) {
        chargeVal.pointer1ValField = (
          <span className="validationMsg">Enter Pointer(s) in Sequence</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.pointer1ValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //Unique Modifies Check
      if (
        (this.isNull(this.state.visitModel.charges[i].modifier1ID) == false &&
          this.isNull(this.state.visitModel.charges[i].modifier2ID) == false &&
          this.state.visitModel.charges[i].modifier1ID ==
            this.state.visitModel.charges[i].modifier2ID) ||
        (this.isNull(this.state.visitModel.charges[i].modifier1ID) == false &&
          this.isNull(this.state.visitModel.charges[i].modifier3ID) == false &&
          this.state.visitModel.charges[i].modifier1ID ==
            this.state.visitModel.charges[i].modifier3ID) ||
        (this.isNull(this.state.visitModel.charges[i].modifier1ID) == false &&
          this.isNull(this.state.visitModel.charges[i].modifier4ID) == false &&
          this.state.visitModel.charges[i].modifier1ID ==
            this.state.visitModel.charges[i].modifier4ID) ||
        (this.isNull(this.state.visitModel.charges[i].modifier2ID) == false &&
          this.isNull(this.state.visitModel.charges[i].modifier3ID) == false &&
          this.state.visitModel.charges[i].modifier2ID ==
            this.state.visitModel.charges[i].modifier3ID) ||
        (this.isNull(this.state.visitModel.charges[i].modifier2ID) == false &&
          this.isNull(this.state.visitModel.charges[i].modifier4ID) == false &&
          this.state.visitModel.charges[i].modifier2ID ==
            this.state.visitModel.charges[i].modifier4ID) ||
        (this.isNull(this.state.visitModel.charges[i].modifier3ID) == false &&
          this.isNull(this.state.visitModel.charges[i].modifier4ID) == false &&
          this.state.visitModel.charges[i].modifier3ID ==
            this.state.visitModel.charges[i].modifier4ID)
      ) {
        chargeVal.modifierValField = (
          <span className="validationMsg">Enter Unique Modifiers(s)</span>
        );
        chargeVal.validation = true;
      } else {
        chargeVal.modifierValField = "";
        if (chargeVal.validation === false) chargeVal.validation = false;
      }

      //Charge model Validation set state
      this.setState({
        visitModel: {
          ...this.state.visitModel,
          charges: [
            ...this.state.visitModel.charges.slice(0, i),
            Object.assign({}, this.state.visitModel.charges[i], chargeVal),
            ...this.state.visitModel.charges.slice(i + 1),
          ],
        },
      });
    }
    //end of for loop

    //Patient Payment Valdation
    var patientPayments = [];
    var patientPaymentVal;
    if (this.state.visitModel.patientPayments == null) {
      patientPayments = [];
    } else {
      patientPayments = this.state.visitModel.patientPayments;
    }

    var totalPaymentAmount = 0;
    for (var i = 0; i < patientPayments.length; i++) {
      

      patientPaymentVal = { ...this.state.visitModel.patientPayments[i] };
      patientPaymentVal.validation = false;

      //Payment Date  validation
      if (this.isNull(this.state.visitModel.patientPayments[i].paymentDate)) {
        patientPaymentVal.dateValField = (
          <span className="validationMsg">Enter Payment Date</span>
        );
        patientPaymentVal.validation = true;
      } else {
        patientPaymentVal.dateValField = "";
        if (patientPaymentVal.validation === false)
          patientPaymentVal.validation = false;
      }

      //Payment Date future date  validation
      if (
        this.isNull(this.state.visitModel.patientPayments[i].paymentDate) ==
          false &&
        new Date(
          moment(this.state.visitModel.patientPayments[i].paymentDate)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        patientPaymentVal.paymentDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        patientPaymentVal.validation = true;
      } else {
        patientPaymentVal.paymentDateFDValField = "";
        if (patientPaymentVal.validation === false)
          patientPaymentVal.validation = false;
      }

      //Type validation
      if (this.isNull(this.state.visitModel.patientPayments[i].type)) {
        patientPaymentVal.typeValField = (
          <span className="validationMsg">Select Payment Type</span>
        );
        patientPaymentVal.validation = true;
      } else {
        patientPaymentVal.typeValField = "";
        if (patientPaymentVal.validation === false)
          patientPaymentVal.validation = false;
      }

      //Method validation
      if (!(this.state.visitModel.patientPayments[i].type == "D")) {
        if (
          this.isNull(this.state.visitModel.patientPayments[i].paymentMethod)
        ) {
          patientPaymentVal.methodValField = (
            <span className="validationMsg">Select Payment Method</span>
          );
          patientPaymentVal.validation = true;
        } else {
          patientPaymentVal.methodValField = "";
          if (patientPaymentVal.validation === false)
            patientPaymentVal.validation = false;
        }
      } else {
        patientPaymentVal.methodValField = "";
        if (patientPaymentVal.validation === false)
          patientPaymentVal.validation = false;
      }

      //Check Number validation
      if (this.state.visitModel.patientPayments[i].paymentMethod === "Check") {
        if (this.isNull(this.state.visitModel.patientPayments[i].checkNumber)) {
          patientPaymentVal.checkNumberValfield = (
            <span className="validationMsg">Enter Check Number</span>
          );
          patientPaymentVal.validation = true;
        } else {
          if (
            this.isNull(
              this.state.visitModel.patientPayments[i].checkNumber.trim()
            )
          ) {
            patientPaymentVal.checkNumberValfield = (
              <span className="validationMsg">Enter Check Number</span>
            );
            patientPaymentVal.validation = true;
          } else {
            patientPaymentVal.checkNumberValfield = "";
            if (patientPaymentVal.validation === false)
              patientPaymentVal.validation = false;
          }
        }
      } else {
        patientPaymentVal.checkNumberValfield = "";
        if (patientPaymentVal.validation === false)
          patientPaymentVal.validation = false;
      }

      //Amount validation
      if (this.isNull(this.state.visitModel.patientPayments[i].paymentAmount)) {
        patientPaymentVal.amountValField = (
          <span className="validationMsg">Enter Amount</span>
        );
        patientPaymentVal.validation = true;
      } else {
        patientPaymentVal.amountValField = "";
        if (patientPaymentVal.validation === false)
          patientPaymentVal.validation = false;
      }

      if (this.state.visitModel.patientPayments[i].paymentMethod === "Advance Payment") {

        if(this.isNull(patientPayments[i].paymentAmount) == false){
          totalPaymentAmount = Number(parseFloat(totalPaymentAmount).toFixed(2)) + Number(parseFloat(patientPayments[i].paymentAmount).toFixed(2))
        }else{
          totalPaymentAmount = totalPaymentAmount + 0
        }
      }


     

      //Patient Payment  model Validation set state
      this.setState({
        visitModel: {
          ...this.state.visitModel,
          patientPayments: [
            ...this.state.visitModel.patientPayments.slice(0, i),
            Object.assign(
              {},
              this.state.visitModel.patientPayments[i],
              patientPaymentVal
            ),
            ...this.state.visitModel.patientPayments.slice(i + 1),
          ],
        },
      });
    }

    //Notes Validation
    var note = [];
    var notesVal;
    if (this.state.visitModel.note == null) {
      note = [];
    } else {
      note = this.state.visitModel.note;
    }

    for (var i = 0; i < note.length; i++) {
      notesVal = { ...this.state.visitModel.note[i] };
      notesVal.validation = false;

      //Notes validation
      if (this.isNull(this.state.visitModel.note[i].note)) {
        notesVal.noteValField = (
          <span className="validationMsg">Enter Notes</span>
        );
        notesVal.validation = true;
      } else {
        notesVal.noteValField = "";
        if (notesVal.validation === false) notesVal.validation = false;
      }

      //Notes validation set state
      this.setState({
        visitModel: {
          ...this.state.visitModel,
          note: [
            ...this.state.visitModel.note.slice(0, i),
            Object.assign({}, this.state.visitModel.note[i], notesVal),
            ...this.state.visitModel.note.slice(i + 1),
          ],
        },
      });
    }

    if (myVal.validation === true) {
      // this.visitInput.focus();
      this.setState({ loading: false });
      Swal.fire(
        "SOMETHING WRONG",
        "Please Select All Visits Fields Properly",
        "error"
      );
      this.saveVisitCount = 0;
      return;
    }

    //Charges
    for (var i = 0; i < this.state.visitModel.charges.length; i++) {
      if (this.state.visitModel.charges[i].validation == true) {
        // this.chargeInput.focus();
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check All Charge Fields", "error");
        this.saveVisitCount = 0;
        return;
      }
    }

    //Patient Payments
    for (var i = 0; i < patientPayments.length; i++) {
      if (this.state.visitModel.patientPayments[i].validation == true) {
        // this.chargeInput.focus();
        this.setState({ loading: false });
        Swal.fire(
          "Something Wrong",
          "Please Check All Patient Payments Fields",
          "error"
        );
        this.saveVisitCount = 0;
        return;
      }
    }

    console.log("Advance PAyment : " , totalPaymentAmount , this.advancePatientPayment)
    if((totalPaymentAmount > this.advancePatientPayment) && (this.advancePatientPayment != -1) ){
      this.setState({ loading: false });
      Swal.fire(
        "",
        "Entered Amount can not be greater than Advance Payment",
        "error"
      );
      this.saveVisitCount = 0;
      return;
    }

    //Totlal Payemnt amount greater than Avance Payment(Disabled)
    // if(this.advancePatientPayment != -1){
    //   if (totalPaymentAmount > this.advancePatientPayment) {
    //     // this.chargeInput.focus();
    //     this.setState({ loading: false });
    //     Swal.fire(
    //       "",
    //       "Payment amount is greater than adance payment",
    //       "error"
    //     );
    //     this.saveVisitCount = 0;
    //     return;
    //   }
    // }

    //Notes
    for (var i = 0; i < note.length; i++) {
      if (this.state.visitModel.note[i].validation == true) {
        // this.chargeInput.focus();
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check All Note Fields", "error");
        this.saveVisitCount = 0;
        return;
      }
    }

    if (this.state.visitModel.supervisingProvID == "Please Select") {
      this.setState({
        visitModel: {
          ...this.state.visitModel,
          supervisingProvID: null,
        },
      });
    }

    if (this.state.visitModel.refProviderID == "Please Select") {
      this.setState({
        visitModel: {
          ...this.state.visitModel,
          refProviderID: null,
        },
      });
    }
    // });

    if (this.state.visitModel.primaryPatientPlanID == null) {
      this.setState({ loading: false });
      Swal.fire(
        "Patient Primary Plan Does'nt Exists",
        "Visit can't be created",
        "error"
      );
      this.saveVisitCount = 0;
      // this.visitInput.focus();
    } else {
      await axios
        .post(this.visitUrl + "SaveVisit", this.state.visitModel, this.config)
        .then(async (response) => {
          this.saveVisitCount = 0;

          let newVisitmodel = { ...response.data };
          let charges = [];

          newVisitmodel.icd1Obj = await this.filterICDObject(
            response.data.icD1ID
          );
          newVisitmodel.icd2Obj = await this.filterICDObject(
            response.data.icD2ID
          );
          newVisitmodel.icd3Obj = await this.filterICDObject(
            response.data.icD3ID
          );
          newVisitmodel.icd4Obj = await this.filterICDObject(
            response.data.icD4ID
          );
          newVisitmodel.icd5Obj = await this.filterICDObject(
            response.data.icD5ID
          );
          newVisitmodel.icd6Obj = await this.filterICDObject(
            response.data.icD6ID
          );
          newVisitmodel.icd7Obj = await this.filterICDObject(
            response.data.icD7ID
          );
          newVisitmodel.icd8Obj = await this.filterICDObject(
            response.data.icD8ID
          );
          newVisitmodel.icd9Obj = await this.filterICDObject(
            response.data.icD9ID
          );
          newVisitmodel.icd10Obj = await this.filterICDObject(
            response.data.icD10ID
          );
          newVisitmodel.icd11Obj = await this.filterICDObject(
            response.data.icD11ID
          );
          newVisitmodel.icd12Obj = await this.filterICDObject(
            response.data.icD12ID
          );

          await newVisitmodel.charges.map(async (charge, index) => {
            var cpt = await this.filterCPTObject(charge.cptid);
            var modifier1 = await this.filterModifierObject(charge.modifier1ID);
            var modifier2 = await this.filterModifierObject(charge.modifier2ID);
            var modifier3 = await this.filterModifierObject(charge.modifier3ID);
            var modifier4 = await this.filterModifierObject(charge.modifier4ID);

            charge.dateOfServiceFrom = charge.dateOfServiceTo
              ? charge.dateOfServiceFrom.slice(0, 10)
              : "";
            charge.dateOfServiceTo = charge.dateOfServiceTo
              ? charge.dateOfServiceTo.slice(0, 10)
              : "";

            charge.cptObj = cpt;
            charge.perUnitAmount = cpt ? cpt.description2 : null;
            charge.cptUnits = cpt ? cpt.description1 : null;
            charge.anesthesiaUnits = cpt ? cpt.anesthesiaUnits : null;
            charge.category = cpt ? cpt.category : null;

            charge.modifier1Obj = modifier1;
            charge.modifier1AnsUnits = modifier1
              ? modifier1.anesthesiaUnits
              : null;
            charge.modifier1Amount = modifier1 ? modifier1.description2 : null;

            charge.modifier2Obj = modifier2;
            charge.modifier2AnsUnits = modifier2
              ? modifier2.anesthesiaUnits
              : null;
            charge.modifier2Amount = modifier2.length
              ? modifier2.description2
              : null;

            charge.modifier3Obj = modifier3 ? modifier3 : null;
            charge.modifier3AnsUnits = modifier3
              ? modifier3.anesthesiaUnits
              : null;
            charge.modifier3Amount = modifier3 ? modifier3.description2 : null;

            charge.modifier4Obj = modifier4;
            charge.modifier4AnsUnits = modifier4
              ? modifier4.anesthesiaUnits
              : null;
            charge.modifier4Amount = modifier4 ? modifier4.description2 : null;
          });

          // newVisitmodel.charges = charges;
          await this.setState({
            visitModel: newVisitmodel,
            loading: false,
          });
          //await this.UNSAFE_componentWillMount();
          Swal.fire("Record Saved Successfully", "", "success");
        })
        .catch((error) => {
          // this.visitInput.focus();
          this.saveVisitCount = 0;
          this.setState({ loading: false });
          try {
            if (error.response) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              } else if (error.response.status == 400) {
                Swal.fire("", error.response.data, "error");
                return;
              } else if (error.response.status == 404) {
                Swal.fire("404 Not Found", "", "error");
                return;
              } else {
                Swal.fire("Something  Wrong", "Please Try Again", "error");
                return;
              }
            } else if (error.request) {
              return;
            } else {
              Swal.fire("Something  Wrong", "Please Try Again", "error");
              return;
            }
          } catch {}
        });
    }
  }

  //Filter ICD Object
  filterICDObject = (icdID) => {
    let icdCode = this.isNull(icdID)
      ? []
      : this.props.icdCodes.filter((option) => option.id == icdID);
    console.log("Filtering ");
    if (icdCode.length > 0) {
      return (icdCode = icdCode[0]);
    } else {
      return (icdCode = {});
    }
    console.log("Filtered ");
  };

  //Filter CPT Object
  filterCPTObject = async (cptID) => {
    let cptCode = this.isNull(cptID)
      ? []
      : await this.props.cptCodes.filter((option) => option.id == cptID);
    if (cptCode.length > 0) {
      return (cptCode = cptCode[0]);
    } else {
      return (cptCode = {});
    }
  };
  //Filter Modifier Object
  filterModifierObject = async (modiiferID) => {
    let modifier = this.isNull(modiiferID)
      ? []
      : await this.props.modifiers.filter((option) => option.id == modiiferID);

    if (modifier.length > 0) {
      return (modifier = modifier[0]);
    } else {
      return (modifier = {});
    }
  };
  //Delete Visit
  deleteVisit(event) {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(
            this.visitUrl + "DeleteVisit/" + this.state.editId,
            this.config
          )
          .then((response) => {
            this.setState({ loading: false });
            Swal.fire("Record Deleted Successfully", "", "success").then(
              (res) => {
                this.props.selectTabAction("Charges");
              }
            );
          })
          .catch((error) => {
            this.setState({ loading: false });
            Swal.fire(
              "Record Not Deleted!",
              "Record can not be delete,  it maybe referenced in other screens.",
              "error"
            );
          });
      }
    });
  }

  //Add New Visit
  async addNewVisit() {
    let validationModel = { ...this.validationModel };

    this.state.visitModel.batchDocumentID = "";
    this.state.visitModel.pageNumber = "";
    validationModel.responsepagesValField = "";
    validationModel.batchDocumentIDValField = "";
    validationModel.icd1ValField = "";
    validationModel.icd2ValField = "";
    validationModel.icd3ValField = "";
    validationModel.icd4ValField = "";
    validationModel.icd5ValField = "";
    validationModel.icd6ValField = "";
    validationModel.icd7ValField = "";
    validationModel.icd8ValField = "";
    validationModel.icd9ValField = "";
    validationModel.icd10ValField = "";
    validationModel.icd11ValField = "";
    validationModel.icd12ValField = "";
    await this.setState({
      chargeModel: { ...this.chargeModel },
      visitModel: { ...this.visitModel },
      validationModel: validationModel,
      chargeValidationModel: [],
      // patientDropDown: [],
      patientPlanDropdown: [],
      chargeModelArray: [],
      // practice: [],
      // location: [],
      // provider: [],
      // refProvider: [],
      // supProvider: [],
      // pos: [],
      patientObj: {},
      // editId: popupVisitId > 0 ? this.props.popupVisitId : this.props.id,
      popupPatientId: 0,
      maxHeight: "361",
      activeItem: "1",
      diagnosisRow: false,
      // cptRows: [],
      dob: "",
      gender: "",
      patientName: "",
      primaryPlanName: "",
      secondaryPlanName: "",
      tertiaryPlanName: "",
      primarySubscriberID: "",
      secondarySubscriberID: "",
      showPopup: false,
      chargeId: 0,
      icd1: "",
      ide2: "",
      icd3: "",
      icd4: "",
      // modifierOptions: [],
      // options: [],
      // cptOptions: [],
      popupName: "",
      id: 0,
      editId: 0,
      visitSubmitted: false,
      // items: [],
      icdArr: [],
      selectedDate: new Date("2014-08-18T21:11:54"),
      loading: false,
      isAns: false,
      batchDocumentID: "",
      pageNumber: "",
    });

    const charge = { ...this.chargeModel };
    charge.posid = this.state.visitModel.posid;
    charge.cptid = null;
    charge.cptObj = {};
    charge.totalAmount = "";
    charge.units = "";
    charge.dateOfServiceFrom = "";
    charge.dateOfServiceTo = "";
    charge.posid = this.state.visitModel.posid;
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: this.state.visitModel.charges.concat(charge),
      },
    });
  }

  //Add Diagnosis Row
  addDiagnosisRow(event) {
    event.preventDefault();
    this.setState({
      diagnosisRow: !this.state.diagnosisRow,
    });
  }

  //Add CPT Row
  async addCPTRow(event) {
    event.preventDefault();
    const charge = { ...this.chargeModel };
    charge.posid = this.state.visitModel.posid;
    if (this.state.visitModel.charges.length > 0) {
      charge.cptid = null;
      charge.cptObj = {};
      charge.totalAmount = "";
      charge.units = "";
      charge.pointer1 = this.state.visitModel.icD1ID ? 1 : null;
      charge.pointer2 = this.state.visitModel.icD2ID ? 2 : null;
      charge.pointer3 = this.state.visitModel.icD3ID ? 3 : null;
      charge.pointer4 = this.state.visitModel.icD4ID ? 4 : null;
      charge.dateOfServiceFrom = this.state.visitModel.charges[0].dateOfServiceFrom;
      charge.dateOfServiceTo = this.state.visitModel.charges[0].dateOfServiceTo;
    } else {
      charge.cptid = null;
      charge.cptObj = {};
      charge.totalAmount = "";
      charge.units = "";
      charge.dateOfServiceFrom = "";
      charge.dateOfServiceTo = "";
    }
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: this.state.visitModel.charges.concat(charge),
      },
    });
  }

  //Add Payment Row
  async addPaymentRow(event) {
    console.log("Advancve Payment Payment :", this.advancePatientPayment);
    event.preventDefault();
    let useAdvancePayment = false;
    if (this.advancePatientPayment > 0) {
      await Swal.fire({
        title: "Your Advance Payment is Available.Do you want to use that?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.value) {
          useAdvancePayment = true;
        }
      });
    }

    const patientPayment = { ...this.patientPaymentModel };
    if (useAdvancePayment == true) {
      patientPayment.paymentMethod = "Advance Payment";
      patientPayment.paymentAmount = this.advancePatientPayment;
    }

    var patientPaymentList = [];
    try {
      if (this.state.editId > 0) {
        patientPayment.visitID = this.state.editId;
        if (this.state.visitModel.patientPayments == null) {
          patientPaymentList = patientPaymentList.concat(patientPayment);
        } else {
          patientPaymentList = this.state.visitModel.patientPayments.concat(
            patientPayment
          );
        }
      } else {
        patientPaymentList = this.state.visitModel.patientPayments.concat(
          patientPayment
        );
      }
      this.setState({
        visitModel: {
          ...this.state.visitModel,
          patientPayments: patientPaymentList,
        },
      });
    } catch {}
  }

  //Delete CPT  Row
  async deleteCPTRow(event, index, chargeId) {
    event.preventDefault();
    const chargeID = chargeId;
    const id = event.target.id;
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        if (chargeID) {
          axios
            .delete(this.chargeUrl + "DeleteCharge/" + chargeId, this.config)
            .then((response) => {
              Swal.fire("Record Deleted Successfully", "", "success");
            })
            .catch((error) => {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being referenced in other screens.",
                "error"
              );
            });
        }

        let charges = [...this.state.visitModel.charges];
        var amount = this.state.visitModel.charges[id].totalAmount;
        charges.splice(id, 1);

        this.setState({
          visitModel: {
            ...this.state.visitModel,
            totalAmount: (this.state.visitModel.totalAmount - amount).toFixed(
              2
            ),
            charges: charges,
          },
        });
      }
    });
  }

  //Delete Patient Payment Row
  deletePatientPaymentRow = (event, index, paymentID) => {
    event.preventDefault();
    const patietnPaymentID = paymentID;
    const id = event.target.id;
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        if (patietnPaymentID) {
          // axios
          //   .delete(this.chargeUrl + "DeleteCharge/" + paymentID, this.config)
          //   .then(response => {
          //     Swal.fire("Record Deleted Successfully", "", "success");
          //   })
          //   .catch(error => {
          //     Swal.fire(
          //       "Record Not Deleted!",
          //       "Record can not be delete, as it is being referenced in other screens.",
          //       "error"
          //     );
          //   });

          Swal.fire("Record Deleted Successfully", "", "success");
        }

        let patientPayments = [...this.state.visitModel.patientPayments];
        patientPayments.splice(id, 1);
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            patientPayments: patientPayments,
          },
        });
      }
    });
  };

  //ICD Filter Options
  filterOption = (option, inputValue) => {
    try {
      var value = inputValue + "";
      if (value.length > 1) {
        const words = inputValue.split(" ");
        return words.reduce(
          (acc, cur) =>
            acc && option.label.toLowerCase().includes(cur.toLowerCase()),
          true
        );
      }
    } catch {}
  };

  //CPT Filter Options
  filterCPTOption = (option, inputValue) => {
    try {
      var value = inputValue + "";
      if (value.length > 1) {
        const words = inputValue.split(" ");
        return words.reduce(
          (acc, cur) =>
            acc && option.label.toLowerCase().includes(cur.toLowerCase()),
          true
        );
      }
    } catch {}
  };

  //Handle  ICD Change  Function
  async handleICDChange(icdSelectedOption, id, icdObj) {
    //If ICD value selected
    if (icdSelectedOption) {
      //UNIQUE ICD VALIDATION
      //filter icd array to check if this id already eists
      var isAvailable = await this.state.icdArr.filter(
        (icdId) => icdId == icdSelectedOption.id
      );
      var myVal = { ...this.validationModel };
      myVal.validation = false;
      //if selected icd id alredy exists in array then set validation message
      if (isAvailable.length > 0) {
        myVal.icd1ValField = (
          <span style={{ maringTop: "30px" }} className="validationMsg">
            Please Enter Unique ICD's
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.icd1ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }

      //set validation model state
      await this.setState({
        validationModel: myVal,
      });

      //if validation error then return
      if (myVal.validation === true) {
        return;
      }

      //Set Auto fill pointers
      var charges = [...this.state.visitModel.charges];
      if (charges.length == 1) {
        if (id == "icD1ID") {
          charges[0].pointer1 = 1;
        }
        if (id == "icD2ID") {
          charges[0].pointer2 = 2;
        }
        if (id == "icD3ID") {
          charges[0].pointer3 = 3;
        }
        if (id == "icD4ID") {
          charges[0].pointer4 = 4;
        }
      }

      //if every thing is right then set state of selected ICD
      this.setState({
        icdArr: this.state.icdArr.concat(icdSelectedOption.id),
        visitModel: {
          ...this.state.visitModel,
          [id]: icdSelectedOption.id,
          [icdObj]: icdSelectedOption,
          charges: charges,
        },
      });
    } else {
      //Get the copy of ICD Array
      var ICDArr = [...this.state.icdArr];
      //get the index of deleted ICD and then remove it
      await ICDArr.splice(
        this.state.icdArr.indexOf(this.state.visitModel[id]),
        1
      );
      //set state
      this.setState({
        icdArr: ICDArr,
        visitModel: {
          ...this.state.visitModel,
          [id]: null,
          [icdObj]: {},
        },
      });
    }
  }

  //Handle CPT Code Change
  async handleCPTCodeChange(cptModel, index) {
    console.log("CPT Object : ", cptModel);
    var charge = this.state.visitModel.charges[index];
    var cptUnits = null;
    var anesthesiaUnits = null;
    var perUnitAmount = null;
    let authorizationNum = "";
    if (cptModel == null) {
      charge.cptid = null;
      charge.cptObj = {};
      charge.category = "";
      cptUnits = null;
      anesthesiaUnits = null;
      perUnitAmount = null;
      charge.units = charge.unitsEntered ? charge.units : 0;
      charge.totalAmount = charge.unitsEntered ? charge.totalAmount : 0;
      authorizationNum = "";
    } else {
      charge.posid = cptModel.posid ? cptModel.posid : charge.posid;
      charge.cptid = cptModel.id;
      charge.cptObj = cptModel;
      charge.category = cptModel.category == null ? null : cptModel.category;
      cptUnits =
        Number(cptModel.description1) > 0
          ? Number(cptModel.description1)
          : null;
      anesthesiaUnits =
        Number(cptModel.anesthesiaUnits) > 0
          ? Number(cptModel.anesthesiaUnits)
          : null;
      perUnitAmount =
        Number(cptModel.description2) > 0
          ? Number(cptModel.description2)
          : null;
      charge.perUnitAmount =
        Number(perUnitAmount) > 0 ? Number(perUnitAmount) : 0;

      if (cptModel.category == "Anesthesia") {
        charge.baseUnits =
          anesthesiaUnits != null ? Number(anesthesiaUnits) : 0;
        let units =
          Number(charge.timeUnits) +
          (anesthesiaUnits != null ? Number(anesthesiaUnits) : 0) +
          (charge.modifier1AnsUnits != null
            ? Number(charge.modifier1AnsUnits)
            : 0) +
          (charge.modifier2AnsUnits != null
            ? Number(charge.modifier2AnsUnits)
            : 0) +
          (charge.modifier3AnsUnits != null
            ? Number(charge.modifier3AnsUnits)
            : 0) +
          (charge.modifier4AnsUnits != null
            ? Number(charge.modifier4AnsUnits)
            : 0);
        charge.units = units > 0 ? units : null;
        charge.totalAmount =
          charge.units * charge.perUnitAmount > 0
            ? charge.units * charge.perUnitAmount
            : null;
        charge.primaryBilledAmount =
          charge.units * charge.perUnitAmount > 0
            ? charge.units * charge.perUnitAmount
            : null;
      } else {
        cptUnits = cptUnits ? Number(cptUnits) : null;

        charge.units = charge.unitsEntered ? charge.units : cptUnits;
        let totalAmount = charge.units * charge.perUnitAmount;
        // +
        // (charge.modifier1Amount != null ? charge.modifier1Amount : 0) +
        // (charge.modifier2Amount != null ? charge.modifier2Amount : 0) +
        // (charge.modifier3Amount != null ? charge.modifier3Amount : 0) +
        // (charge.modifier4Amount != null ? charge.modifier4Amount : 0);
        charge.totalAmount = totalAmount > 0 ? totalAmount : "";
        charge.primaryBilledAmount = charge.totalAmount;
        charge.startTime = null;
        charge.endTime = null;
      }
      charge.cptUnits = cptUnits ? cptUnits : 0;
      charge.anesthesiaUnits = anesthesiaUnits ? anesthesiaUnits : 0;

      //Auth# changes
      let authModel = {
        cptId: cptModel.id,
        providerId: this.state.visitModel.providerID,
        patientId: this.state.visitModel.patientID,
        patientPlanId: this.state.visitModel.primaryPatientPlanID,
        dateOfServiceFrom: this.state.visitModel.charges[index]
          .dateOfServiceFrom
          ? this.state.visitModel.charges[index].dateOfServiceFrom
          : null,
        dateOfServiceTo: this.state.visitModel.charges[index].dateOfServiceTo
          ? this.state.visitModel.charges[index].dateOfServiceTo
          : null,
      };

      await axios
        .post(this.authURL + "GetAuthorizationNumber/", authModel, this.config)
        .then((response) => {
          authorizationNum = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    charge.authorizationNum = authorizationNum
      ? authorizationNum
      : charge.authorizationNum;
    await this.setState({
      // isAns: cptModel.category == null ? true : false,
      visitModel: {
        ...this.state.visitModel,
        authorizationNum: authorizationNum
          ? authorizationNum
          : this.state.visitModel.authorizationNum,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice(index + 1),
        ],
      },
    });

    this.calculateChargesTotalAmount();
  }

  //Calculate Total Amount of All Charges and then set total amount and primary billed amount fields
  async calculateChargesTotalAmount() {
    let newChargeList = this.state.visitModel.charges;
    var totalAmount = 0;
    await newChargeList.map((charge) => {
      if (
        charge.totalAmount == undefined ||
        charge.totalAmount == "" ||
        charge.totalAmount < 0
      ) {
        totalAmount += 0;
      } else {
        totalAmount += Number(parseFloat(charge.totalAmount).toFixed(2));
      }
    });

    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        totalAmount: totalAmount,
        primaryBilledAmount: totalAmount,
      },
    });
  }

  //calculate ansthasia units and total amount
  ansUnits = (charge, ansUnits, option) => {
    var ansUnits =
      charge.anesthesiaUnits != null ? Number(charge.anesthesiaUnits) : 0;
    var timeUnits = charge.timeUnits != null ? Number(charge.timeUnits) : 0;
    var modifier1Units =
      charge.modifier1AnsUnits != null ? Number(charge.modifier1AnsUnits) : 0;
    var modifier2Units =
      charge.modifier2AnsUnits != null ? Number(charge.modifier2AnsUnits) : 0;
    var modifier3Units =
      charge.modifier3AnsUnits != null ? Number(charge.modifier3AnsUnits) : 0;
    var modifier4Units =
      charge.modifier4AnsUnits != null ? Number(charge.modifier4AnsUnits) : 0;

    var units =
      option == "add"
        ? Number(charge.units) + Number(ansUnits)
        : Number(charge.units) - Number(ansUnits);

    charge.units = charge.unitsEntered
      ? units
      : ansUnits +
        timeUnits +
        modifier1Units +
        modifier2Units +
        modifier3Units +
        modifier4Units;
    charge.modifierUnits =
      modifier1Units + modifier2Units + modifier3Units + modifier4Units;

    charge.totalAmount = charge.units * charge.perUnitAmount;
    charge.primaryBilledAmount = charge.totalAmount;
    charge.totalAmount = charge.units * charge.perUnitAmount;
    charge.primaryBilledAmount = charge.totalAmount;
  };

  //calculate not Ansthesia units and total amount
  notAnsUnits = (charge) => {
    charge.units = charge.unitsEntered ? charge.units : charge.cptUnits;
    charge.totalAmount = charge.units * charge.perUnitAmount;
    charge.primaryBilledAmount = charge.totalAmount;
  };

  //handle modifier change
  async handleModifierChange(
    modifier,
    index,
    modifierID,
    modifierObj,
    modifierAnsUnits,
    modifierAmount
  ) {
    var charge = this.state.visitModel.charges[index];
    if (modifier == null) {
      charge[modifierID] = null;
      charge[modifierObj] = null;
      charge[modifierAnsUnits] = null;
      charge[modifierAmount] = null;

      if (charge.category == "Anesthesia") {
        await this.ansUnits(charge, charge[modifierAnsUnits], "sub"); //calculate ansthasia units and total amount
        charge[modifierAmount] = 0;
      } else {
        if (charge.cptid != null) {
          charge[modifierAmount] = 0;
          await this.notAnsUnits(charge); //calculate not Ansthesia units and total amount
        }
      }
    } else {
      charge[modifierID] = modifier.id;
      charge[modifierObj] = modifier;
      charge[modifierAnsUnits] = modifier.anesthesiaUnits;
      charge[modifierAmount] =
        modifier.description2 != null ? modifier.description2 : 0;

      if (charge.category == "Anesthesia") {
        await this.ansUnits(charge, modifier.anesthesiaUnits, "add"); //calculate ansthasia units and total amount
      } else {
        if (charge.cptid != null) {
          await this.notAnsUnits(charge); //calculate not Ansthesia units and total amount
        }
      }
    }

    this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice(index + 1),
        ],
      },
    });

    //Calculate Total Amount of All Charges and then set total amount and primary billed amount fields
    this.calculateChargesTotalAmount();
  }

  //Close Edit Charge Popup
  closeEditChargePopup = () => {
    $("#editChargeModal").hide();
    this.setState({ showPopup: false });
  };

  //Close New Charge
  closeNewCharge() {
    this.props.selectTabAction("Charges");
    this.props.history.push("/Charges");
  }

  //Handle Time Change
  async handleTimeChange(time, index, fieldName) {
    var charge = { ...this.state.visitModel.charges[index] };
    console.log("Time : ", time);
    //New CODE
    if (time == "Invalid Date" || time == null) {
      charge[fieldName] = null;
      if (fieldName == "startTime") {
        charge.startTimeValdation = true;
      } else {
        charge.endTimeValidation = true;
      }
    } else {
      //Set Time Validation to false
      if (fieldName == "startTime") {
        charge.startTimeValdation = false;
      } else {
        charge.endTimeValidation = false;
      }
      //Convert Time to momemt and add Date
      var a = moment(time);
      var dummyDate = "2019-11-11";
      var newTime = dummyDate + a.format().slice(10, 19);

      charge[fieldName] = newTime;
      //Set end time same as start time if end time is empty
      if (charge.endTime == null || charge.endTime == "") {
        charge.endTime = newTime;
      }

      if (
        new Date(charge.startTime).getTime() >
        new Date(charge.endTime).getTime()
      ) {
        dummyDate = "2019-11-12";
        newTime = dummyDate + a.format().slice(10, 19);
        charge.endTime = newTime;
      }

      if (charge.endTimeValidation == false) {
        //Calculate units
        if (charge.category == "Anesthesia") {
          charge.timeUnits = 0;
          if (
            !(
              this.isNull(charge.startTime) ||
              charge.startTime == "Invalid Date" ||
              this.isNull(charge.endTime) ||
              charge.endTime == "Invalid Date"
            )
          ) {
            var startTime = new Date(charge.startTime).getTime();
            var endTime = new Date(charge.endTime).getTime();
            var timeUnits =
              Number(Number(startTime) - Number(endTime)) / 1000 / 60 / 15;
            timeUnits = timeUnits < 0 ? timeUnits * -1 : timeUnits;
            var aftterDecimal = (timeUnits + "").split(".");
            aftterDecimal.length > 1
              ? Number("0." + aftterDecimal[1]) > 0.498888888888889
                ? (charge.timeUnits = Number(aftterDecimal[0]) + 1)
                : (charge.timeUnits = Number(aftterDecimal[0]))
              : (charge.timeUnits = Number(aftterDecimal[0]));
          }

          var ansUnits =
            charge.anesthesiaUnits != null ? Number(charge.anesthesiaUnits) : 0;
          var timeUnits =
            charge.timeUnits != null ? Number(charge.timeUnits) : 0;
          var modifier1Units =
            charge.modifier1AnsUnits != null
              ? Number(charge.modifier1AnsUnits)
              : 0;
          var modifier2Units =
            charge.modifier2AnsUnits != null
              ? Number(charge.modifier2AnsUnits)
              : 0;
          var modifier3Units =
            charge.modifier3AnsUnits != null
              ? Number(charge.modifier3AnsUnits)
              : 0;
          var modifier4Units =
            charge.modifier4AnsUnits != null
              ? Number(charge.modifier4AnsUnits)
              : 0;
          charge.units = charge.unitsEntered
            ? Number(charge.units)
            : ansUnits +
              timeUnits +
              modifier1Units +
              modifier2Units +
              modifier3Units +
              modifier4Units;

          charge.totalAmount = charge.units * charge.perUnitAmount;
          charge.primaryBilledAmount = charge.totalAmount;
        } else {
          charge.timeUnits = 0;
          charge.units = charge.cptUnits;
          charge.totalAmount =
            charge.units * charge.perUnitAmount +
            (charge.modifier1Amount != null ? charge.modifier1Amount : 0) +
            (charge.modifier2Amount != null ? charge.modifier2Amount : 0) +
            (charge.modifier3Amount != null ? charge.modifier3Amount : 0) +
            (charge.modifier4Amount != null ? charge.modifier4Amount : 0);
          charge.primaryBilledAmount = charge.totalAmount;
        }
      }
    }

    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice(index + 1),
        ],
      },
    });
    this.calculateChargesTotalAmount();
  }

  //Is Disabled Function
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  //Open CPT Popup on Double Click
  openCPTPopup = (event) => {
    event.preventDefault();
    try {
      if (event.id) {
        this.openPopup("cpt", event.id);
      }
    } catch {}
  };

  //Open Modifiers Popup on Double Click
  openModifierPopup = (event) => {
    event.preventDefault();
    try {
      if (event.id) {
        this.openPopup("modifier", event.id);
      }
    } catch {}
  };

  //Clean Input Function For AutoComplete
  cleanInput = (inputValue) => {
    // Strip all non-number characters from the input
    return inputValue.replace(inputValue, "fawa");
  };

  //Get Patient ID
  async getPatientID(patID) {
    $("#myModal1").hide();
    var patientInfo = await this.state.patientDropDown.filter(
      (patient) => patient.patientID == patID.patietnID
    );
    this.handlePatientDropDownChange(patientInfo[0]);
  }

  //Open History Popup
  openhistorypopup = (name, id) => {
    this.setState({ popupName: "NewHistoryPractice", id: id });
  };

  //Close History Popup
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ popupName: "" });
  };

  /******************************************khizer code*************************************************************/

  async addRowNotes(event) {
    event.preventDefault();
    const note = { ...this.notesModel };
    var len = this.state.visitModel.note
      ? this.state.visitModel.note.length
      : 0;
    if (len == 0) {
      await this.setState({
        visitModel: {
          ...this.state.visitModel,
          note: this.state.visitModel.note.concat(note),
        },
      });
      return;
    } else {
      len = len - 1;
      if (this.isNull(this.state.visitModel.note[len].note)) {
        Swal.fire("First Enter Previous Notes", "", "error");
        return;
      } else {
        await this.setState({
          visitModel: {
            ...this.state.visitModel,
            note: this.state.visitModel.note.concat(note),
          },
        });
      }
    }

    // const note = { ...this.notesModel };
    // await this.setState({
    //   visitModel: {
    //     ...this.state.visitModel,
    //     note: this.state.visitModel.note.concat(note)
    //   }
    // });
  }

  handleNoteChange(event) {
    event.preventDefault();
    let newNotesList = this.state.visitModel.note;
    const index = event.target.id;
    const name = event.target.name;
    const caret = event.target.selectionStart;
    const element = event.target;
    var value = event.target.value;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    if (caret == 0 || caret <= 1) {
      value = value.trim();
    }

    newNotesList[index][name] = value.toUpperCase();

    this.setState({
      visitModel: {
        ...this.state.visitModel,
        note: newNotesList,
      },
    });
  }

  async deleteRowNotes(event, index, NoteRowId) {
    event.preventDefault();
    const NoteRowID = NoteRowId;
    const id = event.target.id;
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        //KHIZER CODE-------------------------DeleteNote
        if (NoteRowID > 0) {
          axios
            .delete(this.Notesurl + "DeleteNotes/" + NoteRowID, this.config)
            .then((response) => {
              Swal.fire("Record Deleted Successfully", "", "success");
              let note = [...this.state.visitModel.note];
              note.splice(id, 1);
              this.setState({
                visitModel: {
                  ...this.state.visitModel,
                  note: note,
                },
              });
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status) {
                  if (error.response.status == 400) {
                    Swal.fire("Error", error.response.data, "error");
                  } else {
                    Swal.fire(
                      "Record Not Deleted!",
                      "Record can not be delete, as it is being referenced in other screens.",
                      "error"
                    );
                  }
                }
              } else {
                Swal.fire(
                  "Record Not Deleted!",
                  "Record can not be delete, as it is being referenced in other screens.",
                  "error"
                );
              }
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          let note = [...this.state.visitModel.note];
          note.splice(id, 1);
          this.setState({
            visitModel: {
              ...this.state.visitModel,
              note: note,
            },
          });
        }
      }
    });
  }

  //Previous Visit
  async previousVisit(event) {
    event.preventDefault();
    if (this.currentIndex - 1 < 0) {
      Swal.fire("No More Visits", "", "warning");
      return;
    }
    this.currentIndex = this.currentIndex - 1;
    var visitID = this.props.visitGridData[this.currentIndex];
    await this.setState({
      editId: visitID.visitID,
      visitModel: {
        ...this.state.visitModel,
        id: 0,
      },
    });
    this.props.selectTabAction("NewCharge", visitID.visitID);
    this.UNSAFE_componentWillMount();
  }

  //NextVisit
  async nextVisit(event) {
    event.preventDefault();
    if (this.currentIndex + 1 >= this.props.visitGridData.length) {
      Swal.fire("No More Visits", "", "warning");
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    var visitID = this.props.visitGridData[this.currentIndex];
    await this.setState({
      editId: visitID.visitID,
      visitModel: {
        ...this.state.visitModel,
        id: 0,
      },
    });

    this.props.selectTabAction("NewCharge", visitID.visitID);
    this.UNSAFE_componentWillMount();
  }

  openBPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closeBPopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  async getbatchID(batID) {
    $("#myModal").hide();
    await this.setState({
      popupName: "",
      id: 0,
      visitModel: {
        ...this.state.visitModel,
        batchDocumentID: batID[0],
      },
    });

    var myVal = { ...this.validationModel };
    axios
      .get(
        this.batchURL +
          "FindBatchDocumentPath/" +
          this.state.visitModel.batchDocumentID,
        this.config
      )
      .then((response) => {
        myVal.batchDocumentIDValField = "";
        myVal.responsepagesValField = (
          <span
            className="validationMsg"
            style={{ color: "green" }}
          >
            Number of Pages: {response.data.numberOfPages}
          </span>
        );
        this.setState({
          pageNumber: response.data.numberOfPages,
          fileURL: response.data.documentFilePath,
          validationModel: myVal,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 404) {
              console.log("Not Found");
              var myVal = { ...this.validationModel };

              myVal.batchDocumentIDValField = (
                <span className="validationMsg" style={{ textAlign: "left" }}>
                  Invalid Batch # {this.state.visitModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            } else if (error.response.status == 400) {
              console.log("Not Found");
              var myVal = { ...this.validationModel };

              myVal.batchDocumentIDValField = (
                <span className="validationMsg" style={{ textAlign: "left" }}>
                  Invalid Batch # {this.state.visitModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            }
          }
        }
      });
  }

  render() {
    try {
      if (this.props.userInfo1.userPractices.length > 0) {
        if (this.state.practice.length == 0) {
          if (this.state.editId == 0) {
            let locID =
              this.props.userInfo1.userLocations.length > 1
                ? this.props.userInfo1.userLocations[1].id
                : null;
            let provID =
              this.props.userInfo1.userProviders.length > 1
                ? this.props.userInfo1.userProviders[1].id
                : null;
            let refProvID =
              this.props.userInfo1.userRefProviders.length > 1
                ? this.props.userInfo1.userRefProviders[1].id
                : null;

            this.setState({
              visitModel: {
                ...this.state.visitModel,
                practiceID: this.props.userInfo1.practiceID,
                locationID: locID,
                providerID: provID,
                refProviderID: refProvID,
              },
              practice: this.props.userInfo1.userPractices,
              location: this.props.userInfo1.userLocations,
              provider: this.props.userInfo1.userProviders,
              refProvider: this.props.userInfo1.userRefProviders,
            });
          } else {
            this.setState({
              patientModel: {
                ...this.state.patientModel,
                practiceID: this.props.userInfo1.practiceID,
              },
              practice: this.props.userInfo1.userPractices,
              location: this.props.userInfo1.userLocations,
              provider: this.props.userInfo1.userProviders,
              refProvider: this.props.userInfo1.userRefProviders,
            });
          }
        }
      }
    } catch {}

    try {
      this.props.visitGridData.filter((visit, index) => {
        if (visit.visitID == this.state.editId) {
          this.currentIndex = index;
        }
      });
    } catch {}

    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingsIcon} width="17px" />
      </div>
    );

    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onChange={() => this.openhistorypopup("NewHistoryPractice", 0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    // let popup = "";

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <EditCharge
          onClose={this.closeEditChargePopup}
          chargeId={this.state.chargeId}
          chargesList={this.state.visitModel.charges}
          icd1Id={this.state.icd1}
          icd2Id={this.state.icd2}
          icd3Id={this.state.icd3}
          icd4Id={this.state.icd4}
        ></EditCharge>
      );
    } else if (this.state.popupName === "patient") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "manualPosting") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          visitID={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName == "patientSearch") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          getPatientID={(name) => this.getPatientID(name)}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName == "batch") {
      popup = (
        <BatchDocumentPopup
          onClose={this.closeBPopup}
          // getbatchID={(name) => this.getbatchID(name)}
          // popupName="batchNo"
          id={this.state.visitModel.batchDocumentID}
        ></BatchDocumentPopup>
      );
    } else if (this.state.popupName == "batchNo") {
      popup = (
        <GPopup
          onClose={this.closeBPopup}
          getbatchID={(name) => this.getbatchID(name)}
          popupName="batchNo"
          batchPopupID={this.state.visitModel.batchDocumentID}
        ></GPopup>
      );
    } else if (this.state.popupName === "practice") {
      popup = (
        <NewPractice
          onClose={this.closePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.popupName === "location") {
      popup = (
        <NewLocation onClose={this.closePopup} id={this.state.id}></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      popup = (
        <NewProvider onClose={this.closePopup} id={this.state.id}></NewProvider>
      );
    } else if (this.state.popupName === "refprovider") {
      popup = (
        <NewRefferingProvider
          onClose={this.closePopup}
          id={this.state.id}
        ></NewRefferingProvider>
      );
    } else if (this.state.popupName === "pos") {
      popup = <NewPOS onClose={this.closePopup} id={this.state.id}></NewPOS>;
    } else if (this.state.popupName === "superprovider") {
      popup = (
        <NewProvider onClose={this.closePopup} id={this.state.id}></NewProvider>
      );
    } else if (
      this.state.popupName === "icd1" ||
      this.state.popupName === "icd2" ||
      this.state.popupName === "icd3" ||
      this.state.popupName === "icd4" ||
      this.state.popupName === "icd5" ||
      this.state.popupName === "icd6" ||
      this.state.popupName === "icd7" ||
      this.state.popupName === "icd8" ||
      this.state.popupName === "icd9" ||
      this.state.popupName === "icd10" ||
      this.state.popupName === "icd11" ||
      this.state.popupName === "icd12"
    ) {
      popup = <NewICD onClose={this.closePopup} id={this.state.id}></NewICD>;
    } else if (this.state.popupName == "cpt") {
      popup = <NewCPT onClose={this.closePopup} id={this.state.id}></NewCPT>;
    } else if (this.state.popupName == "modifier") {
      popup = (
        <NewModifier onClose={this.closePopup} id={this.state.id}></NewModifier>
      );
    } else if (this.state.popupName === "insuranceplan") {
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else if (this.state.popupName == "NewHistoryPractice") {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.visitUrl}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else if (this.state.popupName === "pagePDF") {
      popup = (
        <PagePDF
          onClose={this.closePage}
          pageNumber={this.state.pageNumber}
          fileURL={this.state.fileURL}
          id={this.state.id}
        ></PagePDF>
      );
    } else if (this.state.popupName === "batchDocument") {
      popup = (
        <BatchDocumentPopup
          onClose={this.closeBatchDoc}
          id={this.state.id}
        ></BatchDocumentPopup>
      );
    } else if (this.state.showRPopup) {
      popup = (
        <NewRefferingProvider
          onClose={this.closeRefProviderPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        >
          >
        </NewRefferingProvider>
      );
    } else if (this.state.showPPopup) {
      popup = (
        <NewProvider
          onClose={this.closeProviderPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        >
          >
        </NewProvider>
      );
    } else if (this.state.showLPopup) {
      popup = (
        <NewLocation
          onClose={this.closeLocationPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewLocation>
      );
    } else if (this.state.showPOSPopup) {
      popup = (
        <NewPOS
          onClose={this.closePOSPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewPOS>
      );
    } else if (this.state.showICDPopup) {
      popup = (
        <NewICD
          onClose={this.closeICDPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewICD>
      );
    } else popup = null;

    if (popup !== null) {
      console.log("Hidden");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    const isActive = this.state.visitModel.isActive;

    const headers = [
      "Claim Dates & Authorizations",
      "Accident & Labs",
      "Other",
      "Notes",
    ];

    const insuranceInfoHeaders = ["Primary Plan", "Secondary Plan"];

    const gender = [
      { value: "", display: "Select Gender" },
      { value: "male", display: "Male" },
      { value: "female", display: "Female" },
      { value: "unknown", display: "Unknown" },
    ];

    let primaryStatus = [];
    try {
      if (this.state.visitModel.primaryStatus == "Pending") {
        primaryStatus = [
          { value: "N", display: "New Charge" },
          { value: "Pending", display: "Pending" },
        ];
      } else {
        primaryStatus = [
          { value: "N", display: "New Charge" },
          { value: "S", display: "Submitted" },
          { value: "K", display: "999 Accepted" },
          { value: "W", display: "Write Off" },
          { value: "D", display: "999 Denied" },
          { value: "E", display: "999 has Errors" },
          { value: "P", display: "Paid" },
          { value: "PT_P", display: "Patient Paid" },
          { value: "PPTS", display: "Paid-Transferred To Sec" },
          { value: "PPTT", display: "Paid-Transferred To Ter" },
          { value: "PPTP", display: "Paid-Transferred To Patient" },
          { value: "SPTP", display: "Paid-Transferred To Patient" },
          { value: "SPTT", display: "Paid-Transferred To Ter" },
          { value: "PR_TP", display: "Pat. Resp. Transferred to Pat" },
          { value: "DN", display: "Denied" },
          { value: "PPTM", display: "Paid - Medigaped" },
          { value: "M", display: "Medigaped " },
          { value: "R", display: "Rejected" },
          { value: "A1AY", display: "Received By Clearing House" },
          { value: "A0PR", display: "Farwarded to Payer" },
          { value: "A1PR", display: "Received By Payer" },
          { value: "A2PR", display: "Accepted By Payer" },
          { value: "TS", display: "Transferred to Secondary" },
          { value: "TT", display: "Accepted By Tertiary" },
          { value: "PTPT", display: "Plan to Patient Transfer" },
          { value: "PAT_T_PT", display: "Patient to Plan Transfer" },
        ];
      }
    } catch {
      primaryStatus = [];
    }

    let status = [
      { value: "N", display: "New Charge" },
      { value: "S", display: "Submitted" },
      { value: "K", display: "999 Accepted" },
      { value: "W", display: "Write Off" },
      { value: "D", display: "999 Denied" },
      { value: "E", display: "999 has Errors" },
      { value: "P", display: "Paid" },
      { value: "PT_P", display: "Patient Paid" },
      { value: "PPTS", display: "Paid-Transferred To Sec" },
      { value: "PPTT", display: "Paid-Transferred To Ter" },
      { value: "PPTP", display: "Paid-Transferred To Patient" },
      { value: "SPTP", display: "Paid-Transferred To Patient" },
      { value: "SPTT", display: "Paid-Transferred To Ter" },
      { value: "PR_TP", display: "Pat. Resp. Transferred to Pat" },
      { value: "DN", display: "Denied" },
      { value: "PPTM", display: "Paid - Medigaped" },
      { value: "M", display: "Medigaped " },
      { value: "R", display: "Rejected" },
      { value: "A1AY", display: "Received By Clearing House" },
      { value: "A0PR", display: "Farwarded to Payer" },
      { value: "A1PR", display: "Received By Payer" },
      { value: "A2PR", display: "Accepted By Payer" },
      { value: "TS", display: "Transferred to Secondary" },
      { value: "TT", display: "Accepted By Tertiary" },
      { value: "PTPT", display: "Plan to Patient Transfer" },
      { value: "PAT_T_PT", display: "Patient to Plan Transfer" },
    ];

    let paymentType = [];
    if (this.state.visitModel.insurancePlanID === 1) {
      paymentType = [
        { value: "", display: "Select Type" },
        { value: "O", display: "Other" },
        { value: "D", display: "Discount" },
      ];
    } else {
      paymentType = [
        { value: "", display: "Select Type" },
        { value: "C", display: "Copay" },
        { value: "O", display: "Other" },
        { value: "D", display: "Discount" },
      ];
    }

    const paymentMethod = [
      { value: "", display: "Select Method " },
      { value: "Cash", display: "Cash" },
      { value: "Check", display: "Check" },
      { value: "Credit Card", display: "Credit Card" },
      { value: "Advance Payment", display: "Advance Payment" },
    ];

    const accidentType = [
      { value: "", display: "Select Type" },
      { value: "EM", display: "New Employment " },
      { value: "AA", display: "Auto Accident" },
      { value: "OA", display: "Other Accident" },
      { value: "AB", display: "Abuse" },
      { value: "AP", display: "Another Party Responsible" },
    ];

    const claimFrequencyCode = [
      { value: "", display: "Select Code" },
      { value: "1", display: "Original " },
      { value: "6", display: "Corrected" },
      { value: "7", display: "Replacement" },
      { value: "8", display: "Void" },
    ];

    const usStates = [
      { value: "", display: "Select State" },
      { value: "AL", display: "AL - Alabama" },
      { value: "AK", display: "AK - Alaska" },
      { value: "AZ", display: "AZ - Arizona" },
      { value: "AR", display: "AR - Arkansas" },
      { value: "CA", display: "CA - California" },
      { value: "CO", display: "CO - Colorado" },
      { value: "CT", display: "CT - Connecticut" },
      { value: "DE", display: "DE - Delaware" },
      { value: "FL", display: "FL - Florida" },
      { value: "GA", display: "GA - Georgia" },
      { value: "HI", display: "HI - Hawaii" },
      { value: "ID", display: "ID - Idaho" },
      { value: "IL", display: "IL - Illinois" },
      { value: "IN", display: "IN - Indiana" },
      { value: "IA", display: "IA - Iowa" },
      { value: "KS", display: "KS - Kansas" },
      { value: "KY", display: "KY - Kentucky" },
      { value: "LA", display: "LA - Louisiana" },
      { value: "ME", display: "ME - Maine" },
      { value: "MD", display: "MD - Maryland" },
      { value: "MA", display: "MA - Massachusetts" },
      { value: "MI", display: "MI - Michigan" },
      { value: "MN", display: "MN - Minnesota" },
      { value: "MS", display: "MS - Mississippi" },
      { value: "MO", display: "MO - Missouri" },
      { value: "MT", display: "MT - Montana" },
      { value: "NE", display: "NE - Nebraska" },
      { value: "NV", display: "NV - Nevada" },
      { value: "NH", display: "NH - New Hampshire" },
      { value: "NJ", display: "NJ - New Jersey" },
      { value: "NM", display: "NM - New Mexico" },
      { value: "NY", display: "NY - New York" },
      { value: "NC", display: "NC - North Carolina" },
      { value: "ND", display: "ND - North Dakota" },
      { value: "OH", display: "OH - Ohio" },
      { value: "OK", display: "OK - Oklahoma" },
      { value: "OR", display: "OR - Oregon" },
      { value: "PA", display: "PA - Pennsylvania" },
      { value: "RI", display: "RI - Rhode Island" },
      { value: "SC", display: "SC - South Carolina" },
      { value: "SD", display: "SD - South Dakota" },
      { value: "TN", display: "TN - Tennessee" },
      { value: "TX", display: "TX - Texas" },
      { value: "UT", display: "UT - Utah" },
      { value: "VT", display: "VT - Vermont" },
      { value: "VA", display: "VA - Virginia" },
      { value: "WA", display: "WA - Washington" },
      { value: "WV", display: "WV - West Virginia" },
      { value: "WI", display: "WI - Wisconsin" },
      { value: "WY", display: "WY - Wyoming" },
    ];

    let newList = [];
    var tableData = {};
    // if(this.state.isAns){
    this.state.visitModel.charges.map((row, index) => {
      let dosFrom = row.dateOfServiceFrom
        ? moment(row.dateOfServiceFrom).format().slice(0, 10)
        : "";
      let dosTo = row.dateOfServiceTo
        ? moment(row.dateOfServiceTo).format().slice(0, 10)
        : "";
      var paid =
        (this.state.visitModel.charges[index].primaryPaid
          ? this.state.visitModel.charges[index].primaryPaid
          : 0) +
        (this.state.visitModel.charges[index].secondaryPaid
          ? this.state.visitModel.charges[index].secondaryPaid
          : 0);
      var writeOff =
        (this.state.visitModel.charges[index].primaryWriteOff
          ? this.state.visitModel.charges[index].primaryWriteOff
          : 0) +
        (this.state.visitModel.charges[index].secondaryWriteOff
          ? this.state.visitModel.charges[index].secondaryWriteOff
          : 0);
      var planBalance =
        (this.state.visitModel.charges[index].primaryBal
          ? this.state.visitModel.charges[index].primaryBal
          : 0) +
        (this.state.visitModel.charges[index].secondaryBal
          ? this.state.visitModel.charges[index].secondaryBal
          : 0);
      var patientPaid = this.state.visitModel.charges[index].patientPaid
        ? this.state.visitModel.charges[index].patientPaid
        : 0;
      var patientBalance =
        (this.state.visitModel.charges[index].primaryPatientBal
          ? this.state.visitModel.charges[index].primaryPatientBal
          : 0) +
        (this.state.visitModel.charges[index].secondaryPatientBal
          ? this.state.visitModel.charges[index].secondaryPatientBal
          : 0);

      newList.push({
        ChargeId:
          this.state.editId > 0 || this.state.visitModel.id > 0 ? (
            <a
              href=""
              id={index}
              onClick={(event) =>
                this.openEditChargePopup(event, index, row.id)
              }
            >
              {row.id}
            </a>
          ) : (
            ""
          ),
        dosFrom: (
          <div style={{ width: "140px", marginTop: "0px", marginLeft: "10px" }}>
            <input
              className="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              min="1900-01-01"
              max="9999-12-31"
              disabled={this.state.visitSubmitted == true ? true : false}
              name="dateOfServiceFrom"
              id={index}
              value={this.state.visitModel.charges[index].dateOfServiceFrom}
              onChange={this.handleChargeChange}
            ></input>
            <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {this.state.visitModel.charges[index].dosFromValField}
              {this.state.visitModel.charges[index].dosFromFDValField}
            </div>
          </div>
        ),
        dosTo: (
          <div
            style={{ width: "140px", marginTop: "-0px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              min="1900-01-01"
              max="9999-12-31"
              disabled={this.state.visitSubmitted == true ? true : false}
              name="dateOfServiceTo"
              id={index}
              value={this.state.visitModel.charges[index].dateOfServiceTo}
              onChange={this.handleChargeChange}
            ></input>
            <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {this.state.visitModel.charges[index].dosToValField}
              {this.state.visitModel.charges[index].dosToFDValField}
            </div>
          </div>
        ),
        cptCode: (
          <div
            style={{ width: "125px", marginTop: "0px" }}
            onDoubleClick={() =>
              this.openCPTPopup(this.state.visitModel.charges[index].cptObj)
            }
          >
            <Select
              value={this.state.visitModel.charges[index].cptObj}
              onChange={(event) => this.handleCPTCodeChange(event, index)}
              options={this.props.cptCodes}
              placeholder=""
              isDisabled={this.state.visitSubmitted == true ? true : false}
              menuPosition="fixed"
              filterOption={this.filterCPTOption}
              menuShouldBlockScroll={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              isClearable={true}
              isSearchable={true}
              styles={{
                indicatorSeparator: () => {},
                clearIndicator: (defaultStyles) => ({
                  ...defaultStyles,
                  color: "#286881",
                }),
                indicatorsContainer: (defaultStyles) => ({
                  ...defaultStyles,
                  padding: "0px",
                  marginBottom: "2px",
                }),
                dropdownIndicator: () => ({
                  display: "none",
                }),
                singleValue: (defaultStyles) => ({
                  ...defaultStyles,
                  paddingBottom: "9px",
                }),
                control: (defaultStyles) => ({
                  ...defaultStyles,
                  minHeight: "28px",
                  paddingLeft: "5px",
                  borderRadius: "8px",
                  height: "30px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                  // display:'none'
                }),
              }}
            />
            <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {" "}
              {this.state.visitModel.charges[index].cptCodeValField}
            </div>
          </div>
        ),
        modifiers: (
          <div className="" style={{ width: "365px" }}>
            <div className="row">
              <div
                // className="hideDD"
                style={{ marginLeft: "10px", width: "90px", height: "20px" }}
                onDoubleClick={(event) =>
                  this.openModifierPopup(
                    event,
                    this.state.visitModel.charges[index].modifier1Obj
                  )
                }
              >
                <Select
                  value={this.state.visitModel.charges[index].modifier1Obj}
                  onChange={(event) =>
                    this.handleModifierChange(
                      event,
                      index,
                      "modifier1ID",
                      "modifier1Obj",
                      "modifier1AnsUnits",
                      "modifier1Amount"
                    )
                  }
                  isDisabled={this.state.visitSubmitted == true ? true : false}
                  options={this.props.modifiers}
                  placeholder=""
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  isClearable={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    // container : (defaultProps) =>({
                    //   ...defaultProps,
                    //   position:"absolute",
                    //   width: "125px"
                    // }),
                    menu: (styles) => ({ ...styles, width: "80px" }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px 0px 6px 0px",
                      marginBottom: "2px",
                    }),
                    indicatorContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px 0px 6px 0px",
                    }),
                    dropdownIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      height: "30px",
                      paddingLeft: "5px",
                      borderColor: "#C6C6C6",
                      boxShadow: "none",
                      borderRadius: "8px",
                      borderColor: "#C6C6C6",
                      "&:hover": {
                        borderColor: "#C6C6C6",
                      },
                      // display:'none'
                    }),
                  }}
                />
              </div>

              <div
                style={{ width: "90px", height: "20px" }}
                onDoubleClick={(event) =>
                  this.openModifierPopup(
                    event,
                    this.state.visitModel.charges[index].modifier2Obj
                  )
                }
              >
                <Select
                  value={this.state.visitModel.charges[index].modifier2Obj}
                  onChange={(event) =>
                    this.handleModifierChange(
                      event,
                      index,
                      "modifier2ID",
                      "modifier2Obj",
                      "modifier2AnsUnits",
                      "modifier2Amount"
                    )
                  }
                  options={this.props.modifiers}
                  placeholder=""
                  isClearable={true}
                  menuPosition="fixed"
                  isDisabled={this.state.visitSubmitted == true ? true : false}
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    // container : (defaultProps) =>({
                    //   ...defaultProps,
                    //   position:"absolute",
                    //   width: "125px"
                    // }),
                    menu: (styles) => ({ ...styles, width: "80px" }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    indicatorContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                    }),
                    dropdownIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      height: "30px",
                      paddingLeft: "5px",
                      borderColor: "#C6C6C6",
                      boxShadow: "none",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
                      "&:hover": {
                        borderColor: "#C6C6C6",
                      },
                      // display:'none'
                    }),
                  }}
                />
              </div>

              <div
                style={{ width: "90px", height: "20px" }}
                onDoubleClick={(event) =>
                  this.openModifierPopup(
                    event,
                    this.state.visitModel.charges[index].modifier3Obj
                  )
                }
              >
                <Select
                  value={this.state.visitModel.charges[index].modifier3Obj}
                  onChange={(event) =>
                    this.handleModifierChange(
                      event,
                      index,
                      "modifier3ID",
                      "modifier3Obj",
                      "modifier3AnsUnits",
                      "modifier3Amount"
                    )
                  }
                  isDisabled={this.state.visitSubmitted == true ? true : false}
                  options={this.props.modifiers}
                  placeholder=""
                  isClearable={true}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    // container : (defaultProps) =>({
                    //   ...defaultProps,
                    //   position:"absolute",
                    //   width: "125px"
                    // }),
                    menu: (styles) => ({ ...styles, width: "80px" }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    indicatorContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                    }),
                    dropdownIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      height: "30px",
                      paddingLeft: "5px",
                      borderColor: "#C6C6C6",
                      boxShadow: "none",
                      borderRadius: "8px",
                      borderColor: "#C6C6C6",
                      "&:hover": {
                        borderColor: "#C6C6C6",
                      },
                      // display:'none'
                    }),
                  }}
                />
              </div>

              <div
                style={{ width: "90px", height: "20px" }}
                onDoubleClick={(event) =>
                  this.openModifierPopup(
                    event,
                    this.state.visitModel.charges[index].modifier4Obj
                  )
                }
              >
                <Select
                  value={this.state.visitModel.charges[index].modifier4Obj}
                  onChange={(event) =>
                    this.handleModifierChange(
                      event,
                      index,
                      "modifier4ID",
                      "modifier4Obj",
                      "modifier4AnsUnits",
                      "modifier4Amount"
                    )
                  }
                  isDisabled={this.state.visitSubmitted == true ? true : false}
                  options={this.props.modifiers}
                  placeholder=""
                  isClearable={true}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    // container : (defaultProps) =>({
                    //   ...defaultProps,
                    //   position:"absolute",
                    //   width: "125px"
                    // }),
                    menu: (styles) => ({ ...styles, width: "80px" }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    indicatorContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                    }),
                    dropdownIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      height: "30px",
                      paddingLeft: "5px",
                      // backgroundColor:"hsl(60, 15%, 91%)",
                      borderColor: "#C6C6C6",
                      boxShadow: "none",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
                      "&:hover": {
                        borderColor: "#C6C6C6",
                      },
                      // display:'none'
                    }),
                  }}
                />
              </div>
              <div class="invalid-feedback">
                {" "}
                {this.state.visitModel.charges[index].modifierValField}
              </div>
            </div>
          </div>
        ),
        pointers: (
          <div style={{ width: "160px" }}>
            <input
              style={{
                width: "35px",
                padding: "5px",
                height: "30px",
                marginLeft: "3px",
              }}
              type="text"
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              value={this.state.visitModel.charges[index].pointer1}
              name="pointer1"
              id={index}
              onChange={(event) => this.handleChargeChange(event)}
              maxLength="2"
              onKeyPress={(event) => this.handleNumericCheck(event)}
            />
            <input
              style={{
                width: "35px",
                padding: "5px",
                height: "30px",
                marginLeft: "3px",
              }}
              type="text"
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              maxLength="2"
              type="text"
              value={this.state.visitModel.charges[index].pointer2}
              name="pointer2"
              id={index}
              onChange={(event) => this.handleChargeChange(event)}
              onKeyPress={(event) => this.handleNumericCheck(event)}
            ></input>
            <input
              style={{
                width: "35px",
                padding: "5px",
                height: "30px",
                marginLeft: "3px",
              }}
              type="text"
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              maxLength="2"
              type="text"
              value={this.state.visitModel.charges[index].pointer3}
              name="pointer3"
              id={index}
              onChange={(event) => this.handleChargeChange(event)}
              onKeyPress={(event) => this.handleNumericCheck(event)}
            ></input>
            <input
              style={{
                width: "35px",
                padding: "5px",
                height: "30px",
                marginLeft: "3px",
              }}
              type="text"
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              maxLength="2"
              type="text"
              value={this.state.visitModel.charges[index].pointer4}
              name="pointer4"
              id={index}
              onChange={(event) => this.handleChargeChange(event)}
              onKeyPress={(event) => this.handleNumericCheck(event)}
            ></input>

            <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {this.state.visitModel.charges[index].pointer1ValField}
            </div>
          </div>
        ),
        units: (
          <div style={{ marginTop: "0px", width: "70px" }}>
            <input
              style={{ width: "70px", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              value={
                this.state.visitModel.charges[index].units > 0
                  ? this.state.visitModel.charges[index].units
                  : ""
              }
              maxLength="4"
              name="units"
              id={index}
              onChange={this.handleChargeChange}
              onKeyPress={(event) => this.handleNumericCheck(event)}
            />
            <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {" "}
              {this.state.visitModel.charges[index].unitsValField}
            </div>
          </div>
        ),
        ndcUnits: (
          <div style={{ marginTop: "0px", width: "90px" }}>
            <input
              style={{ padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              value={
                this.state.visitModel.charges[index].units > 0
                  ? this.state.visitModel.charges[index].units
                  : ""
              }
              maxLength="4"
              value={
                this.state.visitModel.charges[index].ndcUnits > 0
                  ? this.state.visitModel.charges[index].ndcUnits
                  : ""
              }
              name="ndcUnits"
              id={index}
              onChange={this.handleChargeChange}
              onKeyPress={(event) => this.handleNumericCheck(event)}
            />
            <div class="invalid-feedback"></div>
          </div>
        ),
        pos: (
          <div style={{ marginTop: "0px", width: "100px" }}>
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              name="posid"
              id={index}
              value={this.state.visitModel.charges[index].posid}
              onChange={this.handleChargeChange}
            >
              {this.props.posCodes.map((s) => (
                <option key={s.id} value={s.id}>
                  {" "}
                  {s.description2}{" "}
                </option>
              ))}
            </select>

            <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {" "}
              {this.state.visitModel.charges[index].posValField}
            </div>
          </div>
        ),
        ammount: (
          <div style={{ marginTop: "0px", width: "100px" }}>
            <input
              style={{ padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled={this.state.visitSubmitted == true ? true : false}
              value={
                this.state.visitModel.charges[index].units > 0
                  ? this.state.visitModel.charges[index].units
                  : ""
              }
              value={this.state.visitModel.charges[index].totalAmount}
              name="totalAmount"
              id={index}
              onChange={this.handleCPTAmountChange}
            />
            <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {" "}
              {this.state.visitModel.charges[index].amountValField}
            </div>
          </div>
        ),
        isDontPrint: (
          <div
            style={{ width: "80px", marginBottom: "10px", marginLeft: "25px" }}
            class="lblChkBox"
          >
            <input
              style={{ width: "20px", height: "25px" }}
              type="checkbox"
              disabled={this.state.visitSubmitted == true ? true : false}
              id={"isDontPrint" + index}
              name="isDontPrint"
              checked={row.isDontPrint}
              onClick={(event) => {
                this.isDontPrintCB(event, index);
              }}
            />
            <label htmlFor={"authRequired" + index}>
              <span></span>
            </label>
          </div>
        ),
        startTime: (
          <div style={{ width: "150px", height: "33px" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                styl={{ height: "15px" }}
                margin="none"
                id="time-picker"
                label=""
                // ampm={false}
                format="hh:mm:ss a"
                placeholder="08:00:00 AM"
                mask="__:__:__ _M"
                views={["hours", "minutes", "seconds"]}
                value={this.state.visitModel.charges[index].startTime}
                onChange={(event) =>
                  this.handleTimeChange(event, index, "startTime")
                }
                disabled={
                  this.state.visitModel.charges[index].category == "Anesthesia"
                    ? false
                    : true
                }
                keyboardIcon={<Timer />}
                // KeyboardButtonProps={false}
              />

              {/* <TimePicker
                showTodayButton
                // ampm={false}
                invalidDateMessage=""
                // todayLabel="now"
                // type="time"
                // label="Step = 5"
                views={["hours" , "minutes" , "seconds"]}
                value={this.state.visitModel.charges[index].startTime}
                minutesStep={1}
                onChange={event =>
                  this.handleTimeChange(event, index, "startTime")
                }
              /> */}
            </MuiPickersUtilsProvider>
          </div>
        ),
        endTime: (
          <div style={{ width: "150px" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="none"
                id="time-picker"
                label={false}
                invalidDateMessage="Invalid Time Format"
                // ampm={false}
                format="hh:mm:ss a"
                placeholder="08:00:00 AM"
                mask="__:__:__ _M"
                views={["hours", "minutes", "seconds"]}
                value={this.state.visitModel.charges[index].endTime}
                onChange={(event) =>
                  this.handleTimeChange(event, index, "endTime")
                }
                disabled={
                  this.state.visitModel.charges[index].category == "Anesthesia"
                    ? false
                    : true
                }
                keyboardIcon={<Timer />}
                orientation="portrait"
                // KeyboardButtonProps={false}
              />

              {/* <TimePicker
                showTodayButton
                // todayLabel="now"
                // type="time"
                // label="Step = 5"
                // ampm={false}
                views={["hours" , "minutes" , "seconds"]}
                invalidDateMessage=""
                value={this.state.visitModel.charges[index].endTime}
                minutesStep={1}
                onChange={event =>
                  this.handleTimeChange(event, index, "endTime")
                }
              /> */}
            </MuiPickersUtilsProvider>
            {this.state.visitModel.charges[index].timeValField}
          </div>
        ),
        paid: (
          <div style={{ marginTop: "0px", width: "70px" }}>
            <input
              style={{ width: "70px", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled
              value={paid ? Number(paid).toFixed(2) : ""}
            />
            {/* <div class="invalid-feedback">  {this.state.visitModel.charges[index].amountValField}</div> */}
          </div>
        ),
        writeOff: (
          <div style={{ marginTop: "0px", width: "88px" }}>
            <input
              style={{ padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled
              value={writeOff ? Number(writeOff).toFixed(2) : ""}
            />
            {/* <div class="invalid-feedback">  {this.state.visitModel.charges[index].amountValField}</div> */}
          </div>
        ),
        planBalance: (
          <div style={{ marginTop: "0px", width: "80px" }}>
            <input
              style={{ padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled
              value={planBalance ? Number(planBalance).toFixed(2) : ""}
            />
            {/* <div class="invalid-feedback">  {this.state.visitModel.charges[index].amountValField}</div> */}
          </div>
        ),
        patientPaid: (
          <div style={{ marginTop: "0px", width: "75px" }}>
            <input
              style={{ padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled
              value={patientPaid ? Number(patientPaid).toFixed(2) : ""}
            />
            {/* <div class="invalid-feedback">  {this.state.visitModel.charges[index].amountValField}</div> */}
          </div>
        ),
        patientBalance: (
          <div style={{ marginTop: "0px", width: "70px" }}>
            <input
              style={{ width: "70px", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              disabled
              value={patientBalance ? Number(patientBalance).toFixed(2) : ""}
            />
            {/* <div class="invalid-feedback">  {this.state.visitModel.charges[index].amountValField}</div> */}
          </div>
        ),
        remove: (
          <div style={{ width: "50px", paddingRight: "15px" }}>
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span
                aria-hidden="true"
                id={index}
                onClick={(event, index) =>
                  this.deleteCPTRow(event, index, row.id)
                }
              >
                ×
              </span>
            </button>
          </div>
        ),
      });
    });
    tableData = {
      columns: [
        {
          label: "#",
          field: "ChargeId",
          sort: "asc",
          width: 168,
        },
        {
          label: "DOS FROM",
          field: "dosFrom",
          sort: "asc",
          width: 168,
        },
        {
          label: "DOS TO",
          field: "dosTo",
          sort: "asc",
          width: 150,
        },
        {
          label: "CPT CODE",
          field: "cptCode",
          sort: "asc",
          width: 254,
        },

        {
          label: "MODIFIERS",
          field: "modifiers",
          sort: "asc",
          width: 205,
        },
        {
          label: "DIAGNOSIS POINTERS",
          field: "pointers",
          sort: "asc",
          width: 100,
        },
        {
          label: "UNITS",
          field: "units",
          sort: "asc",
          width: 153,
        },
        {
          label: "NDC UNITS",
          field: "ndcUnits",
          sort: "asc",
          width: 153,
        },
        {
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 140,
        },
        {
          label: "AMOUNT",
          field: "ammount",
          sort: "asc",
          width: 50,
        },
        {
          label: "DON'T PRINT",
          field: "isDontPrint",
          sort: "asc",
          width: 50,
        },
        {
          label: "START TIME",
          field: "startTime",
          sort: "asc",
          width: 254,
        },
        {
          label: "END TIME",
          field: "endTime",
          sort: "asc",
          width: 254,
        },
        {
          label: "PAID",
          field: "paid",
          sort: "asc",
          width: 254,
        },
        {
          label: "WRITEOFF",
          field: "writeOff",
          sort: "asc",
          width: 254,
        },
        {
          label: "PLAN BAL",
          field: "planBalance",
          sort: "asc",
          width: 254,
        },
        {
          label: "PAT PAID",
          field: "patientPaid",
          sort: "asc",
          width: 254,
        },
        {
          label: "PAT BAL",
          field: "patientBalance",
          sort: "asc",
          width: 254,
        },
        {
          label: "",
          field: "remove",
          sort: "asc",
          width: 50,
        },
      ],
      rows: newList,
    };

    var patientPaymentList = [];
    if (this.isNull(this.state.visitModel.patientPayments) == false) {
      //Patient Payment Map method
      this.state.visitModel.patientPayments.map((row, index) => {
        console.log("Payment Date : " , row.paymentDate)
        var paymentDate = row.paymentDate ?
        moment(row.paymentDate).format().slice(0, 10)
         : "";
        console.log("Payment Date : " , paymentDate)
        let addedDate = row.addedDate ? row.addedDate.slice(0, 10) : "";
        patientPaymentList.push({
          addedDate: (
            <div
              style={{ width: "140px", marginLeft: "10px" }}
            >
              <input
                class="provider-form w-100 form-control-user"
                style={{ padding: "5px", height: "30px" }}
                disabled
                type="date"
                min="1900-01-01"
                max="9999-12-31"
                name="addedDate"
                id={index}
                value={addedDate}
              ></input>
              <div class="invalid-feedback">
                {/* {row.dateValField}
                {row.paymentDateFDValField} */}
              </div>
            </div>
          ),
          paymentDate: (
            <div
              style={{ width: "140px", marginLeft: "10px" }}
            >
              <input
                class="provider-form w-100 form-control-user"
                style={{ padding: "5px", height: "30px" }}
                type="date"
               
                name="paymentDate"
                min="1900-01-01"
                max="9999-12-31"
                disabled={row.status == "C" ? true : false}
                id={index}
                value={paymentDate}
                onChange={this.handlePatientPaymentChange}
              ></input>
              <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
                {row.dateValField}
                {row.paymentDateFDValField}
              </div>
            </div>
          ),
          type: (
            <div
              style={{
                marginBottom: "10px",
                width: "130px",
                marginLeft: "10px",
              }}
            >
              <select
                style={{ width: "100% ", padding: "5px", height: "30px" }}
                class="provider-form form-control-user"
                disabled={row.status == "C" ? true : false}
                name="type"
                id={index}
                value={this.state.visitModel.patientPayments[index].type}
                onChange={this.handlePatientPaymentChange}
              >
                {paymentType.map((s) => (
                  <option key={s.value} value={s.value}>
                    {" "}
                    {s.display}{" "}
                  </option>
                ))}
              </select>

              <div class="invalid-feedback" style={{paddingLeft:"0px"}}>{row.typeValField}</div>
            </div>
          ),
          paymentMethod: (
            <div style={{ marginBottom: "10px", width: "150px" }}>
              <select
                style={{ width: "100% ", padding: "5px", height: "30px" }}
                class="provider-form form-control-user"
                disabled={row.status == "C" ? true : false}
                name="paymentMethod"
                id={index}
                value={
                  this.state.visitModel.patientPayments[index].paymentMethod
                }
                onChange={this.handlePatientPaymentChange}
              >
                {paymentMethod.map((s) => (
                  <option key={s.value} value={s.value}>
                    {" "}
                    {s.display}{" "}
                  </option>
                ))}
              </select>

              <div class="invalid-feedback" style={{paddingLeft:"0px"}}>{row.methodValField}</div>
            </div>
          ),
          checkNumber: (
            <div
              style={{
                marginBottom: "10px",
                width: "200px",
                marginLeft: "10px",
              }}
            >
              <input
                style={{ width: "98%", padding: "5px", height: "30px" }}
                type="text"
                class="provider-form form-control-user"
                placeholder="Check #"
                id={index}
                disabled={
                  row.status == "C"
                    ? true
                    : row.paymentMethod == "Cash"
                    ? true
                    : false
                }
                value={this.state.visitModel.patientPayments[index].checkNumber}
                name="checkNumber"
                id={index}
                onChange={this.handlePatientPaymentChange}
                maxLength="20"
              />
              <div class="invalid-feedback" style={{paddingLeft:"0px"}}>{row.checkNumberValfield}</div>
            </div>
          ),
          paymentAmount: (
            <div
              style={{
                marginBottom: "10px",
                width: "150px",
                marginLeft: "10px",
              }}
            >
              <input
                style={{ width: "98%", padding: "5px", height: "30px" }}
                type="text"
                class="provider-form form-control-user"
                placeholder="Amount"
                disabled={row.status == "C" ? true : false}
                value={
                  this.state.visitModel.patientPayments[index].paymentAmount
                }
                name="paymentAmount"
                id={index}
                onChange={this.handlePatPaymentAmountChange}
                maxLength="20"
              />
              <div class="invalid-feedback" style={{paddingLeft:"0px"}}>{row.amountValField}</div>
            </div>
          ),
          remove: (
            <div style={{ width: "50px", paddingRight: "15px" }}>
              <button
                class="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span
                  aria-hidden="true"
                  id={index}
                  onClick={(event, index) =>
                    this.deletePatientPaymentRow(event, index, row.id)
                  }
                >
                  ×
                </span>
              </button>
            </div>
          ),
        });
      });
    } else {
      patientPaymentList = [];
    }

    //Patient Payment Grid Columns Name
    const patientPaymentTableDate = {
      columns: [
        {
          label: "POSTED DATE",
          field: "addedDate",
          sort: "asc",
          width: 168,
        },
        {
          label: "PAYMENT DATE",
          field: "paymentDate",
          sort: "asc",
          width: 168,
        },
        {
          label: "TYPE",
          field: "type",
          sort: "asc",
          width: 168,
        },
        {
          label: "PAYMENT METHOD",
          field: "paymentMethod",
          sort: "asc",
          width: 150,
        },
        {
          label: "CHECK #",
          field: "checkNumber",
          sort: "asc",
          width: 254,
        },

        {
          label: "AMOUNT",
          field: "paymentAmount",
          sort: "asc",
          width: 205,
        },
        {
          label: "",
          field: "remove",
          sort: "asc",
          width: 100,
        },
      ],
      rows: patientPaymentList,
    };

    var lastSeenDate = this.state.visitModel.lastSeenDate
      ? this.state.visitModel.lastSeenDate.slice(0, 10)
      : "";

    var onsetDateOfIllness = this.state.visitModel.onsetDateOfIllness
      ? this.state.visitModel.onsetDateOfIllness.slice(0, 10)
      : "";

    var firstDateOfSimiliarIllness = this.state.visitModel
      .firstDateOfSimiliarIllness
      ? this.state.visitModel.firstDateOfSimiliarIllness.slice(0, 10)
      : "";

    var illnessTreatmentDate = this.state.visitModel.illnessTreatmentDate
      ? this.state.visitModel.illnessTreatmentDate.slice(0, 10)
      : "";

    var dateOfPregnancy = this.state.visitModel.dateOfPregnancy
      ? this.state.visitModel.dateOfPregnancy.slice(0, 10)
      : "";

    var admissionDate = this.state.visitModel.admissionDate
      ? this.state.visitModel.admissionDate.slice(0, 10)
      : "";

    var dischargeDate = this.state.visitModel.dischargeDate
      ? this.state.visitModel.dischargeDate.slice(0, 10)
      : "";

    var lastXrayDate = this.state.visitModel.lastXrayDate
      ? this.state.visitModel.lastXrayDate.slice(0, 10)
      : "";

    var unableToWorkFromDate = this.state.visitModel.unableToWorkFromDate
      ? this.state.visitModel.unableToWorkFromDate.slice(0, 10)
      : "";

    var unableToWorkToDate = this.state.visitModel.unableToWorkToDate
      ? this.state.visitModel.unableToWorkToDate.slice(0, 10)
      : "";

    var accidentDate = this.state.visitModel.accidentDate
      ? this.state.visitModel.accidentDate.slice(0, 10)
      : "";

    var submittedDate = this.state.visitModel.submittedDate
      ? this.state.visitModel.submittedDate.slice(0, 10)
      : "";
    submittedDate = submittedDate
      ? submittedDate.slice(5, 7) +
        "/" +
        submittedDate.slice(8, 10) +
        "/" +
        submittedDate.slice(0, 4)
      : "";

    var dobYY = this.state.dob ? this.state.dob.slice(0, 4) : "";
    var dobDD = this.state.dob ? this.state.dob.slice(5, 7) : "";
    var dobMM = this.state.dob ? this.state.dob.slice(8, 10) : "";

    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            imageStyle={{ marginTop: "20%", width: "100px", height: "100px" }}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    /******************************************khizer code*************************************************************/

    var notes = [];
    if (this.state.visitModel.note == null) {
      notes = [];
    } else {
      notes = this.state.visitModel.note;
    }
    let newListNotes = [];
    var tableDataNotes = {};
    let Note = [];
    // Note = this.state.patientModel.note;

    notes.map((row, index) => {
      var notesDate = this.isNull(row.notesDate)
        ? ""
        : row.notesDate.slice(0, 10);

      if (notesDate != "") {
        var YY = notesDate.slice(0, 4);
        var DD = notesDate.slice(5, 7);
        var MM = notesDate.slice(8, 10);
      }

      newListNotes.push({
        notesDate: (
          <div style={{ width: "86px" }}>
            <span>{notesDate != "" ? MM + "/" + DD + "/" + YY : ""}</span>
          </div>
        ),

        note: (
          <div style={{ width: "100%" }}>
            <textarea
              // disabled={this.state.visitSubmitted == true ? true : false}
              className="Note-textarea"
              style={{
                width: "100%",
                height: "100%",
                padding: "10px",
              }}
              rows="1"
              cols="60"
              name="note"
              value={this.state.visitModel.note[index].note}
              id={index}
              onChange={this.handleNoteChange}
            ></textarea>
            <div>{this.state.visitModel.note[index].noteValField}</div>
          </div>
        ),

        addedBy: (
          <div style={{ width: "150px" }}>
            <span>{this.state.visitModel.note[index].addedBy}</span>
          </div>
        ),

        remove: (
          <div
            style={{
              width: "50px",
              paddingRight: "15px",
              marginLeft: "10px",
              marginTop: "-10px",
            }}
          >
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span
                aria-hidden="true"
                id={index}
                onClick={(event, index) =>
                  this.deleteRowNotes(event, index, row.id)
                }
              >
                ×
              </span>
            </button>
          </div>
        ),
      });
    });

    tableDataNotes = {
      columns: [
        {
          label: "DATE",
          field: "notesDate",
          sort: "asc",
          // width: 400
        },
        {
          label: "NOTES",
          field: "note",
          sort: "asc",
          // width: 200
        },
        {
          label: "ADDED BY",
          field: "addedBy",
          sort: "asc",
          // width: 50
        },

        {
          label: "",
          field: "remove",
          sort: "asc",
          // width: 0
        },
      ],
      rows: newListNotes,
    };
    /******************************************khizer code*************************************************************/

    return (
      <React.Fragment>
        {spiner}

        {/* <!-- Content Wrapper --> */}
        <div id="content-wrapper" class="d-flex flex-column">
          {/* <!-- Main Content --> */}
          <div id="content">
            {/* <!-- Begin Page Content --> */}

            {/* <!-- /.container-fluid --> */}

            <div
              class="container-fluid"
              style={{ paddingLeft: "0px", paddingRight: "0.5rem" }}
            >
              {/* <!-- Main form starts here --> */}
              <form class="needs-validation form-group" novalidate="">
                {/* <!-- New Visit row starts here --> */}
                <div class="row">
                  <div class="col-md-12 col-sm-12 order-md-1 provider-form">
                    <div class="header pt-1">
                      <h6>
                        <span class="h4 float-left">
                          {this.state.editId > 0 || this.state.visitModel.id > 0
                            ? "VISIT #  " + this.state.visitModel.id
                            : "NEW VISIT"}
                        </span>
                        <div class="col-md-3 pl-5 p-0 pt-1 m-0 w-20 text-center float-left">
                          {!(this.props.popupVisitId > 0) &&
                          this.state.editId > 0 ? (
                            <React.Fragment>
                              <img
                                src={backIcon}
                                style={{ width: "30px", height: "30px" }}
                                alt="backicon"
                                onClick={this.previousVisit}
                              />
                              <img
                                src={frontIcon}
                                style={{ width: "30px", height: "30px" }}
                                alt="backicon"
                                onClick={this.nextVisit}
                              />
                            </React.Fragment>
                          ) : null}
                        </div>
                        <div class="float-right col-md-0 p-0">
                          {this.state.editId > 0 ? dropdown : ""}
                        </div>
                        <div class="float-right col-md-0 p-0">
                          <Hotkeys
                            keyName="alt+t"
                            onKeyDown={this.onKeyDown.bind(this)}
                            onKeyUp={this.onKeyUp.bind(this)}
                          >
                            <button
                              class="btn btn-primary mr-2"
                              id="myModal"
                              onClick={this.deleteVisit}
                              disabled={this.isDisabled(
                                this.props.rights.delete
                              )}
                            >
                              Delete
                            </button>
                          </Hotkeys>
                        </div>
                        <div class="float-right col-md-0 p-0">
                          <Hotkeys
                            keyName="alt+n"
                            onKeyDown={this.onKeyDown.bind(this)}
                            onKeyUp={this.onKeyUp.bind(this)}
                          >
                            <button
                              class="btn btn-primary float-right mb-1 mr-2"
                              type="button"
                              onClick={this.addNewVisit}
                            >
                              Add New +
                            </button>
                          </Hotkeys>
                        </div>
                        <div class="float-right col-md-0 p-0">
                          {this.state.editId > 0 ||
                          this.state.visitModel.id > 0 ? (
                            <button
                              class="btn btn-primary float-right mb-1 mr-2"
                              type="button"
                              onClick={this.transferredToPlan}
                              disabled={this.isDisabled(
                                this.props.rights.resubmit
                              )}
                            >
                              Transfer To Plan
                            </button>
                          ) : null}
                        </div>
                        <div class="float-right col-md-0 p-0">
                          {this.state.editId > 0 ||
                          this.state.visitModel.id > 0 ? (
                            <button
                              class="btn btn-primary float-right mb-1 mr-2"
                              id="myModal"
                              onClick={this.transferredToPatient}
                              disabled={this.isDisabled(
                                this.props.rights.resubmit
                              )}
                            >
                              Transfer To Patient
                            </button>
                          ) : null}
                        </div>
                        <div class="float-right col-md-0 p-0">
                          {(this.state.visitSubmitted == false ||
                            (this.state.visitModel.secondaryStatus === "N" &&
                              this.state.visitModel.secondaryPatientPlanID !==
                                null &&
                              this.state.visitModel.secondaryBal > 0)) &&
                          (this.state.editId > 0 ||
                            this.state.visitModel.id > 0) ? (
                            <button
                              class="btn btn-primary float-right mb-1 mr-2"
                              onClick={this.markAsSubmit}
                              disabled={this.isDisabled(
                                this.props.rights.resubmit
                              )}
                            >
                              Mark As Submit
                            </button>
                          ) : null}
                        </div>
                        <div class="float-right col-md-0 p-0">
                          {this.state.visitSubmitted == true &&
                          this.state.visitModel.insurancePlanID != 1 ? (
                            <button
                              class="btn btn-primary float-right mb-1 mr-2"
                              onClick={this.resubmitVisit}
                              disabled={this.isDisabled(
                                this.props.rights.resubmit
                              )}
                            >
                              ReSubmit
                            </button>
                          ) : null}
                        </div>
                      </h6>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>
                    <div class="row">
                      <div class="col-md-4 mb-4">
                        <div class="col-md-3 float-left">
                          <label
                            className={
                              this.state.visitModel.patientID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.patientID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "patient",
                                      this.state.visitModel.patientID
                                    )
                                : undefined
                            }
                          >
                            Patient <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <AsyncSelect
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            value={this.state.patientObj}
                            onChange={this.handlePatientDropDownChange}
                            // options={this.state.patientDropDown}
                            loadOptions={this.loadOptions}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="absolute"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            autoFocus={true}
                            blurInputOnSelect={true}
                            captureMenuScroll={true}
                            className="my-class-name"
                            classNamePrefix="my-prefix"
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "9px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              dropdownIndicator: (defaultStyles) => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                fontSize: "16px",
                                transition: "opacity 300ms",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                height: "33px",
                                paddingLeft: "10px",
                                //borderColor:"transparent",
                                borderColor: "#7d8086",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                          <img
                            style={{
                              width: "32px",
                              height: "32px",
                              marginRight: "-15px",
                            }}
                            class="float-right"
                            id="myModal"
                            src={plusIconImage}
                            alt=""
                            onClick={(event) =>
                              this.openPopup(event, "patient", -1)
                            }
                            disabled={this.isDisabled(this.props.rights.add)}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4">
                        <div class="col-md-4 float-left">
                          <label for="DOB/Gender">DOB/Gender</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            style={{ width: "55%" }}
                            class="provider-form form-control-user"
                            id="DOB/Gender"
                            placeholder="mm/dd/yyyy"
                            disabled
                            value={this.state.dob ? this.state.dob : ""}
                          />
                          <select
                            style={{ padding: "5px", height: "31px" }}
                            disabled
                            value={this.state.gender}
                            class="float-lg-right provider-form form-control-user"
                          >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4">
                        <div class="col-md-4 float-left">
                          <label for="DOB/Gender">
                            {this.state.visitModel.batchDocumentID ? (
                              <a
                                href=""
                                onClick={(event) =>
                                  this.openBPopup(
                                    event,
                                    "batch",
                                    this.state.visitModel.batchDocumentID
                                  )
                                }
                              >
                                Batch#
                              </a>
                            ) : (
                              "Batch#"
                            )}

                            {this.state.visitModel.pageNumber ? (
                              <a
                                href=""
                                onClick={(event) =>
                                  this.openPage(
                                    event,
                                    "pagePDF",
                                    this.state.visitModel.pageNumber
                                  )
                                }
                              >
                                /Page#
                              </a>
                            ) : (
                              "/Page#"
                            )}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            style={{ width: "42%" }}
                            class="provider-form form-control-user"
                           
                            placeholder="Batch#"
                            maxLength="20"
                            value={
                              this.state.visitModel.batchDocumentID === null
                                ? ""
                                : this.state.visitModel.batchDocumentID
                            }
                            name="batchDocumentID"
                            id="batchDocumentID"
                            onBlur={this.handleBatchCheck}
                            onChange={this.handleBatchChange}
                            onKeyPress={this.handleNumericCheck}
                          />
                          <a>
                            {" "}
                            <img
                              style={{ width: "25px", marginTop: "-2px" }}
                              class=""
                              src={plusSrc}
                              alt=""
                              onClick={(event) =>
                                this.openBPopup(
                                  event,
                                  "batchNo",
                                  this.state.visitModel.batchDocumentID
                                )
                              }
                            />
                          </a>
                          <input
                            type="text"
                            style={{ width: "42%" }}
                            class="provider-form form-control-user"
                            placeholder="Page#"
                            maxLength="20"
                            value={
                              this.state.visitModel.pageNumber === ""
                                ? ""
                                : this.state.visitModel.pageNumber
                            }
                            name="pageNumber"
                            id="pageNumber"
                            // onBlur={this.handleBatchCheck}
                            onChange={this.handleBatchChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.batchDocumentIDValField}
                          {this.state.validationModel.responsepagesValField}
                          {this.state.validationModel.pageNumberValField}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- New visit row ends here --> */}

                {/* <!-- Insurance info heading starts here --> */}
                <div class="header pt-4">
                  <h6 class="heading">Insurance Info</h6>
                  <div
                    class="clearfix"
                    style={{ borderBottom: "1px solid #037592" }}
                  ></div>
                  <div class="clearfix"></div>
                </div>
                {/* <!-- Insurance Info tabs Start here --> */}
                <Tabs
                  headers={insuranceInfoHeaders}
                  style={{ cursor: "default" }}
                >
                  <Tab>
                    <div class="col-md-12 mt-3 order-md-1 provider-form">
                      <div class="row">
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label
                              className={
                                this.state.visitModel.primaryPatientPlanID
                                  ? "txtUnderline"
                                  : ""
                              }
                              onClick={
                                this.state.visitModel.primaryPatientPlanID
                                  ? (event) =>
                                      this.openPopup(event,
                                        "insuranceplan",
                                        this.state.visitModel
                                          .primaryPatientPlanID
                                      )
                                  : undefined
                              }
                            >
                              Plan
                            </label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder="Plan"
                              disabled
                              value={this.state.primaryPlanName}
                              name="primaryPlanName"
                              id="primaryPlanName"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">SubscriberID </label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              class="provider-form form-control-user"
                              placeholder="SubscriberID"
                              disabled="disabled"
                              value={
                                this.state.primarySubscriberID
                                  ? this.state.primarySubscriberID
                                  : ""
                              }
                              name="primarySubscriberID"
                              id="primarySubscriberID"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>

                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Billed / Allowed</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Billed"
                              disabled
                              value={
                                this.state.visitModel.primaryBilledAmount
                                  ? Number(
                                      this.state.visitModel.primaryBilledAmount
                                    ).toFixed(2)
                                  : ""
                              }
                              name="primaryBilledAmount"
                              id="primaryBilledAmount"
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Allowed"
                              disabled
                              value={
                                this.state.visitModel.primaryAllowed
                                  ? Number(
                                      this.state.visitModel.primaryAllowed
                                    ).toFixed(2)
                                  : ""
                              }
                              name="primaryAllowed"
                              id="primaryAllowed"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">WriteOff / Paid</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Writeoff"
                              disabled
                              value={
                                this.state.visitModel.primaryWriteOff
                                  ? Number(
                                      this.state.visitModel.primaryWriteOff
                                    ).toFixed(2)
                                  : ""
                              }
                              name="primaryWriteOff"
                              id="primaryWriteOff"
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Paid"
                              disabled
                              value={
                                this.state.visitModel.primaryPaid
                                  ? Number(
                                      this.state.visitModel.primaryPaid
                                    ).toFixed(2)
                                  : ""
                              }
                              name="primaryPaid"
                              id="primaryPaid"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>

                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Plan Bal/Pat-Bal</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Plan Bal"
                              disabled
                              value={
                                this.state.visitModel.primaryBal
                                  ? Number(
                                      this.state.visitModel.primaryBal
                                    ).toFixed(2)
                                  : ""
                              }
                              name="primaryBal"
                              id="primaryBal"
                              onChange={this.handleChange}
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Pat Bal"
                              disabled
                              value={
                                this.state.visitModel.primaryPatientBal
                                  ? Number(
                                      this.state.visitModel.primaryPatientBal
                                    ).toFixed(2)
                                  : ""
                              }
                              name="primaryPatientBal"
                              id="primaryPatientBal"
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.visitModel.movedToAdvancePayment > 0 ? (
                              <p
                                style={{
                                  color: "green",
                                  marginTop: "40px",
                                  marginBottom: "0px",
                                  marginLeft:"-25px"
                                }}
                              >
                                Transferred to Advance Payment
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Pat Paid/Trans</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Pat Paid"
                              disabled
                              value={
                                this.state.visitModel.patientPaid
                                  ? Number(
                                      this.state.visitModel.patientPaid
                                    ).toFixed(2)
                                  : ""
                              }
                              name="patientPaid"
                              id="primaryPatientPaid"
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Transferred"
                              disabled
                              value={
                                this.state.visitModel.primaryTransferred
                                  ? Number(
                                      this.state.visitModel.primaryTransferred
                                    ).toFixed(2)
                                  : ""
                              }
                              name="primaryTransferred"
                              id="primaryTransferred"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                      </div>
                      <div className="row">
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Status</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <select
                              style={{ width: "100%", padding: "5px" }}
                              class="provider-form form-control-user"
                              disabled={
                                this.state.visitModel.primaryStatus == "Pending"
                                  ? false
                                  : true
                              }
                              name="primaryStatus"
                              id="primaryStatus"
                              value={this.state.visitModel.primaryStatus}
                              onChange={this.handleChange}
                            >
                              {primaryStatus.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {" "}
                                  {s.display}{" "}
                                </option>
                              ))}{" "}
                            </select>
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab>
                    <div class="col-md-12 mt-3 order-md-1 provider-form">
                      <div class="row">
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label
                              for="firstName"
                              className={
                                this.state.visitModel.secondaryPatientPlanID
                                  ? "txtUnderline"
                                  : ""
                              }
                              onClick={
                                this.state.visitModel.secondaryPatientPlanID
                                  ? () =>
                                      this.openPopup(
                                        "insuranceplan",
                                        this.state.visitModel
                                          .secondaryPatientPlanID
                                      )
                                  : undefined
                              }
                            >
                              Plan
                            </label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder="Plan"
                              disabled
                              value={this.state.secondaryPlanName}
                              name="secondaryPlanName"
                              id="secondaryPlanName"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label>SubscriberID</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder=" SubscriberID "
                              disabled="disabled"
                              value={
                                this.state.secondarySubscriberID
                                  ? this.state.secondarySubscriberID
                                  : ""
                              }
                              name="primarySubscriberID"
                              id="primarySubscriberID"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Billed / Allowed</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Billed"
                              disabled
                              value={
                                this.state.visitModel.secondaryBilledAmount
                                  ? Number(
                                      this.state.visitModel
                                        .secondaryBilledAmount
                                    ).toFixed(2)
                                  : ""
                              }
                              name="secondaryBilledAmount"
                              id="secondaryBilledAmount"
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Allowed"
                              disabled
                              value={
                                this.state.visitModel.secondaryAllowed
                                  ? Number(
                                      this.state.visitModel.secondaryAllowed
                                    ).toFixed(2)
                                  : ""
                              }
                              name="secondaryAllowed"
                              id="secondaryAllowed"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">WriteOff / Paid</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Writeoff"
                              disabled
                              value={
                                this.state.visitModel.secondaryWriteOff
                                  ? Number(
                                      this.state.visitModel.secondaryWriteOff
                                    ).toFixed(2)
                                  : ""
                              }
                              name="secondaryWriteOff"
                              id="secondaryWriteOff"
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Paid"
                              disabled
                              value={
                                this.state.visitModel.secondaryPaid
                                  ? Number(
                                      this.state.visitModel.secondaryPaid
                                    ).toFixed(2)
                                  : ""
                              }
                              name="secondaryPaid"
                              id="secondaryPaid"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Plan Bal/Pat-Bal</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Plan Bal"
                              disabled
                              value={
                                this.state.visitModel.secondaryBal
                                  ? Number(
                                      this.state.visitModel.secondaryBal
                                    ).toFixed(2)
                                  : ""
                              }
                              name="secondaryBal"
                              id="secondaryBal"
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Pat Bal"
                              disabled
                              value={
                                this.state.visitModel.secondaryPatResp
                                  ? Number(
                                      this.state.visitModel.secondaryPatResp
                                    ).toFixed(2)
                                  : ""
                              }
                              name="secondaryPatResp"
                              id="secondaryPatResp"
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Pat Paid/Trans</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              placeholder="Pat Paid"
                              disabled
                              value={
                                this.state.visitModel.patientPaid
                                  ? Number(
                                      this.state.visitModel.patientPaid
                                    ).toFixed(2)
                                  : ""
                              }
                              name="patientPaid"
                              id="secondaryPatientPaid"
                            />
                            <input
                              type="text"
                              style={{ width: "55%" }}
                              class="provider-form form-control-user"
                              placeholder="Transferred"
                              disabled
                              value={
                                this.state.visitModel.secondaryTransferred
                                  ? Number(
                                      this.state.visitModel.secondaryTransferred
                                    ).toFixed(2)
                                  : ""
                              }
                              name="secondaryTransferred"
                              id="secondaryTransferred"
                            />
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                      </div>

                      <div className="row">
                        <div class="col-md-4 mb-4">
                          <div class="col-md-3 float-left">
                            <label for="firstName">Status</label>
                          </div>
                          <div class="col-md-8 float-left">
                            <select
                              style={{ width: "100%", padding: "5px" }}
                              class="provider-form form-control-user"
                              disabled
                              name="secondaryStatus"
                              id="secondaryStatus"
                              value={this.state.visitModel.secondaryStatus}
                            >
                              {status.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {" "}
                                  {s.display}{" "}
                                </option>
                              ))}{" "}
                            </select>
                          </div>
                          <div class="invalid-feedback"> </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
                {/* <!-- Insuranc einfo content starts here --> */}

                {/* <!-- Legal entities row starts here --> */}
                <div class="row">
                  <div class="col-md-12 mt-4 order-md-1 provider-form">
                    <div class="header pt-2">
                      <h6 class="heading">Legal Entities</h6>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    {/* <!-- Legel entities content row 1 starts here --> */}
                    <div class="row">
                      <div class="col-md-4 mb-4">
                        <div class="col-md-3 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.practiceID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.practiceID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "practice",
                                      this.state.visitModel.practiceID
                                    )
                                : undefined
                            }
                          >
                            Practice
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{ width: "85%", padding: "5px" }}
                            class="provider-form form-control-user"
                            name="practiceID"
                            id="practiceID"
                            disabled
                            value={this.state.visitModel.practiceID}
                            onChange={this.handleChange}
                          >
                            {this.state.practice.map((s) => (
                              <option key={s.id} value={s.id}>
                                {" "}
                                {s.description}{" "}
                              </option>
                            ))}{" "}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.practiceValField}{" "}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4">
                        <div class="col-md-3 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.locationID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.locationID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "location",
                                      this.state.visitModel.locationID
                                    )
                                : undefined
                            }
                          >
                            Location
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{ width: "85%", padding: "5px" }}
                            class="provider-form form-control-user"
                            disabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            name="locationID"
                            id="locationID"
                            value={
                              this.state.visitModel.locationID == null
                                ? "Please Select"
                                : this.state.visitModel.locationID
                            }
                            onChange={this.handleChange}
                          >
                            {this.props.userLocations.map((s) => (
                              <option key={s.id} value={s.id}>
                                {" "}
                                {s.description}{" "}
                              </option>
                            ))}{" "}
                          </select>
                          <a
                            href="#"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            {" "}
                            <img
                              class="float-right "
                              style={{ width: "32px", height: "30px" }}
                              src={plusIconImage}
                              onClick={(event) =>
                                this.openLocationPopup(event, 0)
                              }
                              disabled={this.isDisabled(this.props.rights.add)}
                              alt=""
                            />
                          </a>{" "}
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.locationValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4">
                        <div class="col-md-3 float-left">
                          <label
                            for="POS"
                            className={
                              this.state.visitModel.posid ? "txtUnderline" : ""
                            }
                            onClick={
                              this.state.visitModel.posid
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "pos",
                                      this.state.visitModel.posid
                                    )
                                : undefined
                            }
                          >
                            POS
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{ width: "85%", padding: "5px" }}
                            class="provider-form form-control-user"
                            disabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            name="posid"
                            id="posid"
                            value={
                              this.state.visitModel.posid == null
                                ? "Please Select"
                                : this.state.visitModel.posid
                            }
                            onChange={this.handleChange}
                          >
                            {this.props.posCodes.map((s) => (
                              <option key={s.id} value={s.id}>
                                {" "}
                                {s.description}{" "}
                              </option>
                            ))}{" "}
                          </select>
                          <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            {" "}
                            <img
                              class="float-right"
                              style={{ width: "32px", height: "30px" }}
                              src={plusIconImage}
                              onClick={(event) => this.openPOSPopup(event, 0)}
                              disabled={this.isDisabled(this.props.rights.add)}
                              alt=""
                            />
                          </a>{" "}
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.posValField}{" "}
                        </div>
                      </div>
                    </div>

                    {/* <!-- Legel entities content row 1 ends here --> */}

                    {/* <!-- Legel entities content row 2 starts here --> */}
                    <div class="row mt-3">
                      <div class="col-md-4 mb-4">
                        <div class="col-md-3 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.providerID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.providerID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "provider",
                                      this.state.visitModel.providerID
                                    )
                                : undefined
                            }
                          >
                            Provider
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{ width: "85%", padding: "5px" }}
                            class="provider-form form-control-user"
                            disabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            name="providerID"
                            id="providerID"
                            value={
                              this.state.visitModel.providerID == null
                                ? "Please Select"
                                : this.state.visitModel.providerID
                            }
                            onChange={this.handleChange}
                          >
                            {this.props.userProviders.map((s) => (
                              <option key={s.id} value={s.id}>
                                {" "}
                                {s.description}{" "}
                              </option>
                            ))}{" "}
                          </select>
                          <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            {" "}
                            <img
                              class="float-right"
                              style={{ width: "32px", height: "30px" }}
                              src={plusIconImage}
                              onClick={(event) =>
                                this.openProviderPopup(event, 0)
                              }
                              disabled={this.isDisabled(this.props.rights.add)}
                              alt=""
                            />
                          </a>{" "}
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.providerValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4">
                        <div class="col-md-3 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.refProviderID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.refProviderID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "refprovider",
                                      this.state.visitModel.refProviderID
                                    )
                                : undefined
                            }
                          >
                            Ref. Provider
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{ width: "85%", padding: "5px" }}
                            class="provider-form form-control-user"
                            disabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            name="refProviderID"
                            id="refProviderID"
                            value={
                              this.state.visitModel.refProviderID == null
                                ? "Please Select"
                                : this.state.visitModel.refProviderID
                            }
                            onChange={this.handleChange}
                          >
                            {this.props.userRefProviders.map((s) => (
                              <option key={s.id} value={s.id}>
                                {" "}
                                {s.description}{" "}
                              </option>
                            ))}{" "}
                          </select>
                          <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            {" "}
                            <img
                              class="float-right "
                              style={{ width: "32px", height: "30px" }}
                              src={plusIconImage}
                              onClick={(event) =>
                                this.openRefProviderPopup(event, 0)
                              }
                              disabled={this.isDisabled(this.props.rights.add)}
                              alt=""
                            />
                          </a>{" "}
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4">
                        <div class="col-md-3 float-left">
                          <label
                            for="POS"
                            className={
                              this.state.visitModel.supervisingProvID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.supervisingProvID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "superprovider",
                                      this.state.visitModel.supervisingProvID
                                    )
                                : undefined
                            }
                          >
                            Sup. Provider
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{ width: "85%", padding: "5px" }}
                            class="provider-form form-control-user"
                            disabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            name="supervisingProvID"
                            id="supervisingProvID"
                            value={this.state.visitModel.supervisingProvID}
                            onChange={this.handleChange}
                          >
                            {this.state.provider.map((s) => (
                              <option key={s.id} value={s.id}>
                                {" "}
                                {s.description}{" "}
                              </option>
                            ))}{" "}
                          </select>
                          {/* <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            {" "}
                            <img
                              class="float-right pt-1"
                              id="myModal"
                              src="img/plus-ico.png"
                              alt=""
                            />
                          </a>{" "} */}
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                    </div>
                    {/* <!-- Legel entities content row 2 ends here --> */}
                  </div>
                </div>
                {/* <!-- Legal entities row ends here --> */}

                {/* <!-- Diagnosis Row Starts here --> */}
                {/* <div class="row"> */}
                <div class="header pt-1">
                  <h6 class="heading">
                    Diagnosis
                    <div class="float-right p-0 ">
                      <button
                        class="btn btn-primary float-right mb-1 mr-2"
                        id="showDiagnosisRow"
                        onClick={this.addDiagnosisRow}
                      >
                        More DX
                      </button>
                      <button
                        class="btn btn-primary float-right mb-1 mr-2"
                        disabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        id="addCPT"
                        onClick={(event) => this.openPopup(event, "cpt", 0)}
                      >
                        Add CPT
                      </button>
                      <button
                        class="btn btn-primary float-right mb-1 mr-2"
                        disabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        id="addICD"
                        onClick={(event) => this.openPopup(event, "icd1", 0)}
                      >
                        Add ICD
                      </button>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                  </h6>
                </div>
                {/* <!-- ICD content row 1 starts here --> */}
                <div class="row provider-form">
                  <div class="col-md-3 mb-3">
                    <div class="col-md-2 float-left">
                      <label
                        for="D1"
                        className={
                          this.state.visitModel.icD1ID ? "txtUnderline" : ""
                        }
                        onClick={
                          this.state.visitModel.icD1ID
                            ? (event) =>
                                this.openPopup(
                                  event,
                                  "icd1",
                                  this.state.visitModel.icD1ID
                                )
                            : undefined
                        }
                      >
                        D1
                      </label>
                    </div>
                    <div class="col-md-10 float-left">
                      <Select
                        value={this.state.visitModel.icd1Obj}
                        onChange={(event) =>
                          this.handleICDChange(event, "icD1ID", "icd1Obj")
                        }
                        options={this.props.icdCodes}
                        placeholder=""
                        isDisabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        isClearable={true}
                        isSearchable={true}
                        menuPosition="static"
                        openMenuOnClick={false}
                        escapeClearsValue={true}
                        isLoading={
                          this.state.visitModel.icD1ID > 0 ? false : true
                        }
                        filterOption={this.filterOption}
                        styles={{
                          indicatorSeparator: () => {},
                          clearIndicator: (defaultStyles) => ({
                            ...defaultStyles,
                            color: "#286881",
                          }),
                          container: (defaultProps) => ({
                            ...defaultProps,
                            position: "absolute",
                            width: "80%",
                          }),
                          menu: (styles) => ({ ...styles, width: "125px" }),
                          indicatorsContainer: (defaultStyles) => ({
                            ...defaultStyles,
                            padding: "0px",
                            marginBottom: "0",
                            marginTop: "0px",
                            height: "32px",
                            minHeight: "32px",
                          }),
                          IndicatorContainer: (ds) => ({
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            paddingLeft: "8px",
                            paddingRight: "8px",
                            // marginBottom:"11px",
                            // marginBottom: "0",
                            borderBottomRightRadius: "3px",
                            borderTopRightRadius: "3px",
                          }),
                          indicatorContainer: (defaultStyles) => ({
                            // ...defaultStyles,
                            // padding: "9px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            marginBottom: "11px",
                            marginBottom: "0",
                            marginTop: "1px",
                            borderBottomRightRadius: "3px",
                            borderTopRightRadius: "3px",
                            // borderRadius: "0 4px 4px 0"
                          }),
                          dropdownIndicator: () => ({
                            display: "none",
                          }),
                          // dropdownIndicator: defaultStyles => ({
                          //   ...defaultStyles,
                          //   backgroundColor: "#E9F4F8",
                          //   color: "#286881",
                          //   borderRadius: "3px"
                          // }),
                          input: (defaultStyles) => ({
                            ...defaultStyles,
                            margin: "0px",
                            padding: "0px",
                            // display:'none'
                          }),
                          singleValue: (defaultStyles) => ({
                            ...defaultStyles,
                            fontSize: "16px",
                            transition: "opacity 300ms",
                            paddingBottom: "10px",
                            // display:'none'
                          }),
                          control: (defaultStyles) => ({
                            ...defaultStyles,
                            minHeight: "30px",
                            height: "30px",
                            paddingLeft: "5px",
                            //borderColor:"transparent",
                            borderColor: "#C6C6C6",
                            boxShadow: "none",
                            borderColor: "#C6C6C6",
                            "&:hover": {
                              borderColor: "#C6C6C6",
                            },
                            // display:'none'
                          }),
                        }}
                      />
                    </div>
                    <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                      {this.state.validationModel.icd1ValField}{" "}
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="col-md-2 float-left">
                      <label
                        for="D2"
                        className={
                          this.state.visitModel.icD2ID ? "txtUnderline" : ""
                        }
                        onClick={
                          this.state.visitModel.icD2ID
                            ? (event) =>
                                this.openPopup(
                                  event,
                                  "icd2",
                                  this.state.visitModel.icD2ID
                                )
                            : undefined
                        }
                      >
                        D2
                      </label>
                    </div>
                    <div class="col-md-10 float-left">
                      <Select
                        value={this.state.visitModel.icd2Obj}
                        onChange={(event) =>
                          this.handleICDChange(event, "icD2ID", "icd2Obj")
                        }
                        isDisabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        options={this.props.icdCodes}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                        menuPosition="static"
                        openMenuOnClick={false}
                        escapeClearsValue={true}
                        filterOption={this.filterOption}
                        styles={{
                          indicatorSeparator: () => {},
                          clearIndicator: (defaultStyles) => ({
                            ...defaultStyles,
                            color: "#286881",
                          }),
                          container: (defaultProps) => ({
                            ...defaultProps,
                            position: "absolute",
                            width: "80%",
                          }),
                          menu: (styles) => ({ ...styles, width: "125px" }),
                          indicatorsContainer: (defaultStyles) => ({
                            ...defaultStyles,
                            padding: "0px",
                            paddingBottom: "7px",
                            marginBottom: "0",
                            marginTop: "0px",
                            height: "36px",
                            borderBottomRightRadius: "10px",
                            borderTopRightRadius: "10px",
                            // borderRadius:"0 6px 6px 0"
                          }),
                          indicatorContainer: (defaultStyles) => ({
                            ...defaultStyles,
                            padding: "0px",
                            marginBottom: "0",
                            marginTop: "1px",
                            // borderBottomRightRadius: "5px",
                            // borderTopRightRadius: "5px",
                            borderRadius: "0 4px 4px 0",
                          }),
                          // dropdownIndicator: defaultStyles => ({
                          //   ...defaultStyles,
                          //   backgroundColor: "#d8ecf3",
                          //   color: "#286881"
                          //   // display:'none'
                          // }),
                          dropdownIndicator: () => ({
                            display: "none",
                          }),
                          input: (defaultStyles) => ({
                            ...defaultStyles,
                            margin: "0px",
                            padding: "0px",
                            // display:'none'
                          }),
                          singleValue: (defaultStyles) => ({
                            ...defaultStyles,
                            paddingBottom: "10px",
                            fontSize: "16px",
                            // display:'none'
                          }),
                          control: (defaultStyles) => ({
                            ...defaultStyles,
                            minHeight: "30px",
                            height: "30px",
                            paddingLeft: "5px",
                            //borderColor:"transparent",
                            boxShadow: "none",
                            borderColor: "#C6C6C6",
                            "&:hover": {
                              borderColor: "#C6C6C6",
                            },
                            // display:'none'
                          }),
                        }}
                      />
                    </div>
                    <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                      {this.state.validationModel.icd2ValField}
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="col-md-2 float-left">
                      <label
                        for="firstName"
                        className={
                          this.state.visitModel.icD3ID ? "txtUnderline" : ""
                        }
                        onClick={
                          this.state.visitModel.icD3ID
                            ? (event) =>
                                this.openPopup(
                                  event,
                                  "icd3",
                                  this.state.visitModel.icD3ID
                                )
                            : undefined
                        }
                      >
                        D3
                      </label>
                    </div>
                    <div class="col-md-10 float-left">
                      <Select
                        value={this.state.visitModel.icd3Obj}
                        onChange={(event) =>
                          this.handleICDChange(event, "icD3ID", "icd3Obj")
                        }
                        isDisabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        options={this.props.icdCodes}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                        menuPosition="static"
                        openMenuOnClick={false}
                        escapeClearsValue={true}
                        filterOption={this.filterOption}
                        styles={{
                          indicatorSeparator: () => {},
                          clearIndicator: (defaultStyles) => ({
                            ...defaultStyles,
                            color: "#286881",
                          }),
                          container: (defaultProps) => ({
                            ...defaultProps,
                            position: "absolute",
                            width: "80%",
                          }),
                          menu: (styles) => ({ ...styles, width: "125px" }),
                          indicatorsContainer: (defaultStyles) => ({
                            ...defaultStyles,
                            padding: "0px",
                            paddingBottom: "7px",
                            marginBottom: "0",
                            marginTop: "0px",
                            height: "36px",
                            borderBottomRightRadius: "10px",
                            borderTopRightRadius: "10px",
                            // borderRadius:"0 6px 6px 0"
                          }),
                          indicatorContainer: (defaultStyles) => ({
                            ...defaultStyles,
                            padding: "0px",
                            marginBottom: "0",
                            marginTop: "1px",
                            // borderBottomRightRadius: "5px",
                            // borderTopRightRadius: "5px",
                            borderRadius: "0 4px 4px 0",
                          }),
                          // dropdownIndicator: defaultStyles => ({
                          //   ...defaultStyles,
                          //   backgroundColor: "#d8ecf3",
                          //   color: "#286881"
                          //   // display:'none'
                          // }),
                          dropdownIndicator: () => ({
                            display: "none",
                          }),
                          input: (defaultStyles) => ({
                            ...defaultStyles,
                            margin: "0px",
                            padding: "0px",
                            // display:'none'
                          }),
                          singleValue: (defaultStyles) => ({
                            ...defaultStyles,
                            paddingBottom: "10px",
                            fontSize: "16px",
                            // display:'none'
                          }),
                          control: (defaultStyles) => ({
                            ...defaultStyles,
                            minHeight: "30px",
                            height: "30px",
                            paddingLeft: "5px",
                            //borderColor:"transparent",
                            boxShadow: "none",
                            borderColor: "#C6C6C6",
                            "&:hover": {
                              borderColor: "#C6C6C6",
                            },
                            // display:'none'
                          }),
                        }}
                      />
                    </div>
                    <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                      {" "}
                      {this.state.validationModel.icd3ValField}{" "}
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="col-md-2 float-left">
                      <label
                        for="firstName"
                        className={
                          this.state.visitModel.icD4ID ? "txtUnderline" : ""
                        }
                        onClick={
                          this.state.visitModel.icD4ID
                            ? (event) =>
                                this.openPopup(
                                  event,
                                  "icd4",
                                  this.state.visitModel.icD4ID
                                )
                            : undefined
                        }
                      >
                        D4
                      </label>
                    </div>
                    <div class="col-md-10 float-left">
                      <Select
                        value={this.state.visitModel.icd4Obj}
                        onChange={(event) =>
                          this.handleICDChange(event, "icD4ID", "icd4Obj")
                        }
                        isDisabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        options={this.props.icdCodes}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                        menuPosition="static"
                        openMenuOnClick={false}
                        escapeClearsValue={true}
                        filterOption={this.filterOption}
                        styles={{
                          indicatorSeparator: () => {},
                          clearIndicator: (defaultStyles) => ({
                            ...defaultStyles,
                            color: "#286881",
                          }),
                          container: (defaultProps) => ({
                            ...defaultProps,
                            position: "absolute",
                            width: "80%",
                          }),
                          menu: (styles) => ({ ...styles, width: "125px" }),
                          indicatorsContainer: (defaultStyles) => ({
                            ...defaultStyles,
                            padding: "0px",
                            paddingBottom: "7px",
                            marginBottom: "0",
                            marginTop: "0px",
                            height: "36px",
                            borderBottomRightRadius: "10px",
                            borderTopRightRadius: "10px",
                            // borderRadius:"0 6px 6px 0"
                          }),
                          indicatorContainer: (defaultStyles) => ({
                            ...defaultStyles,
                            padding: "0px",
                            marginBottom: "0",
                            marginTop: "1px",
                            // borderBottomRightRadius: "5px",
                            // borderTopRightRadius: "5px",
                            borderRadius: "0 4px 4px 0",
                          }),
                          // dropdownIndicator: defaultStyles => ({
                          //   ...defaultStyles,
                          //   backgroundColor: "#d8ecf3",
                          //   color: "#286881"
                          //   // display:'none'
                          // }),
                          dropdownIndicator: () => ({
                            display: "none",
                          }),
                          input: (defaultStyles) => ({
                            ...defaultStyles,
                            margin: "0px",
                            padding: "0px",
                            // display:'none'
                          }),
                          singleValue: (defaultStyles) => ({
                            ...defaultStyles,
                            paddingBottom: "10px",
                            fontSize: "16px",
                            // display:'none'
                          }),
                          control: (defaultStyles) => ({
                            ...defaultStyles,
                            minHeight: "30px",
                            height: "30px",
                            paddingLeft: "5px",
                            //borderColor:"transparent",
                            boxShadow: "none",
                            borderColor: "#C6C6C6",
                            "&:hover": {
                              borderColor: "#C6C6C6",
                            },
                            // display:'none'
                          }),
                        }}
                      />
                    </div>
                    <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                      {" "}
                      {this.state.validationModel.icd4ValField}{" "}
                    </div>
                  </div>
                </div>
                {/* <!-- ICD content row 1 ends here --> */}

                {/* ICd row 2 and 3 starts here */}
                {this.state.diagnosisRow ? (
                  <React.Fragment>
                    <div class="row provider-form">
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="D1"
                            className={
                              this.state.visitModel.icD5ID ? "txtUnderline" : ""
                            }
                            onClick={
                              this.state.visitModel.icD5ID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "icd5",
                                      this.state.visitModel.icD5ID
                                    )
                                : undefined
                            }
                          >
                            D5
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            value={this.state.visitModel.icd5Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD5ID", "icd5Obj")
                            }
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            // controlShouldRenderValue={false}
                            // onInputChange={this.cleanInput}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                paddingBottom: "7px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "32px",
                                minHeight: "32px",
                              }),
                              IndicatorContainer: (ds) => ({
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                // marginBottom:"11px",
                                // marginBottom: "0",
                                borderBottomRightRadius: "3px",
                                borderTopRightRadius: "3px",
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                // ...defaultStyles,
                                // padding: "9px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                paddingLeft: "0px",
                                paddingRight: "0px",
                                marginBottom: "11px",
                                marginBottom: "0",
                                marginTop: "1px",
                                borderBottomRightRadius: "3px",
                                borderTopRightRadius: "3px",
                                // borderRadius: "0 4px 4px 0"
                              }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#E9F4F8",
                              //   color: "#286881",
                              //   borderRadius: "3px"
                              // }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                fontSize: "16px",
                                paddingBottom: "10px",
                                transition: "opacity 300ms",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                borderColor: "#C6C6C6",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                          {this.state.validationModel.icd5ValField}{" "}
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="D2"
                            className={
                              this.state.visitModel.icD6ID ? "txtUnderline" : ""
                            }
                            onClick={
                              this.state.visitModel.icD6ID
                                ? () =>
                                    this.openPopup(
                                      "icd6",
                                      this.state.visitModel.icD6ID
                                    )
                                : undefined
                            }
                          >
                            D6
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            value={this.state.visitModel.icd6Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD6ID", "icd6Obj")
                            }
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                paddingBottom: "7px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#d8ecf3",
                              //   color: "#286881"
                              //   // display:'none'
                              // }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                paddingBottom: "10px",
                                fontSize: "16px",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>{this.state.validationModel.icd6ValField}</div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.icD7ID ? "txtUnderline" : ""
                            }
                            onClick={
                              this.state.visitModel.icD7ID
                                ? () =>
                                    this.openPopup(
                                      "icd7",
                                      this.state.visitModel.icD7ID
                                    )
                                : undefined
                            }
                          >
                            D7
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            value={this.state.visitModel.icd7Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD7ID", "icd7Obj")
                            }
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                paddingBottom: "7px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#d8ecf3",
                              //   color: "#286881"
                              //   // display:'none'
                              // }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                paddingBottom: "10px",
                                fontSize: "16px",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                          {" "}
                          {this.state.validationModel.icd7ValField}{" "}
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.icD8ID ? "txtUnderline" : ""
                            }
                            onClick={
                              this.state.visitModel.icD8ID
                                ? () =>
                                    this.openPopup(
                                      "icd8",
                                      this.state.visitModel.icD8ID
                                    )
                                : undefined
                            }
                          >
                            D8
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            value={this.state.visitModel.icd8Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD8ID", "icd8Obj")
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                paddingBottom: "7px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#d8ecf3",
                              //   color: "#286881"
                              //   // display:'none'
                              // }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                paddingBottom: "10px",
                                fontSize: "16px",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                          {" "}
                          {this.state.validationModel.icd8ValField}{" "}
                        </div>
                      </div>
                    </div>

                    <div class="row provider-form">
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="D1"
                            className={
                              this.state.visitModel.icD9ID ? "txtUnderline" : ""
                            }
                            onClick={
                              this.state.visitModel.icD9ID
                                ? () =>
                                    this.openPopup(
                                      "icd9",
                                      this.state.visitModel.icD9ID
                                    )
                                : undefined
                            }
                          >
                            D9
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            value={this.state.visitModel.icd9Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD9ID", "icd9Obj")
                            }
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            // controlShouldRenderValue={false}
                            // onInputChange={this.cleanInput}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "32px",
                                minHeight: "32px",
                              }),
                              IndicatorContainer: (ds) => ({
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                // marginBottom:"11px",
                                // marginBottom: "0",
                                borderBottomRightRadius: "3px",
                                borderTopRightRadius: "3px",
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                // ...defaultStyles,
                                // padding: "9px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                paddingLeft: "0px",
                                paddingRight: "0px",
                                marginBottom: "11px",
                                marginBottom: "0",
                                marginTop: "1px",
                                borderBottomRightRadius: "3px",
                                borderTopRightRadius: "3px",
                                // borderRadius: "0 4px 4px 0"
                              }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#E9F4F8",
                              //   color: "#286881",
                              //   borderRadius: "3px"
                              // }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                fontSize: "16px",
                                transition: "opacity 300ms",
                                paddingBottom: "10px",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                borderColor: "#C6C6C6",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                          {this.state.validationModel.icd9ValField}{" "}
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="D2"
                            className={
                              this.state.visitModel.icD10ID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.icD10ID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "icd10",
                                      this.state.visitModel.icD10ID
                                    )
                                : undefined
                            }
                          >
                            D10
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            value={this.state.visitModel.icd10Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD10ID", "icd10Obj")
                            }
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                paddingBottom: "7px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#d8ecf3",
                              //   color: "#286881"
                              //   // display:'none'
                              // }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                paddingBottom: "10px",
                                fontSize: "16px",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                          {this.state.validationModel.icd10ValField}
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.icD11ID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.icD11ID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "icd11",
                                      this.state.visitModel.icD11ID
                                    )
                                : undefined
                            }
                          >
                            D11
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            value={this.state.visitModel.icd11Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD11ID", "icd11Obj")
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                paddingBottom: "7px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#d8ecf3",
                              //   color: "#286881"
                              //   // display:'none'
                              // }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                paddingBottom: "10px",
                                fontSize: "16px",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                          {" "}
                          {this.state.validationModel.icd11ValField}{" "}
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <div class="col-md-2 float-left">
                          <label
                            for="firstName"
                            className={
                              this.state.visitModel.icD12ID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.visitModel.icD12ID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "icd12",
                                      this.state.visitModel.icD12ID
                                    )
                                : undefined
                            }
                          >
                            D12
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <Select
                            value={this.state.visitModel.icd12Obj}
                            onChange={(event) =>
                              this.handleICDChange(event, "icD12ID", "icd12Obj")
                            }
                            isDisabled={
                              this.state.visitSubmitted == true ? true : false
                            }
                            options={this.props.icdCodes}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            menuPosition="static"
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            filterOption={this.filterOption}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              menu: (styles) => ({ ...styles, width: "125px" }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                paddingBottom: "7px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#d8ecf3",
                              //   color: "#286881"
                              //   // display:'none'
                              // }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                paddingBottom: "10px",
                                fontSize: "16px",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                paddingLeft: "5px",
                                //borderColor:"transparent",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback" style={{paddingLeft:"23%" , marginTop:"30px"}}>
                          {" "}
                          {this.state.validationModel.icd12ValField}{" "}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}

                {/* ICD row 2 and 3 ends here */}
                {/* </div> */}
                {/* <!-- Diagnosis Row ends here --> */}

                {/* <!-- Service Lines start here --> */}
                <h6 class="heading">Service Lines</h6>
                <div
                  class="clearfix"
                  style={{ borderBottom: "1px solid #037592" }}
                ></div>
                <div class="card mt-3 mb-4 provider-form">
                  <div class="card-header py-1">
                    <h6 class="m-0 font-weight-bold text-primary search-h">
                      Service Lines
                      <button
                        class="btn btn-primary ml-5 float-right"
                        disabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        onClick={this.addCPTRow}
                      >
                        Add CPT
                      </button>
                    </h6>
                  </div>
                  {/* <!-- Service Lines Table Content --> */}
                  <div class="card-body">
                    <div
                      style={{ overflowX: "hidden" }}
                      class="table-responsive"
                    >
                      <div class="row">
                        <div class="col-sm-12 m-0">
                          <MDBDataTable
                            responsive={true}
                            striped
                            searching={false}
                            data={tableData}
                            displayEntries={false}
                            sortable={true}
                            scrollX={false}
                            scrollY={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- Service Lines ends here --> */}

                {/* <!-- Total Amont starts here --> */}
                <div
                  class="clearfix"
                  style={{ borderBottom: "1px solid #037592" }}
                ></div>
                <div class="row mt-4 provider-form">
                  <div class="col-md-4 mb-2">
                    <div class="col-md-3 float-left">
                      <label for="D1">Total Amount</label>
                    </div>
                    <div class="col-md-8 float-left">
                      <input
                        type="text"
                        style={{ width: "85%" }}
                        class="provider-form form-control-user"
                        placeholder="Total Amount"
                        disabled
                        value={
                          this.state.visitModel.totalAmount
                            ? Number(this.state.visitModel.totalAmount).toFixed(
                                2
                              )
                            : ""
                        }
                        name="totalAmount"
                        id="totalAmount"
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback"> </div>
                  </div>
                  <div class="col-md-4 mb-2">
                    <div class="col-md-3 float-left">
                      <label for="D2">Copay</label>
                    </div>
                    <div class="col-md-8 float-left">
                      <input
                        type="text"
                        style={{ width: "85%" }}
                        class="provider-form form-control-user"
                        disabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        placeholder="Copay"
                        value={
                          this.state.visitModel.copay
                            ? this.state.visitModel.copay
                            : ""
                        }
                        name="copay"
                        id="copay"
                        onChange={this.handleAmountChange}
                      />
                    </div>
                    <div class="invalid-feedback"> </div>
                  </div>
                  <div class="col-md-4 mb-2">
                    <div class="col-md-3 float-left">
                      <label for="D2">Copay Paid</label>
                    </div>
                    <div class="col-md-8 float-left">
                      <input
                        type="text"
                        style={{ width: "85%" }}
                        class="provider-form form-control-user"
                        disabled
                        placeholder="Copay Paid"
                        value={
                          this.state.visitModel.copayPaid
                            ? this.state.visitModel.copayPaid
                            : ""
                        }
                        name="copayPaid"
                        id="copayPaid"
                        onChange={this.handleAmountChange}
                      />
                    </div>
                    <div class="invalid-feedback"> </div>
                  </div>
                </div>
                {/* <!-- Total Amont starts here --> */}

                {/* <!-- Patient Payment Starts here --> */}
                <div class="header pt-2">
                  <h6 class="heading">Patient Payments</h6>
                </div>
                <div
                  class="clearfix"
                  style={{ borderBottom: "1px solid #037592" }}
                ></div>
                <div class="card mb-4 mt-3 provider-form">
                  <div class="card-header py-1">
                    <h6 class="m-0 font-weight-bold text-primary search-h">
                      Patient Payments
                      <button
                        class="btn btn-primary ml-5 float-right"
                        id="myModal"
                        onClick={this.addPaymentRow}
                      >
                        Add Payment
                      </button>
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      {/* <!-- Patient PAyment table contetn --> */}
                      <div
                        style={{ overflowX: "hidden" }}
                        id="dataTable_wrapper"
                        class="dataTables_wrapper dt-bootstrap4"
                      >
                        <MDBDataTable
                          responsive={true}
                          striped
                          searching={false}
                          data={patientPaymentTableDate}
                          displayEntries={false}
                          sortable={true}
                          scrollX={false}
                          scrollY={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- Patient Payment ends here --> */}

                {/* <!-- Submission info stars here --> */}
                <div class="header pt-2">
                  <h6 class="heading">Submission Info</h6>
                  <hr
                    class="p-0 mt-0 mb-1"
                    style={{ backgroundColor: "#037592" }}
                  ></hr>
                </div>

                <div class="row mt-3 provider-form">
                  <div class="col-md-4 mb-4">
                    <div class="col-md-0 float-left">
                      <label for="firstName">Submitted</label>
                    </div>
                    <div class="col-md-8 float-left">
                      <input
                        class="m-2 checkbox"
                        disabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        type="checkbox"
                        checked={this.state.visitModel.isSubmitted}
                        id="markInactive0"
                      />
                    </div>
                    <div class="invalid-feedback"></div>
                  </div>

                  <div class="col-md-4 mb-4">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Submitted Date</label>
                    </div>
                    <div class="col-md-8 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="mm/dd/yyyy"
                        disabled
                        type="text"
                        value={submittedDate}
                        name="submittetdDate"
                        id="submittetdDate"
                      />
                    </div>
                    <div class="invalid-feedback"></div>
                  </div>

                  <div class="col-md-4 mb-4">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Submission Batch</label>
                    </div>
                    <div class="col-md-8 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Submission Batch"
                        disabled
                        type="text"
                        value={
                          this.state.visitModel.submissionLogID == null
                            ? ""
                            : this.state.visitModel.submissionLogID
                        }
                      />
                    </div>
                    <div class="invalid-feedback"></div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12 mt-3 mb-12">
                    <div class="col-md-0 float-left">
                      <label for="firstName">Rejection Reason</label>
                    </div>
                    <div class="col-md-11 pl-4 m-0 float-left">
                      <textarea
                        type="text"
                        class="provider-form w-100 form-control-user"
                        id="firstName"
                        placeholder=""
                        readOnly
                        value={this.state.visitModel.rejectionReason}
                      ></textarea>
                    </div>
                    <div class="invalid-feedback"></div>
                  </div>
                </div>

                {/* <!-- Submission info ends here --> */}

                {/* <!-- Extra info starts here --> */}
                <div class="header pt-4">
                  <h6 class="heading">
                    Extra Information
                    <div class="float-lg-right text-right">
                    <input
                        class="checkbox ml-2"
                        
                        type="checkbox"
                       id="holdStatement"
                      name="holdStatement"
                      checked={this.state.visitModel.holdStatement}
                      onChange={this.handleholdStatementChkBox.bind(this)}
                      />
                     Hold Statement
                      
                      <input
                         class="checkbox ml-2"
                        disabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        type="checkbox"
                        id="isForcePaper"
                        name="isForcePaper"
                        checked={this.state.visitModel.isForcePaper}
                        onChange={this.handleforcePaperChkBox.bind(this)}
                      />
                      Print Paper
                      <input
                         class="checkbox ml-2"
                        disabled={
                          this.state.visitSubmitted == true ? true : false
                        }
                        type="checkbox"
                        id="isDontPrint"
                        name="isDontPrint"
                        checked={this.state.visitModel.isDontPrint}
                        onChange={this.handledontPrintChkBox.bind(this)}
                      />
                      Don't Print
                    </div>
                  </h6>
                  <div
                    class="clearfix"
                    style={{ borderBottom: "1px solid #037592" }}
                  ></div>
                  <div class="clearfix"></div>
                </div>
                <div
                  // style={{ height: "120px" }}
                  class="col-md-12 mt-2 order-md-1"
                >
                  {/* <!-- Extra info ends here --> */}
                  <Tabs headers={headers} style={{ cursor: "default" }}>
                    <Tab>
                      <div class=" provider-form mt-4 col-md-12">
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Authorization #</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                maxLength="20"
                                type="text"
                                value={this.state.visitModel.authorizationNum}
                                name="authorizationNum"
                                id="authorizationNum"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Lastseen">Last Seen Date</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="lastSeenDate"
                                id="lastSeenDate"
                                value={lastSeenDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .lastSeenDateFDValField
                              }{" "}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Outside Referral</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="checkbox"
                                type="checkbox"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                id="outsideReferral"
                                name="outsideReferral"
                                checked={this.state.visitModel.outsideReferral}
                                onChange={this.handleOutsideRefCheck}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="SubscriberID">Referral#</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                maxLength="20"
                                type="text"
                                value={this.state.visitModel.referralNum}
                                name="referralNum"
                                id="referralNum"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Visit">
                                Onset Date of Current illness
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="onsetDateOfIllness"
                                id="onsetDateOfIllness"
                                value={onsetDateOfIllness}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .onsetDateOfIllnessValField
                              }
                              {
                                this.state.validationModel
                                  .onSetDateOfSimiliarIllnessValField
                              }
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Charge#">
                                First date of similar illness
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="firstDateOfSimiliarIllness"
                                id="firstDateOfSimiliarIllness"
                                value={firstDateOfSimiliarIllness}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .firstDateOfSimiliarIllnessValField
                              }{" "}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="DOSfrom">
                                Initial Treatment date
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="illnessTreatmentDate"
                                id="illnessTreatmentDate"
                                value={illnessTreatmentDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .initialTreatementDateValField
                              }{" "}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="DOSTo">Date of Pregnancy(LMP)</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="dateOfPregnancy"
                                id="dateOfPregnancy"
                                value={dateOfPregnancy}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .dateOfPregnancyValField
                              }{" "}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Status">
                                Admission Date
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="admissionDate"
                                id="admissionDate"
                                value={admissionDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.admissionDateValField}{" "}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateFrom">Discharge Date</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="dischargeDate"
                                id="dischargeDate"
                                value={dischargeDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.dischargeDateValField}
                              {
                                this.state.validationModel
                                  .dischargeDateFDValField
                              }{" "}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateTo">Last X-ray Date</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="lastXrayDate"
                                id="lastXrayDate"
                                value={lastXrayDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.laxtXRayValField}{" "}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateFrom">
                                Last X-ray Type
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="provider-form w-100 form-control-user"
                                placeholder="Last X-ray Type"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                type="text"
                                value={this.state.visitModel.lastXrayType}
                                name="lastXrayType"
                                id="lastXrayType"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateTo">
                                Unable To Work From Date
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="unableToWorkFromDate"
                                id="unableToWorkFromDate"
                                value={unableToWorkFromDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .unableToWorkFromDateValField
                              }
                              {
                                this.state.validationModel
                                  .unableToWorkFromDateFDValField
                              }{" "}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateTo">
                                Unable To Work To Date
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="unableToWorkToDate"
                                id="unableToWorkToDate"
                                value={unableToWorkToDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .unableToWorkToDateValField
                              }
                              {
                                this.state.validationModel
                                  .unableToWorkToDateFDValField
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab>
                      <div class=" provider-form mt-3 col-md-12">
                        <div class="row">
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Accident Date</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                min="1900-01-01"
                                max="9999-12-31"
                                name="accidentDate"
                                id="accidentDate"
                                value={accidentDate}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {" "}
                              {
                                this.state.validationModel.accidentDateValField
                              }{" "}
                            </div>
                          </div>
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="Lastseen">Accident Type</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <select
                                name="accidentType"
                                class="w-100"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                name="accidentType"
                                id="accidentType"
                                value={this.state.visitModel.accidentType}
                                onChange={this.handleChange}
                              >
                                {accidentType.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {" "}
                                    {s.display}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Accident State</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <div class="col-md-12 m-0 p-0 float-left">
                                <select
                                  name="accidentState"
                                  class="w-100"
                                  disabled={
                                    this.state.visitSubmitted == true
                                      ? true
                                      : false
                                  }
                                  name="accidentState"
                                  id="accidentState"
                                  value={this.state.visitModel.accidentState}
                                  onChange={this.handleChange}
                                >
                                  {usStates.map((s) => (
                                    <option key={s.value} value={s.value}>
                                      {" "}
                                      {s.display}{" "}
                                    </option>
                                  ))}{" "}
                                </select>
                              </div>
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="row">
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="SubscriberID">CLIA #</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="CLIA #"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                value={this.state.visitModel.cliaNumber}
                                name="cliaNumber"
                                id="cliaNumber"
                                maxLength="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.cliaNumberValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Visit">Outside lab</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="checkbox"
                                type="checkbox"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                type="checkbox"
                                id="outsideLab"
                                name="outsideLab"
                                checked={this.state.visitModel.outsideLab}
                                onClick={this.handleOutsideLabCheck}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Charge#">Lab Charges</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Lab Charges"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                value={this.state.visitModel.labCharges}
                                name="labCharges"
                                id="labCharges"
                                onChange={this.handleAmountChange}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                        </div>
                        <div class="clearfix"></div>
                      </div>
                    </Tab>
                    <Tab>
                      <div class=" provider-form mt-4 col-md-12">
                        <div class="row">
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Payer Claim Control #
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Payer Claim Control #"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                value={
                                  this.state.visitModel.payerClaimControlNum
                                }
                                name="payerClaimControlNum"
                                id="payerClaimControlNum"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Lastseen">Claim Frequency</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <select
                                class="w-100"
                                name="claimFrequencyCode"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                name="claimFrequencyCode"
                                id="claimFrequencyCode"
                                value={this.state.visitModel.claimFrequencyCode}
                                onChange={this.handleChange}
                              >
                                {claimFrequencyCode.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {" "}
                                    {s.display}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Service Auth. Exeption Code
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <div class="col-md-12 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Service Auth. Exeption Code"
                                  disabled={
                                    this.state.visitSubmitted == true
                                      ? true
                                      : false
                                  }
                                  maxLength="20"
                                  value={
                                    this.state.visitModel.serviceAuthExcpCode
                                  }
                                  name="serviceAuthExcpCode"
                                  id="serviceAuthExcpCode"
                                  onChange={this.handleChange}
                                />
                              </div>
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="row">
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="SubscriberID">
                                External Invoice Number
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="External Invoice Number"
                                maxLength="50"
                                value={
                                  this.state.visitModel.externalInvoiceNumber
                                }
                                name="externalInvoiceNumber"
                                id="externalInvoiceNumber"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="Visit">Prescribing MD</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Prescribing MD "
                                id="prescribingMD"
                                name="prescribingMD"
                                value={this.state.visitModel.prescribingMD}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="row">
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateFrom">Emergency</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="checkbox"
                                type="checkbox"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                id="emergency"
                                name="emergency"
                                checked={this.state.visitModel.emergency}
                                onClick={this.handleEmergencyCheck}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-3">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateTo">EPSDT</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="checkbox"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                type="checkbox"
                                id="epsdt"
                                name="epsdt"
                                checked={this.state.visitModel.epsdt}
                                onClick={this.handleEPSDTCheck}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="SubmitDateFrom">Family Plan</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="checkbox"
                                disabled={
                                  this.state.visitSubmitted == true
                                    ? true
                                    : false
                                }
                                type="checkbox"
                                id="familyPlan"
                                name="familyPlan"
                                checked={this.state.visitModel.familyPlan}
                                onClick={this.handleFamilyPlanCheck}
                              />
                            </div>
                            <div class="invalid-feedback"> </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab>
                      <div class="card mb-4">
                        <div class="card-header">
                          <h6 class="m-0 font-weight-bold text-primary search-h">
                            Notes
                            <div class="float-lg-right text-right">
                              <button
                                style={{ marginTop: "-6px" }}
                                class="float-right btn btn-primary mr-2"
                                onClick={this.addRowNotes}
                              >
                                Add Note{" "}
                              </button>
                            </div>
                          </h6>
                        </div>

                        <div class="card-body">
                          <div class="table-responsive">
                            <div
                              style={{ width: "98%" }}
                              id="dataTable_wrapper"
                              class="dataTables_wrapper dt-bootstrap4"
                            >
                              <MDBDataTable
                                responsive={true}
                                striped
                                searching={false}
                                data={tableDataNotes}
                                displayEntries={false}
                                sortable={true}
                                scrollX={false}
                                scrollY={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </form>

              <div class="row">
                <div class="col-12 pt-2 text-center">
                  <button
                    class="btn btn-primary mr-2"
                    type="button"
                    onClick={this.saveCharge}
                  >
                    Save
                  </button>
                  <button
                    class="btn btn-primary mr-2"
                    type="button"
                    onClick={
                      this.state.popupVisitId > 0
                        ? () => this.props.onClose()
                        : this.closeNewCharge.bind(this)
                    }
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* <!-- Footer --> */}
              <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                  <div class="copyright text-center my-auto">
                    {" "}
                    <span>
                      Version 1.0 <br></br>
                      Copyright &copy; 2020 Bellmedex LLC. All rights reserved.
                    </span>{" "}
                  </div>
                </div>
              </footer>
              {/* <!-- End of Footer --> */}
            </div>
            {/* <!-- End of container fluid --> */}
          </div>
          {/* <!-- End of content --> */}
          {popup}
        </div>
        {/* <!-- End of Content Wrapper --> */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    patientInfo: state.selectPatient ? state.selectPatient : null,
    visitGridData: state.VisitGridDataReducer ? state.VisitGridDataReducer : [],
    cptCodes: state.loginInfo
      ? state.loginInfo.cpt
        ? state.loginInfo.cpt
        : []
      : [],
    icdCodes: state.loginInfo
      ? state.loginInfo.icd
        ? state.loginInfo.icd
        : []
      : [],
    posCodes: state.loginInfo
      ? state.loginInfo.pos
        ? state.loginInfo.pos
        : []
      : [],
    modifiers: state.loginInfo
      ? state.loginInfo.modifier
        ? state.loginInfo.modifier
        : []
      : [],
    userProviders: state.loginInfo
      ? state.loginInfo.userProviders
        ? state.loginInfo.userProviders
        : []
      : [],
    userRefProviders: state.loginInfo
      ? state.loginInfo.userRefProviders
        ? state.loginInfo.userRefProviders
        : []
      : [],
    userLocations: state.loginInfo
      ? state.loginInfo.userLocations
        ? state.loginInfo.userLocations
        : []
      : [],
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null, clientID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.chargesSearch,
          add: state.loginInfo.rights.chargesCreate,
          update: state.loginInfo.rights.chargesEdit,
          delete: state.loginInfo.rights.chargesDelete,
          export: state.loginInfo.rights.chargesExport,
          import: state.loginInfo.rights.chargesImport,
          resubmit: state.loginInfo.rights.resubmitCharges,
        }
      : [],
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(NewCharge)
);
 