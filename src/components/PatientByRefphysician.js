import React, { Component, Fragment } from "react";
import Label from "./Label";
import Input from "./Input";
import { withRouter } from "react-router-dom";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable
} from "mdbreact";
import moment from "moment";
import Select, { components } from "react-select";
import GridHeading from "./GridHeading";
import axios from "axios";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import $ from "jquery";
import GPopup from "./GPopup";
import { isNullOrUndefined } from "util";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class PatientByRefphysician extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/RPatient/";
    this.visitUrl = process.env.REACT_APP_URL + "/visit/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      refProviderID: null,
      patientID: null,
      locationID: null,
      dosDateFrom: null,
      dosDateTo: null,
      entryDateFrom: null,
      entryDateTo: null,
      cptID: null
    };

    //Validation Model
    this.validationModel = {
      dosFromValField: "",
      dosToFDValField: "",
      dosToGreaterValField: null,
      // dosToGreaterValField: null,
      selectDOSFromValField: null,

      EntryDateToGreaterValField: null,
      selectEntryFromValField: null,
      entryDateFromValField: "",
      entryDateToValField: "",
      validation: false
    };

    this.state = {
      visitModel: this.visitModel,
      chargeModel: this.chargeModel,
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      isChecked: false,
      data: [],
      refProviderID: {},
      patientID: {},
      cptID: {},
      popupName: "",
      visitPopup: false,
      patientPopup: false,
      id: 0
    };
    this.handleRefProviderChange = this.handleRefProviderChange.bind(this);
    this.handleCPTCodeChange = this.handleCPTCodeChange.bind(this);

    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.openVisitPopup = this.openVisitPopup.bind(this);
    this.closeVisitPopUp = this.closeVisitPopUp.bind(this);
  }
  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }
  openPatientPopup(name, id) {
    this.setState({ popupName: name, patientPopup: true, id: id });
  }

  closePatientPopup() {
    this.setState({ popupName: "", patientPopup: false });
  }

  openVisitPopup(name, id) {
    this.setState({ popupName: name, visitPopup: true, id: id });
  }

  //Close Visit Popup
  closeVisitPopUp() {
    this.setState({ popupName: "", visitPopup: false });
  }

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };
  openPopup = (name, id) => {
    this.setState({ popupName: name, id: id });
  };
  async componentWillMount() {
    try {
      await axios
        .get(this.visitUrl + "GetProfiles", this.config)
        .then(response => {
          console.log("patientDropDown", response.data);
          this.setState({
            supProvider: response.data.refProvider,
            patientDropDown: response.data.patientInfo
          });
        })
        .catch(error => {
          console.log(error);
        });
    } catch {}
  }

  //search Creteria
  searchRefPhysicianReports = e => {
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    //DOS From Future Date Validation
    if (this.isNull(this.state.searchModel.dosDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dosDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.dosFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dosFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //DOS To Future Date Validation
    if (this.isNull(this.state.searchModel.dosDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dosDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.dosToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dosToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    // Dos to should be greater than Dos from
    if (
      this.isNull(this.state.searchModel.dosDateFrom) == false &&
      this.isNull(this.state.searchModel.dosDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.dosDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.dosDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.dosToGreaterValField = (
          <span className="validationMsg">
            DOS To must be greater than DOS From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.dosToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if DOs To is selected Then Make sure than DOS Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.dosDateFrom) == true &&
      this.isNull(this.state.searchModel.dosDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectDOSFromValField = (
        <span className="validationMsg">Select DOS From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectDOSFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date From Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.entryDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date To Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.entryDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date To must be greater than Entry Date From Validation
    // Dos to should be greater than Dos from
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == false &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.entryDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.EntryDateToGreaterValField = (
          <span className="validationMsg">
            DOS To must be greater than DOS From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.EntryDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.EntryDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if Entry Date To is selected Then Make sure than Entry date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == true &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectEntryFromValField = (
        <span className="validationMsg">Select Entry Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectEntryFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    if (myVal.validation == true) {
      this.setState({ validationModel: myVal, loading: false });
      Swal.fire(
        "Something Wrong",
        "Please Select All Fields Properly",
        "error"
      );
      return;
    }

    console.log("searchModel", this.state.searchModel);
    axios
      .post(
        this.url + "GetPatientReferralPhysician",
        this.state.searchModel,
        this.config
      )
      .then(response => {
        console.log("Unit Report Search Response Object : ", response);
        let newList = [];
        if (response.data) {
          console.log("Unit Report Search Response : ", response.data);

          response.data.map((row, i) => {
            newList.push({
             
              dos: row.dos.slice(0, 10),
              refProvider: row.refProvider,
              visitId: (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() => this.openVisitPopup("visit", row.visitId)}
                >
                  {" "}
                  {this.val(row.visitId)}
                </MDBBtn>
              ),
              // visitId: row.visitId,
              accountNo: (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() =>
                    this.openPatientPopup("patient", row.patientID)
                  }
                >
                  {" "}
                  {this.val(row.accountNo)}
                </MDBBtn>
              ),
              // accountNo: row.accountNo,
              patientName: row.patientName,
              dob: row.dob.slice(0, 10),
              phoneNo: row.phoneNo
            });
          });
        }

        this.setState({
          data: newList,
          loading: false
        });
        //  else{
        //   this.setState({
        //     data: newList,
        //     loading: false
        //   });
        //  }
        // console.log("new data", response.data);
      })
      .catch(error => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
        let errorsList = [];
        if (error.response !== null && error.response.data !== null) {
          errorsList = error.response.data;
          console.log(errorsList);
        } else console.log(error);
      });
  };

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

  //handle Change
  handleChange = event => {
    console.log(event.target.value);
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };

  //clear fields button
  clearFields = event => {
    var myVal = { ...this.validationModel };
    myVal.dosFromValField = "";
    myVal.dosToValField = "";
    myVal.dosToGreaterValField = "";
    myVal.selectDOSFromValField = "";
    myVal.EntryDateToGreaterValField = "";
    myVal.selectEntryFromValField = "";
    myVal.entryDateFromValField = "";
    myVal.entryDateToValField = "";
    myVal.validation = false;

    this.setState({
      validationModel: myVal,
      searchModel: this.searchModel,
      refProviderID: {},
      patientID: {},
      cptID: {}
    });
  };
  handleRefProviderChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        refProviderID: event,
        searchModel: {
          ...this.state.searchModel,
          refProviderID: event.id
        }
      });
    } else {
      this.setState({
        refProviderID: null,
        searchModel: {
          ...this.state.searchModel,
          refProviderID: null
        }
      });
    }
  }

  handlePatientDropDownChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        patientID: event,
        searchModel: {
          ...this.state.searchModel,
          patientID: event.patientID
        }
      });
    } else {
      this.setState({
        patientID: null,
        searchModel: {
          ...this.state.searchModel,
          patientID: null
        }
      });
    }
  }

  async handleCPTCodeChange(cptModel, index) {
    if (cptModel == null) {
      this.setState({
        cptID: null,
        searchModel: {
          ...this.state.search,
          cptid: null
        }
      });
    } else {
      this.setState({
        cptID: cptModel,
        searchModel: {
          ...this.state.search,
          cptid: cptModel.id
        }
      });
    }
  }
  filterOption = (option, inputValue) => {
    //  console.log("Option : " , option);
    //  console.log("Input Value : " , inputValue)

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

  render() {
    var submittedDateFrom = this.state.searchModel.submittedDateFrom
      ? this.state.searchModel.submittedDateFrom.slice(0, 10)
      : "";
    var submittedDateTo = this.state.searchModel.submittedDateTo
      ? this.state.searchModel.submittedDateTo.slice(0, 10)
      : "";
    var entryDateFrom = this.state.searchModel.entryDateFrom
      ? this.state.searchModel.entryDateFrom.slice(0, 10)
      : "";
    var entryDateTo = this.state.searchModel.entryDateTo
      ? this.state.searchModel.entryDateTo.slice(0, 10)
      : "";
    var dosDateFrom = this.state.searchModel.dosDateFrom
      ? this.state.searchModel.dosDateFrom.slice(0, 10)
      : "";
    var dosDateTo = this.state.searchModel.dosDateTo
      ? this.state.searchModel.dosDateTo.slice(0, 10)
      : "";

    const data = {
      columns: [
    
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 150
        },
        {
          label: "REF PROVIDER",
          field: "refProvider",
          sort: "asc",
          width: 270
        },
        {
          label: "VISIT ID",
          field: "visitId",
          sort: "asc",
          width: 270
        },
        {
          label: "ACCOUNT #",
          field: "accountNo",
          sort: "asc",
          width: 200
        },
        {
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 100
        },
        {
          label: "DOB",
          field: "dob",
          sort: "asc",
          width: 150
        },
        {
          label: "PHONE #",
          field: "phoneNo",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.data
    };
    let popup = "";

    if (this.state.showPopup) {
      // popup = (
      //   <NewPlanFollowupModal
      //     onClose={() => this.closePLanFollowupPopup}
      //     id={this.state.id}
      //   ></NewPlanFollowupModal>
      // );
    } else if (this.state.patientPopup) {
      popup = (
        <GPopup
          onClose={() => this.closePatientPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.visitPopup) {
      popup = (
        <GPopup
          onClose={() => this.closeVisitPopUp}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else popup = <React.Fragment></React.Fragment>;

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

    return (
      <React.Fragment>
      {spiner}
      <div class="container-fluid">
      <div class="header pt-3">
    <h6>
      <span class="h4">PATIENT BY REFERRAL PHYSICIAN</span>
    
    </h6>
  </div>

        <div
          class="clearfix"
          style={{ borderBottom: "1px solid #037592" }}
        ></div>

        <div class="row">
          <div class="col-md-12 col-sm-12 pt-3 provider-form">
            <form class="needs-validation form-group" 
             onSubmit={(event) => {
                  this.searchRefPhysicianReports(event);
                }}>
              <div class="row">
                <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="patientAccountNumber">Ref Provider</label>
                  </div>
                  <div class="col-md-7 float-left">
                  <Select
                    //   className={
                    //     this.state.validationModel.taxonomyCodeValField
                    //       ? this.errorField
                    //       : ""
                    //   }
                    type="text"
                    value={this.state.refProviderID}
                    name="refProviderID"
                    id="refProviderID"
                    max="10"
                    onChange={event => this.handleRefProviderChange(event)}
                    options={this.props.userRefProviders}
                    // onKeyDown={(e)=>this.filterOption(e)}
                    // filterOption={this.filterOption}
                    placeholder=""
                    isClearable={true}
                    isSearchable={true}
                    // menuPosition="static"
                    openMenuOnClick={false}
                    escapeClearsValue={true}
                    styles={{
                      indicatorSeparator: () => {},
                      clearIndicator: defaultStyles => ({
                        ...defaultStyles,
                        color: "#286881"
                      }),
                      container: defaultProps => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%"
                      }),
                      // menu: styles => ({ ...styles,
                      //   width: '125px'
                      //  }),
                      indicatorsContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "0px",
                        marginBottom: "0",
                        marginTop: "0px",
                        height: "36px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px"
                        // borderRadius:"0 6px 6px 0"
                      }),
                      indicatorContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "9px",
                        marginBottom: "0",
                        marginTop: "1px",
                        // borderBottomRightRadius: "5px",
                        // borderTopRightRadius: "5px",
                        borderRadius: "0 4px 4px 0"
                      }),
                      dropdownIndicator: () => ({
                        display: "none"
                      }),
                      // dropdownIndicator: defaultStyles => ({
                      //   ...defaultStyles,
                      //   backgroundColor: "#d8ecf3",
                      //   color: "#286881",
                      //   borderRadius: "3px"
                      // }),
                      input: defaultStyles => ({
                        ...defaultStyles,
                        margin: "0px",
                        padding: "0px"
                        // display:'none'
                      }),
                      singleValue: defaultStyles => ({
                        ...defaultStyles,
                        fontSize: "16px",
                        transition: "opacity 300ms"
                        // display:'none'
                      }),
                      control: defaultStyles => ({
                        ...defaultStyles,
                        minHeight: "33px",
                        height: "33px",
                        height: "33px",
                        paddingLeft: "10px",
                        //borderColor:"transparent",
                        borderColor: "#C6C6C6",
                        boxShadow: "none",
                        borderColor: "#C6C6C6",
                        "&:hover": {
                          borderColor: "#C6C6C6"
                        }
                        // display:'none'
                      })
                    }}
                  />
            
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
                <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="providerName">Patient</label>
                  </div>
                  <div class="col-md-7 float-left">
                  <Select
                    //   className={
                    //     this.state.validationModel.taxonomyCodeValField
                    //       ? this.errorField
                    //       : ""
                    //   }
                    type="text"
                    value={this.state.patientID}
                    name="patientID"
                    id="patientID"
                    max="10"
                    onChange={event => this.handlePatientDropDownChange(event)}
                    options={this.state.patientDropDown}
                    // onKeyDown={(e)=>this.filterOption(e)}
                    //   filterOption={this.filterOption}
                    placeholder=""
                    isClearable={true}
                    isSearchable={true}
                    // menuPosition="static"
                    openMenuOnClick={false}
                    escapeClearsValue={true}
                    styles={{
                      indicatorSeparator: () => {},
                      clearIndicator: defaultStyles => ({
                        ...defaultStyles,
                        color: "#286881"
                      }),
                      container: defaultProps => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%"
                      }),
                      // menu: styles => ({ ...styles,
                      //   width: '125px'
                      //  }),
                      indicatorsContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "0px",
                        marginBottom: "0",
                        marginTop: "0px",
                        height: "36px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px"
                        // borderRadius:"0 6px 6px 0"
                      }),
                      indicatorContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "9px",
                        marginBottom: "0",
                        marginTop: "1px",
                        // borderBottomRightRadius: "5px",
                        // borderTopRightRadius: "5px",
                        borderRadius: "0 4px 4px 0"
                      }),
                      dropdownIndicator: () => ({
                        display: "none"
                      }),
                      // dropdownIndicator: defaultStyles => ({
                      //   ...defaultStyles,
                      //   backgroundColor: "#d8ecf3",
                      //   color: "#286881",
                      //   borderRadius: "3px"
                      // }),
                      input: defaultStyles => ({
                        ...defaultStyles,
                        margin: "0px",
                        padding: "0px"
                        // display:'none'
                      }),
                      singleValue: defaultStyles => ({
                        ...defaultStyles,
                        fontSize: "16px",
                        transition: "opacity 300ms"
                        // display:'none'
                      }),
                      control: defaultStyles => ({
                        ...defaultStyles,
                        minHeight: "33px",
                        height: "33px",
                        height: "33px",
                        paddingLeft: "10px",
                        //borderColor:"transparent",
                        borderColor: "#C6C6C6",
                        boxShadow: "none",
                        borderColor: "#C6C6C6",
                        "&:hover": {
                          borderColor: "#C6C6C6"
                        }
                        // display:'none'
                      })
                    }}
                  />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
                <div class="col-md-3 mb-2">
                <div class="col-md-4 float-left">
                    <label for="dosDateFrom">DOS FROM</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="dosDateFrom"
                      id="dosDateFrom"
                      value={
                        this.state.searchModel.dosDateFrom == null
                          ? ""
                          : this.state.searchModel.dosDateFrom
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
             
                 
                </div>
                <div class="col-md-3 mb-2">
                <div class="col-md-4 float-left">
                    <label for="dosDateTo">DOS TO</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="dosDateTo"
                      id="dosDateTo"
                      value={
                        this.state.searchModel.dosDateTo == null
                          ? ""
                          : this.state.searchModel.dosDateTo
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-3 mb-2">
                <div class="col-md-4 float-left">
                    <label for="entryDateFrom">Entry Date From</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="entryDateFrom"
                      id="entryDateFrom"
                      value={
                        this.state.searchModel.entryDateFrom == null
                          ? ""
                          : this.state.searchModel.entryDateFrom
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
            
                </div>
                <div class="col-md-3 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="entryDateTo">Entry Date To</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="entryDateTo"
                      id="entryDateTo"
                      value={
                        this.state.searchModel.entryDateTo == null
                          ? ""
                          : this.state.searchModel.entryDateTo
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
                <div class="col-md-3 mb-2">

                <div class="col-md-4 float-left">
                    <label for="patientAccountNumber">CPT</label>
                  </div>
                  <div class="col-md-7 float-left">
                  <Select
                    //   className={
                    //     this.state.validationModel.taxonomyCodeValField
                    //       ? this.errorField
                    //       : ""
                    //   }
                    type="text"
                    value={this.state.cptID}
                    name="cptID"
                    id="cptID"
                    max="10"
                    onChange={event => this.handleCPTCodeChange(event)}
                    options={this.props.cptCodes}
                    // onKeyDown={(e)=>this.filterOption(e)}
                    filterOption={this.filterOption}
                    placeholder=""
                    isClearable={true}
                    isSearchable={true}
                    // menuPosition="static"
                    openMenuOnClick={false}
                    escapeClearsValue={true}
                    styles={{
                      indicatorSeparator: () => {},
                      clearIndicator: defaultStyles => ({
                        ...defaultStyles,
                        color: "#286881"
                      }),
                      container: defaultProps => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%"
                      }),
                      // menu: styles => ({ ...styles,
                      //   width: '125px'
                      //  }),
                      indicatorsContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "0px",
                        marginBottom: "0",
                        marginTop: "0px",
                        height: "36px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px"
                        // borderRadius:"0 6px 6px 0"
                      }),
                      indicatorContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "9px",
                        marginBottom: "0",
                        marginTop: "1px",
                        // borderBottomRightRadius: "5px",
                        // borderTopRightRadius: "5px",
                        borderRadius: "0 4px 4px 0"
                      }),
                      dropdownIndicator: () => ({
                        display: "none"
                      }),
                      // dropdownIndicator: defaultStyles => ({
                      //   ...defaultStyles,
                      //   backgroundColor: "#d8ecf3",
                      //   color: "#286881",
                      //   borderRadius: "3px"
                      // }),
                      input: defaultStyles => ({
                        ...defaultStyles,
                        margin: "0px",
                        padding: "0px"
                        // display:'none'
                      }),
                      singleValue: defaultStyles => ({
                        ...defaultStyles,
                        fontSize: "16px",
                        transition: "opacity 300ms"
                        // display:'none'
                      }),
                      control: defaultStyles => ({
                        ...defaultStyles,
                        minHeight: "33px",
                        height: "33px",
                        height: "33px",
                        paddingLeft: "10px",
                        //borderColor:"transparent",
                        borderColor: "#C6C6C6",
                        boxShadow: "none",
                        borderColor: "#C6C6C6",
                        "&:hover": {
                          borderColor: "#C6C6C6"
                        }
                        // display:'none'
                      })
                    }}
                  />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                 
           
          
             
                </div>
                <div class="col-md-3 mb-2">
     
                </div>
              </div>

       

              <div class="row">
                <div class="col-12 pt-2 text-center">
                  <button class="btn btn-primary mr-2" type="submit">
                    Search
                  </button>
                  <button class="btn btn-primary mr-2" type="button"
                   onClick={(event) => this.clearFields(event)}>
                    Clear
                  </button>
                </div>
              </div>
              <div class="clearfix"></div>
            </form>
          </div>
        </div>

        <div className="row">
              <div className="card mb-4" style={{width:"100%"}}>
                <GridHeading
                  Heading="PATIENT BY REFERRAL PHYSICIAN"
                  // disabled={this.isDisabled(this.props.rights.export)}
                  dataObj={this.state.searchModel}
                  url={this.url}
                  methodName="Export"
                  methodNamePdf="ExportPdf"
                  length={this.state.data.length}
                ></GridHeading>
                <div className="card-body">
                  <div className="table-responsive">
                    <div
                    style={{width:"98%"}}
                      id="dataTable_wrapper"
                      className="dataTables_wrapper dt-bootstrap4"
                    >
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
              </div>
            </div>
      </div>
   
    </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("State from New Charge PAge : ", state);
  return {
    patientInfo: state.selectPatient ? state.selectPatient : null,
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
          resubmit: state.loginInfo.rights.resubmitCharges
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(PatientByRefphysician)
);

// export default connect(mapStateToProps, matchDispatchToProps)(PatientpendingClaim);
