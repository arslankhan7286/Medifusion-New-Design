import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import taxonomyIcon from "../images/code-search-icon.png";
import axios from "axios";
import Input from "./Input";
import leftNavMenusReducer from "../reducers/leftNavMenusReducer";
import Swal from "sweetalert2";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable
} from "mdbreact";
import GridHeading from "./GridHeading";
import { Tabs, Tab } from "react-tab-view";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { log } from "util";

import Hotkeys from "react-hot-keys";

export class NewSubmitter extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Submitter/";
    // this.accountUrl = process.env.REACT_APP_URL + "/account/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";

    this.errorField = "errorField";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.saveSubmitterCount = 0;

    this.SubmitterModal = {
      id: 0,
      name: null,
      address: null,
      city: null,
      state: null,
      zipCode: null,
      email: null,
      submissionUserName: null,
      submissionPassword: null,
      manualSubmission: false,
      fileName: null,
      x12_837_NM1_41_SubmitterName: null,
      x12_837_NM1_41_SubmitterID: null,
      x12_837_ISA_02: "00",
      x12_837_ISA_04: "00",
      x12_837_ISA_06: "ZZ",
      x12_837_GS_02: null,
      submitterContactPerson: null,
      submitterContactNumber: null,
      submitterEmail: null,
      submitterFaxNumber: null,

      x12_270_NM1_41_SubmitterName: null,
      x12_270_NM1_41_SubmitterID: null,
      x12_270_ISA_02: null,
      x12_270_ISA_04: null,
      x12_270_ISA_06: null,
      x12_270_GS_02: null,

      // {SAQIB}

      x12_276_NM1_41_SubmitterName: null,
      x12_276_NM1_41_SubmitterID: null,
      x12_276_ISA_02: null,
      x12_276_ISA_04: null,
      x12_276_ISA_06: null,
      x12_276_GS_02: null,
      receiverID: 0,
      clientID: 0,
      addedBy: null,
      addedDate: "0001-01-01T00:00:00",
      updatedBy: null,
      updatedDate: null,
      isActive: false,
      receiverID: "",
      address: null,
      address2: null,
      phoneNumber: null,
      faxNumber: null,
      email: null,
      website: null,
      autoDownloading: false
    };
    this.searchModel = {
      name: "",
      organizationName: "",
      address: "",
      receiverID: null,
      isChecked: false,
      active: false
    };

    this.validationModel = {
      nameValField: "",
      receiverValField: "",
      organizationNameValField: "",
      npiValField: "",
      taxIDValField: "",
      taxonomyCodeValField: "",
      cliaNumberValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      officePhoneNumValField: "",
      emailValField: "",
      websiteValField: "",
      faxNumberValField: "",
      payToAddress1ValField: "",
      payToAddress2ValField: "",
      payToCityValField: "",
      payToStateValField: "",
      payToZipCodeValField: "",
      notesValField: "",
      clientValField: "",
      validation: false,
      ssnValField: "",
      typeValField: "",
      x12_837_ISA_02ValField: "",
      x12_837_ISA_04ValField: "",
      x12_837_ISA_05ValField: "",
      x12_837_ISA_06ValField: "",

      x12_276_ISA_02ValField: "",
      x12_276_ISA_04ValField: "",
      x12_276_ISA_05ValField: "",
      x12_276_ISA_06ValField: "",

      x12_270_ISA_02ValField: "",
      x12_270_ISA_04ValField: "",
      x12_270_ISA_05ValField: "",
      x12_270_ISA_06ValField: ""
    };

    this.state = {
      editId: this.props.SubmitterID,
      SubmitterModal: this.SubmitterModal,
      validationModel: this.validationModel,
      maxHeight: "361",
      loading: false,
      ReceiverName: [],
      typePractice: false,
      typeValue: "",
      type: "",
      isChecked: false
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.SaveSubmitter = this.SaveSubmitter.bind(this);
    this.handleAutoDownChange = this.handleAutoDownChange.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleZip = this.handleZip.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+s") {
      // alert("save key")
      this.SaveSubmitter();
      console.log(e.which);
    }

    this.setState({
      output: `onKeyDown ${keyName}`
    });
  }

  onKeyUp(keyName, e, handle) {
    console.log("test:onKeyUp", e, handle);
    if (e) {
      console.log("event has been called", e);
    }
    this.setState({
      output: `onKeyUp ${keyName}`
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

  async componentDidMount() {
    this.setState({ loading: true });
    await axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        console.log("Get Profile Receiver : ", response.data.receiver);
        this.setState({ ReceiverName: response.data.receiver });
        console.log("RecieverName", this.state.ReceiverName);
      })
      .catch(error => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            //Swal.fire("Unauthorized Access" , "" , "error");
            console.log(error.response.status);
            return;
          }
        } else if (error.request) {
          console.log(error.request);
          return;
        } else {
          console.log("Error", error.message);
          console.log(JSON.stringify(error));
          //Swal.fire("Something went Wrong" , "" , "error");
          return;
        }

        console.log(error);
      });
    console.log("Edit Id", this.state.editID);
    //Location
    if (this.state.editId > 0) {
      await axios

        .get(this.url + "FindSubmitter/" + this.state.editId, this.config)
        .then(response => {
          // let arrayToPush = [];

          // const pushToProvider = [];
          console.log(
            "response of findReciver in New Reciver Tab:",
            response.data
          );
          this.setState({ SubmitterModal: response.data });
        })
        .catch(error => {
          this.setState({ loading: false });
          if (error.response) {
            if (error.response.status) {
              Swal.fire("Unauthorized Access", "", "error");
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(JSON.stringify(error));
        });
    }

    await this.setModalMaxHeight($(".modal"));
    // if ($('.modal.in').length != 0) {
    //     this.setModalMaxHeight($('.modal.in'));
    // }
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    this.setState({ loading: false });
  }
  handleSameAsAddress = event => { };

  handleZip(event) {
    var zip = event.target.value;
    console.log(zip);

    this.setState({
      SubmitterModal: {
        ...this.state.SubmitterModal,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });

    if (zip.length >= 5 && zip.length <= 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then(response => {
          console.log("ZIP Codes Search Response : ", response.data);
          this.setState({
            SubmitterModal: {
              ...this.state.SubmitterModal,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id
            }
          });
          console.log("Model of zip Code", this.state.SubmitterModal);
        })
        .catch(error => {
          this.setState({ loading: false });

          Swal.fire(
            "Something Wrong",
            "Please Check Server Connection",
            "error"
          );
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
            console.log(errorsList);
          } else console.log(error);
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
      console.log("Zip Code length should be 5");
    }
  }

  handleChangePasswprd = event => {
    event.preventDefault();
    this.setState({
      SubmitterModal: {
        ...this.state.SubmitterModal,

        [event.target.name]: event.target.value
      }
    });
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      SubmitterModal: {
        ...this.state.SubmitterModal,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };

  handleChangeType = event => {
    this.setState({
      typePractice: true,
      type: event.target.value,
      // type: event.target.value
      SubmitterModal: {
        ...this.state.SubmitterModal,
        [event.target.name]: event.target.value
      }
    });
  };

  handleCheck() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        active: !this.state.searchModel.active,

        isChecked: !this.state.searchModel.isChecked
      }
    });
  }

  handleCheckSubmission = () => {
    //  isChecked: !this.state.SubmitterModal.isChecked

    this.setState({
      SubmitterModal: {
        ...this.state.SubmitterModal,
        manualSubmission: !this.state.SubmitterModal.manualSubmission
      }
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
    if (value === "" || value === null || value === undefined) return true;
    else return false;
  }

  SaveSubmitter = e => {
    console.log("Before Update", this.saveSubmitterCount);
    if (this.saveSubmitterCount == 1) {
      return;
    }
    this.saveSubmitterCount = 1;
    if (this.state.loading == true) {
      // this.saveSubmitterCount = 0;

      return;
    }
    console.log("AFter update", this.saveSubmitterCount);
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.SubmitterModal.name)) {
      myVal.nameValField = <span className="validationMsg">Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.SubmitterModal.receiverID)) {
      myVal.receiverValField = (
        <span className="validationMsg">Please Select Receiver Id</span>
      );
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    // if (this.isNull(this.state.SubmitterModal.x12_837_ISA_01) == false) {
    //   if (this.state.SubmitterModal.x12_837_ISA_01.length < 2) {
    //     myVal.x12_837_ISA_02ValField = (
    //       <span className="validationMsg">ISA-01 length should be 2</span>
    //     );
    //     myVal.validation = true;
    //   } else {
    //     myVal.x12_837_ISA_02ValField = "";
    //     if (myVal.validation === false) myVal.validation = false;
    //   }
    // } else {
    //   myVal.x12_837_ISA_02ValField = "";
    //   if (myVal.validation === false) myVal.validation = false;
    // }

    // if (this.isNull(this.state.SubmitterModal.x12_837_ISA_03) == false) {
    //   if (this.state.SubmitterModal.x12_837_ISA_03.length < 2) {
    //     myVal.x12_837_ISA_02ValField = (
    //       <span className="validationMsg">ISA-03 length should be 2</span>
    //     );
    //     myVal.validation = true;
    //   } else {
    //     myVal.x12_837_ISA_04ValField = "";
    //     if (myVal.validation === false) myVal.validation = false;
    //   }
    // } else {
    //   myVal.x12_837_ISA_04ValField = "";
    //   if (myVal.validation === false) myVal.validation = false;
    // }

    if (this.isNull(this.state.SubmitterModal.x12_837_ISA_07) == false) {
      if (this.state.SubmitterModal.x12_837_ISA_07.length < 2) {
        myVal.x12_837_ISA_05ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_837_ISA_05ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_837_ISA_05ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.SubmitterModal.x12_270_ISA_01) == false) {
      if (this.state.SubmitterModal.x12_270_ISA_01.length < 2) {
        myVal.x12_270_ISA_02ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_270_ISA_02ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_270_ISA_02ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.SubmitterModal.x12_270_ISA_03) == false) {
      if (this.state.SubmitterModal.x12_270_ISA_03.length < 2) {
        myVal.x12_270_ISA_04ValField = (
          <span className="validationMsg">ISA-03 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_270_ISA_04ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_270_ISA_04ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.SubmitterModal.x12_270_ISA_07) == false) {
      if (this.state.SubmitterModal.x12_270_ISA_07.length < 2) {
        myVal.x12_270_ISA_05ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_270_ISA_05ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_270_ISA_05ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.SubmitterModal.x12_276_ISA_01) == false) {
      if (this.state.SubmitterModal.x12_276_ISA_01.length < 2) {
        myVal.x12_276_ISA_02ValField = (
          <span className="validationMsg">ISA-01 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_276_ISA_02ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_276_ISA_02ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.SubmitterModal.x12_276_ISA_03) == false) {
      if (this.state.SubmitterModal.x12_276_ISA_03.length < 2) {
        myVal.x12_276_ISA_04ValField = (
          <span className="validationMsg">ISA-03 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_276_ISA_04ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_276_ISA_04ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.SubmitterModal.x12_276_ISA_07) == false) {
      if (this.state.SubmitterModal.x12_276_ISA_07.length < 2) {
        myVal.x12_276_ISA_05ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_276_ISA_05ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_276_ISA_05ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.SubmitterModal.zipCode) === false &&
      this.state.SubmitterModal.zipCode.length > 0
    ) {
      if (this.state.SubmitterModal.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.SubmitterModal.zipCode.length > 5 &&
        this.state.SubmitterModal.zipCode.length < 9
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
    console.log("ReportingTo");

    if (
      this.isNull(this.state.SubmitterModal.fax) === false &&
      this.state.SubmitterModal.fax.length < 10
    ) {
      myVal.faxNumberValField = (
        <span className="validationMsg">Fax # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.faxNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.SubmitterModal.phoneNumber) === false &&
      this.state.SubmitterModal.phoneNumber.length < 10
    ) {
      myVal.officePhoneNumValField = (
        <span className="validationMsg">Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.officePhoneNumValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    myVal.emailValField = "";
    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveSubmitterCount = 0;

      return;
    }

    console.log("SubmitterModal::>>", this.state.SubmitterModal);
    var config = {
      headers: { Authorization: "Bearer  " + this.props.loginObject.token }
    };

    axios
      .post(this.url + "SaveSubmitter", this.state.SubmitterModal, config)
      .then(response => {
        console.log("Response Data of SaveSubmitter : ", response);
        this.saveSubmitterCount = 0;
        this.setState({ SubmitterModal: response.data, loading: false });
        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.saveSubmitterCount = 0;

        console.log(error);
        this.setState({ loading: false });
        try {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              } else if (error.response.status == 400) {
                Swal.fire(
                  "Bad Request",
                  "Failed With Status Code 400",
                  "error"
                );
                return;
              } else if (error.response.status == 404) {
                Swal.fire("Not Found", "Failed With Status Code 404", "error");
                return;
              }
            }
          } else {
            console.log("Error", error.message);
            Swal.fire("Something went Wrong", "", "error");
            return;
          }

          if (error.response.data.Email[0] == "Please enter Valid Email ID") {
            //Swal.fire("Something Wrong", error.response.data.Email[0], "error");
            myVal.emailValField = (
              <span className="validationMsg">Please enter Valid Email ID</span>
            );
            myVal.validation = true;
          } else {
            myVal.emailValField = "";
            if (myVal.validation === false) myVal.validation = false;
          }
          this.setState({
            validationModel: myVal
          });
        } catch { }
      });
    if (this.state.loading == true) {
      return;
    }

    this.setState({ loading: true });

    console.log(this.state.SubmitterModal);
  };

  delete = e => {
    var config = {
      headers: { Authorization: "Bearer  " + this.props.loginObject.token }
    };

    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(this.url + "DeleteSubmitter/" + this.state.editId, config)
          .then(response => {
            this.setState({ loading: false });
            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch(error => {
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
            if (error.response) {
              if (error.response.status) {
                Swal.fire("Unauthorized Access", "", "error");
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            console.log(JSON.stringify(error));
          });

        $("#btnCancel").click();
      }
    });
  };
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = id => {
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  handleAutoDownChange() {
    let isChecked = !this.state.SubmitterModal.autoDownloading;

    this.setState({
      SubmitterModal: {
        ...this.state.SubmitterModal,
        autoDownloading: isChecked
      }
    });
    

  }


  render() {

    console.log("Model ", this.state.SubmitterModal);
    const SubmissionDD = [
      { value: "", display: "Select Type" },
      { value: "SFTP", display: "SFTP" },
      { value: "FTP", display: "FTP" }
    ];

    const headers = ["Location", "Provider", "Referring Providers"];

    const locationData = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 150
        },
        {
          label: "NAME",
          field: "name",
          sort: "asc",
          width: 150
        },
        {
          label: "ORGANIZATION NAME",
          field: "organizationName",
          sort: "asc",
          width: 300
        },
        {
          label: "PRACTICE",
          field: "practice",
          sort: "asc",
          width: 250
        },

        {
          label: "NPI",
          field: "npi",
          sort: "asc",
          width: 200
        },
        {
          label: "PASCODE",
          field: "pascode",
          sort: "asc",
          width: 150
        },
        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.locationData
    };
    const providerData = {
      columns: [
        {
          label: "ID",
          field: "Id",
          sort: "asc",
          width: 150
        },
        {
          label: "NAME",
          field: "name",
          sort: "asc",
          width: 150
        },
        {
          label: "LAST NAME",
          field: "lastName",
          sort: "asc",
          width: 150
        },
        {
          label: "FIRST NAME ",
          field: "firstName",
          sort: "asc",
          width: 150
        },
        {
          label: "NPI",
          field: "npi",
          sort: "asc",
          width: 150
        },

        {
          label: "SSN",
          field: "ssn",
          sort: "asc",
          width: 150
        },
        {
          label: "TEXONOMY CODE",
          field: "texonomycode",
          sort: "asc",
          width: 150
        },
        {
          label: "ADDRESS ,CITY, STATE, ZIP",
          field: "address",
          sort: "asc",
          width: 150
        },
        {
          label: "OFFICE PHONE#",
          field: "phone",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.providerData
    };
    const RefProviderData = {
      columns: [
        {
          label: "ID",
          field: "referingId",
          sort: "asc",
          width: 150
        },
        {
          label: "NAME",
          field: "referingName",
          sort: "asc",
          width: 150
        },
        {
          label: "LAST NAME",
          field: "rLastName",
          sort: "asc",
          width: 150
        },
        {
          label: "FIRST NAME ",
          field: "rFirstName",
          sort: "asc",
          width: 150
        },
        {
          label: "NPI",
          field: "referingNpi",
          sort: "asc",
          width: 150
        },

        {
          label: "SSN",
          field: "referingSsn",
          sort: "asc",
          width: 150
        },
        {
          label: "TEXONOMY CODE",
          field: "referingTexonomy",
          sort: "asc",
          width: 150
        },
        {
          label: "ADDRESS ,CITY, STATE, ZIP",
          field: "referingAddress",
          sort: "asc",
          width: 150
        },
        {
          label: "OFFICE PHONE#",
          field: "referingPhone",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.RefProviderData
    };

    const type = [
      { value: "", display: "Select Type" },
      { value: "SP", display: "Solo Practice" },
      { value: "GP", display: "Group Practice" }
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
      { value: "WY", display: "WY - Wyoming" }
    ];

    const isActive = this.state.SubmitterModal.isActive;

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

    const options = [
      { value: "History", label: "History", className: "dropdown" }
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingsIcon} />
      </div>
    );

    var dropdown;
    dropdown = (
      <Dropdown
        className="TodayselectContainer"
        options={options}
        onChange={() => this.openhistorypopup(0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <NewHistoryPractice
          onClose={() => this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
        // disabled={this.isDisabled(this.props.rights.update)}
        // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    let typeValuefield = "";
    if (
      this.state.typePractice === true &&
      this.state.SubmitterModal.type == "SP"
    ) {
      //  alert("Hi:True" + this.state.typeValue)

      typeValuefield = (
        <div className="row-form">
          <div className="mf-6">
            <label>
              SSN <span className="redlbl"> *</span>
            </label>
            <div className="textBoxValidate">
              <Input
                className={
                  this.state.validationModel.npiValField ? this.errorField : ""
                }
                type="text"
                value={this.state.SubmitterModal.ssn}
                name="ssn"
                id="ssn"
                max="9"
                onChange={() => this.handleChange}
                onKeyPress={event => this.handleNumericCheck(event)}
              />
              {/* <Input name="ssn" id="ssn" max='9'/> */}
              {this.state.validationModel.ssnValField}
            </div>
          </div>
          <div className="mf-6"></div>
        </div>
      );
    } else {
      //alert("Hi:False" + this.state.typeValue)
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
            // style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "300px", maxHeight: "700px" }}
            >

              <div
                class="modal-header"
                style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.receiverID > 0
                          ? this.state.SubmitterModal.name.toUpperCase() +
                          " - " +
                          this.state.SubmitterModal.id
                          : "NEW SUBMITTER"}
                      </h3>

                      <div class="float-lg-right text-right">

                        <input class="checkbox" type="checkbox" checked={isActive} onClick={this.handleCheck} />
                        Mark Inactive

                       <button
                          class=" btn btn-primary mr-2"
                          type="submit"
                          onClick={this.delete}
                          disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          Delete
                        </button>
                        {/* {this.state.editId > 0 ?
                          (<img src={settingIcon} alt="" style={{ width: "17px" }} />) : null} */}
                        {this.state.editId > 0 ? dropdown : ""}

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

                    {/* Main Content */}

                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Name"
                            value={this.state.SubmitterModal.name}
                            name="name"
                            id="name"
                            maxLength="30"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.nameValField}
                        </div>
                      </div>
            
                      <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Receiver<span class="text-danger">*</span>
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
                                  color: "rgb(67, 75, 93"
                                }}
                                name="receiverID"
                                id="receiverID"
                                value={this.state.SubmitterModal.receiverID}
                                onChange={this.handleChange}
                              >
                              {this.state.ReceiverName.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.description}
                            </option>
                          ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.receiverValField}
                            </div>
                          </div>
                      <div class="col-md-4 mb-2"></div>
                      <div class="col-md-4 mb-2"></div>
                    </div>

                    {/* Address Information */}
                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Addres Information</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Address 1
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 1"
                                value={this.state.SubmitterModal.address1}
                                name="address1"
                                id="address1"
                                maxLength="55"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Address 2
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 2"
                                value={this.state.SubmitterModal.address2}
                                name="address2"
                                id="address2"
                                maxLength="55"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                City
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="City"
                                value={this.state.SubmitterModal.city}
                                name="city"
                                id="city"
                                maxLength="20"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.cityValField}
                            </div>
                          </div>

                        </div>

                        <div class="row">
                     

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                State
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
                                  color: "rgb(67, 75, 93"
                                }}
                                name="state"
                                id="state"
                                value={this.state.SubmitterModal.state}
                                onChange={this.handleChange}
                              >
                                {usStates.map(s => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.stateValField}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Zip Code
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Zip Code"
                                value={this.state.SubmitterModal.zipCode}
                                name="zipCode"
                                id="zipCode"
                                maxLength="9"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.zipCodeValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Fax #
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Fax #"
                                value={this.state.SubmitterModal.fax}
                                name="fax"
                                id="fax"
                                maxLength="10"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.faxNumberValField}
                            </div>
                          </div>

                        </div>


                        <div class="row">
                   

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Phone 
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Phone"
                                value={this.state.SubmitterModal.phoneNumber}
                                name="phoneNmber"
                                id="phoneNumber"
                                maxLength="10"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.officePhoneNumValField}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Website
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Website"
                                value={this.state.SubmitterModal.website}
                                name="website"
                                id="website"
                                maxLength="50"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.websiteValField}
                            </div>
                          </div>
                          
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Email
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Website"
                                value={this.state.SubmitterModal.email}
                                name="email"
                                id="email"
                                maxLength="60"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.emailValField}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>


                    {/* EDI 837 Values */}
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">EDI 837 Values</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Submitter Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submitter Name"
                                value={
                                  this.state.SubmitterModal.x12_837_NM1_41_SubmitterName
                                }
                                name="x12_837_NM1_41_SubmitterName"
                                id="x12_837_NM1_41_SubmitterName"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Submitter ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submitter ID"
                                value={
                                  this.state.SubmitterModal.x12_837_NM1_41_SubmitterID
                                }
                                name="x12_837_NM1_41_SubmitterID"
                                id="x12_837_NM1_41_SubmitterID"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Contact Person
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Contact Person"
                                value={
                                  this.state.SubmitterModal.submitterContactPerson
                                }
                                name="submitterContactPerson"
                                id="submitterContactPerson"
                                maxLength="30"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>


                      
                        </div>

                        <div class="row">
                        <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Contact #
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Contact #"
                                value={
                                  this.state.SubmitterModal.submitterContactNumber
                                }
                                name="submitterContactNumber"
                                id="submitterContactNumber"
                                maxLength="30"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Email
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Website"
                                value={this.state.SubmitterModal.submitterEmail}
                                name="submitterEmail"
                                id="submitterEmail"
                                maxLength="60"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.emailValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Fax #
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Fax #"
                                value={this.state.SubmitterModal.submitterFaxNumber}
                                name="submitterFaxNumber"
                                id="submitterFaxNumber"
                                maxLength="9"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              ISA02
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA02"
                                value={this.state.SubmitterModal.x12_837_ISA_02}
                                name="x12_837_ISA_02"
                                id="x12_837_ISA_02"
                                maxLength="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_270_ISA_02ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              ISA04
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA04"
                                value={this.state.SubmitterModal.x12_837_ISA_04}
                                name="x12_837_ISA_04"
                                id="x12_837_ISA_04"
                                maxLength="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_837_ISA_04ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              ISA05
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA05"
                                value={this.state.SubmitterModal.x12_837_ISA_05}
                                name="x12_837_ISA_05"
                                id="x12_837_ISA_05"
                                maxLength="2"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.x12_837_ISA_05ValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              ISA06
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                // placeholder="ISA06"
                                value={this.state.SubmitterModal.x12_837_ISA_06}
                                name="x12_837_ISA_06"
                                id="x12_837_ISA_06"
                                maxLength="15"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.x12_837_ISA_05ValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              GS 02
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                // placeholder="ISA06"
                                value={this.state.SubmitterModal.x12_837_GS_02}
                                name="x12_837_GS_02"
                                id="x12_837_GS_02"
                                maxLength="15"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.x12_837_ISA_05ValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Submission User Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submission User Name"
                                value={this.state.SubmitterModal.submissionUserName}
                                name="submissionUserName"
                                id="submissionUserName"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.x12_837_ISA_05ValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Submission Password                    
                          </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submission Directory"
                                value={this.state.SubmitterModal.submissionPassword}
                                maxLength="30"
                                name="submissionPassword"
                                id="submissionPassword"
                                onChange={this.handleChangePasswprd}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Manual Submission</label>
                    </div>
                    <div class="col-md-7 float-left">
                    <div style={{ marginBottom: "10px" }}
                          class="lblChkBox"
                        >
                          <input
                            type="checkbox"
                            id="manualSubmission"
                            name="manualSubmission"
                            checked={this.state.SubmitterModal.manualSubmission}
                            onClick={this.handleCheckSubmission}
                          />
                          <label for="reportTaxID">
                            <span></span>
                          </label>
                       </div>
                    </div>
                    <div class="invalid-feedback">
                    </div>
                  </div>
                </div>
             </div>
          </div>


                    {/* EDI 270 Values */}
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">EDI 270 Values</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Submitter Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                placeholder="Submitter Name"
                                class="provider-form w-100 form-control-user"
                                value={
                                  this.state.SubmitterModal.x12_270_NM1_41_SubmitterName
                                }
                                name="x12_270_NM1_41_SubmitterName"
                                id="x12_270_NM1_41_SubmitterName"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Submitter ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                max="10"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submitter ID"
                                value={
                                  this.state.SubmitterModal.x12_270_NM1_41_SubmitterID
                                }
                                name="x12_270_NM1_41_SubmitterID"
                                id="x12_270_NM1_41_SubmitterID"
                                maxLength="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA02
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA02"
                                value={this.state.SubmitterModal.x12_270_ISA_02}
                                maxLength="10"
                                name="x12_270_ISA_02"
                                id="x12_270_ISA_02"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_270_ISA_04ValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA04
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA04"
                                value={this.state.SubmitterModal.x12_270_ISA_04}
                                maxLength="10"
                                name="x12_270_ISA_04"
                                id="x12_270_ISA_04"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_270_ISA_04ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA05
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA05"
                                value={this.state.SubmitterModal.x12_270_ISA_05}
                                maxLength="2"
                                name="x12_270_ISA_05"
                                id="x12_270_ISA_05"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_270_ISA_05ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA06
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA06"
                                value={this.state.SubmitterModal.x12_270_ISA_06}
                                maxLength="15"
                                name="x12_270_ISA_06"
                                id="x12_270_ISA_06"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                        </div>

                        <div class="row">

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                GS 02
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" GS 02"
                                value={this.state.SubmitterModal.x12_270_GS_02}
                                name="x12_270_GS_02"
                                id="x12_270_GS_02"
                                maxLength="15"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* EDI 276 Values */}
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">EDI 276 Values</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Submitter Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submitter Name"
                                value={
                                  this.state.SubmitterModal.x12_276_NM1_41_SubmitterName
                                }
                                name="x12_276_NM1_41_SubmitterName"
                                id="x12_276_NM1_41_SubmitterName"
                                maxLength="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              Submitter ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submitter ID"
                                value={
                                  this.state.SubmitterModal.x12_276_NM1_41_SubmitterID
                                }
                                name="x12_276_NM1_41_SubmitterID"
                                id="x12_276_NM1_41_SubmitterID"
                                maxLength="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA02
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA02"
                                value={this.state.SubmitterModal.x12_276_ISA_02}
                                maxLength="10"
                                name="x12_276_ISA_02"
                                id="x12_276_ISA_02"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_276_ISA_02ValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA04
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA04"
                                value={this.state.SubmitterModal.x12_276_ISA_04}
                                maxLength="10"
                                name="x12_276_ISA_04"
                                id="x12_276_ISA_04"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_276_ISA_04ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA05
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA05"
                                value={this.state.SubmitterModal.x12_276_ISA_05}
                                maxLength="2"
                                name="x12_276_ISA_05"
                                id="x12_276_ISA_05"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_276_ISA_05ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA06
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA06"
                                value={this.state.SubmitterModal.x12_276_ISA_06}
                                maxLength="15"
                                name="x12_276_ISA_06"
                                id="x12_276_ISA_06"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                        </div>

                        <div class="row">

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                              GS 02
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="GS 02"
                                value={this.state.SubmitterModal.x12_276_GS_02}
                                name="x12_276_GS_02"
                                id="x12_276_GS_02"
                                maxLength="15"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2"> </div>
                       
                         
                          <div class="col-md-4 mb-2"> </div>
                            
                         
                        </div>
                      </div>
                    </div>


                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.SaveSubmitter}
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
                </div>

                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        {popup}
      </React.Fragment >
    );
  }
}

function mapStateToProps(state) {
  console.log("state from Header Page", state);
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
        search: state.loginInfo.rights.submitterSearch,
        add: state.loginInfo.rights.submitterCreate,
        update: state.loginInfo.rights.submitterUpdate,
        delete: state.loginInfo.rights.submitterDelete,
        export: state.loginInfo.rights.submitterExport,
        import: state.loginInfo.rights.submitterImport
      }
      : []
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewSubmitter);
