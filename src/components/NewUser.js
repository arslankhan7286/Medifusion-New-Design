import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import axios from "axios";
import Input from "./Input";
import leftNavMenusReducer from "../reducers/leftNavMenusReducer";
import Swal from "sweetalert2";
import { Tabs, Tab } from "react-tab-view";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
  MDBCollapse,
} from "mdbreact";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import ResetPassword from "./ResetPassword";

import Hotkeys from "react-hot-keys";

export class NewUser extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/account/";
    this.assignPracticesUrl = process.env.REACT_APP_URL + "/userPractices/";
    this.errorField = "errorField";
    this.userRightsUrl = process.env.REACT_APP_URL + "/Rights/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.savePatientCount = 0;

    this.userModel = {
      id: 0,
      firstName: "",
      lastName: "",
      clientID: null,
      userRole: "",
      email: "",
      password: "",
      cnfrmPass: "",
      practiceID: null,
      teamID: null,
      designationID: null,
      reportingTo: null,
      isActive: false,
    };

    this.userPracticesModel = {
      clientID: null,
      practiceID: null,
      currentUserID: null,
      email: "",
      status: false,
      clientName: "",
      practiceName: "",
    };

    this.validationModel = {
      firstNameValField: "",
      lastNameValField: "",
      clientValField: "",
      roleValField: "",
      emailValField: "",
      passwordValField: "",
      cnfrmPassValField: "",
      practiceValField: "",
      userClientValField: "",
      userPracticeValField: "",
      reportingToValField: "",
      validation: false,
      cnfrmValField: "",
    };

    this.userRights = {
      //Scheduler Rights
      schedulerCreate: false,
      schedulerEdit: false,
      schedulerDelete: false,
      schedulerSearch: false,
      schedulerImport: false,
      schedulerExport: false,
      // Patient Rights
      patientCreate: false,
      patientEdit: false,
      patientDelete: false,
      patientSearch: false,
      patientImport: false,
      patientExport: false,
      //Charges Rights
      chargesCreate: false,
      chargesEdit: false,
      chargesDelete: false,
      chargesSearch: false,
      chargesImport: false,
      chargesExport: false,
      resubmitCharges: false,
      //Documents Rights
      documentsCreate: false,
      documentsEdit: false,
      documentsDelete: false,
      documentsSearch: false,
      documentsImport: false,
      documentsExport: false,
      //Submissions Rights
      submissionsCreate: false,
      submissionsEdit: false,
      submissionsDelete: false,
      submissionsSearch: false,
      submissionsImport: false,
      submissionsExport: false,
      //Payments Rights
      paymentsCreate: false,
      paymentsEdit: false,
      paymentsDelete: false,
      paymentsSearch: false,
      paymentsImport: false,
      paymentsExport: false,
      //Followup Rights
      followupCreate: false,
      followupEdit: false,
      followupDelete: false,
      followupSearch: false,
      followupImport: false,
      followupExport: false,
      //Reports Rights
      reportsCreate: false,
      reportsEdit: false,
      reportsDelete: false,
      reportsSearch: false,
      reportsImport: false,
      reportsExport: false,
      //Client Rights
      clientCreate: false,
      clientEdit: false,
      clientDelete: false,
      clientSearch: false,
      clientImport: false,
      clientExport: false,
      userCreate: false,
      userEdit: false,
      userDelete: false,
      userSearch: false,
      userImport: false,
      userExport: false,
      //Practice
      practiceCreate: false,
      practiceEdit: false,
      practiceDelete: false,
      practiceSearch: false,
      practiceImport: false,
      practiceExport: false,
      //Location
      locationCreate: false,
      locationEdit: false,
      locationDelete: false,
      locationSearch: false,
      locationImport: false,
      locationExport: false,
      //Provider
      providerCreate: false,
      providerEdit: false,
      providerDelete: false,
      providerSearch: false,
      providerImport: false,
      providerExport: false,
      //Referring Provider
      referringProviderCreate: false,
      referringProviderEdit: false,
      referringProviderDelete: false,
      referringProviderSearch: false,
      referringProviderImport: false,
      referringProviderExport: false,
      //Insurance
      insuranceCreate: false,
      insuranceEdit: false,
      insuranceDelete: false,
      insuranceSearch: false,
      insuranceImport: false,
      insuranceExport: false,
      //Insurance Plan
      insurancePlanCreate: false,
      insurancePlanEdit: false,
      insurancePlanDelete: false,
      insurancePlanSearch: false,
      insurancePlanImport: false,
      insurancePlanExport: false,
      //Insurance Plan Address
      insurancePlanAddressCreate: false,
      insurancePlanAddressEdit: false,
      insurancePlanAddressDelete: false,
      insurancePlanAddressSearch: false,
      insurancePlanAddressImport: false,
      insurancePlanAddressExport: false,
      //EDI Submit
      eDISubmitCreate: false,
      eDISubmitEdit: false,
      eDISubmitDelete: false,
      eDISubmitSearch: false,
      eDISubmitImport: false,
      eDISubmitExport: false,
      //EDI EligiBility
      eDIEligiBilityCreate: false,
      eDIEligiBilityEdit: false,
      eDIEligiBilityDelete: false,
      eDIEligiBilitySearch: false,
      eDIEligiBilityImport: false,
      eDIEligiBilityExport: false,
      //EDI Status
      eDIStatusCreate: false,
      eDIStatusEdit: false,
      eDIStatusDelete: false,
      eDIStatusSearch: false,
      eDIStatusImport: false,
      eDIStatusExport: false,
      //ICD
      iCDCreate: false,
      iCDEdit: false,
      iCDDelete: false,
      iCDSearch: false,
      iCDImport: false,
      iCDExport: false,
      //CPT
      cPTCreate: false,
      cPTEdit: false,
      cPTDelete: false,
      cPTSearch: false,
      cPTImport: false,
      cPTExport: false,
      //Modifiers
      modifiersCreate: false,
      modifiersEdit: false,
      modifiersDelete: false,
      modifiersSearch: false,
      modifiersImport: false,
      modifiersExport: false,
      //POS
      pOSCreate: false,
      pOSEdit: false,
      pOSDelete: false,
      pOSSearch: false,
      pOSImport: false,
      pOSExport: false,
      //Claim Status Category Codes
      claimStatusCategoryCodesCreate: false,
      claimStatusCategoryCodesEdit: false,
      claimStatusCategoryCodesDelete: false,
      claimStatusCategoryCodesSearch: false,
      claimStatusCategoryCodesImport: false,
      claimStatusCategoryCodesExport: false,
      //Claim Status Codes
      claimStatusCodesCreate: false,
      claimStatusCodesEdit: false,
      claimStatusCodesDelete: false,
      claimStatusCodesSearch: false,
      claimStatusCodesImport: false,
      claimStatusCodesExport: false,
      //Adjustment Codes
      adjustmentCodesCreate: false,
      adjustmentCodesEdit: false,
      adjustmentCodesDelete: false,
      adjustmentCodesSearch: false,
      adjustmentCodesImport: false,
      adjustmentCodesExport: false,
      //Remark Codes
      remarkCodesCreate: false,
      remarkCodesEdit: false,
      remarkCodesDelete: false,
      remarkCodesSearch: false,
      remarkCodesImport: false,
      remarkCodesExport: false,
      //Team Search
      teamCreate: false,
      teamDelete: false,
      teamExport: false,
      teamImport: false,
      teamSearch: false,
      teamupdate: false,
      //Submitter Search
      submitterCreate: false,
      submitterDelete: false,
      submitterExport: false,
      submitterImport: false,
      submitterSearch: false,
      submitterUpdate: false,
      //Receiver
      receiverCreate: false,
      receiverDelete: false,
      receiverExport: false,
      receiverImport: false,
      receiverSearch: false,
      receiverupdate: false,
      //followup
      planFollowupSearch: false,
      planFollowupCreate: false,
      planFollowupDelete: false,
      planFollowupUpdate: false,
      planFollowupImport: false,
      planFollowupExport: false,
      patientFollowupSearch: false,
      patientFollowupCreate: false,
      patientFollowupDelete: false,
      patientFollowupUpdate: false,
      patientFollowupImport: false,
      patientFollowupExport: false,
      //group and reason
      groupSearch: false,
      groupCreate: false,
      groupUpdate: false,
      groupDelete: false,
      groupExport: false,
      groupImport: false,
      reasonSearch: false,
      reasonCreate: false,
      reasonUpdate: false,
      reasonDelete: false,
      reasonExport: false,
      reasonImport: false,
      //chck post
      addPaymentVisit: false,
      deleteCheck: false,
      manualPosting: false,
      postcheck: false,
      //payments
      patientPlanCreate: false,
      patientPlanUpdate: false,
      patientPlanDelete: false,
      patientPlanSearch: false,
      patientPlanExport: false,
      patientPlanImport: false,
      performEligibility: false,
      patientPaymentCreate: false,
      patientPaymentUpdate: false,
      patientPaymentDelete: false,
      patientPaymentSearch: false,
      patientPaymentExport: false,
      patientPaymentImport: false,
      batchdocumentCreate: false,
      batchdocumentUpdate: false,
      batchdocumentDelete: false,
      batchdocumentSearch: false,
      batchdocumentExport: false,
      batchdocumentImport: false,
      electronicsSubmissionSearch: false,
      electronicsSubmissionSubmit: false,
      electronicsSubmissionResubmit: false,
      addPaymentVisit: false,
      deleteCheck: false,
      manualPosting: false,
      postcheck: false,
      postExport: false,
      postImport: false,
      manualPostingAdd: false,
      manualPostingUpdate: false,
      postCheckSearch: false,
      deletePaymentVisit: false,
    };

    this.state = {
      editId: this.props.userID,
      userModel: this.userModel,
      validationModel: this.validationModel,
      userPracticesModel: this.userPracticesModel,
      userRights: this.userRights,
      userPracticesArr: [],
      userPracticesArrRes: [],
      maxHeight: "361",
      loading: false,
      cnfrmPass: "",
      userRole: [],
      clientID: [],
      clientPractices: [],
      designations: [],
      teams: [],
      data: [],
      email: this.props.email,
      id: 0,
      test: false,
      reportingToArr: [],
      reportingToDropdown: false,
      loading: false,
      isChecked: false,
      collapseMenu: 0,
      newList: [],
      showPopup: false,
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.delete = this.delete.bind(this);
    this.handleClientChange = this.handleClientChange.bind(this);
    this.addPracticeRow = this.addPracticeRow.bind(this);
    this.deletePracticeRow = this.deletePracticeRow.bind(this);
    this.handlePracticeChange = this.handlePracticeChange.bind(this);
    this.handleUserPracticeClientChange = this.handleUserPracticeClientChange.bind(
      this
    );
    this.isNull = this.isNull.bind(this);
    this.savePractices = this.savePractices.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.saveUserRights = this.saveUserRights.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handleDefultCheckbox = this.handleDefultCheckbox.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+s") {
      // alert("save key")
      this.saveUser(e);
      this.saveUserRights(e);
      this.savePractices(e);
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  onKeyUp(keyName, e, handle) {
    if (e) {
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  setModalMaxHeight(element) {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
  }

  componentWillMount() {

     //Adding custom className for CSS
     Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });

    // Array.from(document.querySelectorAll(".content")).forEach((tab) => {
    //   tab.className += " userContent";
    // });





    this.setState({ id: this.props.email ? 1 : 0 });
  }

  async componentDidMount() {

    this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });

    
    await this.setState({ loading: true });
    try {
      // Account Get Profiles
      await axios
        .get(this.url + "getProfiles", this.config)
        .then((response) => {
          if (this.state.email) {
            this.setState({
              clientID: response.data.clients,
              userRole: response.data.list,
              designations: response.data.designations,
              teams: response.data.teams,
              loading: false,
            });
          } else {
            var filteredUserRles = response.data.list.filter(
              (role) => role != this.props.userInfo.userRole
            );
            this.setState({
              clientID: response.data.clients,
              userRole: filteredUserRles,
              designations: response.data.designations,
              teams: response.data.teams,
              loading: false,
            });
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.response) {
            if (error.response.status) {
              Swal.fire("Unauthorized Access", "", "error");
              return;
            }
          } else if (error.request) {
            return;
          } else {
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
        });

      if (this.state.email) {
        await this.setState({ loading: true });
        await axios
          .get(this.url + "findUser/" + this.state.email, this.config)
          .then((findUserResponse) => {
            // Account Get Practices
            axios
              .get(
                this.url +
                  "GetClientPractices/" +
                  findUserResponse.data.clientID,
                this.config
              )
              .then((clientPracticesResponse) => {
                //Reporting To DropDown
                if (
                  findUserResponse.data.userRole == "Biller" ||
                  findUserResponse.data.userRole == "TeamLead"
                ) {
                  var obj = {
                    role: findUserResponse.data.userRole,
                    designationID: findUserResponse.data.designationID,
                    teamID: findUserResponse.data.teamID,
                  };
                  // Get ReportingTo Dropdown
                  axios
                    .post(this.url + "getRoleManager", obj, this.config)
                    .then((reportingTResponse) => {
                      this.setState({
                        clientPractices: clientPracticesResponse.data,
                        userModel: {
                          ...this.state.userModel,
                          firstName: findUserResponse.data.firstName,
                          lastName: findUserResponse.data.lastName,
                          userRole: findUserResponse.data.userRole,
                          clientID: findUserResponse.data.clientID,
                          designationID: findUserResponse.data.designationID,
                          teamID: findUserResponse.data.teamID,
                          email: findUserResponse.data.email,
                          practiceID: findUserResponse.data.practiceID,
                          reportingTo: findUserResponse.data.reportingTo,
                          password: "123",
                          cnfrmPass: "123",
                        },
                        userPracticesArr:
                          findUserResponse.data.assignedUserPractices,
                        reportingToArr: reportingTResponse.data,
                        reportingToDropdown: true,
                        loading: false,
                      });
                    })
                    .catch((error) => {
                      this.setState({
                        reportingToDropdown: false,
                        loading: false,
                      });
                      if (error.response) {
                        if (error.response.status) {
                          Swal.fire("Unauthorized Access", "", "error");
                          return;
                        }
                      } else if (error.request) {
                        return;
                      } else {
                        Swal.fire("Something went Wrong", "", "error");
                        return;
                      }
                    });
                } else {
                  this.setState({
                    clientPractices: clientPracticesResponse.data,
                    userModel: {
                      ...this.state.userModel,
                      firstName: findUserResponse.data.firstName,
                      lastName: findUserResponse.data.lastName,
                      userRole: findUserResponse.data.userRole,
                      clientID: findUserResponse.data.clientID,
                      designationID: findUserResponse.data.designationID,
                      teamID: findUserResponse.data.teamID,
                      email: findUserResponse.data.email,
                      practiceID: findUserResponse.data.practiceID,
                      reportingTo: findUserResponse.data.reportingTo,
                      password: "123",
                      cnfrmPass: "123",
                    },
                    userPracticesArr:
                      findUserResponse.data.assignedUserPractices,
                    // reportingToArr : reportingTResponse.data,
                    reportingToDropdown: false,
                    loading: false,
                  });
                  // this.setState({
                  //   reportingToDropdown: false
                  // });
                }
              })
              .catch((error) => {
                this.setState({ loading: false });
                if (error.response) {
                  if (error.response.status) {
                    Swal.fire("Unauthorized Access", "", "error");
                    return;
                  }
                } else if (error.request) {
                  return;
                } else {
                  Swal.fire("Something went Wrong", "", "error");
                  return;
                }
              });
          })
          .catch((error) => {
            this.setState({ loading: false });
            if (error.response) {
              if (error.response.status) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              }
            } else if (error.request) {
              return;
            } else {
              Swal.fire("Something went Wrong", "", "error");
              return;
            }
          });

        //////////////////////////User Rights/////////////////////////////////

        axios
          .get(
            this.userRightsUrl + "GetRights/" + this.state.email,
            this.config
          )
          .then((response) => {
            this.setState({
              userRights: response.data,
              loading: false,
            });
          })
          .catch((error) => {
            this.setState({ loading: false });
            if (error.response) {
              if (error.response.status) {
                //Swal.fire("Unauthorized Access", "", "error");
                return;
              }
            } else if (error.request) {
              return;
            } else {
              Swal.fire("Something went Wrong", "", "error");
              return;
            }
          });
      }
    } catch {}
  }

  async handleChange(event) {
    event.preventDefault();
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });
    var eventName = event.target.name;
    var eventVal = "";
    if (
      eventName == "firstName" ||
      eventName == "lastName" ||
      eventName == "email"
    ) {
      eventVal = event.target.value.toUpperCase();
    } else {
      eventVal = event.target.value;
    }

    await this.setState({
      userModel: {
        ...this.state.userModel,
        [eventName]: eventVal == "Please Select" ? null : eventVal,
      },
    });

    //User Role Condition

    if (eventName == "userRole") {
      if (eventVal == "Biller" || eventVal == "TeamLead") {
        await this.setState({
          reportingToDropdown: true,
        });
        await this.getReportingToDropdown();
      } else {
        await this.setState({
          reportingToDropdown: false,
        });
      }
    } else if (
      eventName == "userRole" ||
      eventName == "teamID" ||
      eventName == "clientID"
    ) {
      await this.getReportingToDropdown();
    }
  }

  getReportingToDropdown = () => {
    var obj = {
      role:
        this.state.userModel.userRole == ""
          ? null
          : this.state.userModel.userRole,
      designationID: this.state.userModel.designationID,
      teamID: this.state.userModel.teamID,
    };
    // Get ReportingTo Dropdown
    axios
      .post(this.url + "getRoleManager", obj, this.config)
      .then((response) => {
        this.setState({
          reportingToArr: response.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            // Swal.fire("Unauthorized Access", "", "error");
            return;
          }
        } else if (error.request) {
          return;
        } else {
          // Swal.fire("Something went Wrong", "", "error");
          return;
        }
      });
  };

  // Handle client Change
  handleClientChange(event) {
    event.preventDefault();

    this.setState({
      userModel: {
        ...this.state.userModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });

    // Account Get Practices
    axios
      .get(this.url + "GetClientPractices/" + event.target.value, this.config)
      .then((response) => {
        this.setState({ clientPractices: response.data });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            Swal.fire("Unauthorized Access", "", "error");
            return;
          }
        } else if (error.request) {
          return;
        } else {
          Swal.fire("Something went Wrong", "", "error");
          return;
        }
      });
  }

  // Handle Practice Change
  handlePracticeChange(event) {
    this.setState({
      userPracticesModel: {
        ...this.state.userPracticesModel,
        [event.target.name]:
          event.target.value == "Please Select" ? null : event.target.value,
      },
    });
  }

  //Handle user Pratices Client Change
  handleUserPracticeClientChange(event) {
    this.setState({
      userPracticesModel: {
        ...this.state.userPracticesModel,
        [event.target.name]:
          event.target.value == "Please Select" ? null : event.target.value,
      },
    });

    var clientID = 0;
    if (this.isNull(event.target.value)) {
      clientID = 0;
    } else {
      clientID = event.target.value;
    }

    // Account Get Profiles
    axios
      .get(this.url + "GetClientPractices/" + clientID, this.config)
      .then((response) => {
        this.setState({ clientPractices: response.data });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            Swal.fire("Unauthorized Access", "", "error");
            return;
          }
        } else if (error.request) {
          return;
        } else {
          Swal.fire("Something went Wrong", "", "error");
          return;
        }
      });
  }

  //////////////////////////////// handle user rights check box ///////////////////
  handleCheckedChange(e) {
    this.setState({
      userRights: {
        ...this.state.userRights,
        [e.target.name]: !this.state.userRights[e.target.name],
      },
    });
  }

  ////////////////////////////////////////////////////// save user rights ////////////////////
  saveUserRights(e) {
    if (this.savePatientCount == 1) {
      return;
    }
    this.savePatientCount = 1;
    this.handleCheckedChange(e);
    const obj = {
      email: this.state.userModel.email,
      Rights: this.state.userRights,
    };
    axios
      .post(this.userRightsUrl + "SaveRights/", obj, this.config)
      .then((response) => {
        this.savePatientCount = 0;
        this.setState({ userRights: response.data.rights });
        Swal.fire("Rights Added Successfully", "", "success");
      })
      .catch((error) => {
        this.savePatientCount = 0;
      });
  }

  handleDefultCheckbox() {
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked: isChecked });
    axios
      .get(
        this.userRightsUrl + "GetDefault/" + this.state.userModel.userRole,
        this.config
      )
      .then((response) => {
        this.setState({
          userRights: response.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            //Swal.fire("Unauthorized Access", "", "error");
            return;
          }
        } else if (error.request) {
          return;
        } else {
          Swal.fire("Something went Wrong", "", "error");
          return;
        }
      });
  }

  handleCheck = () => {
    this.setState({
      userModel: {
        ...this.state.userModel,
        isActive: !this.state.userModel.isActive,
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

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value == "Please Select"
    )
      return true;
    else return false;
  }

  //Save User
  saveUser = (e) => {
    if (this.savePatientCount == 1) {
      return;
    }
    this.savePatientCount = 1;
    this.setState({ loading: true });
    if (this.state.userModelState == "Updated Successfully") {
      this.savePatientCount = 0;
      return;
    } else if (this.state.userModelState == "User Created Successfully") {
      this.savePatientCount = 0;
      return;
    }

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.userModel.lastName)) {
      myVal.lastNameValField = (
        <span className="validationMsg">Last Name is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.lastNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.firstName)) {
      myVal.firstNameValField = (
        <span className="validationMsg"> First Name is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.firstNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.userRole)) {
      myVal.roleValField = (
        <span className="validationMsg"> User Role is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.roleValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.userRole) == false) {
      if (
        this.state.userModel.userRole == "Biller" ||
        this.state.userModel.userRole == "TeamLead"
      ) {
        if (this.isNull(this.state.userModel.reportingTo)) {
          myVal.reportingToValField = (
            <span className="validationMsg"> ReportingTo is Required</span>
          );
          myVal.validation = true;
        } else {
          myVal.reportingToValField = "";
          if (myVal.validation === false) myVal.validation = false;
        }
      }
    } else {
      myVal.reportingToValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.clientID)) {
      myVal.clientValField = (
        <span className="validationMsg"> Client is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.clientValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.email)) {
      myVal.emailValField = (
        <span className="validationMsg"> Email is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.emailValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.practiceID)) {
      myVal.practiceValField = (
        <span className="validationMsg"> Practice is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.practiceValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.password)) {
      myVal.passwordValField = (
        <span className="validationMsg" style={{ marginTop: "-15px" }}>
          {" "}
          Password is Required
        </span>
      );
      myVal.validation = true;
    } else {
      myVal.passwordValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.userModel.cnfrmPass)) {
      myVal.cnfrmPassValField = (
        <span className="validationMsg">Confirm Password is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.cnfrmPassValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.state.userModel.password !== this.state.userModel.cnfrmPass) {
      //myVal.passwordValField = <span className="validationMsg">Password Did"t Match</span>
      myVal.cnfrmPassValField = (
        <span className="validationMsg">Password Did"t Match</span>
      );
      myVal.validation = true;
    } else {
      //myVal.passwordValField = '';
      myVal.cnfrmPassValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      Swal.fire("Please Select All Fields Properly", "", "error");
      this.savePatientCount = 0;
      return;
    }

    axios
      .post(this.url + "CreateAccount", this.state.userModel, this.config)
      .then((response) => {
        this.savePatientCount = 0;
        this.setState({
          userModelState: response.data,
          editId: response.data.id,
          loading: false,
        });
        Swal.fire("Account Saved Successfully", "", "success");
      })
      .catch((error) => {
        this.savePatientCount = 0;
        this.setState({ loading: false });

        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 404) {
              Swal.fire("Error", "404 Not Found ", "error");
            }else if(error.response.status == 400){
              Swal.fire("Something Wrong", error.response.data, "error");
            }else{
              Swal.fire("Someting Wrong", "Please Try Again", "error");
            }
          }
        } else {
          Swal.fire("Someting Wrong", "Please Try Again", "error");
          return;
        } 
      });

    // this.setState({ loading: false });
    // e.preventDefault();
  };

  //Delete User
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
        // this.setState({loading:true})
        // axios
        //     .delete(this.url + "deleteClient/" + this.state.editId)
        //     .then(response => {
        //         this.setState({loading:false})
        //         Swal.fire("Record Deleted Successfully", "", "success");
        //     })
        //     .catch(error => {
        //         this.setState({loading:false})
        // if (error.response) {
        //     if(error.response.status){
        //         Swal.fire("Unauthorized Access" , "" , "error");
        //         return
        //     }
        //   } else if (error.request) {
        //     return
        //   } else {
        //  Swal.fire("Record Not Deleted!", "Record can not be delete, as it is being referenced in other screens.", "error");
        //     return
        //   }
        //
        //     });
        // $("#btnCancel").click();
      }
    });
  };

  //Add Practice Row
  async addPracticeRow() {
    try {
      //User Practice And Client Validation Model
      var myVal = this.validationModel;
      myVal.validation = false;

      if (this.isNull(this.state.userPracticesModel.clientID)) {
        myVal.userClientValField = (
          <span className="validationMsg">Select Client</span>
        );
        myVal.validation = true;
      } else {
        myVal.userClientValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }

      if (this.isNull(this.state.userPracticesModel.practiceID)) {
        myVal.userPracticeValField = (
          <span className="validationMsg"> Select Primary Practice</span>
        );
        myVal.validation = true;
      } else {
        myVal.userPracticeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }

      this.setState({
        validationModel: myVal,
      });

      if (myVal.validation === true) {
        this.setState({ loading: false });
        Swal.fire("Please Select All Fields Properly", "", "error");
        return;
      }

      //Check weather this practice already added to array
      var practiceCheck = await this.state.userPracticesArr.filter(
        (practice) =>
          practice.practiceID == this.state.userPracticesModel.practiceID &&
          practice.clientID == this.state.userPracticesModel.clientID
      );
      if (practiceCheck.length > 0) {
        this.setState({ loading: false });
        Swal.fire("Same Record Alredy Exists", "", "error");
        return;
      }

      //Filter Client and Practice Array to get Client Name and Practice Name
      var client = await this.state.clientID.filter(
        (client) => client.id == this.state.userPracticesModel.clientID
      );
      var practice = await this.state.clientPractices.filter(
        (practice) => practice.id == this.state.userPracticesModel.practiceID
      );
      var obj = {
        clientID: this.state.userPracticesModel.clientID,
        practiceID: this.state.userPracticesModel.practiceID,
        currentUserID: null,
        email: this.props.email,
        status: true,
        clientName: client.length > 0 ? client[0].description : "",
        practiceName: practice.length > 0 ? practice[0].description : "",
      };

      await this.setState({
        userPracticesArr: this.state.userPracticesArr.concat(obj),
      });
    } catch {}
  }

  //Delete Practice Row
  async deletePracticeRow(clientID, practiceID) {
    try {
      if (practiceID == this.state.userModel.practiceID) {
        Swal.fire("Primary Practice Can't Be Deleted", "", "error");

        return;
      }
      var practice;
      await this.state.userPracticesArr.map((practice, index) => {
        if (
          practice.practiceID == practiceID &&
          practice.clientID == clientID
        ) {
          practice = [...this.state.userPracticesArr];
          practice[index].status = false;
          this.setState({
            userPracticesArr: practice,
          });
        }
      });
    } catch {}
  }

  //Save Practices
  savePractices() {
    this.setState({ loading: true });
    axios
      .post(
        this.assignPracticesUrl + "assignPractices",
        this.state.userPracticesArr,
        this.config
      )
      .then((response) => {
        Swal.fire("Saved Successfully", "", "success");
        this.setState({ loading: false });
        // this.setState({ client: response.data.clients , role : response.data.roles });
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            //Swal.fire("Unauthorized Access" , "" , "error");
            return;
          }
        } else if (error.request) {
          return;
        } else {
          //Swal.fire("Something went Wrong" , "" , "error");
          return;
        }
      });
  }

  /// collapse
  showHide(id) {
    this.setState({
      collapseMenu: this.state.collapseMenu == id ? -1 : id,
    });
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openPasswordPopup = (id) => {
    this.setState({ showPopup: true, id: id });
  };

  closePasswordPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  render() {
    const isActive = this.state.userModel.isActive;

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
    const headers = ["User Info", "Practices", "Rights"];

    var rowData = [];
    this.state.userPracticesArr.map((practice) => {
      if (practice.status == true) {
        var obj = {
          clientName: practice.clientName,
          practiceName: practice.practiceName,
          delete: (
            <div style={{ width: "100px", marginTopL: "5px" }}>
              <button
                class=" btn btn-primary mr-2"
                type="submit"
                onClick={() =>
                  this.deletePracticeRow(practice.clientID, practice.practiceID)
                }
              >
                Delete
              </button>
            </div>
          ),
        };
        rowData.push(obj);
      }
    });
    const data = {
      columns: [
        {
          label: "CLIENT",
          field: "clientName",
          sort: "asc",
          width: 150,
        },
        {
          label: "PRACTICE",
          field: "practiceName",
          sort: "asc",
          width: 270,
        },

        {
          label: "DELETE",
          field: "delete",
          sort: "asc",
          width: 100,
        },
      ],
      rows: rowData,
    };

    //////////////////////////////////////////// Change Password //////////////////////////////////
    var resetPasswordButton;
    resetPasswordButton = (
      <button
        class=" btn btn-primary mr-2"
        onClick={() => this.openPasswordPopup(0)}
      >
        Reset Password
      </button>
    );

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <ResetPassword
          onClose={this.closePasswordPopup}
          email={this.state.email}
        ></ResetPassword>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="clientModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            class="modal-dialog"
            style={{ margin: "4.8rem auto" }}
            role="document"
          >
            <div class="modal-content " style={{minHeight:"300px" , maxHeight:"700px"}}>
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.userModel.name +
                            " - " +
                            this.state.userModel.organizationName +
                            " "
                          : "NEW USER"}
                      </h3>

                      <div class="float-lg-right text-right">
                        <input
                          class="checkbox"
                          type="checkbox"
                          onClick={this.handleCheck}
                        />
                        Mark Inactive
                        {this.state.email != "" ? resetPasswordButton : ""}
                        <button
                          class="close"
                          type="button"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span
                            aria-hidden="true"
                            onClick={() => this.props.onClose()}
                          >
                            ×
                          </span>
                        </button>
                      </div>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    {/* Main Content Start*/}
                    <Tabs headers={headers} style={{ cursor: "pointer" }}>
                      <Tab className="userTab">
                        <br></br>
                        <br></br>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Last Name<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" Last Name"
                                value={this.state.userModel.lastName}
                                name="lastName"
                                id="lastName"
                                maxLength="20"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.lastNameValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                First Name<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" First Name"
                                value={this.state.userModel.firstName}
                                name="firstName"
                                id="firstName"
                                maxLength="20"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.firstNameValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Client</label>
                            </div>
                            <div class="col-md-8  float-left">
                              <select
                                name="clientID"
                                id="clientID"
                                value={this.state.userModel.clientID}
                                onChange={this.handleClientChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.clientID.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.clientValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Primary Practice</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <select
                                name="practiceID"
                                id="practiceID"
                                value={this.state.userModel.practiceID}
                                onChange={this.handleChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.clientPractices.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.practiceValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Team</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <select
                                name="teamID"
                                id="teamID"
                                value={this.state.userModel.teamID}
                                onChange={this.handleChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.teams.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.clientValField} */}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Role</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <select
                                disabled={
                                  this.state.email &&
                                  this.state.userModel.userRole ==
                                    this.props.userInfo.userRole
                                    ? true
                                    : false
                                }
                                name="userRole"
                                id="userRole"
                                value={this.state.userModel.userRole}
                                onChange={this.handleChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.userRole.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.roleValField}
                            </div>
                          </div>

                          {this.state.reportingToDropdown == true ? (
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="firstName">Reporting To</label>
                              </div>
                              <div class="col-md-8 float-left">
                                <select
                                  name="reportingTo"
                                  id="reportingTo"
                                  value={this.state.userModel.reportingTo}
                                  onChange={this.handleChange}
                                  style={{ width: "100%", padding: "5px" }}
                                  class="provider-form form-control-user"
                                >
                                  {this.state.reportingToArr.map((s, i) => (
                                    <option key={i} value={s.email}>
                                      {s.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div class="invalid-feedback">
                                {this.state.validationModel.reportingToValField}
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Email<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" Email"
                                disabled={this.state.id > 0 ? "disable" : ""}
                                value={this.state.userModel.email}
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

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Password<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="provider-form w-100 form-control-user"
                                placeholder="Password"
                                disabled={this.state.id > 0 ? "disable" : ""}
                                type="password"
                                value={this.state.userModel.password}
                                name="password"
                                id="password"
                                max="15"
                                onChange={this.handleChange}
                              />
                              <p>
                                Enter combination of at least 5 letters,numbers
                                and symbols
                              </p>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.passwordValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Confirm Password
                                <span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                class="provider-form w-100 form-control-user"
                                placeholder="  Confirm Password"
                                disabled={this.state.id > 0 ? "disable" : ""}
                                type="password"
                                value={this.state.userModel.cnfrmPass}
                                name="cnfrmPass"
                                id="cnfrmPass"
                                max="15"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.cnfrmPassValField}
                            </div>
                          </div>
                        </div>
                      </Tab>

                      <Tab>
                        <br></br>
                        <br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Client<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8  float-left">
                              <select
                                name="clientID"
                                id="clientID"
                                value={this.state.userPracticesModel.clientID}
                                onChange={this.handleUserPracticeClientChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.clientID.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.userClientValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Practice<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <select
                                name="practiceID"
                                id="practiceID"
                                value={this.state.userPracticesModel.practiceID}
                                onChange={this.handlePracticeChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.clientPractices.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.userPracticeValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"></div>
                            <div class="col-md-8 float-left">
                              <button
                                class=" btn btn-primary mr-2"
                                type="submit"
                                onClick={this.addPracticeRow}
                              >
                                Add +
                              </button>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.clientValField} */}
                            </div>
                          </div>
                        </div>

                        <br></br>

                        <div class="row">
                          <div class="col-md-12 mb-2">
                            <div className="">
                              <MDBDataTable
                                responsive={true}
                                striped
                                bordered
                                searching={false}
                                data={data}
                                displayEntries={false}
                                sortable={true}
                                scrollX={false}
                                scrollY={false}
                              />
                            </div>
                          </div>
                        </div>
                      </Tab>

                      <Tab>
                        <br></br>
                        <br></br>
                        <div class="row">
                          <div class="col-md-12 mb-2">

                            {/* Setup Rights */}
                            <div class="row">
                              <div class="col-md-12 order-md-1 provider-form ">
                                <div className="container-fluid">
                                  <div className="card mb-4">
                                    <div class="header pt-1" style={{backgroundColor:"#b2cfdd"}}>
                                      <h6
                                      style={{paddingLeft:"10px" , fontSize:"20px"}}
                                        class="heading"
                                        onClick={(event) => this.showHide(0)}
                                      >
                                        Setup
                                      </h6>
                                      {/* <hr
                                        class="p-0 mt-0 mb-1"
                                        style={{ backgroundColor: "#037592" }}
                                      ></hr> */}
                                      <div class="clearfix"></div>
                                    </div>
                                    <br></br>
                                    <MDBCollapse
                                      id={0}
                                      isOpen={this.state.collapseMenu}
                                    >
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Practices
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="practiceSearch"
                                                name="practiceSearch"
                                                checked={
                                                  this.state.userRights
                                                    .practiceSearch
                                                }
                                                onClick={
                                                  this.handleCheckedChange
                                                }
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Practices
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="practiceCreate"
                                                name="practiceCreate"
                                                checked={
                                                  this.state.userRights
                                                    .practiceCreate
                                                }
                                                onClick={
                                                  this.handleCheckedChange
                                                }
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Practices
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="practiceEdit"
                                                name="practiceEdit"
                                                checked={
                                                  this.state.userRights
                                                    .practiceEdit
                                                }
                                                onClick={
                                                  this.handleCheckedChange
                                                }
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Practices
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="practiceExport"
                                                name="practiceExport"
                                                checked={
                                                  this.state.userRights
                                                    .practiceExport
                                                }
                                                onClick={
                                                  this.handleCheckedChange
                                                }
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Locations
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="locationSearch"
                                                name="locationSearch"
                                                checked={
                                                  this.state.userRights
                                                    .locationSearch
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Locations
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="locationCreate"
                                                name="locationCreate"
                                                checked={
                                                  this.state.userRights
                                                    .locationCreate
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Locations
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="locationEdit"
                                                name="locationEdit"
                                                checked={
                                                  this.state.userRights.locationEdit
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Locations
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="locationExport"
                                                name="locationExport"
                                                checked={
                                                  this.state.userRights
                                                    .locationExport
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Provider
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="providerSearch"
                                            name="providerSearch"
                                            checked={
                                              this.state.userRights
                                                .providerSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Provider
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="providerCreate"
                                            name="providerCreate"
                                            checked={
                                              this.state.userRights
                                                .providerCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Provider
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="providerEdit"
                                            name="providerEdit"
                                            checked={
                                              this.state.userRights.providerEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Provider
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="providerExport"
                                            name="providerExport"
                                            checked={
                                              this.state.userRights
                                                .providerExport
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Ref. Pro.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="referringProviderSearch"
                                                name="referringProviderSearch"
                                                checked={
                                                  this.state.userRights
                                                    .referringProviderSearch
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Ref. Pro.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="referringProviderCreate"
                                            name="referringProviderCreate"
                                            checked={
                                              this.state.userRights
                                                .referringProviderCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Ref. Pro.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                               id="referringProviderEdit"
                                            name="referringProviderEdit"
                                            checked={
                                              this.state.userRights
                                                .referringProviderEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Ref. Pro.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="referringProviderExport"
                                                name="referringProviderExport"
                                                checked={
                                                  this.state.userRights
                                                    .referringProviderExport
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Insurance
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="insuranceSearch"
                                            name="insuranceSearch"
                                            checked={
                                              this.state.userRights
                                                .insuranceSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Insurance
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="insuranceCreate"
                                                name="insuranceCreate"
                                                checked={
                                                  this.state.userRights
                                                    .insuranceCreate
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Insurance
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="insuranceEdit"
                                                name="insuranceEdit"
                                                checked={
                                                  this.state.userRights
                                                    .insuranceEdit
                                                }
                                                onClick={this.handleCheckedChange}
                                              
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Insurance
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="insuranceExport"
                                                name="insuranceExport"
                                                checked={
                                                  this.state.userRights
                                                    .insuranceExport
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Ins. Plan.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="insurancePlanSearch"
                                                name="insurancePlanSearch"
                                                checked={
                                                  this.state.userRights
                                                    .insurancePlanSearch
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Ins. Plan.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                              <input
                                                type="checkbox"
                                                id="insurancePlanCreate"
                                            name="insurancePlanCreate"
                                            checked={
                                              this.state.userRights
                                                .insurancePlanCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Ins. Plan.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                                type="checkbox"
                                                id="insurancePlanEdit"
                                                name="insurancePlanEdit"
                                                checked={
                                                  this.state.userRights
                                                    .insurancePlanEdit
                                                }
                                                onClick={this.handleCheckedChange}
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Ins. Plan.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="insurancePlanExport"
                                            name="insurancePlanExport"
                                            checked={
                                              this.state.userRights
                                                .insurancePlanExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Plan. Add.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="insurancePlanAddressSearch"
                                            name="insurancePlanAddressSearch"
                                            checked={
                                              this.state.userRights
                                                .insurancePlanAddressSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Plan. Add.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="insurancePlanAddressCreate"
                                            name="insurancePlanAddressCreate"
                                            checked={
                                              this.state.userRights
                                                .insurancePlanAddressCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Plan. Add.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="insurancePlanAddressEdit"
                                            name="insurancePlanAddressEdit"
                                            checked={
                                              this.state.userRights
                                                .insurancePlanAddressEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Plan. Add.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="insurancePlanAddressExport"
                                            name="insurancePlanAddressExport"
                                            checked={
                                              this.state.userRights
                                                .insurancePlanAddressExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Sub. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="ediSubmitSearch"
                                            name="ediSubmitSearch"
                                            checked={
                                              this.state.userRights
                                                .ediSubmitSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Sub. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="ediSubmitCreate"
                                            name="ediSubmitCreate"
                                            checked={
                                              this.state.userRights
                                                .ediSubmitCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Sub. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="ediSubmitEdit"
                                            name="ediSubmitEdit"
                                            checked={
                                              this.state.userRights
                                                .ediSubmitEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Sub. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="ediSubmitExport"
                                            name="ediSubmitExport"
                                            checked={
                                              this.state.userRights
                                                .ediSubmitExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Elig. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="ediEligiBilitySearch"
                                            name="ediEligiBilitySearch"
                                            checked={
                                              this.state.userRights
                                                .ediEligiBilitySearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Elig. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="ediEligiBilityCreate"
                                            name="ediEligiBilityCreate"
                                            checked={
                                              this.state.userRights
                                                .ediEligiBilityCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Elig. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                                <input
                                            type="checkbox"
                                            id="ediEligiBilityEdit"
                                            name="ediEligiBilityEdit"
                                            checked={
                                              this.state.userRights
                                                .ediEligiBilityEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Elig. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="ediEligiBilityExport"
                                            name="ediEligiBilityExport"
                                            checked={
                                              this.state.userRights
                                                .ediEligiBilityExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Status Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="ediStatusSearch"
                                            name="ediStatusSearch"
                                            checked={
                                              this.state.userRights
                                                .ediStatusSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Status Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="ediStatusCreate"
                                            name="ediStatusCreate"
                                            checked={
                                              this.state.userRights
                                                .ediStatusCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Status Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="ediStatusEdit"
                                            name="ediStatusEdit"
                                            checked={
                                              this.state.userRights
                                                .ediStatusEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Status Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="ediStatusExport"
                                            name="ediStatusExport"
                                            checked={
                                              this.state.userRights
                                                .ediStatusExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search ICD
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="icdSearch"
                                            name="icdSearch"
                                            checked={
                                              this.state.userRights.icdSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add ICD
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="icdCreate"
                                            name="icdCreate"
                                            checked={
                                              this.state.userRights.icdCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update ICD
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="icdEdit"
                                            name="icdEdit"
                                            checked={
                                              this.state.userRights.icdEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export ICD
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="icdExport"
                                            name="icdExport"
                                            checked={
                                              this.state.userRights.icdExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search CPT
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="cptSearch"
                                            name="cptSearch"
                                            checked={
                                              this.state.userRights.cptSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add CPT
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="cptCreate"
                                            name="cptCreate"
                                            checked={
                                              this.state.userRights.cptCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update CPT
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="cptEdit"
                                            name="cptEdit"
                                            checked={
                                              this.state.userRights.cptEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export CPT
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="cptExport"
                                            name="cptExport"
                                            checked={
                                              this.state.userRights.cptExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Modifiers
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="modifiersSearch"
                                            name="modifiersSearch"
                                            checked={
                                              this.state.userRights
                                                .modifiersSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Modifiers
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="modifiersCreate"
                                            name="modifiersCreate"
                                            checked={
                                              this.state.userRights
                                                .modifiersCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Modifiers
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="modifiersEdit"
                                            name="modifiersEdit"
                                            checked={
                                              this.state.userRights
                                                .modifiersEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Modifiers
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="modifiersExport"
                                            name="modifiersExport"
                                            checked={
                                              this.state.userRights
                                                .modifiersExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search POS
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="posSearch"
                                            name="posSearch"
                                            checked={
                                              this.state.userRights.posSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add POS
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="posCreate"
                                            name="posCreate"
                                            checked={
                                              this.state.userRights.posCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update POS
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="posEdit"
                                            name="posEdit"
                                            checked={
                                              this.state.userRights.posEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export POS
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="posExport"
                                            name="posExport"
                                            checked={
                                              this.state.userRights.posExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search CS Cat. Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="claimStatusCategoryCodesSearch"
                                            name="claimStatusCategoryCodesSearch"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCategoryCodesSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add CS Cat. Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="claimStatusCategoryCodesCreate"
                                            name="claimStatusCategoryCodesCreate"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCategoryCodesCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update CS Cat. Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="claimStatusCategoryCodesEdit"
                                            name="claimStatusCategoryCodesEdit"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCategoryCodesEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export CS Cat. Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="claimStatusCategoryCodesExport"
                                            name="claimStatusCategoryCodesExport"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCategoryCodesExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search CS Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="claimStatusCodesSearch"
                                            name="claimStatusCodesSearch"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCodesSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add CS Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="claimStatusCodesCreate"
                                            name="claimStatusCodesCreate"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCodesCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update CS Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="claimStatusCodesEdit"
                                            name="claimStatusCodesEdit"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCodesEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export CS Code
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="claimStatusCodesExport"
                                            name="claimStatusCodesExport"
                                            checked={
                                              this.state.userRights
                                                .claimStatusCodesExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Adj. Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="adjustmentCodesSearch"
                                            name="adjustmentCodesSearch"
                                            checked={
                                              this.state.userRights
                                                .adjustmentCodesSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Adj. Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="adjustmentCodesCreate"
                                            name="adjustmentCodesCreate"
                                            checked={
                                              this.state.userRights
                                                .adjustmentCodesCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Adj. Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="adjustmentCodesEdit"
                                            name="adjustmentCodesEdit"
                                            checked={
                                              this.state.userRights
                                                .adjustmentCodesEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Adj. Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="adjustmentCodesExport"
                                            name="adjustmentCodesExport"
                                            checked={
                                              this.state.userRights
                                                .adjustmentCodesExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Remark Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="remarkCodesSearch"
                                            name="remarkCodesSearch"
                                            checked={
                                              this.state.userRights
                                                .remarkCodesSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Remark Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="remarkCodesCreate"
                                            name="remarkCodesCreate"
                                            checked={
                                              this.state.userRights
                                                .remarkCodesCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Remark Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="remarkCodesEdit"
                                            name="remarkCodesEdit"
                                            checked={
                                              this.state.userRights
                                                .remarkCodesEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Remark Codes
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="remarkCodesExport"
                                            name="remarkCodesExport"
                                            checked={
                                              this.state.userRights
                                                .remarkCodesExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search User
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="remarkCodesExport"
                                            name="remarkCodesExport"
                                            checked={
                                              this.state.userRights
                                                .remarkCodesExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add User
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="userCreate"
                                            name="userCreate"
                                            checked={
                                              this.state.userRights.userCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update User
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="userEdit"
                                            name="userEdit"
                                            checked={
                                              this.state.userRights.userEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export User
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="userExport"
                                            name="userExport"
                                            checked={
                                              this.state.userRights.userExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      
                                        <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Client
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="clientSearch"
                                            name="clientSearch"
                                            checked={
                                              this.state.userRights.clientSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Client
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="clientCreate"
                                            name="clientCreate"
                                            checked={
                                              this.state.userRights.clientCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Client
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="clientEdit"
                                            name="clientEdit"
                                            checked={
                                              this.state.userRights.clientEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Client
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="clientExport"
                                            name="clientExport"
                                            checked={
                                              this.state.userRights.clientExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Team
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="teamSearch"
                                            name="teamSearch"
                                            checked={
                                              this.state.userRights.teamSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Team
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="teamCreate"
                                            name="teamCreate"
                                            checked={
                                              this.state.userRights.teamCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Team
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="teamupdate"
                                            name="teamupdate"
                                            checked={
                                              this.state.userRights.teamupdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Team
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="teamExport"
                                            name="teamExport"
                                            checked={
                                              this.state.userRights.teamExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Receiver
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="receiverSearch"
                                            name="receiverSearch"
                                            checked={
                                              this.state.userRights
                                                .receiverSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Receiver
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="receiverCreate"
                                            name="receiverCreate"
                                            checked={
                                              this.state.userRights
                                                .receiverCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Receiver
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="receiverupdate"
                                            name="receiverupdate"
                                            checked={
                                              this.state.userRights
                                                .receiverupdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Receiver
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="receiverExport"
                                            name="receiverExport"
                                            checked={
                                              this.state.userRights
                                                .receiverExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Submitter
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="submitterSearch"
                                            name="submitterSearch"
                                            checked={
                                              this.state.userRights
                                                .submitterSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Submitter
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="submitterCreate"
                                            name="submitterCreate"
                                            checked={
                                              this.state.userRights
                                                .submitterCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Submitter
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="submitterUpdate"
                                            name="submitterUpdate"
                                            checked={
                                              this.state.userRights
                                                .submitterUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Submitter
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="submitterExport"
                                            name="submitterExport"
                                            checked={
                                              this.state.userRights
                                                .submitterExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>
                                    </MDBCollapse>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* PAtient Rights */}
                            <br></br>
                            <div class="row">
                              <div class="col-md-12 order-md-1 provider-form ">
                                <div className="container-fluid">
                                  <div className="card mb-4">
                                  <div class="header pt-1" style={{backgroundColor:"#b2cfdd"}}>
                                      <h6
                                       style={{paddingLeft:"10px" , fontSize:"20px"}}
                                        class="heading"
                                        onClick={(event) => this.showHide(1)}
                                      >
                                        Patient
                                      </h6>
                                      {/* <hr
                                        class="p-0 mt-0 mb-1"
                                        style={{ backgroundColor: "#037592" }}
                                      ></hr> */}
                                      <div class="clearfix"></div>
                                    </div>
                                    <br></br>
                                    <MDBCollapse
                                      id={1}
                                      isOpen={this.state.collapseMenu}
                                    >

                                    < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Patients
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientSearch"
                                            name="patientSearch"
                                            checked={
                                              this.state.userRights
                                                .patientSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Patients
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientCreate"
                                            name="patientCreate"
                                            checked={
                                              this.state.userRights
                                                .patientCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Patients
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                               <input
                                            type="checkbox"
                                            id="patientEdit"
                                            name="patientEdit"
                                            checked={
                                              this.state.userRights.patientEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Patients
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="patientExport"
                                            name="patientExport"
                                            checked={
                                              this.state.userRights
                                                .patientExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Pat. Plan
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientPlanSearch"
                                            name="patientPlanSearch"
                                            checked={
                                              this.state.userRights
                                                .patientPlanSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Pat. Plan
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientPlanCreate"
                                            name="patientPlanCreate"
                                            checked={
                                              this.state.userRights
                                                .patientPlanCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Pat. Plan
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="patientPlanUpdate"
                                            name="patientPlanUpdate"
                                            checked={
                                              this.state.userRights
                                                .patientPlanUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Pat. Plan
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="patientPlanExport"
                                            name="patientPlanExport"
                                            checked={
                                              this.state.userRights
                                                .patientPlanExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                             
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Pat. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientPaymentSearch"
                                            name="patientPaymentSearch"
                                            checked={
                                              this.state.userRights
                                                .patientPaymentSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Pat. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientPaymentCreate"
                                            name="patientPaymentCreate"
                                            checked={
                                              this.state.userRights
                                                .patientPaymentCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Pat. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="patientPaymentUpdate"
                                            name="patientPaymentUpdate"
                                            checked={
                                              this.state.userRights
                                                .patientPaymentUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Pat. Pay.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="patientPaymentExport"
                                            name="patientPaymentExport"
                                            checked={
                                              this.state.userRights
                                                .patientPaymentExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Batch Doc
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="batchdocumentSearch"
                                            name="batchdocumentSearch"
                                            checked={
                                              this.state.userRights
                                                .batchdocumentSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Batch Doc
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="batchdocumentCreate"
                                            name="batchdocumentCreate"
                                            checked={
                                              this.state.userRights
                                                .batchdocumentCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Batch Doc
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="batchdocumentUpdate"
                                            name="batchdocumentUpdate"
                                            checked={
                                              this.state.userRights
                                                .batchdocumentUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Batch Doc
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="batchdocumentExport"
                                            name="batchdocumentExport"
                                            checked={
                                              this.state.userRights
                                                .batchdocumentExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Post Check
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="postcheck"
                                            name="postcheck"
                                            checked={
                                              this.state.userRights.postcheck
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Search Post Check
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="postCheckSearch"
                                            name="postCheckSearch"
                                            checked={
                                              this.state.userRights
                                                .postCheckSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
 </div>

                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Add Manual Posting
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="manualPostingAdd"
                                            name="manualPostingAdd"
                                            checked={
                                              this.state.userRights
                                                .manualPostingAdd
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Update Manual Posting
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="manualPostingUpdate"
                                            name="manualPostingUpdate"
                                            checked={
                                              this.state.userRights
                                                .manualPostingUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                         </div>

                                      <div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Add Payment Visit
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="addPaymentVisit"
                                            name="addPaymentVisit"
                                            checked={
                                              this.state.userRights
                                                .addPaymentVisit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        </div>


                                    </MDBCollapse>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Charge Tab */}
                            <br></br>
                            <div class="row">
                              <div class="col-md-12 order-md-1 provider-form ">
                                <div className="container-fluid">
                                  <div className="card mb-4">
                                  <div class="header pt-1" style={{backgroundColor:"#b2cfdd"}}>
                                      <h6
                                       style={{paddingLeft:"10px" , fontSize:"20px"}}
                                        class="heading"
                                        onClick={(event) => this.showHide(2)}
                                      >
                                        Charges
                                      </h6>
                                      {/* <hr
                                        class="p-0 mt-0 mb-1"
                                        style={{ backgroundColor: "#037592" }}
                                      ></hr> */}
                                      <div class="clearfix"></div>
                                    </div>
                                    <br></br>
                                    <MDBCollapse
                                      id={2}
                                      isOpen={this.state.collapseMenu}
                                    >
                                        < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Charges
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="chargesSearch"
                                            name="chargesSearch"
                                            checked={
                                              this.state.userRights
                                                .chargesSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Charges
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="chargesCreate"
                                            name="chargesCreate"
                                            checked={
                                              this.state.userRights
                                                .chargesCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Charges
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="chargesEdit"
                                            name="chargesEdit"
                                            checked={
                                              this.state.userRights.chargesEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Charges
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="chargesExport"
                                            name="chargesExport"
                                            checked={
                                              this.state.userRights
                                                .chargesExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                      < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Re-Submit Charges
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="resubmitCharges"
                                            name="resubmitCharges"
                                            checked={
                                              this.state.userRights
                                                .resubmitCharges
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        </div>

                                      < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            View HCFA
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="viewLedgers"
                                            name=""
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                          </div>

                                    </MDBCollapse>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Followup Rights */}
                                    <br></br>
                            <div class="row">
                              <div class="col-md-12 order-md-1 provider-form ">
                                <div className="container-fluid">
                                  <div className="card mb-4">
                                  <div class="header pt-1" style={{backgroundColor:"#b2cfdd"}}>
                                      <h6
                                       style={{paddingLeft:"10px" , fontSize:"20px"}}
                                        class="heading"
                                        onClick={(event) => this.showHide(3)}
                                      >
                                        Followup
                                      </h6>
                                      {/* <hr
                                        class="p-0 mt-0 mb-1"
                                        style={{ backgroundColor: "#037592" }}
                                      ></hr> */}
                                      <div class="clearfix"></div>
                                    </div>
                                    <br></br>
                                    <MDBCollapse
                                      id={3}
                                      isOpen={this.state.collapseMenu}
                                    >
                                       
                                      < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                           Search PlanFollowup
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="planFollowupSearch"
                                            name="planFollowupSearch"
                                            checked={
                                              this.state.userRights
                                                .planFollowupSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Update PlanFollowup
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="planFollowupUpdate"
                                            name="planFollowupUpdate"
                                            checked={
                                              this.state.userRights
                                                .planFollowupUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        </div>

                                      < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Update PatientFollowup
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientFollowupUpdate"
                                            name="patientFollowupUpdate"
                                            checked={
                                              this.state.userRights
                                                .patientFollowupUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Search PatientFollowup
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="patientFollowupSearch"
                                            name="patientFollowupSearch"
                                            checked={
                                              this.state.userRights
                                                .patientFollowupSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                          </div>

                                          < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Group
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="groupSearch"
                                            name="groupSearch"
                                            checked={
                                              this.state.userRights.groupSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Group
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="groupCreate"
                                            name="groupCreate"
                                            checked={
                                              this.state.userRights.groupCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Group
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="groupUpdate"
                                            name="groupUpdate"
                                            checked={
                                              this.state.userRights.groupUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Group
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="groupUpdate"
                                            name="groupUpdate"
                                            checked={
                                              this.state.userRights.groupUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                      < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Search Reason
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="reasonSearch"
                                            name="reasonSearch"
                                            checked={
                                              this.state.userRights.reasonSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Reason
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="reasonCreate"
                                            name="reasonCreate"
                                            checked={
                                              this.state.userRights.reasonCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Reason
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="reasonUpdate"
                                            name="reasonUpdate"
                                            checked={
                                              this.state.userRights.reasonUpdate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Reason
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="reasonExport"
                                            name="reasonExport"
                                            checked={
                                              this.state.userRights.reasonExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>

                                    </MDBCollapse>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                            {/* Submissions Rights */}

                            <br></br>
                            <div class="row">
                              <div class="col-md-12 order-md-1 provider-form ">
                                <div className="container-fluid">
                                  <div className="card mb-4">
                                  <div class="header pt-1" style={{backgroundColor:"#b2cfdd"}}>
                                      <h6
                                       style={{paddingLeft:"10px" , fontSize:"20px"}}
                                        class="heading"
                                        onClick={(event) => this.showHide(4)}
                                      >
                                        Submissions
                                      </h6>
                                      {/* <hr
                                        class="p-0 mt-0 mb-1"
                                        style={{ backgroundColor: "#037592" }}
                                      ></hr> */}
                                      <div class="clearfix"></div>
                                    </div>
                                    <br></br>
                                    <MDBCollapse
                                      id={4}
                                      isOpen={this.state.collapseMenu}
                                    >

                                < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Search Elec. Sub.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="electronicsSubmissionSearch"
                                            name="electronicsSubmissionSearch"
                                            checked={
                                              this.state.userRights
                                                .electronicsSubmissionSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Submit Elec. Sub
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="electronicsSubmissionSubmit"
                                            name="electronicsSubmissionSubmit"
                                            checked={
                                              this.state.userRights
                                                .electronicsSubmissionSubmit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        </div>

                                        < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                           Search Paper Sub.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="paperSubmissionSearch"
                                            name="paperSubmissionSearch"
                                            checked={
                                              this.state.userRights
                                                .paperSubmissionSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Submit Paper Sub.
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="paperSubmissionSubmit"
                                            name="paperSubmissionSubmit"
                                            checked={
                                              this.state.userRights
                                                .paperSubmissionSubmit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        </div>
                                       
                                        < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Search SubmissionsLog
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="submissionLogSearch"
                                            name="submissionLogSearch"
                                            checked={
                                              this.state.userRights
                                                .submissionLogSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                       

                                        </div>


                                    </MDBCollapse>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                              {/* Reports Rights */}

                              <br></br>
                            <div class="row">
                              <div class="col-md-12 order-md-1 provider-form ">
                                <div className="container-fluid">
                                  <div className="card mb-4">
                                  <div class="header pt-1" style={{backgroundColor:"#b2cfdd"}}>
                                      <h6
                                       style={{paddingLeft:"10px" , fontSize:"20px"}}
                                        class="heading"
                                        onClick={(event) => this.showHide(5)}
                                      >
                                        Reports
                                      </h6>
                                      {/* <hr
                                        class="p-0 mt-0 mb-1"
                                        style={{ backgroundColor: "#037592" }}
                                      ></hr> */}
                                      <div class="clearfix"></div>
                                    </div>
                                    <br></br>
                                    <MDBCollapse
                                      id={5}
                                      isOpen={this.state.collapseMenu}
                                    >

                                      < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Search Reports
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="reportsSearch"
                                            name="reportsSearch"
                                            checked={
                                              this.state.userRights
                                                .reportsSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Reports
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="reportsCreate"
                                            name="reportsCreate"
                                            checked={
                                              this.state.userRights
                                                .reportsCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Reports
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="reportsEdit"
                                            name="reportsEdit"
                                            checked={
                                              this.state.userRights.reportsEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Reports
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                             <input
                                            type="checkbox"
                                            id="reportsExport"
                                            name="reportsExport"
                                            checked={
                                              this.state.userRights
                                                .reportsExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>




                              
                              </MDBCollapse>
                                          </div>
                                        </div>
                                      </div>
                                    </div>



                              {/* Scheduler Rights */}

                              <br></br>
                            <div class="row">
                              <div class="col-md-12 order-md-1 provider-form ">
                                <div className="container-fluid">
                                  <div className="card mb-4">
                                  <div class="header pt-1" style={{backgroundColor:"#b2cfdd"}}>
                                      <h6
                                      style={{paddingLeft:"10px" , fontSize:"20px"}}
                                        class="heading"
                                        onClick={(event) => this.showHide(6)}
                                      >
                                        Scheduler
                                      </h6>
                                      {/* <hr
                                        class="p-0 mt-0 mb-1"
                                        style={{ backgroundColor: "#037592" }}
                                      ></hr> */}
                                      <div class="clearfix"></div>
                                    </div>
                                    <br></br>
                                    <MDBCollapse
                                      id={6}
                                      isOpen={this.state.collapseMenu}
                                    >

                                      < div class="row">
                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                            Search Scheduler
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="schedulerSearch"
                                            name="schedulerSearch"
                                            checked={
                                              this.state.userRights
                                                .schedulerSearch
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Add Scheduler
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div className="lblChkBox">
                                            <input
                                            type="checkbox"
                                            id="schedulerCreate"
                                            name="schedulerCreate"
                                            checked={
                                              this.state.userRights
                                                .schedulerCreate
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Update Scheduler
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="schedulerEdit"
                                            name="schedulerEdit"
                                            checked={
                                              this.state.userRights
                                                .schedulerEdit
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>

                                        <div class="col-md-3 mb-2">
                                          <div class="col-md-6 float-left">
                                            <label for="name">
                                              Export Scheduler
                                            </label>
                                          </div>
                                          <div class="col-md-6 float-left">
                                            <div
                                              className="lblChkBox"
                                              onClick={this.handleCheckBox}
                                            >
                                              <input
                                            type="checkbox"
                                            id="schedulerExport"
                                            name="schedulerExport"
                                            checked={
                                              this.state.userRights
                                                .schedulerExport
                                            }
                                            onClick={this.handleCheckedChange}
                                          />
                                              <label htmlFor="markInCapitated">
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="invalid-feedback">
                                            {/* {this.state.validationModel.planNameValField} */}
                                          </div>
                                        </div>
                                      </div>




                              
                              </MDBCollapse>
                                          </div>
                                        </div>
                                      </div>
                                    </div>



                          </div>
                        </div>
                      </Tab>
                    </Tabs>

                    {/* Main Content End */}

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <Hotkeys
                        keyName="alt+s"
                        onKeyDown={this.onKeyDown.bind(this)}
                        onKeyUp={this.onKeyUp.bind(this)}
                      >
                        <button
                          class="btn btn-primary mr-2"
                          type="submit"
                          onClick={this.saveUser}
                          disabled={this.isDisabled(
                            this.state.editId > 0
                              ? this.props.rights.update
                              : this.props.rights.add
                          )}
                        >
                          Save
                        </button>
                      </Hotkeys>

                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={
                          this.props.onClose
                            ? () => this.props.onClose()
                            : () => this.props.onClose()
                        }
                      >
                        Cancel
                      </button>
                    </div>

                    {/* End of Main Content */}
                  </div>
                </div>{" "}
                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        {popup}
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
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.userSearch,
          add: state.loginInfo.rights.userCreate,
          update: state.loginInfo.rights.userEdit,
          delete: state.loginInfo.rights.userDelete,
          export: state.loginInfo.rights.userExport,
          import: state.loginInfo.rights.userImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(NewUser);
