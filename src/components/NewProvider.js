import React, { Component, Fragment } from "react";
import $ from "jquery";

import taxonomyIcon from "../images/code-search-icon.png";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import Select, { components } from "react-select";
import settingsIcon from "../images/setting-icon.png";
import Dropdown from "react-dropdown";
import NewHistoryPractice from "./NewHistoryPractice";
import { MDBDataTable, MDBBtn, MDBTable } from "mdbreact";
import NumberFormat from "react-number-format";
import deleteBtnIcon from "../images/del-btn-pform.png";
import settingIcon from "../images/setting-icon.png";

// import Grid from '@material-ui/core/Grid';
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { TimePicker } from "@material-ui/pickers";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import moment from "moment";
import Timer from "@material-ui/icons/Timer";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { userInfo } from "../actions/userInfo";
import { taxonomyCodeAction } from "../actions/TaxonomyAction";
import { ProviderAction } from "../actions/ProviderAction";
import { ResponsiveContainer } from "recharts";
import { flexbox } from "@material-ui/system";
//import { Flag } from "semantic-ui-react";

class NewProvider extends Component {
  constructor(props) {
    super(props);
    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/Provider/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    this.accountUrl = process.env.REACT_APP_URL + "/account/";
    this.insurancePlanurl = process.env.REACT_APP_URL + "/PatientPlan/";
    this.providerScheduleUrl = process.env.REACT_APP_URL + "/ProviderSchedule/";
    this.InsurancOptionurl =
      process.env.REACT_APP_URL + "/InsuranceBillingOption/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveProviderCount = 0;

    //provider Model
    this.providerModel = {
      id: 0,
      title: "",
      name: "",
      lastName: "",
      firstName: "",
      middleInitial: "",
      npi: "",
      ssn: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      officePhoneNum: "",
      phoneNumExt: "",
      email: "",
      deaNumber: "",
      upinNumber: "",
      licenceNumber: "",
      isActive: true,
      isDeleted: false,
      practiceID:
        this.props.userInfo1.practiceID != null
          ? this.props.userInfo1.practiceID
          : null,
      notes: "",
      addedBy: "",
      updatedBy: "",
      faxNumber: "",
      billUnderProvider: false,

      taxonomyCode: null,
      payToAddress1: "",
      payToAddress2: "",
      payToCity: "",
      payToState: "",
      payToZipCode: "",
      payofficePhoneNum: "",
      insuranceBillingoption: [],
      userLocations: "",
      userLocationId: "",
      providerSchedule: [],
    };

    this.insuranceBillingoption = {
      providerID: "",
      locationID: "",
      insurancePlanID: "",
      reportTaxID: false,
      payToAddress: "None",
    };

    this.providerSchedule = {
      ID: 0,
      chk: false,
      weekday: "",
      providerID: "",
      provider: "",
      locationID: "",
      location: "",
      fromTime: "",
      toTime: "",
      timeInterval: "",
      overBookAllowed: "",
      notes: "",
      day: "",
      breakfrom: "",
      breakto: "",
    };

    this.validationModel = {
      titleValField: "",
      nameValField: "",
      lastNameValField: "",
      firstNameValField: "",
      middleInitialValField: "",
      npiValField: "",
      ssnValField: "",
      taxonomyCodeValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      officePhoneNumValField: "",
      emailValField: "",
      deaNumberValField: "",
      upinNumberValField: "",
      licenceNumberValField: "",
      isActiveValField: true,
      isDeletedValField: false,
      notesValField: "",
      locationVal: "",
      insurancePlanIDVal: "",
      payaddVal: "",
      toTimeVal: "",
      faxNumberValField: "",
    };

    this.state = {
      editId: this.props.id,
      providerModel: this.providerModel,
      validationModel: this.validationModel,
      maxHeight: "361",
      loading: false,
      isChecked: false,
      taxonomyCode: {},
      popupName: "",
      showPopup: false,
      Checked: false,
      patientPlanData: [],
      // userLocations: [],
      userLocations: this.props.userInfo1.userLocations
        ? this.props.userInfo1.userLocations
        : [],
      insurancePlans: this.props.insurancePlans
        ? this.props.insurancePlans
        : [],
      localModel: [],
      reportTaxID: false,
      providerSchedule: [],
      checkedTab: 1,
      windowHeight: "700px",
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveNewProvider = this.saveNewProvider.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.delete = this.delete.bind(this);
    this.handleZip = this.handleZip.bind(this);
    this.handletaxonomyCodeChange = this.handletaxonomyCodeChange.bind(this);
    this.addPlanRow = this.addPlanRow.bind(this);
    this.reportTaxIDcheck = this.reportTaxIDcheck.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.selectALL = this.selectALL.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  setModalMaxHeight = (element) => {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var maxHeight = contentHeight - headerHeight;

    this.setState({ maxHeight: maxHeight });
  };

  componentWillMount() {
    var windowHeight = window.innerHeight;
    this.setState({ windowHeight: `${windowHeight - 50}px` });
  }
  async componentDidMount() {
    this.setState({ loading: true });
    // this.setModalMaxHeight($(".modal"));
    // var zIndex = 1040 + 10 * $(".modal:visible").length;
    // $(this).css("z-Index", zIndex);
    // setTimeout(function () {
    //   $(".modal-backdrop")
    //     .not(".modal-stack")
    //     .css("z-Index", zIndex - 1)
    //     .addClass("modal-stack");
    // }, 0);

    try {
      //TaxonomyCode
      try {
        if (
          this.props.userInfo1.taxonomy == null ||
          this.props.userInfo1.taxonomy == 0
        ) {
          await axios
            .get(this.commonUrl + "GetTaxonomy", this.config)
            .then((response) => {
              this.props.taxonomyCodeAction(
                this.props,
                response.data,
                "TAXONOMYCODES"
              );
            })
            .catch((error) => {});
        }
      } catch {}

      // try {
      //   //get insurance plans from get profiles
      //   await axios
      //     .get(this.insurancePlanurl + "getprofiles", this.config)
      //     .then(response => {
      //       this.setState({ insurancePlan: response.data.insurancePlans });
      //     })
      //     .then(error => { });
      // } catch { }

      if (this.state.editId > 0) {
        await axios
          .get(this.url + "findprovider/" + this.state.editId, this.config)
          .then((response) => {
            var providerModel = response.data;

            var providerModel = response.data;
            if (providerModel.insuranceBillingoption == null) {
              providerModel.insuranceBillingoption = [];
            }

            var taxonomyCode = [];
            try {
              if (providerModel.taxonomyCode) {
                taxonomyCode = this.props.userInfo1.taxonomy.filter(
                  (option) => option.value == providerModel.taxonomyCode
                )[0];
              }
            } catch {}

            this.setState({
              providerModel: providerModel,
              taxonomyCode: taxonomyCode,
            });
          })
          .catch((error) => {
            let errorsList = [];
            if (error.response !== null && error.response.data !== null) {
              errorsList = error.response.data;
            }
          });
      }

      ////////// Provider Scheduler ////////////////////////............................
      var locationID = this.state.userLocations[1].id;
      var providerID = this.state.providerModel.id
        ? this.state.providerModel.id
        : 0; // 0 ka chk laga ha

      try {
        axios
          .get(this.providerScheduleUrl + "FindProviderSchedule/", {
            params: {
              locationID: locationID,
              providerID: providerID,
            },
            headers: {
              Authorization: "Bearer  " + this.props.loginObject.token,
              Accept: "*/*",
            },
          })
          .then((response) => {
            var providerSchedule = response.data;
            this.setState({
              // providerModel: {
              //   ...this.state.providerModel,
              providerSchedule: providerSchedule,
              // }
            });
          })

          .catch((error) => {});
      } catch {}

      try {
        var taxonomyCode = [];
        taxonomyCode = this.props.userInfo1.taxonomy.filter(
          (option) => option.id
        );
      } catch {}

      try {
        let newProviderList = this.state.providerModel.insuranceBillingoption;
        for (
          var i = 0;
          i < this.state.providerModel.insuranceBillingoption.length;
          i++
        ) {
          newProviderList[i].userlocationobj = this.state.userLocations.filter(
            (option) =>
              option.id ==
              this.state.providerModel.insuranceBillingoption[i].locationID
          );
          newProviderList[
            i
          ].insurancePlanobj = this.props.insurancePlans.filter(
            (option) =>
              option.id ==
              this.state.providerModel.insuranceBillingoption[i].insurancePlanID
          );
        }
        this.setState({
          providerModel: {
            ...this.state.providerModel,
            insuranceBillingoption: newProviderList,
          },
        });
      } catch {}
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  handleCheckbox() {
    this.setState({
      providerModel: {
        ...this.state.providerModel,
        billUnderProvider: !this.state.providerModel.billUnderProvider,
      },
    });
  }

  handleZip(event) {
    var zip = event.target.value;

    this.setState({
      providerModel: {
        ...this.state.providerModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.commonUrl + "GetCityStateInfo/" + zip, this.config)
        .then((response) => {
          this.setState({
            providerModel: {
              ...this.state.providerModel,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id,
            },
          });
        })
        .catch((error) => {
          this.setState({ loading: false });

          if (error.response.data == "InValid ZipCode") {
            Swal.fire("Something Wrong", "InValid ZipCode", "error");
          } else {
            Swal.fire(
              "Something Wrong",
              "Please Check Server Connection",
              "error"
            );
          }
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
          }
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
    }
  }

  handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    event.preventDefault();

    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    var regExpr = /[^a-zA-Z0-9 ]/g;
    var myValue = event.target.value;
    var myName = event.target.name;

    if (caret == 0 || caret <= 1) {
      myValue = myValue.trim();
    }

    if (
      myName == "upinNumber" ||
      myName == "licenceNumber" ||
      myName == "deaNumber"
    ) {
      myValue = myValue.replace(regExpr, "");
    } else {
      myValue = myValue ? myValue : "";
      myValue = myValue;
    }

    this.setState({
      providerModel: {
        ...this.state.providerModel,
        [myName]: myValue.toUpperCase(),
      },
    });
  };

  // handleChange = event => {
  //   event.preventDefault();

  //   //Carret Position
  //   const caret = event.target.selectionStart;
  //   const element = event.target;
  //   window.requestAnimationFrame(() => {
  //     element.selectionStart = caret;
  //     element.selectionEnd = caret;
  //   });

  //   this.setState({
  //     providerModel: {
  //       ...this.state.providerModel,
  //       [event.target.name]: event.target.value.toUpperCase()
  //     }
  //   });
  // };

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select"
    )
      return true;
    else return false;
  }

  handleCheck() {
    this.setState({
      providerModel: {
        ...this.state.providerModel,
        isActive: !this.state.providerModel.isActive,
      },
    });
  }

  delete = (e) => {
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
          .delete(this.url + "DeleteProvider/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({
              loading: false,
              providerModel: this.providerModel,
              taxonomyCode: null,
            });

            try {
              //GetProviders
              axios
                .get(this.commonUrl + "GetProvider", this.config)
                .then((response) => {
                  this.props.ProviderAction(
                    this.props,
                    response.data,
                    "PROVIDER_ACTION"
                  );
                })
                .catch((error) => {});
            } catch {}

            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch((error) => {
            this.setState({ loading: false });

            if (this.state.editId > 0) {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being reference in other screens.",
                "error"
              );
            } else {
              Swal.fire(
                "Record Not Deleted!",
                "Don't have record to delete",
                "error"
              );
            }
          });

        // $("#btnCancel").click();
      }
    });
  };

  saveNewProvider = (e) => {
    if (this.saveProviderCount == 1) {
      return;
    }
    this.saveProviderCount = 1;
    e.preventDefault();
    this.setState({ loading: true });

    if (this.isNull(this.state.providerModel.officePhoneNum) === false) {
      if (this.state.providerModel.officePhoneNum.length > 10) {
        var officePhoneNum = this.state.providerModel.officePhoneNum.slice(
          3,
          17
        );
        this.state.providerModel.officePhoneNum = officePhoneNum.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    var myVal = this.validationModel;
    myVal.validation = false;

    // // location check
    var providerScheduleVal = this.state.providerSchedule;
    var len = this.state.providerSchedule.length;
    for (var i = 0; i < len; i++) {
      providerScheduleVal[i].validation = false;

      //locationVal from validation
      if (this.state.providerSchedule[i].fromTime != null) {
        if (
          this.state.providerSchedule[i].toTime == null ||
          this.state.providerSchedule[i].toTime == 0
        ) {
          providerScheduleVal[i].toTimeVal = <span>Please Enter To Time</span>;
          providerScheduleVal[i].validation = true;
        } else {
          providerScheduleVal[i].toTimeVal = "";
          if (providerScheduleVal[i].validation === false)
            providerScheduleVal[i].validation = false;
        }
      }
      if (this.state.providerSchedule[i].breakfrom != null) {
        if (
          this.state.providerSchedule[i].breakto == null ||
          this.state.providerSchedule[i].breakto == 0
        ) {
          providerScheduleVal[i].breaktoVal = <span>Please Enter To Time</span>;
          providerScheduleVal[i].validation = true;
        } else {
          providerScheduleVal[i].breaktoVal = "";
          if (providerScheduleVal[i].validation === false)
            providerScheduleVal[i].validation = false;
        }
      }
    }
    //Location Otions Validation set state
    this.setState({
      providerSchedule: providerScheduleVal,
    });
    for (var i = 0; i < len; i++) {
      if (providerScheduleVal[i].validation === true) {
        this.setState({ loading: false });
        Swal.fire("Please Select All Fields Properly1", "", "error");
        return;
      }
    }

    //Billing Otions  Model Validation
    var insuranceBillingoptionVal;
    for (
      var i = 0;
      i < this.state.providerModel.insuranceBillingoption.length;
      i++
    ) {
      insuranceBillingoptionVal = {
        ...this.state.providerModel.insuranceBillingoption[i],
      };
      insuranceBillingoptionVal.validation = false;

      //locationVal from validation
      if (
        this.isNull(
          this.state.providerModel.insuranceBillingoption[i].locationID
        )
      ) {
        insuranceBillingoptionVal.locationVal = (
          <span>Please Select Location</span>
        );
        insuranceBillingoptionVal.validation = true;
      } else {
        insuranceBillingoptionVal.locationVal = "";
        if (insuranceBillingoptionVal.validation === false)
          insuranceBillingoptionVal.validation = false;
      }

      //insurancePlanIDVal from validation
      if (
        this.isNull(
          this.state.providerModel.insuranceBillingoption[i].insurancePlanID
        )
      ) {
        insuranceBillingoptionVal.insurancePlanIDVal = (
          <span>Please Select Plan</span>
        );
        insuranceBillingoptionVal.validation = true;
      } else {
        insuranceBillingoptionVal.insurancePlanIDVal = "";
        if (insuranceBillingoptionVal.validation === false)
          insuranceBillingoptionVal.validation = false;
      }

      //Billing Otions Validation set state
      this.setState({
        providerModel: {
          ...this.state.providerModel,
          insuranceBillingoption: [
            ...this.state.providerModel.insuranceBillingoption.slice(0, i),
            Object.assign(
              {},
              this.state.providerModel.insuranceBillingoption[i],
              insuranceBillingoptionVal
            ),
            ...this.state.providerModel.insuranceBillingoption.slice(i + 1),
          ],
        },
      });
    }

    if (this.isNull(this.state.providerModel.name)) {
      myVal.nameValField = <span className="validationMsg">Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.providerModel.lastName)) {
      myVal.lastNameValField = (
        <span className="validationMsg">Enter Last Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.lastNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.providerModel.firstName)) {
      myVal.firstNameValField = (
        <span className="validationMsg">Enter First Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.firstNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.providerModel.npi)) {
      myVal.npiValField = <span className="validationMsg">Enter NPI</span>;
      myVal.validation = true;
    } else if (this.state.providerModel.npi.length < 10) {
      myVal.npiValField = (
        <span className="validationMsg">NPI length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.npiValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    // if (
    //   this.isNull(this.state.providerModel.taxonomyCode) === false &&
    //   this.state.providerModel.taxonomyCode.length < 10
    // ) {
    //   myVal.taxonomyCodeValField = (
    //     <span className="validationMsg">Taxonomy Code length should be 10</span>
    //   );
    //   myVal.validation = true;
    // } else {
    //   myVal.taxonomyCodeValField = "";
    //   if (myVal.validation === false) myVal.validation = false;
    // }

    if (
      this.isNull(this.state.providerModel.zipCode) === false &&
      this.state.providerModel.zipCode.length > 0
    ) {
      if (this.state.providerModel.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.providerModel.zipCode.length > 5 &&
        this.state.providerModel.zipCode.length < 9
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
      this.isNull(this.state.providerModel.officePhoneNum) === false &&
      this.state.providerModel.officePhoneNum.length < 10
    ) {
      myVal.officePhoneNumValField = (
        <span className="validationMsg">Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.officePhoneNumValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Fax number Validation
    if (this.isNull(this.state.providerModel.faxNumber) === false) {
      if (this.state.providerModel.faxNumber.length < 10) {
        myVal.faxNumberValField = (
          <span className="validationMsg">Fax # length should be 10</span>
        );
        myVal.validation = true;
      } else {
        myVal.faxNumberValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.faxNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.providerModel.ssn) === false &&
      this.state.providerModel.ssn.length < 9
    ) {
      myVal.ssnValField = (
        <span className="validationMsg">SSN length should be 9</span>
      );
      myVal.validation = true;
    } else {
      myVal.ssnValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    myVal.emailValField = "";
    this.setState({
      validationModel: myVal,
    });

    console.log("My Validation Model : ", myVal);
    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveProviderCount = 0;
      Swal.fire("Please Select All Fields Properly", "", "error");
      return;
    }

    var newproviderModel = this.state.providerModel;
    newproviderModel.providerSchedule = this.state.providerSchedule;
    axios
      .post(this.url + "saveprovider", newproviderModel, this.config)
      .then((response) => {
        Swal.fire("Record Saved Successfully", "", "success");

        this.setState({ loading: false, providerModel: response.data });
        this.saveProviderCount = 0;
        try {
          //GetProviders
          axios
            .get(this.commonUrl + "GetProvider", this.config)
            .then((response) => {
              this.saveProviderCount = 0;

              this.props.ProviderAction(
                this.props,
                response.data,
                "PROVIDER_ACTION"
              );
            })
            .catch((error) => {
              this.saveProviderCount = 0;
            });
        } catch {
          this.saveProviderCount = 0;
        }
      })
      .catch((error) => {
        this.saveProviderCount = 0;

        this.setState({ loading: false });
        try {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              } else if (error.response.status == 404) {
                Swal.fire("Not Found", "Failed With Status Code 404", "error");
                return;
              } else if (error.response.status == 400) {
                if (error.response.data.Email) {
                  if (error.response.data.Email[0]) {
                    Swal.fire("", "Please enter valid email", "error");
                    myVal.emailValField = (
                      <span className="validationMsg">
                        Please Enter Valid Email ID
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
                  return
                } else {
                  Swal.fire("Something Wrong", error.response.data, "error");
                  return;
                }
              } else {
                Swal.fire("Something Wrong", "", "error");
                return;
              }
            }
          } else {
            Swal.fire("Something Wrong", "Please Try Again", "error");
            return;
          }
        } catch {}
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

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  handletaxonomyCodeChange(event) {
    if (event) {
      this.setState({
        taxonomyCode: event,
        // taxonomyCodeobj: event.id,
        providerModel: {
          ...this.state.providerModel,
          taxonomyCode: event.value,
        },
      });
    } else {
      this.setState({
        taxonomyCode: null,
        // taxonomyCodeobj: event.id,
        providerModel: {
          ...this.state.providerModel,
          taxonomyCode: null,
        },
      });
    }
  }

  openhistorypopup = (id) => {
    console.log("history")
    this.setState({ showPopup: true, id: id });
  };

  closehistoryPopup = () => {
    // $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  handleSameAsAddress = (event) => {
    let Checked = !this.state.Checked;
    // this.setState ({ isChecked:isChecked }) ;
    this.setState({ Checked: Checked });

    if (Checked) {
      // alert("Click")
      this.setState({
        providerModel: {
          ...this.state.providerModel,
          payToAddress1: this.state.providerModel.address1,
          payToAddress2: this.state.providerModel.address2,
          payToCity: this.state.providerModel.city,
          payToState: this.state.providerModel.state,
          payToZipCode: this.state.providerModel.zipCode,
          payofficePhoneNum: this.state.providerModel.officePhoneNum,
        },
      });
    } else {
      // alert("Not Click")

      this.setState({
        providerModel: {
          ...this.state.providerModel,
          payToAddress1: "",
          payToAddress2: "",
          payToCity: "",
          payToState: "",
          payToZipCode: "",
          payofficePhoneNum: "",
        },
      });
    }
  };

  async addPlanRow(event) {
    event.preventDefault();
    const insuranceBillingoption = { ...this.insuranceBillingoption };
    insuranceBillingoption.providerID = this.state.providerModel.id;
    await this.setState({
      providerModel: {
        ...this.state.providerModel,
        insuranceBillingoption: this.state.providerModel.insuranceBillingoption.concat(
          insuranceBillingoption
        ),
      },
    });
  }

  reportTaxIDcheck(event, id) {
    let newProviderList = this.state.providerModel.insuranceBillingoption;

    newProviderList[id].reportTaxID = !newProviderList[id].reportTaxID;

    this.setState({
      providerModel: {
        ...this.state.providerModel,
        insuranceBillingoption: newProviderList,
      },
    });
  }

  //Handle Time Change
  async handleTimeChange(id, time, fieldName) {
    if (
      this.state.providerSchedule[0].locationID == null ||
      this.state.providerSchedule[0].locationID == 0
    ) {
      Swal.fire("Select Location");
      return;
    }

    var dummyDate = "2019-11-11";
    if (fieldName == "fromTime") {
      dummyDate =
        this.state.providerSchedule.fromTime != ""
          ? moment(this.state.providerSchedule.fromTime).format().slice(0, 10)
          : "2019-11-11";
    } else if (fieldName == "toTime") {
      dummyDate =
        this.state.providerSchedule.toTime != ""
          ? moment(this.state.providerSchedule.toTime).format().slice(0, 10)
          : "2019-11-11";
    } else if (fieldName == "breakfrom") {
      dummyDate =
        this.state.providerSchedule.breakfrom != ""
          ? moment(this.state.providerSchedule.breakfrom).format().slice(0, 10)
          : "2019-11-11";
    } else if (fieldName == "breakto") {
      dummyDate =
        this.state.providerSchedule.breakto != ""
          ? moment(this.state.providerSchedule.breakto).format().slice(0, 10)
          : "2019-11-11";
    }

    let newProviderScheduler = this.state.providerSchedule;

    var a = moment(time);
    var model = this.state.providerSchedule;
    var newTime = dummyDate + a.format().slice(10, 19);
    // const index = event.target.id;
    // const name = event.target.name;
    newProviderScheduler[id][fieldName] = newTime;
    this.setState({
      // providerModel: {
      //   ...this.state.providerModel,
      providerSchedule: newProviderScheduler,
      // }
    });
  }

  handleScheduleChange(event) {
    event.preventDefault();

    let newProviderScheduler = this.state.providerSchedule;

    const index = event.target.id;
    const name = event.target.name;
    if (this.state.editId > 0) {
      newProviderScheduler[index].id = newProviderScheduler[index].id;
    } else {
      newProviderScheduler[index].id = 0;
    }
    newProviderScheduler[index][name] = event.target.value;
    // newProviderScheduler[index].locationID = null;
    this.setState({
      // providerModel: {
      //   ...this.state.providerModel,
      providerSchedule: newProviderScheduler,
      // }
    });
  }

  selectALL(event, id) {
    let newProviderSchedule = this.state.providerSchedule;

    if (newProviderSchedule[id].chk == true) {
      newProviderSchedule[id].inActive = true;
    } else {
      newProviderSchedule[id].inActive = !newProviderSchedule[id].inActive;
    }
    newProviderSchedule[id].chk = !newProviderSchedule[id].chk;
    newProviderSchedule[id].providerID = this.state.editId
      ? this.state.editId
      : this.state.providerModel.id;

    this.setState({
      // providerModel: {
      //   ...this.state.providerModel,
      providerSchedule: newProviderSchedule,
      // }
    });
  }

  handleplanModelChange = (event) => {
    event.preventDefault();

    let newProviderList = this.state.providerModel.insuranceBillingoption;

    const index = event.target.id;
    const name = event.target.name;
    newProviderList[index][name] = event.target.value;

    this.setState({
      providerModel: {
        ...this.state.providerModel,
        insuranceBillingoption: newProviderList,
      },
    });
  };

  handleLocationChange(event) {
    this.setState({
      providerModel: {
        ...this.state.providerModel,
        userLocations: event.target.value,
      },
    });

    var locationID = event.target.value;
    var providerID = this.state.providerModel.id;
    var providerID = this.state.editId ? this.state.editId : 0;

    try {
      axios
        .get(this.providerScheduleUrl + "FindProviderSchedule/", {
          params: {
            locationID: event.target.value,
            providerID: providerID,
          },
          headers: {
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*",
          },
        })
        .then((response) => {
          var providerSchedule = response.data;

          for (var i = 0; i < response.data.length; i++) {
            providerSchedule[i].locationID = locationID;

            if (this.state.editId > 0) {
              providerSchedule[i].providerID = this.state.editId
                ? this.state.editId
                : this.state.providerModel.id;
            }

            if (
              providerSchedule[i].addedBy == null ||
              providerSchedule[i].addedBy == ""
            ) {
              providerSchedule[i].id = 0;
            } else {
              providerSchedule[i].id = response.data[i].id;
              // if(providerSchedule[i].id = response.data[i].id){
              providerSchedule[i].chk = true;
              // }
            }
          }

          this.setState({
            providerSchedule: providerSchedule,
          });
        })

        .catch((error) => {});
    } catch {}
  }

  handleplanModellocChange(event, index) {
    let newProviderList = this.state.providerModel.insuranceBillingoption;
    if (event) {
      newProviderList[index].locationID = event.id;
      newProviderList[index].userlocationobj = event;

      this.setState({
        providerModel: {
          ...this.state.providerModel,
          insuranceBillingoption: newProviderList,
        },
      });
    } else {
      newProviderList[index].locationID = null;
      newProviderList[index].userlocationobj = null;

      this.setState({
        providerModel: {
          ...this.state.providerModel,
          insuranceBillingoption: newProviderList,
        },
      });
    }
  }

  handleplanModelInsChange(event, index) {
    let newProviderList = this.state.providerModel.insuranceBillingoption;
    if (event) {
      newProviderList[index].insurancePlanID = event.id;
      newProviderList[index].insurancePlanobj = event;

      this.setState({
        providerModel: {
          ...this.state.providerModel,
          insuranceBillingoption: newProviderList,
        },
      });
    } else {
      newProviderList[index].insurancePlanID = null;
      newProviderList[index].insurancePlanobj = null;

      this.setState({
        providerModel: {
          ...this.state.providerModel,
          insuranceBillingoption: newProviderList,
        },
      });
    }
  }

  async deleteRow(event, index, RowId) {
    const RowID = RowId;
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
        if (RowID > 0) {
          axios
            .delete(
              this.InsurancOptionurl + "DeleteInsuranceBillingOption/" + RowID,
              this.config
            )
            .then((response) => {
              Swal.fire("Record Deleted Successfully", "", "success");
              let insuranceBillingoption = [
                ...this.state.providerModel.insuranceBillingoption,
              ];
              insuranceBillingoption.splice(id, 1);
              this.setState({
                providerModel: {
                  ...this.state.providerModel,
                  insuranceBillingoption: insuranceBillingoption,
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
          let insuranceBillingoption = [
            ...this.state.providerModel.insuranceBillingoption,
          ];
          insuranceBillingoption.splice(id, 1);
          this.setState({
            providerModel: {
              ...this.state.providerModel,
              insuranceBillingoption: insuranceBillingoption,
            },
          });
        }
      }
    });
  }

  onPaste(event) {
    var x = event.target.value;
    x = x.trim();

    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        providerModel: {
          ...this.state.providerModel,
          [event.target.name]: x,
        },
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("Error", "Should be Number", "error");
      return;
    } else {
      this.setState({
        providerModel: {
          ...this.state.providerModel,
          [event.target.name]: x,
        },
      });
    }
  }

  handleTabCheck = (tabID) => {
    const checkedTab =
      this.state.checkedTab != tabID ? tabID : this.state.checkedTab;
    this.setState({ checkedTab: checkedTab });
  };
  render() {
    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    const isActive = this.state.providerModel.isActive;
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
      { value: "MR", display: "MR" },
      { value: "MRS", display: "MRS" },
    ];

    const payToAddressdrop = [
      { value: "None", display: "None" },
      { value: "Provider", display: "Provider" },
      { value: "Practice", display: "Practice" },
    ];

    const timeInterval = [
      { value: "Please Select", display: "Please Select" },
      { value: "10", display: "10 mints" },
      { value: "15", display: "15 mints" },
      { value: "20", display: "20 mints" },
      { value: "25", display: "25 mints" },
      { value: "30", display: "30 mints" },
    ];

    //Insurance billin gGrid Data
    let newList = [];
    var patientPlanData = {};
    this.state.providerModel.insuranceBillingoption.map((row, index) => {
      newList.push({
        location: (
          <div style={{ width: "150px" }}>
            <Select
              type="text"
              max="10"
              value={
                this.state.providerModel.insuranceBillingoption[index]
                  .userlocationobj
              }
              name="locationID"
              id={index}
              onChange={(event) => this.handleplanModellocChange(event, index)}
              options={this.state.userLocations}
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
                  width: "115%",
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
                  height: "30px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            {this.state.providerModel.insuranceBillingoption[index].locationVal}
          </div>
        ),
        insurancePlan: (
          <div style={{ width: "150px" }}>
            <Select
              type="text"
              max="10"
              value={
                this.state.providerModel.insuranceBillingoption[index]
                  .insurancePlanobj
              }
              name="insurancePlanID"
              id={index}
              onChange={(event) => this.handleplanModelInsChange(event, index)}
              options={this.props.insurancePlans}
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
                  width: "115%",
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
                  height: "30px",
                  borderColor: "#C6C6C6",
                  boxShadow: "none",
                  borderColor: "#C6C6C6",
                  "&:hover": {
                    borderColor: "#C6C6C6",
                  },
                }),
              }}
            />
            {
              this.state.providerModel.insuranceBillingoption[index]
                .insurancePlanIDVal
            }
          </div>
        ),
        reportTaxId: (
          <div style={{ paddingLeft: "50px" }}>
            <input
              style={{ width: "20px", height: "20px" }}
              className="checkbox"
              type="checkbox"
              id={index}
              name="reportTaxID"
              checked={
                this.state.providerModel.insuranceBillingoption[index]
                  .reportTaxID
              }
              onClick={(event) => this.reportTaxIDcheck(event, index)}
            />
          </div>
        ),
        payToAddress: (
          <div>
            <select
              class="text-primary"
              style={{ width: "150px", fontSize: "12px", padding: "2px" }}
              name="payToAddress"
              id={index}
              value={
                this.state.providerModel.insuranceBillingoption[index]
                  .payToAddress
              }
              onChange={this.handleplanModelChange}
            >
              {payToAddressdrop.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>

            {this.state.providerModel.insuranceBillingoption[index].payaddVal}
          </div>
        ),
        remove: (
          <div >
            <button
              className="close"
              type="button"
              aria-label="Close"
              style={{ margin: "0px", padding: "0px" }}
              name="deleteCPTBtn"
              id={index}
              onClick={(event, index) => this.deleteRow(event, index, row.id)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ),
      });
    });
    patientPlanData = {
      columns: [
        {
          label: "LOCATION",
          field: "location",
          sort: "asc",
          width: 150,
        },
        {
          label: "INSURANCE PLAN",
          field: "insurancePlan",
          sort: "asc",
          width: 150,
        },
        {
          label: "REPORT TAX ID",
          field: "reportTaxId",
          sort: "asc",
          width: 150,
        },
        {
          label: "PAY TO ADDRESS",
          field: "payToAddress",
          sort: "asc",
          width: 150,
        },
        {
          label: "",
          field: "remove",
          sort: "asc",
          width: 150,
        },
      ],
      rows: newList,
    };

    //Provider Scheduler Grid
    var providerSchedulerGrid = {};
    let schedulernewList = [];

    this.state.providerSchedule = this.state.providerSchedule
      ? this.state.providerSchedule
      : [];
    this.state.providerSchedule.map((row, index) => {
      schedulernewList.push({
        chk: (
          <div
            class="lblChkBox"
            onClick={(event) => this.selectALL(event, index)}
          >
            <input
            style={{marginLeft:"7px" , height:"15px" , width:"15px"}}
              type="checkbox"
              id={index}
              name="chk"
              //  onChange={this.selectALL}
              // checked={this.state.providerModel.providerSchedule[index].chk}
              checked={this.state.providerSchedule[index].chk}
            />
            <label for="chk">
              <span></span>
            </label>
          </div>
        ),
        weekday: this.state.providerSchedule[index].dayofWeek,
        fromTime: (
          <div style={{ width: "90%" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="none"
                name="fromTime"
                id={index}
                value={this.state.providerSchedule[index].fromTime}
                onChange={this.handleScheduleChange}
                label=""
                format="hh:mm:ss a"
                placeholder="08:00:00 AM"
                mask="__:__:__ _M"
                views={["hours", "minutes", "seconds"]}
                onChange={(time) => {
                  this.handleTimeChange(index, time, "fromTime");
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        ),
        toTime: (
          <div style={{ width: "90%" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="none"
                name="toTime"
                id={index}
                // value={this.state.providerModel.providerSchedule[index].toTime}
                value={this.state.providerSchedule[index].toTime}
                onChange={this.handleScheduleChange}
                label=""
                format="hh:mm:ss a"
                placeholder="08:00:00 AM"
                mask="__:__:__ _M"
                views={["hours", "minutes", "seconds"]}
                onChange={(time) => {
                  this.handleTimeChange(index, time, "toTime");
                }}
              />
            </MuiPickersUtilsProvider>
            {this.state.providerSchedule[index].toTimeVal}
          </div>
        ),
        timeInterval: (
          <div style={{ width: "150px" }}>
            <select
              class=" text-primary"
              style={{ width: "90%", fontSize: "12px", padding: "2px" }}
              name="timeInterval"
              id={index}
              value={this.state.providerSchedule[index].timeInterval}
              onChange={this.handleScheduleChange}
            >
              {timeInterval.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>
          </div>
        ),
        breakfrom: (
          <div style={{ width: "100%" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="none"
                name="breakfrom"
                id={index}
                value={this.state.providerSchedule[index].breakfrom}
                onChange={this.handleScheduleChange}
                label=""
                format="hh:mm:ss a"
                placeholder="08:00:00 AM"
                mask="__:__:__ _M"
                views={["hours", "minutes", "seconds"]}
                onChange={(time) => {
                  this.handleTimeChange(index, time, "breakfrom");
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        ),
        breakto: (
          <div style={{ width: "100%" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="none"
                name="breakto"
                id={index}
                value={this.state.providerSchedule[index].breakto}
                onChange={this.handleScheduleChange}
                label=""
                format="hh:mm:ss a"
                placeholder="08:00:00 AM"
                mask="__:__:__ _M"
                views={["hours", "minutes", "seconds"]}
                onChange={(time) => {
                  this.handleTimeChange(index, time, "breakto");
                }}
              />
            </MuiPickersUtilsProvider>
            {this.state.providerSchedule[index].breaktoVal}
          </div>
        ),
      });
    });

    providerSchedulerGrid = {
      columns: [
        {
          label: "",
          field: "chk",
          sort: "asc",
          // width: 150
        },

        {
          label: "DAY",
          field: "weekday",
          sort: "asc",
          // width: 150
        },
        {
          label: "FROM TIME",
          field: "fromTime",
          sort: "asc",
          // width: 150
        },
        {
          label: "TO TIME",
          field: "toTime",
          sort: "asc",
          // width: 150
        },
        {
          label: "SLOTS",
          field: "timeInterval",
          sort: "asc",
          // width: 150
        },
        {
          label: "BREAK FROM",
          field: "breakfrom",
          sort: "asc",
          // width: 150
        },
        {
          label: "BREAK TO",
          field: "breakto",
          sort: "asc",
          // width: 150
        },
      ],
      rows: schedulernewList,
    };

    //Spiner
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

    //Setting Icon
    var Imag;
    Imag = (
      <div>
        <img src={settingIcon} />
      </div>
    );
    //History DropDown
    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onChange={() => this.openhistorypopup(0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />

      


    );

    let popup = "";
      if (this.state.showPopup) {
        console.log("MaxHeight : ", this.state.windowHeight);
        popup = (
          <NewHistoryPractice
            onClose={this.closehistoryPopup}
            historyID={this.state.editId}
            apiURL={this.url}
            // disabled={this.isDisabled(this.props.rights.update)}
            // disabled={this.isDisabled(this.props.rights.add)}
          ></NewHistoryPractice>
        );
      } else {
        popup = <React.Fragment></React.Fragment>;
      }
  

    return (
      <React.Fragment>
        <div
          className="modal fade show popupBackScreen"
          id="providerModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div
              className="modal-content"
              style={{ minHeight: "300px", height: this.state.windowHeight }}
            >
              <div className="modal-header ">
                {spiner}
                {/* <div className=" "> */}

                <ul
                  className="tabs"
                  role="tablist"
                  style={{ borderBottom: "1px solid #d8526b" }}
                >
                  <li class="float-right">
                    {spiner}
                    <div class="float-lg-right text-right">
                      <input class="checkbox" type="checkbox" />
                      Mark Inactive
                      <button
                        style={{
                          height: "24px",
                          fontSize: "11px",
                          paddingTop: "0px",
                          paddingBottom: "0px",
                        }}
                        class="btn btn-primary mr-2 ml-2"
                        type="button"
                        onClick={this.delete}
                      >
                        Delete
                      </button>
                      {this.state.editId > 0 ? dropdown : null}
                      <button
                        class="close"
                        type="button"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={() => this.props.onClose()}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  </li>

                  {/* Tab 1 */}
                  <li>
                    <input
                      type="radio"
                      name="tabs"
                      id="tab1"
                      checked={this.state.checkedTab == 1 ? true : false}
                      onClick={() => this.handleTabCheck(1)}
                    />
                    <label
                      for="tab1"
                      role="tab"
                      aria-selected="true"
                      aria-controls="panel1"
                      tabindex="0"
                    >
                      Provider Info
                    </label>
                    <div
                      id="tab-content1"
                      class="tab-content"
                      role="tabpanel"
                      aria-labelledby="description"
                      aria-hidden="false"
                    >
                      <div class="row">
                        <div class="col-md-12 order-md-1 provider-form ">
                          <div class="header pt-1">
                            <h3>My Provider -1</h3>
                          </div>
                          <div
                            class="clearfix"
                            style={{ borderBottom: "1px solid #037592" }}
                          ></div>
                          <br></br>
                          <form
                            class="needs-validation form-group"
                            novalidate=""
                          >
                            <div class="row">
                              <div class="col-md-4 mb-2">
                                <div class="col-md-4 float-left">
                                  <label for="lastName">
                                    Name<span class="text-danger">*</span>
                                  </label>
                                </div>
                                <div class="col-md-8 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Name"
                                    value={this.state.providerModel.name}
                                    name="name"
                                    id="name"
                                    maxLength="60"
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {this.state.validationModel.nameValField}
                                </div>
                              </div>
                              <div class="col-md-4 mb-2">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">Title</label>
                                </div>
                                <div class="col-md-8 float-left">
                                  <select
                                    style={{
                                      borderRadius: "6px",
                                      border: "1px solid rgb(125, 128, 134)",
                                      boxSizing: "border-box",
                                      display: "block",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      height: "30px",
                                      lineHeight: "auto",
                                      outline: "none",
                                      position: "relative",
                                      width: "100%",
                                      paddingLeft: "2px",
                                      paddingBottom: "6px",
                                      paddingTop: "6px",
                                      color: "rgb(67, 75, 93",
                                    }}
                                    name="title"
                                    id="title"
                                    value={this.state.providerModel.title}
                                    onChange={this.handleChange}
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
                              <div class="col-md-4 mb-2">
                                <div class="col-md-4 float-left">
                                  <label for="lastName">
                                    Last Name<span class="text-danger">*</span>
                                  </label>
                                </div>
                                <div class="col-md-8 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Last Name"
                                    name="lastName"
                                    id="lastName"
                                    required=""
                                    maxLength="35"
                                    value={this.state.providerModel.lastName}
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {this.state.validationModel.lastNameValField}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2">
                                <div class="col-md-4 float-left">
                                  <label for="middleInitial">
                                    MI
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="MI"
                                    required=""
                                    maxLength="3"
                                    name="middleInitial"
                                    id="middleInitial"
                                    onChange={this.handleChange}
                                    value={
                                      this.state.providerModel.middleInitial
                                    }
                                  />
                                </div>
                                <div class="invalid-feedback"></div>
                              </div>

                              <div class="col-md-4 mb-2">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    First Name<span class="text-danger">*</span>
                                  </label>
                                </div>
                                <div class="col-md-8 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="First Name"
                                    required=""
                                    value={this.state.providerModel.firstName}
                                    name="firstName"
                                    id="firstName"
                                    maxLength="35"
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {this.state.validationModel.firstNameValField}
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-12 order-md-1 form-group provider-form ">
                          <div class="header pt-1">
                            <h6 class="heading">Legal Information</h6>
                            <hr
                              class="p-0 mt-0 mb-1"
                              style={{ backgroundColor: "#037592" }}
                            ></hr>
                            <div class="clearfix"></div>
                          </div>
                          <br></br>
                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="npi">
                                  NPI<span class="text-danger">*</span>
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="NPI"
                                  required=""
                                  value={this.state.providerModel.npi}
                                  name="npi"
                                  id="npi"
                                  maxLength="10"
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                  onInput={this.onPaste}
                                />
                              </div>
                              <div class="invalid-feedback">
                                {this.state.validationModel.npiValField}
                              </div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="ssn">
                                  SSN
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="SSN*"
                                  required=""
                                  value={this.state.providerModel.ssn}
                                  name="ssn"
                                  id="ssn"
                                  maxLength="9"
                                  onChange={this.handleChange}
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

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="upinNumber">
                                  UPIN
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="UPIN"
                                  required=""
                                  value={this.state.providerModel.upinNumber}
                                  name="upinNumber"
                                  id="upinNumber"
                                  maxLength="20"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="firstName">
                                  Taxonomy Code{" "}
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <Select
                                  type="text"
                                  max="10"
                                  value={this.state.taxonomyCode}
                                  name="taxonomyCode"
                                  id="taxonomyCode"
                                  onChange={(event) =>
                                    this.handletaxonomyCodeChange(event)
                                  }
                                  options={this.props.userInfo1.taxonomy}
                                  placeholder="Taxonomy Code"
                                  isClearable={true}
                                  isSearchable={true}
                                  openMenuOnClick={false}
                                  escapeClearsValue={true}
                                  styles={{
                                    indicatorSeparator: () => {},
                                    clearIndicator: (defaultStyles) => ({
                                      ...defaultStyles,
                                      color: "#286881",
                                    }),
                                    container: (defaultProps) => ({
                                      ...defaultProps,
                                      position: "absolute",
                                      width: "86%",
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
                              </div>
                              <div class="invalid-feedback">
                                {
                                  this.state.validationModel
                                    .taxonomyCodeValField
                                }
                              </div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="deaNumber">
                                  DEA 
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="DEA"
                                  required=""
                                  value={this.state.providerModel.deaNumber}
                                  name="deaNumber"
                                  id="deaNumber"
                                  maxLength="20"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="licenceNumber">
                                  License Number
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="License Number"
                                  Number
                                  required=""
                                  value={this.state.providerModel.licenceNumber}
                                  name="licenceNumber"
                                  id="licenceNumber"
                                  maxLength="20"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="faxNumber">Fax Number</label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Fax Number"
                                  required=""
                                  value={this.state.providerModel.faxNumber}
                                  name="faxNumber"
                                  id="faxNumber"
                                  maxLength="10"
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                  onInput={this.onPaste}
                                />
                              </div>
                              <div class="invalid-feedback">
                                {this.state.validationModel.faxNumberValField}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <br></br>
                      <div class="row">
                        <div class="col-md-12 order-md-1 form-group  provider-form ">
                          <div class="header pt-1">
                            <h6 class="heading">Address Information</h6>
                            <hr
                              class="p-0 mt-0 mb-1"
                              style={{ backgroundColor: "#037592" }}
                            ></hr>
                            <div class="clearfix"></div>
                          </div>
                          <br></br>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="address1">
                                  Address 1
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Address 1"
                                  required=""
                                  value={this.state.providerModel.address1}
                                  name="address1"
                                  id="address1"
                                  maxLength="55"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="address2">Address 2</label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Address 2"
                                  required=""
                                  value={this.state.providerModel.address2}
                                  name="address2"
                                  id="address2"
                                  maxLength="55"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="email">
                                  Email<span class="text-danger">*</span>
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Email"
                                  required=""
                                  value={this.state.providerModel.email}
                                  name="email"
                                  id="email"
                                  maxLength="60"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback">
                                {this.state.validationModel.emailValField}
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="city">
                                  City 
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="City"
                                  required=""
                                  value={this.state.providerModel.city}
                                  name="city"
                                  id="city"
                                  max="20"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="firstName">
                                  State 
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <select
                                  style={{
                                    borderRadius: "6px",
                                    border: "1px solid rgb(125, 128, 134)",
                                    boxSizing: "border-box",
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    height: "30px",
                                    lineHeight: "auto",
                                    outline: "none",
                                    position: "relative",
                                    width: "100%",
                                    paddingLeft: "2px",
                                    paddingBottom: "6px",
                                    paddingTop: "6px",
                                    color: "rgb(67, 75, 93",
                                  }}
                                  name="state"
                                  id="state"
                                  value={this.state.providerModel.state}
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

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="zipCode">
                                  Zip Code
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Zip Code"
                                  required=""
                                  value={this.state.providerModel.zipCode}
                                  name="zipCode"
                                  id="zipCode"
                                  maxLength="9"
                                  onChange={this.handleZip}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                />
                              </div>
                              <div class="invalid-feedback">
                                {this.state.validationModel.zipCodeValField}
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="faxNumber">Fax</label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Fax"
                                  required=""
                                  value={this.state.providerModel.faxNumber}
                                  name="faxNumber"
                                  id="faxNumber"
                                  maxLength="10"
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                  onInput={this.onPaste}
                                />
                              </div>
                              <div class="invalid-feedback">
                                {this.state.validationModel.faxNumber}
                              </div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="firstName">Phone</label>
                              </div>
                              <div class="col-md-8 float-left">
                                <NumberFormat
                                class="provider-form w-100 form-control-user"
                                  format="00 (###) ###-####"
                                  mask="_"
                                  type="text"
                                  value={
                                    this.state.providerModel.officePhoneNum
                                  }
                                  placeholder="Phone "
                                  max="10"
                                  name="officePhoneNum"
                                  id="officePhoneNum"
                                  onChange={this.handleChange}
                                  // onKeyPress={event => this.handleNumericCheck(event)}
                                />
                              </div>
                              <div class="invalid-feedback">
                                {
                                  this.state.validationModel
                                    .officePhoneNumValField
                                }
                              </div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="firstName">Extension</label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Extension"
                                  required=""
                                  value={this.state.providerModel.phoneNumExt}
                                  maxLength="4"
                                  name="phoneNumExt"
                                  id="phoneNumExt"
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                  onInput={this.onPaste}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>

                          <div class="row">
                          <div class="col-md-12 mb-2" style={{paddingLeft:"43px"}}>
                              <div class="col-md-1 float-left">
                                <label for="notes" >Notes</label>
                              </div>
                              <div class="col-md-11  float-left">
                                <textarea
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Notes"
                                  required=""
                                  name="notes"
                                  id="notes"
                                  // cols="30"
                                  // rows="10"
                                  value={this.state.providerModel.notes}
                                  onChange={this.handleChange}
                                ></textarea>
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-12 order-md-1 form-group provider-form ">
                              <div class="header pt-1">
                                <h6 class="heading">Pay to Address</h6>
                                <div class="float-lg-right text-right">
                                  <input
                                    class="checkbox"
                                    type="checkbox"
                                    id="sameAsAddress"
                                    name="sameAsAddress"
                                    checked={this.state.Checked}
                                    onChange={this.handleSameAsAddress}
                                  />
                                  Same as Address
                                  {/* <a href="">Same as Address</a> */}
                                </div>

                                <hr
                                  class="p-0 mt-0 mb-1"
                                  style={{ backgroundColor: "#037592" }}
                                ></hr>

                                <div class="clearfix"></div>
                              </div>
                              <br></br>

                              <div class="row">
                                <div class="col-md-4 mb-2">
                                  <div class="col-md-4 float-left">
                                    <label for="payToAddress1">
                                      Address 1
                                      {/* <span class="text-danger">*</span> */}
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      class="provider-form w-100 form-control-user"
                                      placeholder="Address 1"
                                      required=""
                                      value={
                                        this.state.providerModel.payToAddress1
                                      }
                                      name="payToAddress1"
                                      id="payToAddress1"
                                      max="55"
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                  <div class="invalid-feedback"></div>
                                </div>

                                <div class="col-md-4 mb-2">
                                  <div class="col-md-4 float-left">
                                    <label for="payToAddress2">Address 2</label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      class="provider-form w-100 form-control-user"
                                      placeholder="Address 2"
                                      required=""
                                      value={
                                        this.state.providerModel.payToAddress2
                                      }
                                      name="payToAddress2"
                                      id="payToAddress2"
                                      max="55"
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                  <div class="invalid-feedback"></div>
                                </div>

                                <div class="col-md-4 mb-2">
                                  <div class="col-md-4 float-left">
                                    <label for="payofficePhoneNum">
                                      Phone
                                      {/* <span class="text-danger">*</span> */}
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      class="provider-form w-100 form-control-user"
                                      placeholder="Phone"
                                      required=""
                                      value={
                                        this.state.providerModel
                                          .payofficePhoneNum
                                      }
                                      name="officePhoneNum"
                                      id="officePhoneNum"
                                      max="10"
                                      onChange={this.handleChange}
                                      onKeyPress={(event) =>
                                        this.handleNumericCheck(event)
                                      }
                                    />
                                  </div>
                                  <div class="invalid-feedback">
                                    {
                                      this.state.validationModel
                                        .officePhoneNumValField
                                    }
                                  </div>
                                </div>
                              </div>

                              <div class="row">
                                <div class="col-md-4 mb-2">
                                  <div class="col-md-4 float-left">
                                    <label for="payToCity">
                                      City 
                                      {/* <span class="text-danger">*</span> */}
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      class="provider-form w-100 form-control-user"
                                      placeholder="City"
                                      required=""
                                      value={this.state.providerModel.payToCity}
                                      name="payToCity"
                                      id="payToCity"
                                      max="20"
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                  <div class="invalid-feedback"></div>
                                </div>

                                <div class="col-md-4 mb-2">
                                  <div class="col-md-4 float-left">
                                    <label for="firstName">
                                      State
                                       {/* <span class="text-danger">*</span> */}
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <select
                                      style={{
                                        borderRadius: "6px",
                                        border: "1px solid rgb(125, 128, 134)",
                                        boxSizing: "border-box",
                                        display: "block",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        height: "30px",
                                        lineHeight: "auto",
                                        outline: "none",
                                        position: "relative",
                                        width: "100%",
                                        paddingLeft: "2px",
                                        paddingBottom: "6px",
                                        paddingTop: "6px",
                                        color: "rgb(67, 75, 93",
                                      }}
                                      name="payToState"
                                      id="payToState"
                                      value={
                                        this.state.providerModel.payToState
                                      }
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

                                <div class="col-md-4 mb-2">
                                  <div class="col-md-4 float-left">
                                    <label for="payToZipCode">
                                      Zip Code
                                      {/* <span class="text-danger">*</span> */}
                                    </label>
                                  
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      class="provider-form w-100 form-control-user"
                                      placeholder="Zip Code"
                                      required=""
                                      value={
                                        this.state.providerModel.payToZipCode
                                      }
                                      name="payToZipCode"
                                      id="payToZipCode"
                                      max="9"
                                      onChange={this.handleZip}
                                      onKeyPress={(event) =>
                                        this.handleNumericCheck(event)
                                      }
                                    />
                                  </div>
                                  <div class="invalid-feedback">
                                    {this.state.validationModel.zipCodeValField}
                                  </div>
                                </div>
                              </div>

                              <div id="content">
                                <button
                                  id="sidebarToggleTop"
                                  class="btn btn-link d-md-none rounded-circle mr-3"
                                >
                                  {" "}
                                  <i class="fa fa-bars"></i>{" "}
                                </button>
                                <div class="topbar-divider d-none d-sm-block"></div>
                                <div class="container-fluid ml-n3 mr-n3"> </div>
                              </div>
                              <br></br>

                              <hr></hr>
                              <div class="col-12 text-center">
                                <button
                                  class="btn btn-primary mr-2"
                                  type="button"
                                  onClick={this.saveNewProvider}
                                >
                                  Save
                                </button>
                                <button
                                  class="btn btn-primary mr-2"
                                  type="button"
                                  onClick={() => this.props.onClose()}
                                >
                                  Cancel
                                </button>
                              </div>
                              <br></br>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Insuranc eBillng */}
                  <li>
                    <input
                      type="radio"
                      name="tabs"
                      id="tab2"
                      checked={this.state.checkedTab == 2 ? true : false}
                      onClick={() => this.handleTabCheck(2)}
                    />
                    <label
                      for="tab2"
                      role="tab"
                      aria-selected="false"
                      aria-controls="panel2"
                      tabindex="1"
                    >
                      Insurance Billing
                    </label>

                    <div
                      style={{ marginLeft: "-95px" }}
                      id="tab-content2"
                      class="tab-content"
                      role="tabpanel"
                      aria-labelledby="specification"
                      aria-hidden="true"
                    >
                      <br></br>

                      <div class="card mb-2">
                        <div class="card-header py-3">
                          <h6 class="m-0 font-weight-bold text-primary search-h">
                            Insurance Billing Option
                          </h6>
                          <div class="float-lg-right text-right">
                            <input class="checkbox" type="checkbox" />
                            Bill Under Provider
                            <a
                              href=""
                              style={{ marginTop: "-6px" }}
                              className="btn-search btn-primary btn-user"
                              onClick={this.addPlanRow}
                            >
                              {" "}
                              Add Row
                            </a>
                          </div>
                        </div>

                        <div class="card-body">
                          <div class="table-responsive">
                            <div
                              id="dataTable_wrapper"
                              class="dataTables_wrapper dt-bootstrap4"
                            >
                              <MDBDataTable
                                responsive={true}
                                striped
                                bordered
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
                  </li>

                

                  <li>
                    <input
                      type="radio"
                      name="tabs"
                      id="tab4"
                      checked={this.state.checkedTab == 4 ? true : false}
                      onClick={() => this.handleTabCheck(4)}
                    />
                    <label
                      for="tab4"
                      role="tab"
                      aria-selected="false"
                      aria-controls="panel4"
                      tabindex="3"
                    >
                      Provider Scheduler
                    </label>
                    <div
                      style={{ marginLeft: "-197px" }}
                      id="tab-content4"
                      class="tab-content"
                      role="tabpanel"
                      aria-labelledby="specification"
                      aria-hidden="true"
                    >
                      <br></br>
                      <div class="card mb-4">
                        <div class="card-header py-3">
                          <h6 class="m-0 col-md-4 float-left font-weight-bold text-primary search-h">
                            Scheduler Setting
                          </h6>
                          <div class="float-lg-right">
                            Location
                            <select
                              class="float-lg-right text-primary"
                              style={{ fontSize: "12px", padding: "2px" }}
                              name="userLocations"
                              id="userLocations"
                              value={this.state.providerModel.userLocations}
                              onChange={this.handleLocationChange}
                            >
                              {this.state.userLocations.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.description}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div class="card-body">
                          <div class="table-responsive">
                            <div
                              id="dataTable_wrapper"
                              class="dataTables_wrapper dt-bootstrap4"
                            >
                              <MDBDataTable
                                responsive={true}
                                striped
                                bordered
                                searching={false}
                                data={providerSchedulerGrid}
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
                  </li>
                
                  {/* <li>
                    <input
                      type="radio"
                      name="tabs"
                      id="tab3"
                      checked={this.state.checkedTab == 3 ? true : false}
                      onClick={() => this.handleTabCheck(3)}
                    />
                    <label
                      for="tab3"
                      role="tab"
                      aria-selected="false"
                      aria-controls="panel3"
                      tabindex="2"
                    >
                      Scheduler Setting
                    </label>
                    <div
                      style={{ marginLeft: "-323px" }}
                      id="tab-content3"
                      class="tab-content"
                      role="tabpanel"
                      aria-labelledby="specification"
                      aria-hidden="true"
                    >
                      <br></br>
                      <div class="card mb-4">
                        <div class="card-header py-3">
                          <h6 class="m-0 col-md-4 float-left font-weight-bold text-primary search-h">
                            Scheduler Setting
                          </h6>
                          <div class="float-lg-right">
                            <a class="pr-1" href="#">
                              Location
                            </a>
                            <select
                              class="float-lg-right text-primary"
                              style={{ fontSize: "12px", padding: "2px" }}
                            >
                              <option value="0">Select car:</option>
                              <option value="1">Audi</option>
                              <option value="2">BMW</option>
                              <option value="3">Citroen</option>
                              <option value="4">Ford</option>
                              <option value="5">Honda</option>
                              <option value="6">Jaguar</option>
                              <option value="7">Land Rover</option>
                              <option value="8">Mercedes</option>
                              <option value="9">Mini</option>
                              <option value="10">Nissan</option>
                              <option value="11">Toyota</option>
                              <option value="12">Volvo</option>
                            </select>
                          </div>
                        </div>
                        <div class="card-body">
                          <div class="table-responsive">
                            <div
                              id="dataTable_wrapper"
                              class="dataTables_wrapper dt-bootstrap4"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li> */}
                </ul>
                {/* </div> */}
                <a className="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i className="fas fa-angle-up"></i>{" "}
                </a>
                {popup}
              </div>
            </div>
          </div>
        </div>
      
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
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
          search: state.loginInfo.rights.providerSearch,
          add: state.loginInfo.rights.providerCreate,
          update: state.loginInfo.rights.providerEdit,
          delete: state.loginInfo.rights.providerDelete,
          export: state.loginInfo.rights.providerExport,
          import: state.loginInfo.rights.providerImport,
        }
      : [],
    taxonomyCode:
      state.loginInfo.taxonomy == null ? [] : state.loginInfo.taxonomy,
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
      userInfo: userInfo,
      taxonomyCodeAction: taxonomyCodeAction,
      ProviderAction: ProviderAction,
    },
    dispatch
  );
}
export default connect(mapStateToProps, matchDispatchToProps)(NewProvider);
