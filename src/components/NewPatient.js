import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Input from "./Input";
import Label from "./Label";
import axios from "axios";
import Swal from "sweetalert2";
import $ from "jquery";
import calenderPic from "../images/dob-icon.png";
import patientPic from "../images/patient-img.png";
import samll_doc_icon from "../images/dob-icon.png";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import { isNull, isNullOrUndefined } from "util";
import { Tabs, Tab } from "react-tab-view";
import backIcon from "../images/icons/back-icon.png";
import frontIcon from "../images/icons/front-icon.png";
import plusImage from "../images/plus-ico.png";
import alertIcon from "../images/alert-icon.png";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import NewRefferingProvider from "./NewRefferingProvider";
import { MDBDataTable, MDBBtn, MDBCollapse } from "mdbreact";
import Select, { components } from "react-select";
import moment from "moment";
import NumberFormat from "react-number-format";
import VisitUsed from "./VisitUsed";
import TopForm from "./TopForm/TopForm";
import SendFax from "./SendFax";
import GPopup from "./GPopup";
import BatchDocumentPopup from "./BatchDocumentPopup";
import PagePDF from "./PagePDF";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { selectPatient } from "../actions/selectPatient";
import plusSrc from "../images/plus-icon.png";
import { topForm } from "../actions/TopForm";

class NewPatient extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/patient/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";
    this.Notesurl = process.env.REACT_APP_URL + "/Notes/";
    this.patientPlanUrl = process.env.REACT_APP_URL + "/PatientPlan/";
    this.insurancePlanAddressURL =
      process.env.REACT_APP_URL + "/InsurancePlanAddress/";

    this.batchURL = process.env.REACT_APP_URL + "/BatchDocument/";
    this.proURL = process.env.REACT_APP_URL + "/Provider/";
    this.errorField = "errorField";
    let patientPopupId = 0;
    patientPopupId = this.props.popupPatientId;
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.savePatientCount = 0;
    this.currentIndex = 0;
    this.myPatientPlans = [];

    //Note Model
    this.notesModel = {
      id: 0,
      notesDate: null,
      note: null,
      noteValField: "",
      validation: false,
    };

    //Patient Model
    this.patientModel = {
      id: 0,
      accountNum: "",
      medicalRecordNumber: "",
      title: "",
      lastName: "",
      middleInitial: "",
      firstName: "",
      ssn: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      race: "",
      ethinicity: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      mobileNumber: "",
      email: "",
      practiceID: null,
      locationId: null,
      providerID: null,
      refProviderID: null,
      notes: "",
      isDeleted: false,
      isActive: false,
      statementMessage: "",
      ChargeTable: [],
      statement: true,
      batchDocumentID: null,
      pageNumber: "",
      holdStatement: false,
      /******************************************khizer code*************************************************************/
      note: [],
      patientPlans: [],

      /*******************************************Afzaaal code*************************************************************/
      authnote: [],
      patientAuthorization: [],
      patientReferrals: [],
    };

    this.patientPlanModel = {
      id: 0,
      insurancePlanID: null,
      patientID: null,
      coverage: "",
      relationShip: "",
      lastName: "",
      firstName: "",
      middleInitial: "",
      dob: "",
      gender: "",
      address1: "",
      city: "",
      state: "",
      zipCode: "",
      subscriberId: "",
      insurancePlanAddressID: null,
      insurancePlanID: null,
      insurancePlanAddresses: [],
      isActive: true,
      authRequired: false,
      insurancePlanObject: {},

      //Validation Fiels
      lastNameValField: null,
      firstNameValField: null,
      coverageValField: null,
      relationshipValField: null,
      subscriberIDValField: null,
      insurancePlanValField: null,
      dobValField: null,
    };

    this.patientAuthModel = {
      id: 0,
      plan: "",
      providerID: "",
      icdid: "",
      cptid: "",
      authorizationNumber: "",
      startdate: "",
      enddate: "",
      visitsAllowed: 1,
      visitsUsed: 0,
      remaining: "",
      remarks: "",
      status: "AUTH REQUIRED",
      responsibleParty: "BELLMEDEX",

      insurancePlanID: null,
      patientPlanID: null,
      patientPlanModel: {},
      remindBeforeDays: "15",
      remindBeforeRemainingVisits: "1",
      insurancePlanValField: null,
      providerObject: {},
      icdObject: {},
      cptObject: {},

      authorizedAmount: "",
      medicalRecordRequired: false,
      medicalNecessityRequired: false,
      addedDate: "",
      authorizationDate: "",
      commonKey: null,
    };

    this.patientReferral = {
      id: 0,
      patientID: "",
      pcpid: "",
      providerID: "",
      provider: "",
      patientPlanID: "",
      patientPlan: "",
      startDate: "",
      endDate: "",
      visitAllowed: "",
      visitUsed: 0,
      status: "",
      ReferralNo: "",
      FaxStatus: "",
      rererralForService: "",
      commonKey: null,
      insurancePlanID: null,
      patientPlanID: null,
      patientPlanModel: {},
      insurancePlanObject: {},
      insurancePlanValField: null,
      providerObject: {},
      pcpObject: {},
    };
    //Validation Model
    this.validationModel = {
      accountNumValField: "",
      medicalRecordNoValField: "",
      titleValField: "",
      lastNameValField: "",
      middleInitialValField: "",
      firstNameValField: "",
      ssnValField: "",
      dobValField: "",
      genderValField: "",
      maritalStatusValField: "",
      raceValField: "",
      ethinicityValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      phoneNumberValField: "",
      mobileNumberValField: "",
      emailValField: "",
      practiceIDValField: "",
      locationIdValField: "",
      providerIDValField: "",
      refProviderIDValField: "",
      notesValField: "",
      isDeletedValField: false,
      isActiveValField: true,
      dobValField: "",
      emailValField: "",
      planIDValField: "",
      providerIDValField: "",
      cptIDValField: "",
      authorizationNumberValField: "",
      startdateNumberValField: "",
      enddateValField: "",
      visitsAllowedValField: "",
      patientPlanIDRefValField: "",
      pcpIDRefValField: "",
      providerIDRefValField: "",
      greaterValField: "",
      batchDocumentIDValField: "",
      responsepagesValField: "",
      pageNumberValField: "",
      enterPageValField: "",
    };

    this.state = {
      editId: patientPopupId > 0 ? this.props.popupPatientId : this.props.id,
      patientPopupId: 0,
      patientModel: this.patientModel,
      validationModel: this.validationModel,
      patientPlanModel: this.patientPlanModel,
      patientAuthModel: this.patientAuthModel,
      patientReferral: this.patientReferral,
      faxModel: [],
      practice: [],
      location: [],
      provider: [],
      refProvider: [],
      file: "",
      imagePreviewUrl: patientPic,
      popupName: "",
      id: 0,
      loading: false,
      today: "",
      insurancePlans: this.props.insurancePlans
        ? this.props.insurancePlans
        : [],
      insurancePlanAddresses: [],
      patientPlans: [],
      showLPopup: false,
      showPPopup: false,
      showRPopup: false,
      collapseID: 1,
      showVPopup: false,
      showFPopup: false,
      patientAuthID: 0,
      batchDocumentID: null,
      pageNumber: "",
      fileURL: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.savePatient = this.savePatient.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleZip = this.handleZip.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.openLocationPopup = this.openLocationPopup.bind(this);
    this.closeLocationPopup = this.closeLocationPopup.bind(this);
    this.openProviderPopup = this.openProviderPopup.bind(this);
    this.closeProviderPopup = this.closeProviderPopup.bind(this);
    this.openRefProviderPopup = this.openRefProviderPopup.bind(this);
    this.closeRefProviderPopup = this.closeRefProviderPopup.bind(this);
    this.addRowNotes = this.addRowNotes.bind(this);
    this.addReferral = this.addReferral.bind(this);
    this.addAuthRowNotes = this.addAuthRowNotes.bind(this);
    // this.handlebatchChange = this.handlebatchChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleAuthNoteChange = this.handleAuthNoteChange.bind(this);
    this.handleBatchChange = this.handleBatchChange.bind(this);
    this.handleAuthChange = this.handleAuthChange.bind(this);
    this.handleRefChange = this.handleRefChange.bind(this);
    this.openvisitPopup = this.openvisitPopup.bind(this);
    this.closevisitPopup = this.closevisitPopup.bind(this);
    this.addPlanRow = this.addPlanRow.bind(this);
    this.addAuthRow = this.addAuthRow.bind(this);
    this.handleInsurancePlansuggChange = this.handleInsurancePlansuggChange.bind(
      this
    );
    this.nextVisit = this.nextVisit.bind(this);
    this.previousVisit = this.previousVisit.bind(this);

    this.addAuthRow = this.addAuthRow.bind(this);
    this.handleBatchCheck = this.handleBatchCheck.bind(this);
    this.handleInsuranceAuthsuggChange = this.handleInsuranceAuthsuggChange.bind(
      this
    );
    this.closefaxPopup = this.closefaxPopup.bind(this);
    this.openfaxPopup = this.openfaxPopup.bind(this);
  }

  componentDidMount() {
    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });
  }

  async UNSAFE_componentWillMount() {
    await this.setState({
      patientPopupId: this.props.popupPatientId,
      loading: true,
    });
    if (this.props.id > 0) {
      try {
        let patientid = this.props.patientID;
        axios
          .get(this.url + `PatientSummary/${this.props.id}`, this.config)
          .then((response) => {
            this.props.topForm(response.data);
          })
          .catch((error) => error);
      } catch (error) {}
    }

    try {
      // //Get insurance plans from get profiles
      // try {
      //   await axios
      //     .get(this.patientPlanUrl + "getprofiles", this.config)
      //     .then((response) => {
      //       this.setState({ insurancePlans: response.data.insurancePlans });
      //     })
      //     .then((error) => {});
      // } catch {}

      var NewPatientmodel = "";
      if (this.state.editId > 0) {
        try {
          //Find Patient API
          await axios
            .get(this.url + "findPatient/" + this.state.editId, this.config)
            .then((response) => {
              NewPatientmodel = response.data;
              if (response.data.patientPlans == null) {
                NewPatientmodel.patientPlans = [];
              }
              if (response.data.patientAuthorization === null) {
                NewPatientmodel.patientAuthorization = [];
              }
              if (response.data.patientReferrals === null) {
                NewPatientmodel.patientReferrals = [];
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } catch {}

        //Map method on patient plans
        await NewPatientmodel.patientPlans.map(async (plan, index) => {
          var insurancePlan = await this.props.insurancePlans.filter(
            (indurancePlan) => indurancePlan.id == plan.insurancePlanID
          );
          NewPatientmodel.patientPlans[
            index
          ].insurancePlanObject = insurancePlan;

          if (insurancePlan.length > 0) {
            let commonKey = "";
            if (NewPatientmodel.patientPlans[index].coverage) {
              commonKey = NewPatientmodel.patientPlans[
                index
              ].coverage.toString();
            } else {
              commonKey = "";
            }

            if (NewPatientmodel.patientPlans[index].insurancePlanID) {
              commonKey = NewPatientmodel.patientPlans[
                index
              ].insurancePlanID.toString();
            } else {
              commonKey = "";
            }

            if (NewPatientmodel.patientPlans[index].subscriberId) {
              commonKey = NewPatientmodel.patientPlans[
                index
              ].subscriberId.toString();
            } else {
              commonKey = "";
            }

            if (NewPatientmodel.patientPlans[index].isActive) {
              commonKey = NewPatientmodel.patientPlans[
                index
              ].isActive.toString();
            } else {
              commonKey = "";
            }

            this.myPatientPlans.push({
              id: plan.id,
              value: insurancePlan[0].value,
              label: insurancePlan[0].value,
              insurancePlanID: insurancePlan[0].id,
              commonKey: commonKey,
            });
          }

          try {
            await axios
              .get(
                this.insurancePlanAddressURL +
                  "GetInsurancePlanAddressesByInsurancePlanID/" +
                  plan.insurancePlanID,
                this.config
              )
              .then((response) => {
                NewPatientmodel.patientPlans[index].insurancePlanAddresses =
                  response.data;
                // this.setState({
                //   patientModel: NewPatientmodel,
                // });
              })
              .catch((error) => {
                console.log(error);
              });
          } catch {
            NewPatientmodel.patientPlans[index].insurancePlanAddresses = [];
          }
        });

        await this.setState({
          patientModel: NewPatientmodel,
          imagePreviewUrl: NewPatientmodel.profilePic,
          loading: false,
        });

        //Get Patient Notes
        //http://96.69.218.154:8020/api/Patient/FindPatientNotes/2543
        axios
          .get(this.url + "FindPatientNotes/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({
              patientModel: {
                ...this.state.patientModel,
                note: response.data,
              },
            });
          })
          .catch((error) => {});

        //Get Patient Authorizations
        //http://96.69.218.154:8020/api/Patient/FindPatientAuthorization/2519
        axios
          .get(
            this.url + "FindPatientAuthorization/" + this.state.editId,
            this.config
          )
          .then(async (response) => {
            let patientAuthorization = response.data;

            //Auth Patient Plans
            await patientAuthorization.map(async (plan, index) => {
              //Set Patient Plans Object
              var insurancePlan = await this.props.insurancePlans.filter(
                (indurancePlan) => indurancePlan.id == plan.insurancePlanID
              );
              patientAuthorization[index].insurancePlanObject = insurancePlan;

              //Set Provider Object
              var provider = await this.props.userProviders.filter(
                (provider) => provider.id == plan.providerID
              );
              patientAuthorization[index].providerObject = provider;

              //Set ICD Object
              var icd = await this.props.icdCodes.filter(
                (icd) => icd.id == plan.icdid
              );
              patientAuthorization[index].icdObject = icd;

              //Set CPT Object
              var cpt = await this.props.cptCodes.filter(
                (cpt) => cpt.id == plan.cptid
              );
              patientAuthorization[index].cptObject = cpt;
            });

            await this.setState({
              patientModel: {
                ...this.state.patientModel,
                patientAuthorization: patientAuthorization,
              },
            });
          })
          .catch((error) => {});

        //Get Patient Refferls
        //http://96.69.218.154:8020/api/Patient/FindPatientReferral/3213
        axios
          .get(
            this.url + "FindPatientReferral/" + this.state.editId,
            this.config
          )
          .then(async (response) => {
            let patientReferrals = response.data;
            //Referral Patient
            await patientReferrals.map(async (ref, index) => {
              //Set Patient Plans Object
              var insurancePlan = await this.props.insurancePlans.filter(
                (indurancePlan) => indurancePlan.id == ref.insurancePlanID
              );
              patientReferrals[index].insurancePlanObject = insurancePlan;

              //Set Provider Object
              var provider = await this.props.userProviders.filter(
                (provider) => provider.id == ref.providerID
              );
              patientReferrals[index].providerObject = provider;

              //Set PCP Object
              var provider = await this.props.userProviders.filter(
                (provider) => provider.id == ref.pcpid
              );
              patientReferrals[index].pcpObject = provider;
            });
            await this.setState({
              patientModel: {
                ...this.state.patientModel,
                patientReferrals: patientReferrals,
              },
            });
          })
          .catch((error) => {});
      } else {
        this.setState({ loading: false });
      }
    } catch {
      this.setState({ loading: false });
    }
    //Batch document and page link
    if (this.state.patientModel.batchDocumentID) {
      this.setState({ loading: true });
      var myVal = this.validationModel;

      axios
        .get(
          this.batchURL +
            "FindBatchDocumentPath/" +
            this.state.patientModel.batchDocumentID,
          this.config
        )
        .then((response) => {
          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span
              className="validationMsg"
              style={{ color: "green", marginLeft: "-44%" }}
            >
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
            loading: false,
            validationModel: myVal,
          });
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                    Invalid Batch # {this.state.patientModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 400) {
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                    Invalid Batch # {this.state.patientModel.batchDocumentID}
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

  openPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  openLocationPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showLPopup: true, id: id });
  };

  closeLocationPopup = () => {
    $("#locationModal").hide();
    this.setState({ showLPopup: false });
  };

  openProviderPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPPopup: true, id: id });
  };

  //close facility popup
  closeProviderPopup = () => {
    $("#providerModal").hide();
    this.setState({ showPPopup: false });
  };

  //open facility popup
  openRefProviderPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showRPopup: true, id: id });
  };

  //close facility popup
  closeRefProviderPopup = () => {
    $("#refModal").hide();
    this.setState({ showRPopup: false });
  };

  async handleZip(event) {
    var zip = event.target.value;
    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;

    if (name == "planZipCode") {
      let newList = [...this.state.patientModel.patientPlans];
      newList[index].zipCode = value;
      await this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientPlans: newList,
        },
      });
    } else {
      await this.setState({
        patientModel: {
          ...this.state.patientModel,
          [event.target.name]: event.target.value.toUpperCase(),
        },
      });
    }

    if (zip.length >= 5 && zip.length <= 9) {
      await axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then((response) => {
          if (name == "planZipCode") {
            let newList = [...this.state.patientModel.patientPlans];
            newList[index].zipCode = value;
            newList[index].city = response.data.city.toUpperCase();
            newList[index].state = response.data.state_id;
            this.setState({
              patientModel: {
                ...this.state.patientModel,
                patientPlans: newList,
              },
            });
          } else {
            this.setState({
              patientModel: {
                ...this.state.patientModel,
                city: response.data.city.toUpperCase(),
                state: response.data.state_id,
              },
            });
          }
        })
        .catch((error) => {
          this.setState({ loading: false });

          if (error.response) {
            if (error.response.data) {
              if (error.response.data == "InValid ZipCode") {
                Swal.fire(
                  "Something Wrong",
                  "Please Enter Valid ZipCode",
                  "error"
                );
              } else {
                console.log("Error : ", error);
              }
            } else {
              console.log("Error : ", error);
            }
          } else {
            console.log("Error : ", error);
          }
        });
    } else {
      console.log("Zip Code length should be 5");
    }
  }

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value.length == 0
    )
      return true;
    else return false;
  }

  replace(field, replaceWhat, replaceWith) {
    if (this.isNull(field)) return field;
    else return field.replace(replaceWhat, replaceWith);
  }

  async handleChange(event) {
    event.preventDefault();
    var eventName = event.target.name;
    var eventValue = event.target.value;
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });

    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    // practice change dropdown
    if (event.target.name == "practiceID") {
      var userLocation = await this.props.userInfo1.userLocations.filter(
        (location) => location.iD2 == this.props.userInfo1.practiceID
      );
      var userProvider = await this.props.userInfo1.userProviders.filter(
        (provider) => provider.iD2 == this.props.userInfo1.practiceID
      );
      var userRefProvider = await this.props.userInfo1.userRefProviders.filter(
        (refProvider) => refProvider.iD2 == this.props.userInfo1.practiceID
      );
      await this.setState({
        location: userLocation,
        provider: userProvider,
        refProvider: userRefProvider,
      });

      if (this.isNull(this.state.patientModel.locationId) == true) {
        await this.setState({
          patientModel: {
            ...this.state.patientModel,
            locationId: userLocation[0].id,
          },
        });
      }
      if (this.isNull(this.state.patientModel.providerID) == true) {
        await this.setState({
          patientModel: {
            ...this.state.patientModel,
            providerID: userProvider[0].id,
          },
        });
      }
      if (this.isNull(this.state.patientModel.refProviderID) == true) {
        await this.setState({
          patientModel: {
            ...this.state.patientModel,
            refProviderID: userRefProvider[0].id,
          },
        });
      }
    }
  }

  async handleBatchChange(event) {
    const eventValue = event.target.value;
    const eventName = event.target.name;
    var valueOfPage;
    if (eventName == "pageNumber") {
      valueOfPage = this.state.patientModel.batchDocumentID
        ? this.state.patientModel.batchDocumentID
        : "";

      var myVal = this.validationModel;
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
              style={{ color: "green", marginLeft: "-44%" }}
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
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                    Invalid Batch # {this.state.patientModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 400) {
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                    Invalid Batch # {this.state.patientModel.batchDocumentID}
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
      var myVal = this.validationModel;
      myVal.responsepagesValField = "";
      myVal.batchDocumentIDValField = "";
      myVal.pageNumberValField = "";

      this.setState({ validationModel: myVal });
    }

    await this.setState({
      patientModel: {
        ...this.state.patientModel,
        [eventName]: eventValue.trim(),
      },
      batchDocumentID: eventName == "batchDocumentID" ? eventValue : null,
    });

    if (this.isNull(this.state.patientModel.batchDocumentID)) {
      var myVal = this.validationModel;
      myVal.responsepagesValField = "";
    }
  }

  handleBatchCheck = (event) => {
    console.log("State Value of Batch :", this.state.batchDocumentID);
    var eventValue = event.target.value;
    if (event.target.name == "pageNumber") {
      eventValue = this.state.patientModel.batchDocumentID;
    } else {
      eventValue = eventValue;
    }
    var myVal = this.validationModel;
    axios
      .get(this.batchURL + "FindBatchDocumentPath/" + eventValue, this.config)
      .then((response) => {
        myVal.batchDocumentIDValField = "";
        myVal.responsepagesValField = (
          <span
            className="validationMsg"
            style={{ color: "green", marginLeft: "-44%" }}
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
              var myVal = this.validationModel;

              myVal.batchDocumentIDValField = (
                <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                  Invalid Batch # {this.state.patientModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            }
            //  else  if (error.response.status == 400) {
            //   var myVal = this.validationModel;

            //   myVal.batchDocumentIDValField = (
            //     <span
            //       className="validationMsg"
            //       style={{ textAlign:"left"}}
            //     >
            //       Invalid Batch # {this.state.patientModel.batchDocumentID}
            //     </span>
            //   );
            //   myVal.responsepagesValField = "";
            //   this.setState({validationModel:myVal});
            //   return;
            // }
          }
        }
      });
    // }
  };

  //Save Patient
  async savePatient(e) {
    e.preventDefault();

    if (this.savePatientCount == 1) {
      return;
    }

    this.savePatientCount = 1;
    // e.preventDefault();

    if (this.state.patientModel.phoneNumber) {
      if (this.state.patientModel.phoneNumber.length > 10) {
        var lng = this.state.patientModel.phoneNumber
          ? this.state.patientModel.phoneNumber.length
          : "";
        var phoneNumber = this.state.patientModel.phoneNumber.slice(3, lng);
        this.state.patientModel.phoneNumber = phoneNumber.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    if (this.state.patientModel.mobileNumber) {
      if (this.state.patientModel.mobileNumber.length > 10) {
        var lng = this.state.patientModel.mobileNumber
          ? this.state.patientModel.mobileNumber.length
          : "";
        var mobileNumber = this.state.patientModel.mobileNumber.slice(3, lng);
        this.state.patientModel.mobileNumber = mobileNumber.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    this.setState({ loading: true });

    var myVal = { ...this.validationModel };
    myVal.validation = false;

    if (this.isNull(this.state.patientModel.batchDocumentID) == false) {
      if (this.isNull(this.state.patientModel.pageNumber)) {
        myVal.pageNumberValField = (
          <span style={{ marginLeft: "40%" }}>Enter Valid Page #</span>
        );
        myVal.validation = true;
      } else {
        myVal.pageNumberValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }

    //Batch number Validatoin
    if (this.isNull(this.state.patientModel.batchDocumentID) == false) {
      axios
        .get(
          this.batchURL +
            "FindBatchDocumentPath/" +
            this.state.patientModel.batchDocumentID,
          this.config
        )
        .then((response) => {
          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span
              className="validationMsg"
              style={{ color: "green", marginLeft: "-43%" }}
            >
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
          });
          // return;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              console.log(error.response.status);
              if (error.response.status == 404) {
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                    Invalid Batch # {this.state.patientModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 400) {
                var myVal = this.validationModel;

                myVal.batchDocumentIDValField = (
                  <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                    Invalid Batch # {this.state.patientModel.batchDocumentID}
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

    if (this.isNull(this.state.patientModel.lastName)) {
      myVal.lastNameValField = (
        <span className="validationMsg">Enter Last Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.lastNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientModel.firstName)) {
      myVal.firstNameValField = (
        <span className="validationMsg">Enter First Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.firstNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.patientModel.zipCode) === false &&
      this.state.patientModel.zipCode.length > 0
    ) {
      if (this.state.patientModel.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.patientModel.zipCode.length > 5 &&
        this.state.patientModel.zipCode.length < 9
      ) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of either 5 or 9 digits
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.zipCodeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.zipCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.patientModel.phoneNumber) === false &&
      this.state.patientModel.phoneNumber.length < 10
    ) {
      myVal.phoneNumberValField = (
        <span className="validationMsg">Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.phoneNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.patientModel.mobileNumber) === false &&
      this.state.patientModel.mobileNumber.length < 10
    ) {
      myVal.mobileNumberValField = (
        <span className="validationMsg">Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.mobileNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.patientModel.ssn) === false &&
      this.state.patientModel.ssn.length < 9
    ) {
      myVal.ssnValField = (
        <span className="validationMsg">ssn # length should be 9</span>
      );
      myVal.validation = true;
    } else {
      myVal.ssnValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientModel.practiceID)) {
      myVal.practiceIDValField = (
        <span className="validationMsg">Select Practice</span>
      );
      myVal.validation = true;
    } else {
      myVal.practiceIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientModel.locationId)) {
      myVal.locationIdValField = (
        <span className="validationMsg">Select Location</span>
      );
      myVal.validation = true;
    } else {
      myVal.locationIdValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientModel.providerID)) {
      myVal.providerIDValField = (
        <span className="validationMsg">Select Provider</span>
      );
      myVal.validation = true;
    } else {
      myVal.providerIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //DOB Future Date Validation
    if (this.isNull(this.state.patientModel.dob) == false) {
      if (
        new Date(
          moment(this.state.patientModel.dob).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.dobValField = (
          <span className="validationMsg">Future date can't be selected </span>
        );
        myVal.validation = true;
      } else {
        myVal.dobValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.dobValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientModel.pageNumber) == false) {
      var listOfNum, matchComme, matchDash, singleNum;
      var pageNumber = this.state.patientModel.pageNumber;

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
        for (var i = 0; i < singleNum.length; i++) {
          if (singleNum > this.state.pageNumber) {
            myVal.pageNumberValField = (
              <span className="validationMsg" style={{marginLeft:"43%" }}>
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
        for (var i = 0; i < listOfNum.length; i++) {
          if (listOfNum[i] > this.state.pageNumber) {
            myVal.pageNumberValField = (
              <span  style={{marginLeft:"43%" }}>
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

    myVal.emailValField = "";
    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      Swal.fire("Please fill all patient fields properly", "", "error");
      this.setState({ loading: false });
      this.savePatientCount = 0;
      return;
    }

    //Patient Plans Validation
    var patientPlans = [];
    let patientPlanValidationCount = 0;
    try {
      patientPlans = this.state.patientModel.patientPlans
        ? this.state.patientModel.patientPlans
        : [];
      await patientPlans.map((plan, index) => {
        //Last Name Validation
        if (this.isNull(plan.lastName)) {
          plan.lastNameValField = (
            <span className="validationMsg">Enter Last Name</span>
          );
          patientPlanValidationCount += 1;
        } else {
          plan.lastNameValField = null;
        }
        //First Name Validation
        if (this.isNull(plan.firstName)) {
          plan.firstNameValField = (
            <span className="validationMsg">Enter First Name</span>
          );
          patientPlanValidationCount += 1;
        } else {
          plan.firstNameValField = null;
        }

        //DOB Future Date Validation
        if (this.isNull(plan.dob) == false) {
          if (
            new Date(moment(plan.dob).format().slice(0, 10)).getTime() >
            new Date(moment().format().slice(0, 10)).getTime()
          ) {
            plan.dobValField = (
              <span className="validationMsg">
                Future date can't be selected{" "}
              </span>
            );
            patientPlanValidationCount += 1;
          } else {
            plan.dobValField = null;
          }
        } else {
          plan.dobValField = null;
        }

        //Coverage Val Field
        if (this.isNull(plan.coverage)) {
          plan.coverageValField = (
            <span className="validationMsg">Select Coverage</span>
          );
          patientPlanValidationCount += 1;
        } else {
          plan.coverageValField = null;
        }

        //Relationship Val Field
        if (this.isNull(plan.relationShip)) {
          plan.relationshipValField = (
            <span className="validationMsg">Select Relationship</span>
          );
          patientPlanValidationCount += 1;
        } else {
          plan.relationshipValField = null;
        }

        //Subscriber validation
        if (this.isNull(plan.subscriberId)) {
          plan.subscriberIDValField = (
            <span className="validationMsg">Enter SubscriberID</span>
          );
          patientPlanValidationCount += 1;
        } else {
          plan.subscriberIDValField = null;
        }

        //Insurance Plan Validation
        if (this.isNull(plan.insurancePlanID)) {
          plan.insurancePlanValField = (
            <span className="validationMsg">Enter Insurance Plan</span>
          );
          patientPlanValidationCount += 1;
        } else {
          plan.insurancePlanValField = null;
        }
      });
    } catch {}

    if (patientPlanValidationCount > 0) {
      this.setState({
        loading: false,
        patientModel: {
          ...this.state.patientModel,
          patientPlans: patientPlans,
        },
      });
      Swal.fire(
        "Something Wrong!",
        "Please Select All patient Plan Fields Properly",
        "error"
      );
      this.savePatientCount = 0;
      return;
    }

    //Patient Referral Validation
    var patientRefModel = [];
    let patientRefValidationCount = 0;
    try {
      patientRefModel = this.state.patientModel.patientReferrals
        ? this.state.patientModel.patientReferrals
        : [];
      await patientRefModel.map((ref, index) => {
        console.log("ref Plan : ", ref);
        // Validation
        if (this.isNull(ref.providerID)) {
          ref.providerIDRefValField = (
            <span className="validationMsg">Enter Provider</span>
          );
          patientRefValidationCount += 1;
        } else {
          ref.providerIDRefValField = null;
        }

        if (this.isNull(ref.patientPlanID)) {
          ref.patientPlanIDRefValField = (
            <span className="validationMsg">Enter Plan</span>
          );
          patientRefValidationCount += 1;
        } else {
          ref.patientPlanIDRefValField = null;
        }
      });
    } catch {}

    if (patientRefValidationCount > 0) {
      this.setState({
        loading: false,
        patientModel: {
          ...this.state.patientModel,
          patientReferral: patientRefModel,
        },
      });
      Swal.fire(
        "Something Wrong!",
        "Please Select All Patient Referral Fields Properly",
        "error"
      );
      this.savePatientCount = 0;
      return;
    }

    //Notes Validation
    var note = [];
    var notesVal;
    if (this.state.patientModel.note == null) {
      note = [];
    } else {
      note = this.state.patientModel.note;
    }

    for (var i = 0; i < note.length; i++) {
      notesVal = { ...this.state.patientModel.note[i] };
      notesVal.validation = false;
      //Notes validation
      if (this.isNull(this.state.patientModel.note[i].note)) {
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
        patientModel: {
          ...this.state.patientModel,
          note: [
            ...this.state.patientModel.note.slice(0, i),
            Object.assign({}, this.state.patientModel.note[i], notesVal),
            ...this.state.patientModel.note.slice(i + 1),
          ],
        },
      });
    }

    //Notes
    for (var i = 0; i < note.length; i++) {
      if (this.state.patientModel.note[i].validation == true) {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check All Note Fields", "error");
        this.savePatientCount = 0;
        return;
      }
    }

    let propsTosend = [];
    let patientModel = { ...this.state.patientModel };
    patientModel.profilePic = this.state.imagePreviewUrl;
    // e.preventDefault();
    axios
      .post(this.url + "savePatient", patientModel, this.config)
      .then((response) => {
        this.savePatientCount = 0;
        propsTosend = response.data;
        this.setState({
          patientModel: response.data,
          editId: response.data.id,
          loading: false,
        });
        Swal.fire("Record Saved Successfully", "", "success").then((sres) => {
          // this.UNSAFE_componentWillMount();
          if (this.props.SchedularAdvSearch) {
            this.props.rowSelect(propsTosend);
            this.props.gotoAppointment();
          }
          if (!this.props.SchedularAdvSearch) {
            if (
              this.state.patientPopupId > 0 ||
              this.state.patientPopupId == -1
            ) {
            } else {
              this.props.selectTabAction("NewPatient", response.data.id);
              this.props.history.push("/NewPatient/" + response.data.id);
            }
          }
        });
      })
      .catch((error) => {
        this.savePatientCount = 0;
        this.setState({ loading: false });

        try {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              } else if (error.response.status == 404) {
                Swal.fire("Not Found", "Failed With Status Code 404", "error");
              } else if (error.response.status == 400) {
                Swal.fire("", error.response.data, "error");
              }
            }
          }
          if (error.response.data) {
            if (error.response.data.Email[0] == "Please enter Valid Email ID") {
              //Swal.fire("Something Wrong", error.response.data.Email[0], "error");
              myVal.emailValField = (
                <span className="validationMsg">
                  Please enter Valid Email ID
                </span>
              );
              myVal.validation = true;
            } else {
              myVal.emailValField = "";
              if (myVal.validation === false) myVal.validation = false;
            }
            this.setState({
              validationModel: myVal,
            });
          } else {
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
        } catch {}
      });
  }

  cancelBtn = (e) => {
    e.preventDefault();
    this.props.selectTabAction("Patient");
    this.props.history.push("/Patient");
  };

  async handleCheck() {
    // var patientPlans    = this.state.patientModel.patientPlans    ;
    // patientPlans   [index].active = !this.state.patientModel.patientPlans    [index].active
    await this.setState({
      patientModel: {
        ...this.state.patientModel,
        isActive: !this.state.patientModel.isActive,
      },
    });
  }

  handlePatientPlanCheck = (index) => {
    var patientPlans = this.state.patientModel.patientPlans;
    patientPlans[index].isActive = !this.state.patientModel.patientPlans[index]
      .isActive;
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        patientPlans: patientPlans,
      },
    });
  };

  handlePatientPlanAuthReqCheck = (index) => {
    var patientPlans = this.state.patientModel.patientPlans;
    patientPlans[index].authRequired = !this.state.patientModel.patientPlans[
      index
    ].authRequired;
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        patientPlans: patientPlans,
      },
    });
    if (
      patientPlans[index].authRequired == true &&
      this.isNull(patientPlans[index].insurancePlanID) == false
    ) {
      this.addAuthRow();
    }
    if (
      patientPlans[index].authRequired == false &&
      this.isNull(patientPlans[index].insurancePlanID) == false
    ) {
      var length = this.state.patientModel.patientAuthorization.length
        ? this.state.patientModel.patientAuthorization.length
        : 0;
      if (length) {
        var ID = this.state.patientModel.patientAuthorization[length - 1].id
          ? this.state.patientModel.patientAuthorization[length - 1].id
          : 0;
        if (ID > 0) {
          axios
            .delete(this.url + "DeletePatientAuth/" + ID, this.config)
            .then((response) => {
              Swal.fire(
                "Record Deleted!",
                "Record has been deleted.",
                "success"
              );
              let patientAuthModel = [
                ...this.state.patientModel.patientAuthorization,
              ];
              patientAuthModel.splice(index, 1);
              this.setState({
                loading: false,
                patientModel: {
                  ...this.state.patientModel,
                  patientAuthorization: patientAuthModel,
                },
              });
            })
            .catch((error) => {
              this.setState({ loading: false });
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
          let patientAuthModel = [
            ...this.state.patientModel.patientAuthorization,
          ];
          patientAuthModel.splice(index, 1);
          this.setState({
            loading: false,
            patientModel: {
              ...this.state.patientModel,
              patientAuthorization: patientAuthModel,
            },
          });
        }
      }
    }
  };

  handleCheckbox() {
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        statement: !this.state.patientModel.statement,
      },
    });
  }

  //Hold Sttemnet checkbox
  handleholdStatementCheckbox = () => {
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        holdStatement: !this.state.patientModel.holdStatement,
      },
    });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  handleDateChange = (date) => {
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        dob: date.target.value,
      },
    });
  };

  //Add New Patient
  addNewPatient = () => {
    let validationModel = { ...this.validationModel };
    validationModel.responsepagesValField = "";
    validationModel.batchDocumentIDValField = "";
    this.setState({
      editId: 0,
      validationModel: validationModel,
      patientModel: {
        ...this.state.patientModel,
        id: 0,
        accountNum: "",
        medicalRecordNumber: "",
        title: "",
        lastName: "",
        middleInitial: "",
        firstName: "",
        ssn: "",
        dob: "",
        gender: "",
        maritalStatus: "",
        race: "",
        ethinicity: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        mobileNumber: "",
        email: "",
        statementMessage: "",
        statement: false,
        // practiceID: null,
        // locationId: null,
        // providerID: null,
        // refProviderID: null,
        note: [],
        patientPlans: [],
        authnote: [],
        patientAuthorization: [],
        patientReferrals: [],

        notes: "",
        isDeleted: false,
        isActive: true,
        batchDocumentID: "",
        pageNumber: "",
      },
    });

    this.props.selectTabAction("NewPatient", 0);
    this.props.history.push("/NewPatient/" + 0);
  };

  deletePatient = (e) => {
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
        axios
          .delete(this.url + "DeletePatient/" + this.state.editId, this.config)
          .then((response) => {
            Swal.fire("Record Deleted Successfully", "", "success");
            $("#btnCancel").click();
            this.props.selectTabAction("Patient");
          })
          .catch((error) => {
            Swal.fire(
              "Record Not Deleted!",
              "Record can not be deleted, as it is being referenced in other screens.",
              "error"
            );
          });
      }
    });
  };

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = (name, id) => {
    this.setState({ popupName: "NewHistoryPractice", id: id });
  };

  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ popupName: "" });
  };

  async addRowNotes(event) {
    event.preventDefault();
    const note = { ...this.notesModel };
    var len = this.state.patientModel.note
      ? this.state.patientModel.note.length
      : 0;
    if (len == 0) {
      await this.setState({
        patientModel: {
          ...this.state.patientModel,
          note: this.state.patientModel.note.concat(note),
        },
      });
      return;
    } else {
      len = len - 1;
      if (this.isNull(this.state.patientModel.note[len].note)) {
        Swal.fire("First Enter Previous Notes", "", "error");
        return;
      } else {
        await this.setState({
          patientModel: {
            ...this.state.patientModel,
            note: this.state.patientModel.note.concat(note),
          },
        });
      }
    }
    if (this.state.patientModel.note) {
    }
  }

  async addAuthRowNotes(event) {
    const authnote = { ...this.notesModel };
    var len = this.state.patientModel.authnote
      ? this.state.patientModel.authnote.length
      : 0;
    if (len == 0) {
      await this.setState({
        patientModel: {
          ...this.state.patientModel,
          //  authnote: this.state.patientModel.authnote.concat(note)
        },
      });
      return;
    } else {
      len = len - 1;
      if (this.isNull(this.state.patientModel.authnote[len].authnote)) {
        Swal.fire("First Enter Previous Notes", "", "error");
        return;
      } else {
        await this.setState({
          patientModel: {
            ...this.state.patientModel,
            //  authnote: this.state.patientModel.authnote.concat(authnote)
          },
        });
      }
    }
    if (this.state.patientModel.authnote) {
    }
  }

  // async addRowNotes() {
  //   const note = { ...this.notesModel };

  //   await this.setState({
  //     patientModel: {
  //       ...this.state.patientModel,
  //       note: this.state.patientModel.note.concat(note)
  //     }
  //   });
  // }

  handlePlanChange = (event) => {
    let newList = [...this.state.patientModel.patientPlans];
    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;

    // handle First index Plan Coverage
    if (index == 0) {
      if (name == "coverage") {
        if (value != "P") {
          Swal.fire("Select First Coverage As Primary", "", "error");
          return;
        }
      }
    }

    if (name === "relationShip") {
      newList[index][name] =
        value == "Please Select" ? null : value.toUpperCase();
      if (value == 18) {
        newList[index].lastName = this.state.patientModel.lastName;
        newList[index].firstName = this.state.patientModel.firstName;
        newList[index].dob = this.state.patientModel.dob;
        newList[index].gender = this.state.patientModel.gender;
        newList[index].middleInitial = this.state.patientModel.middleInitial;
        newList[index].city = this.state.patientModel.city;
        newList[index].state = this.state.patientModel.state;
        newList[index].zipCode = this.state.patientModel.zipCode;
        newList[index].address1 = this.state.patientModel.address1;
      } else {
        newList[index].lastName = "";
        newList[index].firstName = "";
        newList[index].dob = "";
        newList[index].gender = "";
        newList[index].middleInitial = "";
        newList[index].city = "";
        newList[index].state = "";
        newList[index].zipCode = "";
        newList[index].address1 = "";
      }
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientPlans: newList,
        },
      });
    } else {
      newList[index][name] =
        value == "Please Select" ? null : value.toUpperCase();
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientPlans: newList,
        },
      });
    }

    //carret Position
    if (
      event.target.name == "dob" ||
      event.target.name == "startdate" ||
      event.target.name == "enddate"
    ) {
    } else {
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }
  };

  handleAuthChange = (event) => {
    let newList = [...this.state.patientModel.patientAuthorization];
    const index = event.target.id;
    const name = event.target.name;
    var value = event.target.value;

    if (name == "authorizationNumber") {
      var authorizationDate = new Date().toISOString().slice(0, 10);
      newList[index].authorizationDate = authorizationDate;
    } else if (name == "visitsAllowed") {
      newList[index].remaining =
        this.state.patientModel.patientAuthorization[index].visitsAllowed -
        this.state.patientModel.patientAuthorization[index].visitsUsed;
    } else if (
      name == "medicalNecessityRequired" ||
      name == "medicalRecordRequired"
    ) {
      if (value == "Y") {
        value = true;
      } else {
        value = false;
      }
      value = value;
    } else if (name == "status" || name == "responsibleParty") {
      value = value;
    } else {
      value = value.toUpperCase();
    }
    newList[index][name] = value;
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        patientAuthorization: newList,
      },
    });

    //carret Position
    if (
      event.target.name == "startDate" ||
      event.target.name == "endDate" ||
      event.target.name == "authorizationDate"
    ) {
    } else {
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }
  };

  handleRefChange = (event) => {
    console.log(event.target.value, event.target.name);
    let newList = [...this.state.patientModel.patientReferrals];
    const index = event.target.id;
    const name = event.target.name;
    var value = event.target.value;

    // handle First index Plan Coverage

    // if( name == "remaining"){
    //   value = newList[index]visitsAllowed - newList[index]visitsUsed;
    // }
    if (name == "status" || name == "rererralForService") {
      value = value;
    } else {
      value = value.toUpperCase();
    }
    newList[index][name] = value;
    this.setState({
      patientModel: {
        ...this.state.patientModel,
        patientReferrals: newList,
      },
    });

    //carret Position
    if (event.target.name == "startDate" || event.target.name == "endDate") {
    } else {
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }
  };

  // handleAuthDropDownChange = event => {
  //   console.log(event.target.value, event.target.name);
  //   let newList = [...this.state.patientModel.patientAuthorization];
  //   const index = event.target.id;
  //   const name = event.target.name;
  //   const value = event.target.value;

  //   newList[index][name] = value.toUpperCase();
  //   this.setState({
  //     patientModel: {
  //       ...this.state.patientModel,
  //       patientAuthorization: newList
  //     }
  //   });
  // };

  async handleNoteChange(event) {
    var value = event.target.value;
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    if (caret == 0 || caret <= 1) {
      value = value.trim();
    }
    let newNotesList = this.state.patientModel.note;
    const index = event.target.id;
    const name = event.target.name;
    newNotesList[index][name] = value.toUpperCase();

    this.setState({
      patientModel: {
        ...this.state.patientModel,
        note: newNotesList,
      },
    });
  }

  async handleAuthNoteChange(event) {
    var value = event.target.value;
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    if (caret == 0 || caret <= 1) {
      value = value.trim();
    }
    let newAuthNotesList = this.state.patientModel.authnote;
    const index = event.target.id;
    const name = event.target.name;
    newAuthNotesList[index][name] = value.toUpperCase();

    this.setState({
      patientModel: {
        ...this.state.patientModel,
        authnote: newAuthNotesList,
      },
    });
  }

  async deleteRowNotes(event, index, NoteRowId) {
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
              let note = [...this.state.patientModel.note];
              note.splice(id, 1);
              this.setState({
                patientModel: {
                  ...this.state.patientModel,
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
          let note = [...this.state.patientModel.note];
          note.splice(id, 1);
          this.setState({
            patientModel: {
              ...this.state.patientModel,
              note: note,
            },
          });
        }
      }
    });
  }

  //Patient Plans Functions
  addPlanRow(event) {
    event.preventDefault();
    const patientPlanModel = { ...this.patientPlanModel };

    var len = this.state.patientModel.patientPlans
      ? this.state.patientModel.patientPlans.length
      : 0;
    if (len == 0) {
      patientPlanModel.patientID = this.state.patientModel.id;
      var patientPlanModelList = [];
      if (this.isNull(this.state.patientModel.patientPlans)) {
        patientPlanModelList = patientPlanModelList.concat(patientPlanModel);
      } else {
        patientPlanModelList = this.state.patientModel.patientPlans.concat(
          patientPlanModel
        );
      }
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientPlans: patientPlanModelList,
        },
      });
      return;
    } else {
      len = len - 1;
      var patientPlans = this.state.patientModel.patientPlans;
      patientPlans[len].validation = false;
      //Last Name Validation
      if (this.isNull(patientPlans[len].lastName)) {
        patientPlans[len].lastNameValField = (
          <span className="validationMsg">Enter Last Name</span>
        );
        patientPlans[len].validation = true;
      } else {
        if (patientPlans[len].validation == false)
          patientPlans[len].validation = false;
      }
      //First Name Validation
      if (this.isNull(patientPlans[len].firstName)) {
        patientPlans[len].firstNameValField = (
          <span className="validationMsg">Enter First Name</span>
        );
        patientPlans[len].validation = true;
      } else {
        if (patientPlans[len].validation == false)
          patientPlans[len].validation = false;
      }

      //Coverage Val Field
      if (this.isNull(patientPlans[len].coverage)) {
        patientPlans[len].coverageValField = (
          <span className="validationMsg">Select Coverage</span>
        );
        patientPlans[len].validation = true;
      } else {
        if (patientPlans[len].validation == false)
          patientPlans[len].validation = false;
      }

      //Relationship Val Field
      if (this.isNull(patientPlans[len].relationShip)) {
        patientPlans[len].relationshipValField = (
          <span className="validationMsg">Select Rlationship</span>
        );
        patientPlans[len].validation = true;
      } else {
        if (patientPlans[len].validation == false)
          patientPlans[len].validation = false;
      }

      //Subscriber validation
      if (this.isNull(patientPlans[len].subscriberId)) {
        patientPlans[len].subscriberIDValField = (
          <span className="validationMsg">Enter SubscriberID</span>
        );
        patientPlans[len].validation = true;
      } else {
        if (patientPlans[len].validation == false)
          patientPlans[len].validation = false;
      }

      //Insurance Plan Validation
      // if (this.isNull(patientPlans[len].insurancePlanID)) {
      //   patientPlans[len] = (
      //     <span className="validationMsg">Enter Insurance Plan</span>
      //   );
      //   patientPlans[len].validation  = true;
      // } else {
      //   if( patientPlans[len].validation == false)  patientPlans[len].validation = false
      // }

      if (patientPlans[len].validation == true) {
        this.setState({
          patientModel: {
            ...this.state.patientModel,
            patientPlans: patientPlans,
          },
        });
        Swal.fire(
          "First  Fill All Required Fields of Curent Plan",
          "",
          "error"
        );
        return;
      }

      this.addMYPatientPlan(
        patientPlans[len],
        patientPlans[len].insurancePlanObject,
        patientPlans[len].insurancePlanID
      );

      patientPlans[len].commonKey =
        patientPlans[len].coverage.toString() +
        patientPlans[len].insurancePlanID.toString() +
        patientPlans[len].subscriberId.toString() +
        patientPlans[len].isActive.toString();

      patientPlanModel.patientID = this.state.patientModel.id;
      var patientPlanModelList = [];
      if (this.isNull(this.state.patientModel.patientPlans)) {
        patientPlanModelList = patientPlanModelList.concat(patientPlanModel);
      } else {
        patientPlanModelList = this.state.patientModel.patientPlans.concat(
          patientPlanModel
        );
      }
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientPlans: patientPlanModelList,
        },
      });
      return;
    }
  }

  async addAuthRow() {
    // event.preventDefault();
    var len = this.state.patientModel.patientPlans.length - 1;
    var patientPlans = this.state.patientModel.patientPlans;
    if(patientPlans.length   == 0 ){
      return
    }
    patientPlans[len].commonKey =
      patientPlans[len].coverage.toString() +
      patientPlans[len].insurancePlanID.toString() +
      patientPlans[len].subscriberId.toString() +
      patientPlans[len].isActive.toString();

    var patientPlan = await this.myPatientPlans.filter(
      (patientPlan) => patientPlan.commonKey == patientPlans[len].commonKey
    );
    console.log("Patient Plan ;", patientPlan);
    if (patientPlan.length == 0) {
      this.addMYPatientPlan(
        patientPlans[len],
        patientPlans[len].insurancePlanObject,
        patientPlans[len].insurancePlanID
      );
    }

    var length = this.state.patientModel.patientAuthorization
      ? this.state.patientModel.patientAuthorization.length
      : 0;
    if (length == 0) {
      const patientAuthModel = { ...this.patientAuthModel };
      patientAuthModel.patientID = this.state.patientModel.id;
      // set by default plan
      patientAuthModel.patientPlanID = patientPlans[0].insurancePlanObject.id;
      patientAuthModel.insurancePlanID = patientPlans[0].insurancePlanID;
      patientAuthModel.insurancePlanObject =
        patientPlans[0].insurancePlanObject;
      //Set Provider Object
      var provider = await this.props.userProviders.filter(
        (provider) => provider.id == this.state.patientModel.providerID
      );

      patientAuthModel.providerID = this.state.patientModel.providerID;
      patientAuthModel.providerObject = provider;
      var patientAuthModelList = [];
      if (this.isNull(this.state.patientModel.patientAuthorization)) {
        patientAuthModelList = patientAuthModelList.concat(patientAuthModel);
      } else {
        patientAuthModelList = this.state.patientModel.patientAuthorization.concat(
          patientAuthModel
        );
      }
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientAuthorization: patientAuthModelList,
          patientPlans: patientPlans,
        },
      });
    } else {
      len = length - 1;
      var patientAuth = this.state.patientModel.patientAuthorization;
      patientAuth[len].validation = false;
      //authorizationNumber
      // if (this.isNull(patientAuth[len].authorizationNumber)) {
      //   patientAuth[len].authorizationNumberValField = (
      //     <span className="validationMsg">Enter Auth #</span>
      //   );
      //   patientAuth[len].validation = true;
      // } else {
      //   if (patientAuth[len].validation == false)
      //     patientAuth[len].validation = false;
      // }

      //authorizationNumber
      // if (this.isNull(patientAuth[len].cptid)) {
      //   patientAuth[len].cptIDValField = (
      //     <span className="validationMsg">Enter CPT</span>
      //   );
      //   patientAuth[len].validation = true;
      // } else {
      //   if (patientAuth[len].validation == false)
      //     patientAuth[len].validation = false;
      // }

      // if (this.isNull(patientAuth[len].providerID)) {
      //   patientAuth[len].providerIDValField = (
      //     <span className="validationMsg">Enter Provider</span>
      //   );
      //   patientAuth[len].validation = true;
      // } else {
      //   if (patientAuth[len].validation == false)
      //     patientAuth[len].validation = false;
      // }

      // if (this.isNull(patientAuth[len].insurancePlanID)) {
      //   patientAuth[len].planIDValField = (
      //     <span className="validationMsg">Enter Insurnace Plan</span>
      //   );
      //   patientAuth[len].validation = true;
      // } else {
      //   if (patientAuth[len].validation == false)
      //     patientAuth.validation = false;
      // }

      // if (this.isNull(patientAuth[len].startDate)) {
      //   patientAuth[len].startdateNumberValField = (
      //     <span className="validationMsg">Enter Start Date</span>
      //   );
      //   patientAuth[len].validation = true;
      // } else {
      //   if (patientAuth[len].validation == false)
      //     patientAuth.validation = false;
      // }

      // if (this.isNull(patientAuth[len].endDate)) {
      //   patientAuth[len].enddateValField = (
      //     <span className="validationMsg">Enter End Date</span>
      //   );
      //   patientAuth[len].validation = true;
      // } else {
      //   if (patientAuth[len].validation == false)
      //     patientAuth.validation = false;
      // }

      // if (this.isNull(patientAuth[len].visitsAllowed)) {
      //   patientAuth[len].visitsAllowedValField = (
      //     <span className="validationMsg">Enter End Date</span>
      //   );
      //   patientAuth[len].validation = true;
      // } else {
      //   if (patientAuth[len].validation == false)
      //     patientAuth.validation = false;
      // }

      // if (patientAuth[len].validation == true) {
      //   this.setState({
      //     patientModel: {
      //       ...this.state.patientModel,
      //       patientAuthorization: patientAuth,
      //       patientPlans: patientPlans,
      //     },
      //   });
      //   Swal.fire(
      //     "First  Fill All Required Fields of Patient Authorization",
      //     "",
      //     "error"
      //   );
      //   return;
      // } else {
      const patientAuthModel = { ...this.patientAuthModel };
      patientAuthModel.patientID = this.state.patientModel.id;
      // set by default plan
      patientAuthModel.patientPlanID =
        patientPlans[0].insurancePlanObject[0].id;
      patientAuthModel.insurancePlanID = patientPlans[0].insurancePlanID;
      patientAuthModel.insurancePlanObject =
        patientPlans[0].insurancePlanObject;
      //Set Provider Object
      var provider = await this.props.userProviders.filter(
        (provider) => provider.id == this.state.patientModel.providerID
      );

      patientAuthModel.providerID = this.state.patientModel.providerID;
      patientAuthModel.providerObject = provider;
      var patientAuthModelList = [];
      if (this.isNull(this.state.patientModel.patientAuthorization)) {
        patientAuthModelList = patientAuthModelList.concat(patientAuthModel);
      } else {
        patientAuthModelList = this.state.patientModel.patientAuthorization.concat(
          patientAuthModel
        );
      }
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientAuthorization: patientAuthModelList,
          patientPlans: patientPlans,
        },
      });
    }
    // }
  }

  async addReferral(event) {
    event.preventDefault();
    var len = this.state.patientModel.patientPlans.length - 1;
    var patientPlans = this.state.patientModel.patientPlans;

    patientPlans[len].commonKey =
      patientPlans[len].coverage.toString() +
      patientPlans[len].insurancePlanID.toString() +
      patientPlans[len].subscriberId.toString() +
      patientPlans[len].isActive.toString();

    var patientPlan = await this.myPatientPlans.filter(
      (patientPlan) => patientPlan.commonKey == patientPlans[len].commonKey
    );

    if (patientPlan.length == 0) {
      this.addMYPatientPlan(
        patientPlans[len],
        patientPlans[len].insurancePlanObject,
        patientPlans[len].insurancePlanID
      );
    }

    var length = this.state.patientModel.patientReferrals
      ? this.state.patientModel.patientReferrals.length
      : 0;
    if (length == 0) {
      const patientReferrals = { ...this.patientReferral };
      patientReferrals.patientID = this.state.patientModel.id;
      // set by default plan
      patientReferrals.patientPlanID = patientPlans[0].insurancePlanObject.id
        ? patientPlans[0].insurancePlanObject.id
        : patientPlans[0].insurancePlanObject[0].id;
      patientReferrals.insurancePlanID = patientPlans[0].insurancePlanID;
      patientReferrals.insurancePlanObject =
        patientPlans[0].insurancePlanObject;
      //Set PCP && Provider Object
      var provider = await this.props.userProviders.filter(
        (provider) => provider.id == this.state.patientModel.providerID
      );
      console.log("Provider", provider);
      // NewPatientmodel.patientReferrals[index].pcpObject = provider;
      patientReferrals.pcpid = this.state.patientModel.providerID;
      patientReferrals.pcpObject = provider;
      patientReferrals.providerID = this.state.patientModel.providerID;
      patientReferrals.providerObject = provider;
      console.log(patientReferrals);

      var patientRefModelList = [];
      if (this.isNull(this.state.patientModel.patientReferrals)) {
        patientRefModelList = patientRefModelList.concat(patientReferrals);
      } else {
        patientRefModelList = this.state.patientModel.patientReferrals.concat(
          patientReferrals
        );
      }
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          patientReferrals: patientRefModelList,
          patientPlans: patientPlans,
        },
      });
    } else {
      len = length - 1;
      var patientReferral = this.state.patientModel.patientReferrals;
      patientReferral[len].validation = false;

      //patientPlanIDRefValField
      if (this.isNull(patientReferral[len].patientPlanID)) {
        patientReferral[len].patientPlanIDRefValField = (
          <span className="validationMsg">Enter Plan</span>
        );
        patientReferral[len].validation = true;
      } else {
        if (patientReferral[len].validation == false)
          patientReferral[len].validation = false;
      }
      //providerIDRefValField
      if (this.isNull(patientReferral[len].providerID)) {
        patientReferral[len].providerIDRefValField = (
          <span className="validationMsg">Enter Provider</span>
        );
        patientReferral[len].validation = true;
      } else {
        if (patientReferral[len].validation == false)
          patientReferral[len].validation = false;
      }

      if (patientReferral[len].validation == true) {
        this.setState({
          patientModel: {
            ...this.state.patientModel,
            patientReferrals: patientReferral,
            patientPlans: patientPlans,
          },
        });
        Swal.fire(
          "First  Fill All Required Fields of Patient Referral",
          "",
          "error"
        );
        return;
      } else {
        const patientReferralModel = { ...this.patientReferral };
        patientReferralModel.patientID = this.state.patientModel.id;
        // set by default plan
        patientReferralModel.patientPlanID = patientPlans[0].insurancePlanObject
          .id
          ? patientPlans[0].insurancePlanObject.id
          : patientPlans[0].insurancePlanObject[0].id;
        patientReferralModel.insurancePlanID = patientPlans[0].insurancePlanID;
        patientReferralModel.insurancePlanObject =
          patientPlans[0].insurancePlanObject;
        //Set PCP && Provider Object
        var provider = await this.props.userProviders.filter(
          (provider) => provider.id == this.state.patientModel.providerID
        );
        console.log("Provider", provider);
        // NewPatientmodel.patientReferrals[index].pcpObject = provider;
        patientReferralModel.pcpid = this.state.patientModel.providerID;
        patientReferralModel.pcpObject = provider;
        patientReferralModel.providerID = this.state.patientModel.providerID;
        patientReferralModel.providerObject = provider;
        console.log(patientReferralModel);
        var patientReferralModelList = [];
        if (this.isNull(this.state.patientModel.patientReferrals)) {
          patientReferralModelList = patientReferralModelList.concat(
            patientReferralModel
          );
        } else {
          patientReferralModelList = this.state.patientModel.patientReferrals.concat(
            patientReferralModel
          );
        }
        this.setState({
          patientModel: {
            ...this.state.patientModel,
            patientReferrals: patientReferralModelList,
            patientPlans: patientPlans,
          },
        });
      }
    }
  }
  //Remove Plan Row
  removePlanRow = (event, index, planID) => {
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
        if (planID > 0) {
          axios
            .delete(
              this.patientPlanUrl + "DeletePatientPlan/" + planID,
              this.config
            )
            .then((response) => {
              Swal.fire(
                "Record Deleted!",
                "Record has been deleted.",
                "success"
              );
              let patientPlans = [...this.state.patientModel.patientPlans];
              patientPlans.splice(index, 1);
              this.setState({
                patientModel: {
                  ...this.state.patientModel,
                  patientPlans: patientPlans,
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
          let patientPlans = [...this.state.patientModel.patientPlans];
          patientPlans.splice(index, 1);
          this.setState({
            patientModel: {
              ...this.state.patientModel,
              patientPlans: patientPlans,
            },
          });
        }
      }
    });
  };

  removeAuthRow = (event, index, ID) => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      this.setState({ loading: true });
      if (result.value) {
        //KHIZER CODE-------------------------DeleteNote
        if (ID > 0) {
          axios
            .delete(this.url + "DeletePatientAuth/" + ID, this.config)
            .then((response) => {
              Swal.fire(
                "Record Deleted!",
                "Record has been deleted.",
                "success"
              );
              let patientAuthModel = [
                ...this.state.patientModel.patientAuthorization,
              ];
              patientAuthModel.splice(index, 1);
              this.setState({
                loading: false,
                patientModel: {
                  ...this.state.patientModel,
                  patientAuthorization: patientAuthModel,
                },
              });
            })
            .catch((error) => {
              this.setState({ loading: false });
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
          let patientAuthModel = [
            ...this.state.patientModel.patientAuthorization,
          ];
          patientAuthModel.splice(index, 1);
          this.setState({
            loading: false,
            patientModel: {
              ...this.state.patientModel,
              patientAuthorization: patientAuthModel,
            },
          });
        }
      }
    });
  };

  removeRefRow = (event, index, ID) => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      this.setState({ loading: true });
      if (result.value) {
        //KHIZER CODE-------------------------DeleteNote
        if (ID > 0) {
          axios
            .delete(this.url + "DeletePatientReferral/" + ID, this.config)
            .then((response) => {
              Swal.fire(
                "Record Deleted!",
                "Record has been deleted.",
                "success"
              );
              let patientReferral = [
                ...this.state.patientModel.patientReferrals,
              ];
              patientReferral.splice(index, 1);
              this.setState({
                loading: false,
                patientModel: {
                  ...this.state.patientModel,
                  patientReferrals: patientReferral,
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
          let patientReferral = [...this.state.patientModel.patientReferrals];
          patientReferral.splice(index, 1);
          this.setState({
            loading: false,
            patientModel: {
              ...this.state.patientModel,
              patientReferrals: patientReferral,
            },
          });
        }
      } else {
        this.setState({ loading: false });
      }
    });
  };

  //toggle collapse
  toggleCollapse = (collapseID) => {
    const collapseIDL = this.state.collapseID != collapseID ? collapseID : 0;
    this.setState({ collapseID: collapseIDL });
  };

  //Handle Insurnace Plan Change
  handleInsurancePlanChange = (event) => {
    this.setState({ insurancePlanObject: event });
  };

  //Handle Patient Plan Change
  handlePatientPlanChange = (event) => {
    this.setState({
      patientPlans: {
        ...this.state.patientPlans,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
  };

  addMYPatientPlan = async (patientPlan, event, insurancePlanID) => {
    // var newMyPatientPlans = await  this.myPatientPlans.filter(plan => plan.id != patientPlan.id);
    // console.log("New Patient Plans List : " , newMyPatientPlans);

    this.myPatientPlans.push({
      id: patientPlan.id,
      label: event.label,
      value: event.value,
      insurancePlanID: insurancePlanID,
      commonKey:
        patientPlan.coverage.toString() +
        patientPlan.insurancePlanID.toString() +
        patientPlan.subscriberId.toString() +
        patientPlan.isActive.toString(),
    });

    // this.myPatientPlans = newMyPatientPlans;
  };

  //Insurance Plan Change
  async handleInsurancePlansuggChange(event, index) {
    let newList = [...this.state.patientModel.patientPlans];

    if (event) {
      newList[index].insurancePlanID = event.id;
      newList[index].insurancePlanObject = event;

      try {
        await axios
          .get(
            this.insurancePlanAddressURL +
              "GetInsurancePlanAddressesByInsurancePlanID/" +
              event.id,
            this.config
          )
          .then((response) => {
            newList[index].insurancePlanAddresses = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch {
        newList[index].insurancePlanAddresses = [];
      }

      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          insurancePlanID: event.id,
        },
      });
    } else {
      newList[index].insurancePlanID = null;
      newList[index].insurancePlanObject = [];
      newList[index].insurancePlanAddresses = [];

      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          patientPlans: newList,
        },
      });
    }
  }

  async handleInsuranceAuthsuggChange(event, index) {
    console.log("Plan : ", event);
    let newAuthList = [...this.state.patientModel.patientAuthorization];

    if (event) {
      newAuthList[index].patientPlanID = event.id;
      newAuthList[index].insurancePlanObject = event;
      newAuthList[index].commonKey = event.commonKey;
      newAuthList[index].insurancePlanID = event.insurancePlanID;
      // if (event.id == 0) {
      //   newAuthList[index].insurancePlanID = event.insurancePlanID;
      // }

      // await this.addMYPatientPlan(newAuthList[index], event, event.id);

      try {
        await axios
          .get(
            this.insurancePlanAddressURL +
              "GetInsurancePlanAddressesByInsurancePlanID/" +
              event.id,
            this.config
          )
          .then((response) => {
            newAuthList[index].insurancePlanAddresses = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch {
        newAuthList[index].insurancePlanAddresses = [];
      }

      this.setState({
        patientAuthModel: {
          ...this.state.patientAuthModel,
          // insurancePlanID: event.id
          patientPlanID: event.id,
        },
      });
    } else {
      newAuthList[index].insurancePlanID = null;
      newAuthList[index].insurancePlanObject = [];
      newAuthList[index].insurancePlanAddresses = [];

      this.setState({
        patientAuthModel: {
          ...this.state.patientAuthModel,
          patientAuthorization: newAuthList,
        },
      });
    }
  }

  //Handle  ICD Change  Function
  async handleProviderChange(event, index) {
    //If ICD value selected
    let newList = [...this.state.patientModel.patientAuthorization];

    if (event) {
      newList[index].providerID = event.id;
      newList[index].providerObject = event;
    } else {
      newList[index].providerID = null;
      newList[index].providerObject = [];
    }
    this.setState({
      patientAuthModel: {
        ...this.state.patientAuthModel,
        patientAuthorization: newList,
      },
    });
  }

  async handleInsuranceRefsuggChange(event, index) {
    console.log("Plan : ", event);
    let newRefList = [...this.state.patientModel.patientReferrals];

    if (event) {
      newRefList[index].patientPlanID = event.id;
      newRefList[index].insurancePlanObject = event;
      newRefList[index].commonKey = event.commonKey;
      newRefList[index].insurancePlanID = event.insurancePlanID;
      try {
        await axios
          .get(
            this.insurancePlanAddressURL +
              "GetInsurancePlanAddressesByInsurancePlanID/" +
              event.id,
            this.config
          )
          .then((response) => {
            newRefList[index].insurancePlanAddresses = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch {
        newRefList[index].insurancePlanAddresses = [];
      }

      this.setState({
        patientReferrals: {
          ...this.state.patientReferrals,
          // insurancePlanID: event.id
          patientPlanID: event.id,
        },
      });
    } else {
      newRefList[index].insurancePlanID = null;
      newRefList[index].insurancePlanObject = [];
      newRefList[index].insurancePlanAddresses = [];

      this.setState({
        patientReferrals: {
          ...this.state.patientReferrals,
          patientReferrals: newRefList,
        },
      });
    }
  }

  async handleRefProviderChange(event, index) {
    //If ICD value selected
    let newList = [...this.state.patientModel.patientReferrals];

    if (event) {
      newList[index].providerID = event.id;
      newList[index].providerObject = event;
    } else {
      newList[index].providerID = null;
      newList[index].providerObject = [];
    }
    this.setState({
      patientReferral: {
        ...this.state.patientReferral,
        patientReferrals: newList,
      },
    });
  }

  async handleRefPCPChange(event, index) {
    //If ICD value selected
    let newList = [...this.state.patientModel.patientReferrals];

    if (event) {
      newList[index].pcpid = event.id;
      newList[index].pcpObject = event;
    } else {
      newList[index].pcpid = null;
      newList[index].pcpObject = [];
    }
    this.setState({
      patientReferral: {
        ...this.state.patientReferral,
        patientReferrals: newList,
      },
    });
  }

  async handleicdChange(event, index) {
    let newList = [...this.state.patientModel.patientAuthorization];

    if (event) {
      newList[index].icdid = event.id;
      newList[index].icdObject = event;
    } else {
      newList[index].icdid = null;
      newList[index].icdObject = [];
    }
    this.setState({
      patientAuthModel: {
        ...this.state.patientAuthModel,
        patientAuthorization: newList,
      },
    });
  }

  async handlecptChange(event, index) {
    let newList = [...this.state.patientModel.patientAuthorization];

    if (event) {
      newList[index].cptid = event.id;
      newList[index].cptObject = event;
    } else {
      newList[index].cptid = null;
      newList[index].cptObject = [];
    }
    this.setState({
      patientAuthModel: {
        ...this.state.patientAuthModel,
        patientAuthorization: newList,
      },
    });
  }

  //Previous Visit
  async previousVisit() {
    if (this.currentIndex - 1 < 0) {
      Swal.fire("No More Patients", "", "warning");
      return;
    }
    this.currentIndex = this.currentIndex - 1;
    var patient = this.props.patientGridData[this.currentIndex];
    await this.setState({
      editId: patient.id,
      patientModel: {
        ...this.state.patientModel,
        id: 0,
      },
    });
    this.props.selectPatient({ ID: patient.id, accNum: patient.accountNum });
    this.props.selectTabAction("NewPatient", patient.id);
    this.UNSAFE_componentWillMount();
  }

  //NextVisit
  async nextVisit() {
    if (this.currentIndex + 1 >= this.props.patientGridData.length) {
      Swal.fire("No More Patients", "", "warning");
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    var patient = this.props.patientGridData[this.currentIndex];
    await this.setState({
      editId: patient.id,
      patientModel: {
        ...this.state.patientModel,
        id: 0,
      },
    });
    this.props.selectPatient({ ID: patient.id, accNum: patient.accountNum });
    this.props.selectTabAction("NewPatient", patient.id);
    this.UNSAFE_componentWillMount();
  }

  //On Paste Function
  onPaste = (event) => {
    var x = event.target.value;
    x = x.trim();
    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          [event.target.name]: x,
        },
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("", "Should be Number", "error");
      return;
    } else {
      this.setState({
        patientModel: {
          ...this.state.patientModel,
          [event.target.name]: x,
        },
      });
    }

    return;
  };

  //Filter Options
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
    } catch {
      console.log("Error");
    }
  };

  closevisitPopup = () => {
    $("#submittedVisitsModal").hide();
    this.setState({ showVPopup: false });
  };

  openvisitPopup = (event, id) => {
    event.preventDefault();
    this.setState({
      showVPopup: true,
      patientAuthID: id,
    });
  };

  closefaxPopup = () => {
    $("#faxModal").hide();
    this.setState({ showFPopup: false });
  };

  async openfaxPopup(event, index) {
    event.preventDefault();
    this.setState({ loading: true });
    var faxNumber = "";
    var referralDocumentFileName = "";
    await axios
      .get(
        this.proURL + "findprovider/" + this.state.patientModel.providerID,
        this.config
      )
      .then((response) => {
        faxNumber = response.data.faxNumber;
        referralDocumentFileName = response.data.referralDocumentFileName;
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
    let modelList = [];
    try {
      modelList = {
        pcp: this.state.patientModel.patientReferrals[index].pcpObject,
        patientName:
          this.state.patientModel.firstName +
          " " +
          this.state.patientModel.lastName,
        patientDOB: this.state.patientModel.dob,
        serviceName: this.state.patientModel.patientReferrals[index]
          .rererralForService,
        providerID: this.state.patientModel.providerID,
        faxNumber: faxNumber,
        patientid: this.state.patientModel.id,
        pcpproviderid: this.state.patientModel.patientReferrals[index].pcpid,
        providerid: this.state.patientModel.patientReferrals[index].providerID,
        referralDocumentFileName: referralDocumentFileName,
      };
    } catch {
      modelList = {};
    }
    this.setState({
      showFPopup: true,
      faxModel: modelList,
    });
  }

  async getbatchID(batID) {
    $("#myModal").hide();
    await this.setState({
      popupName: "",
      id: 0,
      patientModel: {
        ...this.state.patientModel,
        batchDocumentID: batID[0],
      },
    });
    var myVal = this.validationModel;

    axios
      .get(
        this.batchURL +
          "FindBatchDocumentPath/" +
          this.state.patientModel.batchDocumentID,
        this.config
      )
      .then((response) => {
        myVal.batchDocumentIDValField = "";
        myVal.responsepagesValField = (
          <span
            className="validationMsg"
            style={{ color: "green", marginLeft: "-44%" }}
          >
            Number of Pages: {response.data.numberOfPages}
          </span>
        );
        this.setState({
          pageNumber: response.data.numberOfPages,
          fileURL: response.data.documentFilePath,
          loading: false,
          validationModel: myVal,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            console.log(error.response.status);
            if (error.response.status == 404) {
              var myVal = this.validationModel;

              myVal.batchDocumentIDValField = (
                <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                  Invalid Batch # {this.state.patientModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            } else if (error.response.status == 400) {
              var myVal = this.validationModel;

              myVal.batchDocumentIDValField = (
                <span className="validationMsg" style={{ marginLeft:"-43%"}}>
                  Invalid Batch # {this.state.patientModel.batchDocumentID}
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

  openPage = (name, id) => {
    var pageNumber = this.state.patientModel.pageNumber;
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
    this.setState({
      popupName: name,
      pageNumber: loadPage,
    });
  };
  closePage = (name) => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  render() {
    let validationModel = { ...this.validationModel };
    console.log("Patient Model :", this.state.patientModel);
    console.log("Validatoin Model :", this.state.validationModel);
    console.log("Pages Response ", validationModel.responsepagesValField);

    try {
      this.props.patientGridData.filter((patient, index) => {
        if (patient.id == this.state.editId) {
          this.currentIndex = index;
        }
      });
    } catch {}

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
                ? this.props.userInfo1.userRefProviders[0].id
                : null;

            this.setState({
              patientModel: {
                ...this.state.patientModel,
                practiceID: this.props.userInfo1.practiceID,
                locationId: locID,
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

    let imagePreviewUrl = this.state.imagePreviewUrl;

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          src={imagePreviewUrl}
          alt="patient-pix"
          style={{ borderRadius: "50%" }}
        />
      );
    } else {
      $imagePreview = <img src={patientPic} />;
    }

    let active = this.state.patientModel.isActive;

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

    const titles = [
      { value: "", display: "Select Title" },
      { value: "MR.", display: "MR" },
      { value: "MRS.", display: "MRS" },
    ];

    const gender = [
      { value: "", display: "Gender" },
      { value: "M", display: "MALE" },
      { value: "F", display: "FEMALE" },
      { value: "U", display: "UNKNOWN" },
    ];

    const matitalStatus = [
      { value: "", display: "MARITAL STATUS" },
      { value: "SINGLE", display: "SINGLE" },
      { value: "MARRIED", display: "MARRIED" },
      { value: "DIVORCED", display: "DIVORCED" },
      { value: "WIDOW", display: "WIDOW" },
      { value: "OTHER", display: "OTHER" },
    ];

    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    const relationship = [
      { value: "", display: "Select Relationship" },
      { value: "18", display: "18 SELF" },
      { value: "01", display: "01 SPOUSE" },
      { value: "19", display: "19 CHiLD" },
      { value: "20", display: "20 EMPLOYEE" },
      { value: "21", display: "21 UNKNOWN" },
      { value: "39", display: "39 ORGAN DONAR" },
      { value: "53", display: "53 LIFE PARTNER" },
      { value: "G8", display: "G8 OTHER RELATIONSHIP" },
    ];

    //Coverage
    const coverage = [
      { value: "", display: "Select Coverage" },
      { value: "P", display: "PRIMARY" },
      { value: "S", display: "SECONDARY" },
      { value: "T", display: "TERTIARY" },
    ];

    const medicalRecordRequired = [
      { value: "", display: "Please Select" },
      { value: "Y", display: "YES" },
      { value: "N", display: "NO" },
    ];

    const medicalNecessityRequired = [
      { value: "", display: "Please Select" },
      { value: "Y", display: "YES" },
      { value: "N", display: "NO" },
    ];

    const headers = ["Plans", "Authorizations", "Referrals", "Notes"];

    const status = [
      // { value: "AUTH REQUIRED", display: "AUTH REQUIRED" },
      { value: "ACTIVE", display: "ACTIVE" },
      { value: "IN ACTIVE", display: "IN ACTIVE" },
    ];

    const pAuthstatus = [
      { value: "AUTH REQUIRED", display: "AUTH REQUIRED" },
      { value: "ACTIVE", display: "ACTIVE" },
      { value: "IN ACTIVE", display: "IN ACTIVE" },
      { value: "IN PROCESS", display: "IN PROCESS" },
      { value: "MD ORDERS REQUESTED", display: "MD ORDERS REQUESTED" },
    ];

    const responsibleParty = [
      { value: "BELLMEDEX", display: "BELLMEDEX" },
      { value: "CLIENT", display: "CLIENT" },
    ];

    const referralFor = [
      { value: "", display: "Please Select" },
      {
        value: "Most Recent Wellness Visit",
        display: "MOST RECENT WELLNESS VISIT",
      },
      {
        value: "Medical Clearance for Speech Therapy",
        display: "MEDICAL CLEARANCE FOR SPEECH THERAPY",
      },
      {
        value: "Medical Clearance for Hearing Aids",
        display: "MEDICAL CLEARANCE FOR HEARING AIDS",
      },
      {
        value: "Most Recent Audiological Evaluation",
        display: "MOST RECENT AUDIOLOGICAL EVALUATION",
      },
      {
        value: "Dizziness/Balance Testing",
        display: "DIZZINESS/BALANCE TESTING",
      },
      {
        value: "Most Recent Speech Language Evaluation",
        display: "MOST RECENT SPEECH LANGUAGE EVALUATION",
      },
      {
        value: "Auditory Brainstem Response Results",
        display: "AUDITORY BRAINSTEM RESPONSE RESULTS",
      },
    ];

    let newList = [];
    var patientPlanData = {};

    var patientPlan = [];
    if (this.isNull(this.state.patientModel.patientPlans)) {
      patientPlan = [];
    } else {
      patientPlan = this.state.patientModel.patientPlans;
    }
    patientPlan.map((row, index) => {
      var insurancePlanAddresses = row.insurancePlanAddresses
        ? row.insurancePlanAddresses
        : [];
      var dob = row.dob ? row.dob.slice(0, 10) : "";
      newList.push({
        coverage: (
          <div style={{ marginBottom: "10px", width: "150px" }}>
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="coverage"
              id={index}
              value={this.state.patientModel.patientPlans[index].coverage}
              onChange={this.handlePlanChange}
            >
              {coverage.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.coverageValField}
            </div>
          </div>
        ),

        insurancePlan: (
          <div
            style={{ width: "205px", marginBottom: "10px", marginLeft: "10px" }}
          >
            <Select
              type="text"
              value={
                this.state.patientModel.patientPlans[index].insurancePlanObject
              }
              name="insurancePlanID"
              id="insurancePlanID"
              max="10"
              onChange={(event) =>
                this.handleInsurancePlansuggChange(event, index)
              }
              options={this.props.insurancePlans}
              filterOption={this.filterOption}
              placeholder="Plan Name"
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.insurancePlanValField}
            </div>
          </div>
        ),
        authRequired: (
          <div
            style={{ width: "80px", marginBottom: "10px", marginLeft: "25px" }}
            class="lblChkBox"
          >
            <input
              style={{ width: "20px", height: "25px" }}
              type="checkbox"
              id={"authRequired" + index}
              name="authRequired"
              checked={row.authRequired}
              onChange={() => this.handlePatientPlanAuthReqCheck(index)}
            />
            <label htmlFor={"authRequired" + index}>
              <span></span>
            </label>
          </div>
        ),
        subscriberID: (
          <div
            style={{ marginBottom: "10px", width: "150px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Subscriber ID"
              name="subscriberId"
              id={index}
              maxLength="20"
              value={this.state.patientModel.patientPlans[index].subscriberId}
              onChange={this.handlePlanChange}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.subscriberIDValField}
            </div>
          </div>
        ),
        relationShip: (
          <div
            style={{ marginBottom: "10px", width: "150px", marginLeft: "10px" }}
          >
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="relationShip"
              id={index}
              value={this.state.patientModel.patientPlans[index].relationShip}
              onChange={this.handlePlanChange}
            >
              {relationship.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.relationshipValField}
            </div>
          </div>
        ),
        lastName: (
          <div
            style={{ marginBottom: "10px", width: "150px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Last Name"
              name="lastName"
              id={index}
              maxLength="25"
              value={this.state.patientModel.patientPlans[index].lastName}
              onChange={this.handlePlanChange}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.lastNameValField}
            </div>
          </div>
        ),
        firstName: (
          <div
            style={{ marginBottom: "10px", width: "150px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="First Name"
              name="firstName"
              id={index}
              maxLength="25"
              value={this.state.patientModel.patientPlans[index].firstName}
              onChange={this.handlePlanChange}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.firstNameValField}
            </div>
          </div>
        ),
        middleInitial: (
          <div
            style={{ marginBottom: "10px", width: "80px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="MI"
              name="middleInitial"
              id={index}
              maxLength="3"
              value={this.state.patientModel.patientPlans[index].middleInitial}
              onChange={this.handlePlanChange}
            />
            <div class="invalid-feedback">{/* {row.firstNameValField} */}</div>
          </div>
        ),
        gender: (
          <div
            style={{ marginBottom: "10px", width: "100px", marginLeft: "10px" }}
          >
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="gender"
              id={index}
              value={this.state.patientModel.patientPlans[index].gender}
              onChange={this.handlePlanChange}
            >
              {gender.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
          </div>
        ),
        dob: (
          <div
            style={{ width: "150px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              name="dob"
              min="1900-01-01"
              max="9999-12-31"
              id={index}
              value={dob}
              onChange={this.handlePlanChange}
            ></input>
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.dobValField}
            </div>
          </div>
        ),
        address1: (
          <div
            style={{ marginBottom: "10px", width: "200px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Address"
              name="address1"
              id={index}
              maxLength="55"
              value={this.state.patientModel.patientPlans[index].address1}
              onChange={this.handlePlanChange}
            />
            <div class="invalid-feedback">{/* {row.firstNameValField} */}</div>
          </div>
        ),
        city: (
          <div
            style={{ marginBottom: "10px", width: "100px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="City"
              name="city"
              id={index}
              maxLength="20"
              value={this.state.patientModel.patientPlans[index].city}
              onChange={this.handlePlanChange}
            />
            <div class="invalid-feedback">{/* {row.firstNameValField} */}</div>
          </div>
        ),
        state: (
          <div
            style={{ marginBottom: "10px", width: "120px", marginLeft: "10px" }}
          >
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="state"
              id={index}
              value={this.state.patientModel.patientPlans[index].state}
              onChange={this.handlePlanChange}
            >
              {usStates.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
          </div>
        ),
        zipCode: (
          <div
            style={{ marginBottom: "10px", width: "100px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="City"
              name="planZipCode"
              id={index}
              maxLength="9"
              value={this.state.patientModel.patientPlans[index].zipCode}
              onChange={this.handleZip}
              onKeyPress={(event) => this.handleNumericCheck(event)}
            />
            <div class="invalid-feedback">{/* {row.firstNameValField} */}</div>
          </div>
        ),
        insurancePlanAddress: (
          <div
            style={{ marginBottom: "10px", width: "150px", marginLeft: "10px" }}
          >
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="insurancePlanAddressID"
              id={index}
              value={
                this.state.patientModel.patientPlans[index]
                  .insurancePlanAddressID == null
                  ? "Please Select"
                  : this.state.patientModel.patientPlans[index]
                      .insurancePlanAddressID
              }
              onChange={this.handlePlanChange}
            >
              {insurancePlanAddresses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.address1}
                </option>
              ))}
            </select>

            <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
          </div>
        ),
        isActive: (
          <div
            style={{ marginBottom: "10px", marginLeft: "25px", width: "60px" }}
            class="lblChkBox"
          >
            <input
              style={{ width: "20px", height: "25px" }}
              type="checkbox"
              id={"markInactive" + index}
              name="markInactive"
              checked={row.isActive}
              onChange={() => this.handlePatientPlanCheck(index)}
            />
            <label htmlFor={"authRequired" + index}>
              <span></span>
            </label>
          </div>
        ),
        remove: (
          <div style={{ width: "50px", paddingRight: "30px" }}>
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span
                aria-hidden="true"
                id={index}
                onClick={(event) => this.removePlanRow(event, index, row.id)}
              >
                ×
              </span>
            </button>
          </div>
        ),
      });
    });

    patientPlanData = {
      columns: [
        {
          label: "COVERAGE",
          field: "coverage",
          sort: "asc",
          //width: 150
        },
        {
          label: "PLAN NAME",
          field: "insurancePlan",
          sort: "asc",
          //width: 150
        },
        {
          label: "AUTH REQ",
          field: "authRequired",
          sort: "asc",
          //width: 150
        },

        {
          label: "SUBSCRIBER ID",
          field: "subscriberID",
          sort: "asc",
          //width: 150
        },
        {
          label: "RELATIONSHIP",
          field: "relationShip",
          sort: "asc",
          //width: 150
        },
        {
          label: "LAST NAME",
          field: "lastName",
          sort: "asc",
          //width: 150
        },
        {
          label: "FIRST NAME",
          field: "firstName",
          sort: "asc",
          //width: 150
        },
        {
          label: "MI",
          field: "middleInitial",
          sort: "asc",
          //width: 150
        },
        {
          label: "GENDER",
          field: "gender",
          sort: "asc",
          //width: 150
        },
        {
          label: "DOB",
          field: "dob",
          sort: "asc",
          //width: 150
        },
        {
          label: "ADDRESS",
          field: "address1",
          sort: "asc",
          //width: 150
        },
        {
          label: "CITY",
          field: "city",
          sort: "asc",
          //width: 150
        },
        {
          label: "STATE",
          field: "state",
          sort: "asc",
          //width: 150
        },
        {
          label: "ZIP",
          field: "zipCode",
          sort: "asc",
          //width: 150
        },
        {
          label: "PLAN ADDRESS",
          field: "insurancePlanAddress",
          sort: "asc",
          //width: 150
        },
        {
          label: "ACTIVE",
          field: "isActive",
          sort: "asc",
          //width: 150
        },
        {
          label: "",
          field: "remove",
          sort: "asc",
          //width: 150
        },
      ],
      rows: newList,
    };

    /******************AFZAAL
     * CHANGES FOR
     * AUTH GRID
     * **************/

    let newAuthList = [];
    var patientAuthData = {};

    var patientAuth = [];
    if (this.isNull(this.state.patientModel.patientAuthorization)) {
      patientAuth = [];
    } else {
      patientAuth = this.state.patientModel.patientAuthorization;
    }

    patientAuth.map((row, index) => {
      var startdate = row.startDate ? row.startDate.slice(0, 10) : "";
      var enddate = row.endDate ? row.endDate.slice(0, 10) : "";
      var addedDate = new Date().toISOString().slice(0, 10);
      row.addedDate = addedDate;
      addedDate = row.addedDate;

      var authorizationDate = row.authorizationDate
        ? row.authorizationDate.slice(0, 10)
        : "";

      newAuthList.push({
        plan: (
          <div
            style={{ width: "205px", marginTop: "10px", marginLeft: "10px" }}
          >
            <Select
              type="text"
              value={
                this.state.patientModel.patientAuthorization[index]
                  .insurancePlanObject
              }
              name="insurancePlanID"
              id="insurancePlanID"
              max="10"
              onChange={(event) =>
                this.handleInsuranceAuthsuggChange(event, index)
              }
              options={this.myPatientPlans}
              filterOption={this.filterOption}
              placeholder=""
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.planIDValField}
            </div>
          </div>
        ),
        providerID: (
          <div
            style={{ width: "205px", marginTop: "10px", marginLeft: "10px" }}
          >
            <Select
              type="text"
              value={
                this.state.patientModel.patientAuthorization[index]
                  .providerObject
              }
              onChange={(event) => this.handleProviderChange(event, index)}
              options={this.props.userProviders}
              placeholder=""
              filterOption={this.filterOption}
              placeholder=""
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.providerIDValField}
            </div>
          </div>
        ),
        icdid: (
          <div
            style={{ width: "120px", marginTop: "10px", marginLeft: "10px" }}
          >
            <Select
              type="text"
              value={
                this.state.patientModel.patientAuthorization[index].icdObject
              }
              onChange={(event) => this.handleicdChange(event, index)}
              options={this.props.icdCodes}
              placeholder=""
              filterOption={this.filterOption}
              placeholder=""
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback">{row.providerIDValField}</div>
          </div>
        ),
        cptid: (
          <div
            style={{ width: "120px", marginTop: "10px", marginLeft: "10px" }}
          >
            <Select
              type="text"
              value={
                this.state.patientModel.patientAuthorization[index].cptObject
              }
              onChange={(event) => this.handlecptChange(event, index)}
              options={this.props.cptCodes}
              placeholder=""
              filterOption={this.filterOption}
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.cptIDValField}
            </div>
          </div>
        ),
        authorizationNumber: (
          <div
            style={{ marginTop: "10px", width: "170px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="AUTH#"
              name="authorizationNumber"
              id={index}
              maxLength="25"
              value={
                this.state.patientModel.patientAuthorization[index]
                  .authorizationNumber
              }
              onChange={this.handleAuthChange}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.authorizationNumberValField}
            </div>
          </div>
        ),

        authorizationDate: (
          <div
            style={{ width: "140px", marginTop: "10px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              name="startDate"
              min="1900-01-01"
              max="9999-12-31"
              id={index}
              value={authorizationDate}
              onChange={this.handleAuthChange}
            ></input>
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.startdateNumberValField}
            </div>
          </div>
        ),
        startdate: (
          <div
            style={{ width: "140px", marginTop: "10px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              name="startDate"
              min="1900-01-01"
              max="9999-12-31"
              id={index}
              value={startdate}
              onChange={this.handleAuthChange}
            ></input>
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.startdateNumberValField}
            </div>
          </div>
        ),
        enddate: (
          <div
            style={{ width: "140px", marginTop: "10px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              name="endDate"
              min="1900-01-01"
              max="9999-12-31"
              id={index}
              value={enddate}
              onChange={this.handleAuthChange}
            ></input>
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.enddateValField}
              {row.greaterValField}
            </div>
          </div>
        ),
        visitsAllowed: (
          <div
            className="row"
            style={{ width: "250px", justifyContent: "center" }}
          >
            <div
              style={{ width: "80px", marginTop: "10px", marginLeft: "10px" }}
            >
              <input
                style={{ width: "98%", padding: "5px", height: "30px" }}
                type="text"
                class="provider-form form-control-user"
                placeholder="Allowed"
                name="visitsAllowed"
                id={index}
                maxLength="25"
                value={
                  this.state.patientModel.patientAuthorization[index]
                    .visitsAllowed
                }
                onChange={this.handleAuthChange}
              />
              <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
                {row.visitsAllowedValField}
              </div>
            </div>
            <div
              style={{ width: "30px", marginTop: "10px", marginLeft: "10px" }}
            >
              <a
                href=""
                onClick={(event) =>
                  this.openvisitPopup(
                    event,
                    this.state.patientModel.patientAuthorization[index].id
                  )
                }
              >
                {" "}
                {this.state.patientModel.patientAuthorization[index].visitsUsed}
              </a>
              <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
                {row.visitsAllowedValField}
              </div>
            </div>

            <div
              style={{ width: "80px", marginTop: "10px", marginLeft: "10px" }}
            >
              <input
                style={{ width: "98%", padding: "5px", height: "30px" }}
                type="text"
                class="provider-form form-control-user"
                placeholder="Remaining"
                name="remaining"
                id={index}
                readOnly
                maxLength="25"
                value={
                  (this.state.patientModel.patientAuthorization[
                    index
                  ].remaining =
                    this.state.patientModel.patientAuthorization[index]
                      .visitsAllowed -
                    this.state.patientModel.patientAuthorization[index]
                      .visitsUsed)
                }
                onChange={this.handleAuthChange}
              />
              <div class="invalid-feedback">
                {/* {row.visitsAllowedValField} */}
              </div>
            </div>
          </div>
        ),

        remindBeforeDays: (
          <div
            className="row"
            style={{ width: "220px", justifyContent: "center" }}
          >
            <div
              style={{ marginTop: "10px", width: "80px", marginLeft: "10px" }}
            >
              <input
                style={{ width: "98%", padding: "5px", height: "30px" }}
                type="text"
                class="provider-form form-control-user"
                placeholder="Remind bfore days"
                name="remindBeforeDays"
                id={index}
                maxLength="25"
                value={
                  this.state.patientModel.patientAuthorization[index]
                    .remindBeforeDays
                }
                onChange={this.handleAuthChange}
              />
              <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
                {/* {row.visitsAllowedValField} */}
              </div>
            </div>
            <div
              style={{ marginTop: "10px", width: "80px", marginLeft: "10px" }}
            >
              <input
                style={{ width: "98%", padding: "5px", height: "30px" }}
                type="text"
                class="provider-form form-control-user"
                placeholder=""
                name="remindBeforeRemainingVisits"
                id={index}
                maxLength="25"
                value={
                  this.state.patientModel.patientAuthorization[index]
                    .remindBeforeRemainingVisits
                }
                onChange={this.handleAuthChange}
              />
              <div class="invalid-feedback">
                {/* {row.visitsAllowedValField} */}
              </div>
            </div>
          </div>
        ),

        authorizedAmount: (
          <div
            style={{ marginTop: "10px", width: "150px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Ath Amount"
              name="authorizedAmount"
              id={index}
              maxLength="25"
              value={
                this.state.patientModel.patientAuthorization[index]
                  .authorizedAmount
              }
              onChange={this.handleAuthChange}
              onKeyPress={(event) => this.handleNumericCheck(event)}
            />
            <div class="invalid-feedback">
              {/* {row.visitsAllowedValField} */}
            </div>
          </div>
        ),
        medicalRecordRequired: (
          <div
            className="row"
            style={{ width: "230px", justifyContent: "center" }}
          >
            <div
              style={{ marginTop: "10px", width: "85px", marginLeft: "0px" }}
            >
              <select
                style={{ width: "100% ", padding: "5px", height: "30px" }}
                class="provider-form form-control-user"
                name="medicalRecordRequired"
                id={index}
                value={
                  this.state.patientModel.patientAuthorization[index]
                    .medicalRecordRequired == true
                    ? "Y"
                    : "N"
                }
                onChange={this.handleAuthChange}
              >
                {medicalRecordRequired.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.display}
                  </option>
                ))}
              </select>

              <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
            </div>

            <div
              style={{ marginTop: "10px", width: "85px", marginLeft: "10px" }}
            >
              <select
                style={{ width: "100% ", padding: "5px", height: "30px" }}
                class="provider-form form-control-user"
                name="medicalNecessityRequired"
                id={index}
                value={
                  this.state.patientModel.patientAuthorization[index]
                    .medicalNecessityRequired == true
                    ? "Y"
                    : "N"
                }
                onChange={this.handleAuthChange}
              >
                {medicalNecessityRequired.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.display}
                  </option>
                ))}
              </select>

              <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
            </div>
          </div>
        ),

        status: (
          <div style={{ marginTop: "10px", width: "100px", marginLeft: "0px" }}>
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="status"
              id={index}
              value={this.state.patientModel.patientAuthorization[index].status}
              onChange={this.handleAuthChange}
            >
              {status.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
          </div>
        ),

        responsibleParty: (
          <div style={{ marginTop: "10px", width: "150px", marginLeft: "0px" }}>
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="responsibleParty"
              id={index}
              value={
                this.state.patientModel.patientAuthorization[index]
                  .responsibleParty
              }
              onChange={this.handleAuthChange}
            >
              {responsibleParty.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
          </div>
        ),
        remarks: (
          <div
            style={{ width: "250px", marginLeft: "10px", marginTop: "10px" }}
          >
            <div className="textBoxValidate">
              <textarea
                style={{
                  overflowY: "scroll",
                  height: "30px",
                  width: "250px",
                  borderRadius: "5px",
                }}
                type="text"
                name="remarks"
                id={index}
                cols="20"
                rows="10"
                value={
                  this.state.patientModel.patientAuthorization[index].remarks
                }
                onChange={this.handleAuthChange}
              ></textarea>
            </div>
          </div>
        ),
        addeddate: (
          <div
            style={{ width: "140px", marginTop: "10px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              name="addedDate"
              min="1900-01-01"
              max="9999-12-31"
              id={index}
              disabled={true}
              value={addedDate}
              onChange={this.handleAuthChange}
            ></input>
            <div class="invalid-feedback"></div>
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
                onClick={(event) => this.removeAuthRow(event, index, row.id)}
              >
                ×
              </span>
            </button>
          </div>
        ),
      });
    });
    patientAuthData = {
      columns: [
        {
          label: "PLAN",
          field: "plan",
          sort: "asc",
        },
        {
          label: "PROVIDER",
          field: "providerID",
          sort: "asc",
        },
        {
          label: "ICD",
          field: "icdid",
          sort: "asc",
        },
        {
          label: "CPT",
          field: "cptid",
          sort: "asc",
        },
        {
          label: "AUTHORIZATION #",
          field: "authorizationNumber",
          sort: "asc",
        },

        {
          label: "AUTH DATE",
          field: "authorizationDate",
          sort: "asc",
        },
        {
          label: "START DATE",
          field: "startdate",
          sort: "asc",
        },
        {
          label: "END DATE",
          field: "enddate",
          sort: "asc",
        },
        {
          label: "VISIT ALLOWED/USED/REMAINING",
          field: "visitsallowed",
          sort: "asc",
        },

        {
          label: "REMIND BEFORE DAYS/VISITS",
          field: "remindBeforeDays",
          sort: "asc",
        },

        {
          label: "AUTH AMOUNT",
          field: "authorizedAmount",
          sort: "asc",
        },
        {
          label: "MEDICAL RECORD/NECESSITY",
          field: "medicalRecordRequired",
          sort: "asc",
        },

        {
          label: "STATUS",
          field: "status",
          sort: "asc",
        },
        {
          label: "RESPONSIBLE PARTY",
          field: "responsibleParty",
          sort: "asc",
        },

        {
          label: "REMARKS",
          field: "remarks",
          sort: "asc",
        },
        {
          label: "ENTRY DATE",
          field: "addeddate",
          sort: "asc",
        },
        {
          label: "",
          field: "remove",
          sort: "asc",
          // width: 0
        },
      ],
      rows: newAuthList,
    };

    /************Patient Referrals Grid*********** */

    let newReferralList = [];
    var patientReferralData = {};

    var patientReferral = [];
    if (this.isNull(this.state.patientModel.patientReferrals)) {
      patientReferral = [];
    } else {
      patientReferral = this.state.patientModel.patientReferrals;
    }

    patientReferral.map((row, index) => {
      var startdate = row.startDate ? row.startDate.slice(0, 10) : "";
      var enddate = row.endDate ? row.endDate.slice(0, 10) : "";

      newReferralList.push({
        pcp: (
          <div
            style={{ width: "205px", marginTop: "10px", marginLeft: "10px" }}
          >
            <Select
              value={this.state.patientModel.patientReferrals[index].pcpObject}
              onChange={(event) => this.handleRefPCPChange(event, index)}
              options={this.props.userProviders}
              placeholder=""
              filterOption={this.filterOption}
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback">{/* {row.planIDValField} */}</div>
          </div>
        ),

        providerID: (
          <div
            style={{ width: "205px", marginTop: "10px", marginLeft: "10px" }}
          >
            <Select
              value={
                this.state.patientModel.patientReferrals[index].providerObject
              }
              onChange={(event) => this.handleRefProviderChange(event, index)}
              options={this.props.userProviders}
              placeholder=""
              filterOption={this.filterOption}
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.providerIDRefValField}
            </div>
          </div>
        ),
        referralFor: (
          <div
            style={{ marginTop: "10px", width: "150px", marginLeft: "10px" }}
          >
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="rererralForService"
              id={index}
              value={
                this.state.patientModel.patientReferrals[index]
                  .rererralForService
              }
              onChange={this.handleRefChange}
            >
              {referralFor.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
          </div>
        ),
        plan: (
          <div
            style={{ width: "205px", marginTop: "10px", marginLeft: "10px" }}
          >
            <Select
              value={
                this.state.patientModel.patientReferrals[index]
                  .insurancePlanObject
              }
              name="insurancePlanID"
              id="insurancePlanID"
              max="10"
              onChange={(event) =>
                this.handleInsuranceRefsuggChange(event, index)
              }
              options={this.myPatientPlans}
              filterOption={this.filterOption}
              menuPosition="fixed"
              isClearable={true}
              isSearchable={true}
              openMenuOnClick={false}
              escapeClearsValue={true}
              styles={{
                indicatorSeparator: () => {},
                container: (defaultProps) => ({
                  ...defaultProps,
                  width: "100%",
                }),
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
                  height: "32px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {row.patientPlanIDRefValField}
            </div>
          </div>
        ),
        startdate: (
          <div
            style={{ width: "150px", marginTop: "10px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              name="startDate"
              min="1900-01-01"
              max="9999-12-31"
              id={index}
              value={startdate}
              onChange={this.handleRefChange}
            ></input>
            <div class="invalid-feedback" style={{ paddingLeft: "0px" }}>
              {/* {row.greaterValField} */}
            </div>
          </div>
        ),
        enddate: (
          <div
            style={{ width: "150px", marginTop: "10px", marginLeft: "10px" }}
          >
            <input
              class="provider-form w-100 form-control-user"
              style={{ padding: "5px", height: "30px" }}
              type="date"
              min="1900-01-01"
              max="9999-12-31"
              name="endDate"
              min="1900-01-01"
              max="9999-12-31"
              id={index}
              value={enddate}
              onChange={this.handleRefChange}
            ></input>
            <div class="invalid-feedback">{/* {row.greaterValField} */}</div>
          </div>
        ),
        visitsAllowed: (
          <div
            style={{ marginTop: "10px", width: "140px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Allowed"
              name="visitAllowed"
              id={index}
              maxLength="25"
              value={
                this.state.patientModel.patientReferrals[index].visitAllowed
              }
              onChange={this.handleRefChange}
            />
            <div class="invalid-feedback">
              {/* {row.visitsAllowedValField} */}
            </div>
          </div>
        ),
        visitsUsed: (
          <div
            style={{ marginTop: "10px", width: "110px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Used"
              name="visitUsed"
              id={index}
              maxLength="25"
              value={this.state.patientModel.patientReferrals[index].visitUsed}
              disabled={true}
              onChange={this.handleRefChange}
            />
            <div class="invalid-feedback">
              {/* {row.visitsAllowedValField} */}
            </div>
          </div>
        ),
        status: (
          <div style={{ marginTop: "10px", width: "100px", marginLeft: "0px" }}>
            <select
              style={{ width: "100% ", padding: "5px", height: "30px" }}
              class="provider-form form-control-user"
              name="status"
              id={index}
              value={this.state.patientModel.patientReferrals[index].status}
              onChange={this.handleRefChange}
            >
              {status.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            <div class="invalid-feedback">{/* {row.coverageValField} */}</div>
          </div>
        ),
        referralID: (
          <div
            style={{ marginTop: "10px", width: "110px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Used"
              name="referralNo"
              id={index}
              maxLength="25"
              value={this.state.patientModel.patientReferrals[index].referralNo}
              onChange={this.handleRefChange}
            />
            <div class="invalid-feedback">
              {/* {row.visitsAllowedValField} */}
            </div>
          </div>
        ),
        faxStatus: (
          <div
            style={{ marginTop: "10px", width: "105px", marginLeft: "10px" }}
          >
            <input
              style={{ width: "98%", padding: "5px", height: "30px" }}
              type="text"
              class="provider-form form-control-user"
              placeholder="Used"
              name="faxStatus"
              id={index}
              maxLength="25"
              disabled={true}
              value={this.state.patientModel.patientReferrals[index].faxStatus}
              onChange={this.handleRefChange}
            />
            <div class="invalid-feedback">
              {/* {row.visitsAllowedValField} */}
            </div>
          </div>
        ),
        faxSent: (
          <div
            style={{ marginTop: "10px", width: "100px", marginLeft: "10px" }}
          >
            <a
              href=""
              onClick={(event) =>
                this.openfaxPopup(
                  event,
                  this.state.patientModel.patientAuthorization[index].id
                )
              }
            >
              {"Send Fax"}
            </a>
            <div class="invalid-feedback">
              {/* {row.visitsAllowedValField} */}
            </div>
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
                onClick={(event) => this.removeRefRow(event, index, row.id)}
              >
                ×
              </span>
            </button>
          </div>
        ),
      });
    });
    patientReferralData = {
      columns: [
        {
          label: "PCP",
          field: "pcp",
          sort: "asc",
        },
        {
          label: "PROVIDER",
          field: "providerID",
          sort: "asc",
        },
        {
          label: "REFERRAL FOR",
          field: "referralFor",
          sort: "asc",
        },
        {
          label: "PLAN",
          field: "plan",
          sort: "asc",
        },
        {
          label: "START DATE",
          field: "startdate",
          sort: "asc",
        },
        {
          label: "END DATE",
          field: "enddate",
          sort: "asc",
        },
        {
          label: "VISIT ALLOWED",
          field: "visitsallowed",
          sort: "asc",
        },
        {
          label: "VISITS USED",
          field: "visitsUsed",
          sort: "asc",
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
        },
        {
          label: "REFERRAL #",
          field: "referralID",
          sort: "asc",
        },

        {
          label: "FAX STATUS",
          field: "faxStatus",
          sort: "asc",
        },
        {
          label: "",
          field: "faxSent",
          sort: "asc",
        },

        {
          label: "",
          field: "remove",
          sort: "asc",
          // width: 0
        },
      ],
      rows: newReferralList,
    };

    /************ End Patient Referrals Grid*********** */

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
    if (this.state.popupName === "practice") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewPractice
          onClose={this.closePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.popupName === "location") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewLocation onClose={this.closePopup} id={this.state.id}></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewProvider onClose={this.closePopup} id={this.state.id}></NewProvider>
      );
    } else if (this.state.popupName === "refprovider") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewRefferingProvider
          onClose={this.closePopup}
          id={this.state.id}
        ></NewRefferingProvider>
      );
    } else if (this.state.popupName === "NewHistoryPractice") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else if (this.state.showLPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewLocation
          onClose={this.closeLocationPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewLocation>
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
    } else if (this.state.popupName == "batch") {
      popup = (
        <BatchDocumentPopup
          onClose={this.closePopup}
          // getbatchID={(name) => this.getbatchID(name)}
          // popupName="batchNo"
          id={this.state.patientModel.batchDocumentID}
        ></BatchDocumentPopup>
      );
    } else if (this.state.popupName == "batchNo") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          getbatchID={(name) => this.getbatchID(name)}
          popupName="batchNo"
          batchPopupID={this.state.patientModel.batchDocumentID}
        ></GPopup>
      );
    } else if (this.state.showPPopup) {
      document.body.style.overflow = "hidden";
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
    } else if (this.state.showRPopup) {
      document.body.style.overflow = "hidden";
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
    } else if (this.state.showVPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <VisitUsed
          onClose={this.closevisitPopup}
          patientAuthID={this.state.patientAuthID}
        ></VisitUsed>
      );
    } else if (this.state.showFPopup) {
      popup = (
        <SendFax
          onClose={this.closefaxPopup}
          faxModel={this.state.faxModel}
          userProviders={this.props.userProviders}
          referralFor={referralFor}
        ></SendFax>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = "visible";
    }
    //Spinner
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
    let notesList = [];
    var noteTableData = {};
    let Note = [];

    if (this.state.patientModel.note)
      this.state.patientModel.note.map((row, index) => {
        var notesDate = this.isNull(row.notesDate)
          ? ""
          : row.notesDate.slice(0, 10);

        if (notesDate != "") {
          var YY = notesDate.slice(0, 4);
          var DD = notesDate.slice(5, 7);
          var MM = notesDate.slice(8, 10);
        }

        notesList.push({
          notesDate: (
            <div
              style={{ marginTop: "10px", width: "100px", marginLeft: "10px" }}
            >
              <span>{notesDate != "" ? MM + "/" + DD + "/" + YY : ""}</span>
            </div>
          ),

          note: (
            <div style={{ width: "100%" }}>
              <textarea
                data-toggle="tooltip"
                title={this.state.patientModel.note[index].note}
                className="Note-textarea"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "10px",
                }}
                rows="1"
                cols="60"
                name="note"
                value={this.state.patientModel.note[index].note}
                id={index}
                onChange={this.handleNoteChange}
              ></textarea>
              <div class="invalid-feedback" style={{paddingLeft:"0px"}}>
              {this.state.patientModel.note[index].noteValField}
                        </div>
              
            </div>
          ),

          addedBy: (
            <div style={{ width: "200px", marginLeft: "10px" }}>
              <span>{this.state.patientModel.note[index].addedBy}</span>
            </div>
          ),

          remove: (
            <div
              style={{
                width: "50px",
                paddingRight: "15px",
                marginLeft: "10px",
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

    noteTableData = {
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
      rows: notesList,
    };
    /******************************************khizer code*************************************************************/

    return (
      <React.Fragment>
        {spiner}
        {/* // <!-- /.container-fluid Starts--> */}
        <div
          class="container-fluid"
          style={{ paddingLeft: "0px", paddingRight: "0px" }}
        >
          {/* <!-- Page Heading --> */}

          {/* <!-- Container Top Starts Here --> */}
          <div
            class="container-fluid"
            style={{ paddingLeft: "0px", paddingRight: "0px" }}
          >
            {/* <!-- Tab Content Starts --> */}
            <div class="tab-content">
              {/* <!-- Tab Pane Starts Here --> */}
              <div id="home" class="tab-pane">
                {/* <!---Patient Demographic/Top Form Start here --> */}
                {this.props.SchedularAdvSearch ? null : this.props.id > 0 ? (
                  <TopForm patientID={this.props.id} />
                ) : null}
                {/* <!---Patient Demographic/Top Form End here -->  */}

                {/* <!---NEW PATIENT | Demographics | Edits start here --> */}
                <br></br>
                <div class="row">
                  <div class="col-md-12 mt-1 order-md-1 provider-form">
                    <div class="header pt-1">
                      <h6>
                        <span class="h4 float-left">
                          {this.state.editId > 0
                            ? this.state.patientModel.lastName +
                              " - " +
                              this.state.patientModel.firstName +
                              " - " +
                              this.state.patientModel.accountNum
                            : "NEW PATIENT"}
                        </span>

                        <div class="col-md-3 pl-2 p-0 pt-1 m-0 w-20 text-center float-left">
                          {!(this.props.popupPatientId > 0) &&
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

                        <div
                          class="float-right p-0 col-md-0"
                          style={{ marginTop: "-3px" }}
                        >
                          {this.state.editId > 0 ? dropdown : ""}
                        </div>

                        <div class="float-right p-0 col-md-0">
                          <button
                            style={{ marginTop: "-5px" }}
                            className="btn btn-primary ml-1 mr-2"
                            id="myModal"
                            onClick={this.deletePatient}
                            disabled={this.isDisabled(this.props.rights.delete)}
                          >
                            Delete
                          </button>
                        </div>
                        <div class="float-right p-0 col-md-0">
                          <button
                            style={{ marginTop: "-5px" }}
                            className="btn btn-primary ml-1 mr-2"
                            id="myModal"
                            onClick={this.addNewPatient}
                            disabled={this.isDisabled(this.props.rights.delete)}
                          >
                            Add New
                          </button>
                        </div>
                        <div class="float-right p-0 col-md-0">
                          <input
                            style={{
                              width: "20px",
                              height: "20px",
                              marginTop: "5px",
                            }}
                            class="checkbox mr-2"
                            type="checkbox"
                            checked={this.state.patientModel.isActive}
                            onClick={this.handleCheck}
                          />
                          Active
                        </div>
                      </h6>
                    </div>

                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    <div class="row">
                      <div class="col-md-2 float-left">
                        <div
                          class="Neon Neon-theme-dragdropbox"
                          style={{ width: "80%", height: "100%" }}
                        >
                          <label htmlFor="file-input">{$imagePreview}</label>
                          <input
                            style={{ visibility: "hidden", height: "100%" }}
                            id="file-input"
                            type="file"
                            onChange={(e) => this._handleImageChange(e)}
                          />
                        </div>
                      </div>

                      <div class="col-md-10  float-right">
                        <div class="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Account#<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                name="accountNum"
                                id="accountNum"
                                placeholder=" Account#"
                                maxLength="20"
                                value={this.state.patientModel.accountNum}
                                onChange={this.handleChange}
                                disabled
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.accountNumValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">MRN</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                name="medicalRecordNumber"
                                id="medicalRecordNumber"
                                placeholder="MRN"
                                maxLength="20"
                                value={
                                  this.state.patientModel.medicalRecordNumber
                                }
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Title</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                name="title"
                                id="title"
                                value={this.state.patientModel.title}
                                onChange={this.handleChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {titles.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="firstName">
                                Last Name<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                name="lastName"
                                id="lastName"
                                placeholder="Last Name"
                                maxLength="35"
                                value={this.state.patientModel.lastName}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback" style={{paddingLeft:"34%"}}>
                              {this.state.validationModel.lastNameValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="firstName">
                                First Name<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                name="firstName"
                                id="firstName"
                                placeholder="First Name"
                                maxLength="35"
                                value={this.state.patientModel.firstName}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback" style={{paddingLeft:"34%"}}>
                              {this.state.validationModel.firstNameValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="firstName">Middle Initial</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                name="middleInitial"
                                id="middleInitial"
                                placeholder=" Middle Initial"
                                maxLength="3"
                                value={this.state.patientModel.middleInitial}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="DOB">DOB</label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                class="provider-form w-100 form-control-user"
                                min="1900-01-01"
                                max="9999-12-31"
                                type="date"
                                min="1900-01-01"
                                max="9999-12-31"
                                name="dob"
                                id="dob"
                                value={this.replace(
                                  this.state.patientModel.dob,
                                  "T00:00:00",
                                  ""
                                )}
                                onChange={this.handleDateChange}
                              ></input>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.dobValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="firstName">Gender</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                style={{ width: "100%" }}
                                class="p-1 m-0 provider-form form-control-user"
                                name="gender"
                                id="gender"
                                value={this.state.patientModel.gender}
                                onChange={this.handleChange}
                              >
                                {gender.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.ssnValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="firstName">SSN</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                name="ssn"
                                id="ssn"
                                placeholder="SSN"
                                maxLength="9"
                                value={this.state.patientModel.ssn}
                                // onChange={() => this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.ssnValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="firstName">Merital Status</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                style={{ width: "100%" }}
                                class="p-1 m-0 provider-form form-control-user"
                                name="maritalStatus"
                                id="maritalStatus"
                                value={this.state.patientModel.maritalStatus}
                                onChange={this.handleChange}
                              >
                                {matitalStatus.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.ssnValField} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!---NEW PATIENT | Demographics | Edits start here --> */}

                {/* <!-- Address Info Large Row Starts --> */}
                <div class="row">
                  {/* <!--Address Information start here--> */}
                  <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                    <div class="header pt-0">
                      <h6 class="heading">Address Information</h6>
                      <hr
                        class="p-0 mt-0 mb-1"
                        style={{ backgroundColor: "#037592" }}
                      ></hr>
                      <div class="clearfix"></div>
                    </div>
                    <br></br>

                    <form class="needs-validation form-group">
                      <div class="row">
                        <div class="col-md-6 mb-2">
                          <div class="col-md-2 float-left">
                            <label for="firstName">Address 1</label>
                          </div>
                          <div class="col-md-10 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              name="address1"
                              id="address1"
                              placeholder="Address 1"
                              maxLength="55"
                              value={this.state.patientModel.address1}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-6 mb-2">
                          <div class="col-md-2 float-left">
                            <label for="firstName">
                              Address 2
                              {/* <span class="text-danger">*</span> */}
                            </label>
                          </div>
                          <div class="col-md-10 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              name="address2"
                              id="address2"
                              placeholder="Address 2"
                              maxLength="55"
                              value={this.state.patientModel.address2}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <div class="col-md-4 float-left">
                            <label for="firstName">
                              City {/* <span class="text-danger">*</span> */}
                            </label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              class="provider-form ml-1 w-100 form-control-user"
                              name="city"
                              id="city"
                              maxLength="20"
                              value={this.state.patientModel.city}
                              onChange={this.handleChange}
                              placeholder="City "
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-3 mb-2">
                          <div class="col-md-3 float-left">
                            <label for="firstName">
                              State {/* <span class="text-danger">*</span> */}
                            </label>
                          </div>
                          <div class="col-md-8 p-0 pl-0 float-left">
                            <select
                              name="state"
                              class="w-100"
                              name="state"
                              id="state"
                              value={this.state.patientModel.state}
                              onChange={this.handleChange}
                            >
                              {usStates.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.display}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-6 mb-2">
                          <div class="col-md-2 float-left">
                            <label for="firstName">
                              Zip Code{" "}
                              {/* <span class="text-danger">*</span> */}
                            </label>
                          </div>
                          <div class="col-md-4 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              name="zipCode"
                              id="zipCode"
                              maxLength="9"
                              value={this.state.patientModel.zipCode}
                              onChange={this.handleZip}
                              onKeyPress={(event) =>
                                this.handleNumericCheck(event)
                              }
                              placeholder="Zip Code"
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.zipCodeValField}
                          </div>
                          <div class="col-md-2 float-left">
                            <label for="firstName">
                              Cell# {/* <span class="text-danger">*</span> */}
                            </label>
                          </div>
                          <div class="col-md-4 float-left">
                            <NumberFormat
                              format="00 (###) ###-####"
                              mask="_"
                              class="provider-form w-100 form-control-user"
                              type="text"
                              placeholder="00 (111) 111-1111"
                              name="mobileNumber"
                              id="mobileNumber"
                              max="10"
                              value={this.state.patientModel.mobileNumber}
                              onChange={this.handleChange}
                              onKeyPress={(event) =>
                                this.handleNumericCheck(event)
                              }
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.mobileNumberValField}
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6 mb-2">
                          <div class="col-md-2 float-left">
                            <label for="firstName">
                              Email {/* <span class="text-danger">*</span> */}
                            </label>
                          </div>
                          <div class="col-md-10 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              name="email"
                              id="email"
                              maxLength="60"
                              value={this.state.patientModel.email}
                              onChange={this.handleChange}
                              placeholder="Email"
                            />
                          </div>
                          <div class="invalid-feedback" style={{paddingLeft:"19%"}}>
                            {" "}
                            {this.state.validationModel.emailValField}{" "}
                          </div>
                        </div>
                        <div class="col-md-6 mb-4">
                          <div class="col-md-2 p-0 m-0 float-left">
                            <label for="DOB/Gender">
                              <span>
                                {this.state.patientModel.batchDocumentID ? (
                                  <a
                                    href=""
                                    onClick={(event) =>
                                      this.openPopup(
                                        event,
                                        "batch",
                                        this.state.patientModel.batchDocumentID
                                      )
                                    }
                                  >
                                    Batch#
                                  </a>
                                ) : (
                                  "Batch#"
                                )}
                              </span>
                            </label>
                          </div>
                          <div class="col-md-4 float-left">
                            <input
                              type="text"
                              style={{ width: "80%" }}
                              class="provider-form form-control-user"
                              type="text"
                              maxLength="20"
                              value={
                                this.state.patientModel.batchDocumentID
                                  ? this.state.patientModel.batchDocumentID
                                  : ""
                              }
                              name="batchDocumentID"
                              id="batchDocumentID"
                              placeholder="Batch#"
                              onBlur={this.handleBatchCheck}
                              onChange={this.handleBatchChange}
                              onKeyPress={(event) =>
                                this.handleNumericCheck(event)
                              }
                            />
                            <a>
                              {" "}
                              <img
                                style={{ width: "25px", marginTop: "-2px" }}
                                class="float-right pt-1"
                                src={plusSrc}
                                alt=""
                                onClick={(event) =>
                                  this.openPopup(
                                    event,
                                    "batchNo",
                                    this.state.patientModel.batchDocumentID
                                  )
                                }
                              />
                            </a>
                          </div>
                          {/* <div class="invalid-feedback">
                          {this.state.validationModel.batchDocumentIDValField}
                          {this.state.validationModel.responsepagesValField}
                          </div> */}
                          <div class="col-md-2 float-left">
                            <label for="firstName">
                              <span>
                                {this.state.patientModel.pageNumber ? (
                                  <a
                                    href=""
                                    onClick={(event) =>
                                      this.openPopup(
                                        event,
                                        "pagePDF",
                                        this.state.patientModel.pageNumber
                                      )
                                    }
                                  >
                                    Page#
                                  </a>
                                ) : (
                                  "Page#"
                                )}
                              </span>
                            </label>
                          </div>
                          <div class="col-md-4 float-left">
                            <input
                              type="text"
                              style={{ width: "100%" }}
                              class="provider-form form-control-user"
                              maxLength="20"
                              type="text"
                              value={
                                this.state.patientModel.pageNumber
                                  ? this.state.patientModel.pageNumber
                                  : ""
                              }
                              placeholder="Page#"
                              name="pageNumber"
                              id="pageNumber"
                              // onBlur={this.handleBatchCheck}
                              onChange={this.handleBatchChange}
                            />
                          </div>
                          <div
                            class="invalid-feedback"
                            style={{ marginTop: "30px", marginLeft: "10%" }}
                          >
                            {this.state.validationModel.batchDocumentIDValField}
                            {this.state.validationModel.responsepagesValField}
                            {this.state.validationModel.pageNumberValField}
                          </div>
                        </div>
                      </div>

                      <div class="clearfix">
                        <br></br>
                      </div>

                      {/* <!-- Statement Info Starts Here --> */}
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Statement Info</h6>
                          <hr
                            class="p-0 mt-0 mb-1"
                            style={{ backgroundColor: "#037592" }}
                          ></hr>
                          <div class="clearfix"></div>
                        </div>
                        <br></br>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 m-0 p-0 float-left">
                              <label for="firstName">Statement</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                style={{ border: "0px solid #7cbcdb" }}
                                class="checkbox mr-2"
                                type="checkbox"
                                id="statement"
                                name="statement"
                                checked={this.state.patientModel.statement}
                                onChange={this.handleCheckbox}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 m-0 p-0 float-left">
                              <label for="firstName">Hold Statement</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                style={{ border: "0px solid #7cbcdb" }}
                                class="checkbox mr-2"
                                type="checkbox"
                                id="holdStatement"
                                name="holdStatement"
                                checked={this.state.patientModel.holdStatement}
                                onChange={this.handleholdStatementCheckbox}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-4">
                            <div class="col-md-4 m-0 p-0 float-left">
                              <label for="firstName">Statement Message</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                name="statementMessage"
                                id="statementMessage"
                                maxLength="60"
                                value={this.state.patientModel.statementMessage}
                                onChange={this.handleChange}
                                placeholder="Statement Message"
                              />
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                        </div>
                      </div>
                      {/* <!-- Statement Info Ends Here --> */}

                      {/* <!-- Legen Entities Start Here  -->                        */}
                      <div class="col-md-12 mt-2 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Legal Entities</h6>
                        </div>
                        <div
                          class="clearfix"
                          style={{ borderBottom: "1px solid #037592" }}
                        ></div>
                        <br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-3 float-left">
                              <label for="firstName">
                                {this.state.patientModel.practiceID > 0 ? (
                                  <a
                                    href="#"
                                    onClick={(event) =>
                                      this.openPopup(
                                        event,
                                        "practice",
                                        this.state.patientModel.practiceID
                                      )
                                    }
                                  >
                                    Practice
                                  </a>
                                ) : (
                                  <span>Practice</span>
                                )}

                                <span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-9 float-left">
                              <select
                                style={{ width: "85% ", padding: "5px" }}
                                class="provider-form form-control-user"
                                name="practiceID"
                                id="practiceID"
                                disabled
                                value={this.state.patientModel.practiceID}
                                onChange={this.handleChange}
                              >
                                {this.state.practice.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                              {/* <a
                          href="popup-provider.html"
                          data-toggle="modal"
                          data-target="#logoutModal"
                        >
                          <img
                            class="float-right pt-1"
                            id="myModal"
                            src="img/plus-ico.png"
                            alt=""
                          />
                        </a> */}
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.practiceIDValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-3 float-left">
                              <label for="firstName">
                                <label for="firstName">
                                  {this.state.patientModel.locationId ? (
                                    <a
                                      href="#"
                                      onClick={(event) =>
                                        this.openPopup(
                                          event,
                                          "location",
                                          this.state.patientModel.locationId
                                        )
                                      }
                                    >
                                      Location
                                    </a>
                                  ) : (
                                    <span>Location</span>
                                  )}
                                  <span class="text-danger">*</span>
                                </label>
                              </label>
                            </div>
                            <div class="col-md-9 float-left">
                              <select
                                style={{ width: "85%", padding: "5px" }}
                                class="provider-form form-control-user"
                                name="locationId"
                                id="locationId"
                                value={this.state.patientModel.locationId}
                                onChange={this.handleChange}
                              >
                                {this.props.userLocations.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                              <a
                                href="popup-provider.html"
                                data-toggle="modal"
                                data-target="#logoutModal"
                              >
                                <img
                                  class="float-right pt-1"
                                  id="myModal"
                                  src={plusImage}
                                  style={{ width: "25px" }}
                                  onClick={(event) =>
                                    this.openLocationPopup(event, 0)
                                  }
                                  disabled={this.isDisabled(
                                    this.props.rights.add
                                  )}
                                  alt=""
                                />
                              </a>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.locationIdValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-3 float-left">
                              <label for="firstName">
                                {this.state.patientModel.providerID ? (
                                  <a
                                    href="#"
                                    onClick={(event) =>
                                      this.openPopup(
                                        event,
                                        "provider",
                                        this.state.patientModel.providerID
                                      )
                                    }
                                  >
                                    Provider
                                  </a>
                                ) : (
                                  <span>Provider</span>
                                )}
                                <span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-9 float-left">
                              <select
                                style={{ width: "85%", padding: "5px" }}
                                class="provider-form form-control-user"
                                name="providerID"
                                id="providerID"
                                value={this.state.patientModel.providerID}
                                onChange={this.handleChange}
                              >
                                {this.props.userProviders.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                              <a
                                href="popup-provider.html"
                                data-toggle="modal"
                                data-target="#logoutModal"
                              >
                                <img
                                  class="float-right pt-1"
                                  id="myModal"
                                  src={plusImage}
                                  style={{ width: "25px" }}
                                  onClick={(event) =>
                                    this.openProviderPopup(event, 0)
                                  }
                                  disabled={this.isDisabled(
                                    this.props.rights.add
                                  )}
                                  alt=""
                                />
                              </a>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.providerIDValField}
                            </div>
                          </div>
                        </div>

                        <div class="row ">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-3 float-left">
                              <label for="firstName">
                                {this.state.patientModel.refProviderID ? (
                                  <a
                                    href="#"
                                    onClick={(event) =>
                                      this.openPopup(
                                        event,
                                        "refprovider",
                                        this.state.patientModel.refProviderID
                                      )
                                    }
                                  >
                                    {" "}
                                    Ref Provider
                                  </a>
                                ) : (
                                  <span> Ref Provider</span>
                                )}
                              </label>
                            </div>
                            <div class="col-md-9 float-left">
                              <select
                                style={{ width: "85%", padding: "5px" }}
                                class="provider-form form-control-user"
                                name="refProviderID"
                                id="refProviderID"
                                value={this.state.patientModel.refProviderID}
                                onChange={this.handleChange}
                              >
                                {this.props.userRefProviders.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                              <a
                                href="popup-provider.html"
                                data-toggle="modal"
                                data-target="#logoutModal"
                              >
                                <img
                                  class="float-right pt-1"
                                  id="myModal"
                                  src={plusImage}
                                  style={{ width: "25px" }}
                                  onClick={(event) =>
                                    this.openRefProviderPopup(event, 0)
                                  }
                                  disabled={this.isDisabled(
                                    this.props.rights.add
                                  )}
                                  alt=""
                                />
                              </a>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                        </div>

                        <div class="clearfix">
                          <br></br>
                        </div>
                      </div>
                      {/* <!-- Legen Entities Start Here  -->    */}

                      {/* React Tabs Start Here*/}
                      <Tabs headers={headers} style={{ cursor: "default" }}>
                        <Tab>
                          <div class="card mb-4">
                            <div class="card-header">
                              <h6 class="m-0 font-weight-bold text-primary search-h">
                                Patient Plans
                                <div class="float-lg-right text-right">
                                  <button
                                    style={{ marginTop: "-6px" }}
                                    class="float-right btn btn-primary mr-2"
                                    onClick={this.addPlanRow}
                                  >
                                    Add New
                                  </button>
                                </div>
                              </h6>
                            </div>

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
                                      data={patientPlanData}
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
                        </Tab>
                        <Tab>
                          <div class="card mb-4">
                            <div class="card-header">
                              <h6 class="m-0 font-weight-bold text-primary search-h">
                                PATIENT AUTHORIZATION
                                <div class="float-lg-right text-right">
                                  <button
                                    style={{ marginTop: "-6px" }}
                                    class="float-right btn btn-primary mr-2"
                                    type="button"
                                    onClick={this.addAuthRow}
                                  >
                                    Add Patient Auth
                                  </button>
                                </div>
                              </h6>
                            </div>

                            <div class="card-body">
                              <div class="table-responsive">
                                <div
                                  style={{ overflowX: "hidden" }}
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
                                >
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    searching={false}
                                    data={patientAuthData}
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
                        <Tab>
                          <div class="card mb-4">
                            <div class="card-header">
                              <h6 class="m-0 font-weight-bold text-primary search-h">
                                PATIENT REFERRALS
                                <div class="float-lg-right text-right">
                                  <button
                                    style={{ marginTop: "-6px" }}
                                    class="float-right btn btn-primary mr-2"
                                    onClick={this.addReferral}
                                  >
                                    Add Patient Referrals
                                  </button>
                                </div>
                              </h6>
                            </div>

                            <div class="card-body">
                              <div class="table-responsive">
                                <div
                                  style={{ overflowX: "hidden" }}
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
                                >
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    searching={false}
                                    data={patientReferralData}
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
                                  style={{ overflowX: "hidden" }}
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
                                >
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    searching={false}
                                    data={noteTableData}
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
                      {/* React Tabs Ends Here */}

                      {/* <!-- Scroll to Top Button--> */}
                      <br></br>
                      <div class="row">
                        {/* <!--Address Information start here--> */}
                        <div class="col-12 pt-2 text-center">
                          <button
                            class="btn btn-primary mr-2"
                            onClick={this.savePatient}
                            disabled={this.isDisabled(
                              this.state.editId > 0
                                ? this.props.rights.update
                                : this.props.rights.add
                            )}
                          >
                            Save
                          </button>
                          <button
                            class="btn btn-primary mr-2"
                            onClick={
                              this.state.patientPopupId > 0 ||
                              this.state.patientPopupId == -1
                                ? () => this.props.onClose()
                                : this.cancelBtn
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* <!-- Address Info Large Row Starts --> */}
              </div>
              {/* <!-- Tab Pane Ends Here --> */}
            </div>
            {/* <!-- Tab Content Ends --> */}
          </div>
          {/* <!-- Container Top Ends Here --> */}

          {/* <!-- End of Main Content --> */}

          {/* <!-- Footer --> */}
          <footer class="sticky-footer bg-white">
            <div class="container my-auto">
              <div class="copyright text-center my-auto">
                {" "}
                <span>
                  Version 1.0 <br />
                  Copyright &copy; 2020 Bellmedex LLC. All rights reserved.
                </span>{" "}
              </div>
            </div>
          </footer>
          {/* <!-- End of Footer --> */}
        </div>

        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    patientGridData: state.PatientGridDataReducer
      ? state.PatientGridDataReducer
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
    icdCodes: state.loginInfo
      ? state.loginInfo.icd
        ? state.loginInfo.icd
        : []
      : [],
    userLocations: state.loginInfo
      ? state.loginInfo.userLocations
        ? state.loginInfo.userLocations
        : []
      : [],
    cptCodes: state.loginInfo
      ? state.loginInfo.cpt
        ? state.loginInfo.cpt
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
      : { userPractices: [], name: "", practiceID: null },
    insurancePlans: state.insurancePlans
      ? state.insurancePlans.insurancePlans
      : [],
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.patientSearch,
          add: state.loginInfo.rights.patientCreate,
          update: state.loginInfo.rights.patientEdit,
          delete: state.loginInfo.rights.patientDelete,
          export: state.loginInfo.rights.patientExport,
          import: state.loginInfo.rights.patientImport,
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
      selectPatient: selectPatient,
      topForm: topForm,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(NewPatient)
);
