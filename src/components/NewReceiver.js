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
import settingIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { log } from "util";

export class NewReceiver extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Receiver/";
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
    // {Faisal}

    this.saveReceiverCount = 0;


    this.ReceiverModal = {
      id: 0,
      name: null,
      address: null,
      city: null,
      state: null,
      zipCode: null,
      submissionMethod: null,
      submissionURL: null,
      submissionPort: null,
      submissionDirectory: null,
      reportsDirectory: null,
      erasDirectory: null,
      x12_837_NM1_40_ReceiverName: null,
      x12_837_NM1_40_ReceiverID: null,
      x12_837_ISA_01: "00",
      x12_837_ISA_03: "00",
      x12_837_ISA_05: null,
      x12_837_ISA_07: "ZZ",
      x12_837_ISA_08: null,
      x12_837_GS_03: null,
      x12_270_NM1_40_ReceiverName: null,
      x12_270_NM1_40_ReceiverID: null,

      x12_270_ISA_01: "00",
      x12_270_ISA_03: "00",
      x12_270_ISA_05: null,
      x12_270_ISA_07: "ZZ",
      x12_270_ISA_08: null,
      x12_270_GS_03: null,

      x12_276_NM1_40_ReceiverName: null,
      x12_276_NM1_40_ReceiverID: null,
      x12_276_ISA_01: "00",
      x12_276_ISA_03: "00",
      x12_276_ISA_05: null,
      x12_276_ISA_07: "ZZ",
      x12_276_ISA_08: null,
      x12_276_GS_03: null,
      elementSeperator: "*",
      segmentSeperator: "~",
      subElementSeperator: ":",
      repetitionSepeator: "^",
      addedBy: null,
      addedDate: "0001-01-01T00:00:00",
      updatedBy: null,
      updatedDate: "0001-01-01T00:00:00",
      address1: null,
      address2: null,
      phoneNumber: null,
      faxNumber: null,
      email: null,
      website: null
    };

    this.validationModel = {
      nameValField: "",
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
      x12_837_ISA_01ValField: "",
      x12_837_ISA_03ValField: "",
      x12_837_ISA_07ValField: "",
      x12_837_ISA_08ValField: "",

      x12_276_ISA_01ValField: "",
      x12_276_ISA_03ValField: "",
      x12_276_ISA_07ValFieldP: "",
      x12_276_ISA_08ValField: "",

      x12_270_ISA_01ValField: "",
      x12_270_ISA_03ValField: "",
      x12_270_ISA_07ValField: "",
      x12_270_ISA_08ValField: ""
    };

    this.state = {
      editId: this.props.receiverID,
      ReceiverModal: this.ReceiverModal,
      validationModel: this.validationModel,
      maxHeight: "361",
      loading: false,
      client: [],
      typePractice: false,
      typeValue: "",
      type: "",
      showPopup: ""
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.SaveReceiver = this.SaveReceiver.bind(this);
    //this.handleSameAsAddress = this.handleSameAsAddress.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleZip = this.handleZip.bind(this);
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
    await this.setState({ loading: true })
    console.log("Edit Id", this.state.editID);
    //Location
    if (this.state.editId > 0) {
      await axios

        .get(this.url + "FindReceiver/" + this.state.editId, this.config)
        .then(response => {
          // let arrayToPush = [];

          // const pushToProvider = [];
          console.log(
            "response of findReciver in New Reciver Tab:",
            response.data
          );
          this.setState({ ReceiverModal: response.data });
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
      ReceiverModal: {
        ...this.state.ReceiverModal,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then(response => {
          console.log("ZIP Codes Search Response : ", response.data);
          this.setState({
            ReceiverModal: {
              ...this.state.ReceiverModal,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id
            }
          });
          console.log("Model of zip Code", this.state.ReceiverModal);
        })
        .catch(error => {
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
            console.log(errorsList);
          } else console.log(error);
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
      console.log("Zip Code length should be 5");
    }
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      ReceiverModal: {
        ...this.state.ReceiverModal,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase()
      }
    });
  };

  handleChangeType = event => {
    this.setState({
      typePractice: true,
      type: event.target.value,
      // type: event.target.value
      ReceiverModal: {
        ...this.state.ReceiverModal,
        [event.target.name]: event.target.value
      }
    });
  };

  handleCheck() {
    this.setState({
      ReceiverModal: {
        ...this.state.ReceiverModal,
        isActive: !this.state.ReceiverModal.isActive
      }
    });
  }

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

  SaveReceiver = e => {
    console.log("Before Update", this.saveReceiverCount)
    if (this.saveReceiverCount == 1) {
      return
    }
    this.saveReceiverCount = 1;
    if (this.state.loading == true) {
      return;
    }
    console.log("AFter update", this.saveReceiverCount)

    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.ReceiverModal.name)) {
      myVal.nameValField = <span className="validationMsg">Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_837_ISA_01) == false) {
      if (this.state.ReceiverModal.x12_837_ISA_01.length < 2) {
        myVal.x12_837_ISA_01ValField = (
          <span className="validationMsg">ISA-01 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_837_ISA_01ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_837_ISA_01ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_837_ISA_03) == false) {
      if (this.state.ReceiverModal.x12_837_ISA_03.length < 2) {
        myVal.x12_837_ISA_01ValField = (
          <span className="validationMsg">ISA-03 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_837_ISA_03ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_837_ISA_03ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_837_ISA_07) == false) {
      if (this.state.ReceiverModal.x12_837_ISA_07.length < 2) {
        myVal.x12_837_ISA_07ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_837_ISA_07ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_837_ISA_07ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_270_ISA_01) == false) {
      if (this.state.ReceiverModal.x12_270_ISA_01.length < 2) {
        myVal.x12_270_ISA_01ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_270_ISA_01ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_270_ISA_01ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_270_ISA_03) == false) {
      if (this.state.ReceiverModal.x12_270_ISA_03.length < 2) {
        myVal.x12_270_ISA_03ValField = (
          <span className="validationMsg">ISA-03 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_270_ISA_03ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_270_ISA_03ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_270_ISA_07) == false) {
      if (this.state.ReceiverModal.x12_270_ISA_07.length < 2) {
        myVal.x12_270_ISA_07ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_270_ISA_07ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_270_ISA_07ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_276_ISA_01) == false) {
      if (this.state.ReceiverModal.x12_276_ISA_01.length < 2) {
        myVal.x12_276_ISA_01ValField = (
          <span className="validationMsg">ISA-01 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_276_ISA_01ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_276_ISA_01ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_276_ISA_03) == false) {
      if (this.state.ReceiverModal.x12_276_ISA_03.length < 2) {
        myVal.x12_276_ISA_03ValField = (
          <span className="validationMsg">ISA-03 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_276_ISA_03ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_276_ISA_03ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ReceiverModal.x12_276_ISA_07) == false) {
      if (this.state.ReceiverModal.x12_276_ISA_07.length < 2) {
        myVal.x12_276_ISA_07ValField = (
          <span className="validationMsg">ISA-07 length should be 2</span>
        );
        myVal.validation = true;
      } else {
        myVal.x12_276_ISA_07ValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.x12_276_ISA_07ValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.ReceiverModal.zipCode) === false &&
      this.state.ReceiverModal.zipCode.length > 0
    ) {
      if (this.state.ReceiverModal.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.ReceiverModal.zipCode.length > 5 &&
        this.state.ReceiverModal.zipCode.length < 9
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
      this.isNull(this.state.ReceiverModal.fax) === false &&
      this.state.ReceiverModal.fax.length < 10
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
      this.isNull(this.state.ReceiverModal.phoneNumber) === false &&
      this.state.ReceiverModal.phoneNumber.length < 10
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
      this.saveReceiverCount = 0;

      return;
    }

    console.log("ReceiverModal::>>", this.state.ReceiverModal);
    var config = {
      headers: { Authorization: "Bearer  " + this.props.loginObject.token }
    };

    axios
      .post(this.url + "SaveReceiver", this.state.ReceiverModal, config)
      .then(response => {
        this.saveReceiverCount = 0;

        console.log("Response Data of SaveReceiver : ", response);
        this.setState({ ReceiverModal: response.data, loading: false });
        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.saveReceiverCount = 0;

        console.log(error);
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


        } catch{ }
      });
    if (this.state.loading == true) {
      return;
    }

    this.setState({ loading: true });

    console.log(this.state.ReceiverModal);
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
          .delete(this.url + "DeleteReceiver/" + this.state.editId, config)
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
                // Swal.fire("Unauthorized Access", "", "error");
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


  render() {
    const SubmissionDD = [
      { value: "", display: "Select Type" },
      { value: "SFTP", display: "SFTP" },
      { value: "FTP", display: "FTP" }
    ];

    const headers = ["Location", "Provider", "Referring Providers"];


    const options = [
      { value: "History", label: "History", className: "dropdown" }
    ];

    var Imag;
    Imag = (
      <div>
        <img
          src={settingIcon}
        />
      </div>
    );

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

    const isActive = this.state.ReceiverModal.isActive;

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
                          ? this.state.ReceiverModal.name.toUpperCase() +
                          " - " +
                          this.state.ReceiverModal.id
                          : "NEW RECEIVER"}
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
                            value={this.state.ReceiverModal.name}
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
                                value={this.state.ReceiverModal.address1}
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
                                value={this.state.ReceiverModal.address2}
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
                                Email
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Email"
                                value={this.state.ReceiverModal.email}
                                name="email"
                                id="email"
                                maxLength="55"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>

                        </div>

                        <div class="row">
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
                                value={this.state.ReceiverModal.city}
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
                                value={this.state.ReceiverModal.state}
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
                                value={this.state.ReceiverModal.zipCode}
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

                        </div>


                        <div class="row">
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
                                value={this.state.ReceiverModal.fax}
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
                                value={this.state.ReceiverModal.phoneNumber}
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
                                value={this.state.ReceiverModal.website}
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

                        </div>
                      </div>
                    </div>

                    {/* EDI Settings */}
                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">EDI Settings</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Segment Seperator
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Segment Seperator"
                                value={this.state.ReceiverModal.segmentSeperator}
                                name="segmentSeperator"
                                id="segmentSeperator"
                                maxLength="1"
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
                                Element Seperator
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Element Seperato"
                                value={this.state.ReceiverModal.elementSeperator}
                                name="elementSeperator"
                                id="elementSeperator"
                                maxLength="1"
                                onChange={this.handleChange}
                              />
                            </div>
                            {/* <div class="invalid-feedback">
                              {this.state.validationModel.officePhoneNumValField} */}
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Sub Element Seperator
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Sub Element Seperator"
                                value={this.state.ReceiverModal.subElementSeperator}
                                name="subElementSeperator"
                                id="subElementSeperator"
                                maxLength="1"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.websiteValField} */}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Repition Seperator
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Repition Seperator"
                                value={this.state.ReceiverModal.repetitionSepeator}
                                maxLength="1"
                                name="repetitionSepeator"
                                id="repetitionSepeator"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2"></div>
                          <div class="col-md-4 mb-2"></div>

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
                                Organization Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Organization Name"
                                value={
                                  this.state.ReceiverModal.x12_837_NM1_40_ReceiverName
                                }
                                name="x12_837_NM1_40_ReceiverName"
                                id="x12_837_NM1_40_ReceiverName"
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
                                Receiver ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Receiver ID"
                                value={
                                  this.state.ReceiverModal.x12_837_NM1_40_ReceiverID
                                }
                                name="x12_837_NM1_40_ReceiverID"
                                id="x12_837_NM1_40_ReceiverID"
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
                                Submission Method 
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
                                name="submissionMethod"
                                id="submissionMethod"
                                value={this.state.ReceiverModal.submissionMethod}
                                onChange={this.handleChange}
                              >
                                {SubmissionDD.map(s => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
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
                                Submission URL
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submission URL"
                                value={this.state.ReceiverModal.submissionURL}
                                name="submissionURL"
                                id="submissionURL"
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
                                Submission Port
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submission Port"
                                value={this.state.ReceiverModal.submissionPort}
                                name="submissionPort"
                                id="submissionPort"
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
                                Submission Directory
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submission Directory"
                                value={this.state.ReceiverModal.submissionDirectory}
                                maxLength="9"
                                name="submissionDirectory"
                                id="submissionDirectory"
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
                                Reports Directory
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Reports Directory"
                                value={this.state.ReceiverModal.reportsDirectory}
                                name="reportsDirectory"
                                id="reportsDirectory"
                                max="55"
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
                                Eras Directory
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Eras Directory"
                                value={this.state.ReceiverModal.erasDirectory}
                                maxLength="9"
                                name="erasDirectory"
                                id="erasDirectory"
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
                                ISA01
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA01"
                                value={this.state.ReceiverModal.x12_837_ISA_01}
                                maxLength="2"
                                name="x12_837_ISA_01"
                                id="x12_837_ISA_01"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_837_ISA_01ValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA03
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA03"
                                value={this.state.ReceiverModal.x12_837_ISA_03}
                                maxLength="2"
                                name="x12_837_ISA_03"
                                id="x12_837_ISA_03"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_837_ISA_03ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA07
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA07"
                                value={this.state.ReceiverModal.x12_837_ISA_07}
                                maxLength="2"
                                name="x12_837_ISA_07"
                                id="x12_837_ISA_07"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_837_ISA_07ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA08
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA08"
                                value={this.state.ReceiverModal.x12_837_ISA_08}
                                maxLength="15"
                                name="x12_837_ISA_08"
                                id="x12_837_ISA_08"
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
                                GS 03
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="GS 03"
                                value={this.state.ReceiverModal.x12_837_GS_03}
                                name="x12_837_GS_03"
                                id="x12_837_GS_03"
                                maxLength="15"
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
                                NM1-40 Receiver Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NM1-40 Receiver Name"
                                value={
                                  this.state.ReceiverModal.x12_837_NM1_40_ReceiverName
                                }
                                name="x12_837_NM1_40_ReceiverName"
                                id="x12_837_NM1_40_ReceiverName"
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
                                NM1-40 Receiver ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NM1-40 Receiver ID"
                                value={
                                  this.state.ReceiverModal.x12_837_NM1_40_ReceiverID
                                }
                                maxLength="9"
                                name="x12_837_NM1_40_ReceiverID"
                                id="x12_837_NM1_40_ReceiverID"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
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
                                Organization Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Organization Name"
                                value={
                                  this.state.ReceiverModal.x12_270_NM1_40_ReceiverName
                                }
                                name="x12_270_NM1_40_ReceiverName"
                                id="x12_270_NM1_40_ReceiverName"
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
                                Receiver ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Receiver ID"
                                value={
                                  this.state.ReceiverModal.x12_270_NM1_40_ReceiverID
                                }
                                name="x12_270_NM1_40_ReceiverID"
                                id="x12_270_NM1_40_ReceiverID"
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
                                ISA01
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA01"
                                alue={this.state.ReceiverModal.x12_270_ISA_01}
                                maxLength="2"
                                name="x12_270_ISA_01"
                                id="x12_270_ISA_01"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_270_ISA_01ValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA03
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA03"
                                value={this.state.ReceiverModal.x12_270_ISA_03}
                                maxLength="2"
                                name="x12_270_ISA_03"
                                id="x12_270_ISA_03"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_270_ISA_03ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA07
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA07"
                                value={this.state.ReceiverModal.x12_270_ISA_07}
                                maxLength="2"
                                name="x12_270_ISA_07"
                                id="x12_270_ISA_07"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_270_ISA_07ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA08
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA08"
                                value={this.state.ReceiverModal.x12_270_ISA_08}
                                maxLength="15"
                                name="x12_270_ISA_08"
                                id="x12_270_ISA_08"
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
                                GS 03
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="GS 03"
                                value={this.state.ReceiverModal.x12_270_GS_03}
                                name="x12_270_GS_03"
                                id="x12_270_GS_03"
                                maxLength="15"
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
                                NM1-40 Receiver Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NM1-40 Receiver Name"
                                value={
                                  this.state.ReceiverModal.x12_270_NM1_40_ReceiverName
                                }
                                name="x12_270_NM1_40_ReceiverName"
                                id="x12_270_NM1_40_ReceiverName"
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
                                NM1-40 Receiver ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NM1-40 Receiver ID"
                                value={
                                  this.state.ReceiverModal.x12_270_NM1_40_ReceiverID
                                }
                                maxLength="9"
                                name="x12_270_NM1_40_ReceiverID"
                                id="x12_270_NM1_40_ReceiverID"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
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
                                Organization Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Organization Name"
                                value={
                                  this.state.ReceiverModal.x12_276_NM1_40_ReceiverName
                                }
                                name="x12_276_NM1_40_ReceiverName"
                                id="x12_276_NM1_40_ReceiverName"
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
                                Receiver ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Receiver ID"
                                value={
                                  this.state.ReceiverModal.x12_276_NM1_40_ReceiverID
                                }
                                name="x12_276_NM1_40_ReceiverID"
                                id="x12_276_NM1_40_ReceiverID"
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
                                ISA01
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA01"
                                value={this.state.ReceiverModal.x12_276_ISA_01}
                                maxLength="2"
                                name="x12_276_ISA_01"
                                id="x12_276_ISA_01"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_276_ISA_01ValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA03
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA03"
                                value={this.state.ReceiverModal.x12_276_ISA_03}
                                maxLength="2"
                                name="x12_276_ISA_03"
                                id="x12_276_ISA_03"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_276_ISA_03ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA07
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA07"
                                value={this.state.ReceiverModal.x12_276_ISA_07}
                                maxLength="2"
                                name="x12_276_ISA_07"
                                id="x12_276_ISA_07"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.x12_276_ISA_07ValField}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                ISA08
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ISA08"
                                value={this.state.ReceiverModal.x12_276_ISA_08}
                                maxLength="15"
                                name="x12_276_ISA_08"
                                id="x12_276_ISA_08"
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
                                GS 03
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="GS 03"
                                value={this.state.ReceiverModal.x12_276_GS_03}
                                name="x12_276_GS_03"
                                id="x12_276_GS_03"
                                maxLength="15"
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
                                NM1-40 Receiver Name
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NM1-40 Receiver Name"
                                value={
                                  this.state.ReceiverModal.x12_276_NM1_40_ReceiverName
                                }
                                name="x12_276_NM1_40_ReceiverName"
                                id="x12_276_NM1_40_ReceiverName"
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
                                NM1-40 Receiver ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NM1-40 Receiver ID"
                                value={
                                  this.state.ReceiverModal.x12_276_NM1_40_ReceiverID
                                }
                                max="9"
                                name="x12_276_NM1_40_ReceiverID"
                                id="x12_276_NM1_40_ReceiverID"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.faxNumberValField} */}
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>














                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.SaveReceiver}
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
        search: state.loginInfo.rights.receiverSearch,
        add: state.loginInfo.rights.receiverCreate,
        update: state.loginInfo.rights.receiverupdate,
        delete: state.loginInfo.rights.receiverDelete,
        export: state.loginInfo.rights.receiverExport,
        import: state.loginInfo.rights.receiverImport
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

export default connect(mapStateToProps, matchDispatchToProps)(NewReceiver);
