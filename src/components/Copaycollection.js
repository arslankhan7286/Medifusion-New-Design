import React, { Component } from "react";
import Label from "./Label";
import Input from "./Input";
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
import { withRouter } from "react-router-dom";
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

export class Copaycollection extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/RCopay/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      accountNum: "",
      lastName: "",
      firstName: "",
      providerID: "",
      locationID: "",
      entryDateFrom: "",
      entryDateTo: "",
      dosFrom: "",
      dosTo: "",
      pendingCopay: false
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
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: [],
      loading: false,
      locationID: {},
      providerID: {},
      refProviderID: {},
      popupName: "",
      visitPopup: false,
      patientPopup: false,
      id: 0
    };
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);
    this.handleRefProviderChange = this.handleRefProviderChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);

    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.openVisitPopup = this.openVisitPopup.bind(this);
    this.closeVisitPopUp = this.closeVisitPopUp.bind(this);
  }

  isChecked = id => {
    //return this.state.submitModel.visits.filter(name => name === id)[0] ? true : false
    return this.selectedVisits.filter(name => name === id)[0] ? true : false;
  };
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

  searchCollectionReports = e => {
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    //DOS From Future Date Validation
    if (this.isNull(this.state.searchModel.dosFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dosFrom)
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
    if (this.isNull(this.state.searchModel.dosTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dosTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.dosToFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dosToFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosToFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    // Dos to should be greater than Dos from
    if (
      this.isNull(this.state.searchModel.dosFrom) == false &&
      this.isNull(this.state.searchModel.dosTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.dosFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.dosTo)
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
      this.isNull(this.state.searchModel.dosFrom) == true &&
      this.isNull(this.state.searchModel.dosTo) == false
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

    axios
      .post(
        this.url + "FindCopayCollected",
        this.state.searchModel,
        this.config
      )
      .then(response => {
        console.log("Collection Report Search Response : ", response.data);
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
      
            accountNum: (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openPatientPopup("patient", row.patientID)}
              >
                {" "}
                {this.val(row.accountNum)}
              </MDBBtn>
            ),
            // accountNum:
            //   this.isNull(row.accountNum) == true ? " " : row.accountNum,
            patientName: row.patientName,

            dos: this.isNull(row.dos) == true ? " " : row.dos,
            visitID: (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openVisitPopup("visit", row.visitID)}
              >
                {" "}
                {this.val(row.visitID)}
              </MDBBtn>
            ),
            // visitID: this.isNull(row.visitID) == true ? " " : row.visitID,
            copay: this.isNull(row.copay) == true ? " " : row.copay,
            copayCollected:
              this.isNull(row.copayCollected) == true
                ? " "
                : row.copayCollected,

            provider: this.isNull(row.provider) == true ? " " : row.provider,
            location: this.isNull(row.location) == true ? " " : row.location
          });
        });
        this.setState({ data: newList, loading: false });
        // console.log(
        //   "new data",
        //   this.state.data,
        //   "loading ",
        //   this.state.loading
        // );
      })
      .catch(error => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
      });
    e.preventDefault();
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
  handleCheck() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        pendingCopay: !this.state.searchModel.pendingCopay
      }
    });
  }
  //handle Change
  handleChange = event => {
    //event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
    console.log(this.state.searchModel);
  };
  //clear fields button
  clearFields = event => {
    var myVal = { ...this.validationModel };

    myVal.dosFromValField ="";
    myVal.dosToFDValField ="";
    myVal.dosToGreaterValField ="";
    myVal.selectDOSFromValField ="";
    myVal.EntryDateToGreaterValField ="";
    myVal.selectEntryFromValField ="";
    myVal.entryDateFromValField="";
    myVal.entryDateToValField ="";



    myVal.validation = false;

    this.setState({
      validationModel: myVal,
      searchModel: this.searchModel,
      locationID: this.state.searchModel.locationID,
      providerID: this.state.searchModel.providerID
    });
  };
  handleLocationChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        locationID: event,
        searchModel: {
          ...this.state.searchModel,
          locationID: event.id
        }
      });
    } else {
      this.setState({
        locationID: null,
        searchModel: {
          ...this.state.searchModel,
          locationID: null
        }
      });
    }
  }
  handleProviderChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        providerID: event,
        searchModel: {
          ...this.state.searchModel,
          providerID: event.id
        }
      });
    } else {
      this.setState({
        providerID: null,
        searchModel: {
          ...this.state.searchModel,
          providerID: null
        }
      });
    }
  }
  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  render() {
    let pendingCopay = this.state.searchModel.pendingCopay;

    var postedDateTo = this.state.searchModel.postedDateTo
      ? this.state.searchModel.postedDateTo.slice(0, 10)
      : "";
    var postedDateFrom = this.state.searchModel.postedDateFrom
      ? this.state.searchModel.postedDateFrom.slice(0, 10)
      : "";

    var dosFrom = this.state.searchModel.dosFrom
      ? this.state.searchModel.dosFrom.slice(0, 10)
      : "";
    var dosTo = this.state.searchModel.dosTo
      ? this.state.searchModel.dosTo.slice(0, 10)
      : "";
    var entryDateFrom = this.state.searchModel.entryDateFrom
      ? this.state.searchModel.entryDateFrom.slice(0, 10)
      : "";
    var entryDateTo = this.state.searchModel.entryDateTo
      ? this.state.searchModel.entryDateTo.slice(0, 10)
      : "";
    var appointmentDateFrom = this.state.searchModel.appointmentDateFrom
      ? this.state.searchModel.appointmentDateFrom.slice(0, 10)
      : "";
    var checkDate = this.state.searchModel.checkDate
      ? this.state.searchModel.checkDate.slice(0, 10)
      : "";

    const data = {
      columns: [
 
        {
          label: "ACCOUNT #",
          field: "accountNum",
          sort: "asc",
          width: 270
        },
        {
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 150
        },

        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 100
        },
        {
          label: "VISIT #",
          field: "visitID",
          sort: "asc",
          width: 100
        },
        {
          label: "COPAY",
          field: "copay",
          sort: "asc",
          width: 100
        },
        {
          label: "COPAY COLLECTED",
          field: "copayCollected",
          sort: "asc",
          width: 100
        },
        {
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          width: 100
        },
        {
          label: "LOCATION",
          field: "location",
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
      <span class="h4">Copay Collection</span>
    
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
                  this.searchCollectionReports(event);
                }}>
              <div class="row">
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
                      name="dosFrom"
                      id="dosFrom"
                      value={
                        this.state.searchModel.dosFrom == null
                          ? ""
                          : this.state.searchModel.dosFrom
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
                    <label for="dosTo">DOS TO</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="dosTo"
                      id="dosTo"
                      value={
                        this.state.searchModel.dosTo == null
                          ? ""
                          : this.state.searchModel.dosTo
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
              
           
            
             
              </div>

              <div class="row">
            
                <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="lastName">Patient Last Name </label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Patient Last Name"
                      name="lastName"
                      id="lastName"
                      maxLength="35"
                      value={this.state.searchModel.lastName}
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
                    <label for="lastName">Patient First Name </label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Patient First Name"
                      name="firstName"
                      id="firstName"
                      maxLength="35"
                      value={this.state.searchModel.firstName}
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
                    <label for="providerName">Location</label>
                  </div>
                  <div class="col-md-7 float-left">
                  <Select
                    type="text"
                    value={this.state.locationID}
                    name="locationID"
                    id="locationID"
                    max="10"
                    onChange={event => this.handleLocationChange(event)}
                    options={this.props.userLocations}
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

                      indicatorsContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "0px",
                        marginBottom: "0",
                        marginTop: "0px",
                        height: "36px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px"
                      }),
                      indicatorContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "9px",
                        marginBottom: "0",
                        marginTop: "1px",

                        borderRadius: "0 4px 4px 0"
                      }),
                      dropdownIndicator: () => ({
                        display: "none"
                      }),

                      input: defaultStyles => ({
                        ...defaultStyles,
                        margin: "0px",
                        padding: "0px"
                      }),
                      singleValue: defaultStyles => ({
                        ...defaultStyles,
                        fontSize: "16px",
                        transition: "opacity 300ms"
                      }),
                      control: defaultStyles => ({
                        ...defaultStyles,
                        minHeight: "33px",
                        height: "33px",
                        height: "33px",
                        paddingLeft: "10px",

                        borderColor: "#C6C6C6",
                        boxShadow: "none",
                        borderColor: "#C6C6C6",
                        "&:hover": {
                          borderColor: "#C6C6C6"
                        }
                      })
                    }}
                  />
                </div>
              </div>
     

                
                   
               
                <div class="col-md-3 mb-2">

                <div class="col-md-4 float-left">
                    <label for="Provider">Provider</label>
                  </div>
                  <div class="col-md-7 float-left">
                  <Select
                    //   className={
                    //     this.state.validationModel.taxonomyCodeValField
                    //       ? this.errorField
                    //       : ""
                    //   }
                    type="text"
                    value={this.state.providerID}
                    name="providerID"
                    id="providerID"
                    max="10"
                    onChange={event => this.handleProviderChange(event)}
                    options={this.props.userProviders}
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
                    <label for="accountNum">Account #</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Patient Account Number"
                      name="accountNum"
                      id="accountNum"
                      maxLength="35"
                      value={this.state.searchModel.accountNum}
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
                      <label for="IncludePendingCopay">Include Pending Copay</label>
                    </div>
                    <div class="col-md-7 float-left">
                    <div style={{ marginBottom: "10px" }}
                          class="lblChkBox"
                        >
                          <input
                            type="checkbox"
                            id="markInactive"
                            name="markInactive"
                            checked={pendingCopay}
                            onClick={this.handleCheck}
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
                  Heading="COPAY COLLECTION"
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
  console.log("State from Appointment Status PAge : ", state);
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
  connect(mapStateToProps, matchDispatchToProps)(Copaycollection)
);

// export default connect(mapStateToProps, matchDispatchToProps)(CollectionReport);
