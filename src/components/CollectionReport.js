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
import Select, { components } from "react-select";
import GridHeading from "./GridHeading";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import moment from "moment";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class CollectionReport extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/RCollection/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      checkDateTo: "",
      checkDateFrom: "",
      postedDateTo: "",
      postedDateFrom: "",
      dosDateFrom: "",
      dosDateTo: "",
      locationID: "",
      providerID: "",
      checkNo: "",
      checkDate: "",
      userPosted: "",
      refProviderID: "",
      collectionType: ""

      // postedDateTo: "",
      // postedDateFrom: "",
      // userPosted: "",
      // locationID:"",
      // dosDateFrom:"",
      // dosDateTo:"",
      // providerID:"",
      // checkNo:"",
      // checkdate:"",
      // user:"",
      // refProviderID:"",
    };

    //Validation Model
    this.validationModel = {
      postedDateToGreaterValField: null,
      selectpostedDateFromValField: null,
      postedDateFromValField: "",
      postedDateToValField: "",
      dosToFDValField: "",
      dosToGreaterValField: null,
      selectDOSFromValField: null,
      checkDateFromValField: "",
      checkDateToValField: "",
      checkDateToGreaterValField: "",
      selectcheckDateFromValField: "",
      validation: false
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: [],
      loading: false,
      locationID: {},
      providerID: {},
      refProviderID: {}
    };
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);
    this.handleRefProviderChange = this.handleRefProviderChange.bind(this);
  }

  searchCollectionReports = e => {
    this.setState({ loading: true });
    e.preventDefault();

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
    //Dos Greater and Less than Check
    console.log("DateOfServiceFrom");

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

    //DOS To must be greater than DOS From Validation
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

    //Posted Date From Future Date Validation
    if (this.isNull(this.state.searchModel.postedDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.postedDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.postedDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.postedDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.postedDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Posted Date To Future Date Validation
    if (this.isNull(this.state.searchModel.postedDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.postedDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.postedDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.postedDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.postedDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Posted Date To must be greater than Posted Date From Validation
    if (
      this.isNull(this.state.searchModel.postedDateFrom) == false &&
      this.isNull(this.state.searchModel.postedDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.postedDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.postedDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.postedDateToGreaterValField = (
          <span className="validationMsg">
            Posted Date To must be greater than Posted Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.postedDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.postedDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if Posted Date To is selected Then Make sure than Posted date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.postedDateFrom) == true &&
      this.isNull(this.state.searchModel.postedDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectpostedDateFromValField = (
        <span className="validationMsg">Select Posted Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectpostedDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //check Date From Future Date Validation
    if (this.isNull(this.state.searchModel.checkDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.checkDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.checkDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.checkDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.checkDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //check Date To Future Date Validation
    if (this.isNull(this.state.searchModel.checkDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.checkDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.checkDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.checkDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.checkDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //check date  To must be greater than check date From Validation
    if (
      this.isNull(this.state.searchModel.checkDateFrom) == false &&
      this.isNull(this.state.searchModel.checkDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.checkDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.checkDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.checkDateToGreaterValField = (
          <span className="validationMsg">
            Check Date To must be greater than Check Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.checkDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.checkDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //check dateFrom Future Date Validation
    if (this.isNull(this.state.searchModel.submittedDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.submittedDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.submittedDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.submittedDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submittedDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if check date To is selected Then Make sure than check date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.checkDateFrom) == true &&
      this.isNull(this.state.searchModel.checkDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectcheckDateFromValField = (
        <span className="validationMsg">Select check date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectcheckDateFromValField = null;
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
      .post(this.url + "FindCollections", this.state.searchModel, this.config)
      .then(response => {
        console.log("Collection Report Search Response : ", response.data);
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
        
            srNo: this.isNull(row.srNo) == true ? " " : row.srNo,
            postingUserName: row.postingUserName,

            payerName: this.isNull(row.payerName) == true ? " " : row.payerName,
            practiceName:
              this.isNull(row.practiceName) == true ? " " : row.practiceName,
            checkNumber:
              this.isNull(row.checkNumber) == true ? " " : row.checkNumber,
            checkDate: this.isNull(row.checkDate) == true ? " " : row.checkDate,
            postingDate:
              this.isNull(row.postingDate) == true ? " " : row.postingDate,
              checkAmount: this.isNull(row.checkAmount) == true ? " " :"$" + (row.checkAmount),
              appliedAmount: this.isNull(row.appliedAmount) == true ? " " :"$" + (row.appliedAmount),
              unAppliedAmount: this.isNull(row.unAppliedAmount) == true ? " " :"$" + (row.unAppliedAmount)
          });
        });
        this.setState({ data: newList, loading: false });
        console.log(
          "new data",
          this.state.data,
          "loading ",
          this.state.loading
        );
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

  //handle Change
  handleChange = event => {
    console.log("Event : ", event.target.name, event.target.value);
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "null" ? null : event.target.value.toUpperCase()
      }
    });
  };
  //clear fields button
  clearFields = event => {
    var myVal = { ...this.validationModel };

    myVal.postedDateToGreaterValField = "";
    myVal.selectpostedDateFromValField = "";
    myVal.postedDateFromValField = "";
    myVal.postedDateToValField = "";
    myVal.dosToFDValField = "";
    myVal.dosToGreaterValField = "";
    myVal.selectDOSFromValField = "";
    myVal.checkDateFromValField = "";
    myVal.checkDateToValField = "";
    myVal.checkDateToGreaterValField = "";
    myVal.selectcheckDateFromValField = "";

    myVal.validation = false;

    this.setState({
      searchModel: this.searchModel,
      locationID: this.state.searchModel.locationID,
      providerID: this.state.searchModel.providerID,
      refProviderID: this.state.searchModel.refProviderID,
      validationModel: myVal
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

  render() {
    const collectionType = [
      { value: "NULL", display: "All" },
      { value: "PATIENT", display: "Patient " },
      { value: "PAYER", display: "Payer " }
    ];
    var postedDateTo = this.state.searchModel.postedDateTo
      ? this.state.searchModel.postedDateTo.slice(0, 10)
      : "";
    var postedDateFrom = this.state.searchModel.postedDateFrom
      ? this.state.searchModel.postedDateFrom.slice(0, 10)
      : "";

    var dosDateFrom = this.state.searchModel.dosDateFrom
      ? this.state.searchModel.dosDateFrom.slice(0, 10)
      : "";
    var dosDateTo = this.state.searchModel.dosDateTo
      ? this.state.searchModel.dosDateTo.slice(0, 10)
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
    var checkDateFrom = this.state.searchModel.checkDateFrom
      ? this.state.searchModel.checkDateFrom.slice(0, 10)
      : "";
    var checkDateTo = this.state.searchModel.checkDateTo
      ? this.state.searchModel.checkDateTo.slice(0, 10)
      : "";

      const data = {
        columns: [
    
          {
            label: "S.No",
            field: "srNo",
            sort: "asc",
            width: 270,
          },
          {
            label: "POSTING USER NAME",
            field: "postingUserName",
            sort: "asc",
            width: 150,
          },
  
          {
            label: "PAYER NAME",
            field: "payerName",
            sort: "asc",
            width: 200,
          },
          {
            label: "PRACTICE NAME",
            field: "practiceName",
            sort: "asc",
            width: 100,
          },
          {
            label: "CHECK NUMBER",
            field: "checkNumber",
            sort: "asc",
            width: 150,
          },
          {
            label: "CHECK DATE",
            field: "checkDate",
            sort: "asc",
            width: 100,
          },
          {
            label: "POSTING DATE",
            field: "postingDate",
            sort: "asc",
            width: 100,
          },
          {
            label: "CHECK AMOUNT",
            field: "checkAmount",
            sort: "asc",
            width: 100,
          },
          {
            label: "APPLIED AMOUNT",
            field: "appliedAmount",
            sort: "asc",
            width: 100,
          },
          {
            label: " UN APPLIED AMOUNT",
            field: "unAppliedAmount",
            sort: "asc",
            width: 100,
          },
        ],
        rows: this.state.data,
      };

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
      <span class="h4">COLLECTION REPORT</span>

    </h6>
  </div>

        <div
          class="clearfix"
          style={{ borderBottom: "1px solid #037592" }}
        ></div>

        <div class="row">
          <div class="col-md-12 col-sm-12 pt-3 provider-form">
            <form class="needs-validation form-group" 
             onSubmit={(event) => {this.searchCollectionReports(event);
                }}>
              <div class="row">


              <div class="col-md-3 mb-2">
                <div class="col-md-4 float-left">
                    <label for="postedDateFrom">Posted Date From</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="postedDateFrom"
                      id="postedDateFrom"
                      value={
                        this.state.searchModel.postedDateFrom == null
                          ? ""
                          : this.state.searchModel.postedDateFrom
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                  </div>
                </div>



                <div class="col-md-3 mb-2">
                <div class="col-md-4 float-left">
                    <label for="postedDateTo">Posted Date To</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="postedDateTo"
                      id="postedDateTo"
                      value={
                        this.state.searchModel.postedDateTo == null
                          ? ""
                          : this.state.searchModel.postedDateTo
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
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
                    <label for="Location">Location</label>
                  </div>
                  <div class="col-md-7 float-left">
                  <Select
                    type="text"
                    value={this.state.locationID}
                    name="locationID"
                    id="locationID"
                    max="10"
                    onChange={(event) => this.handleLocationChange(event)}
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
                      clearIndicator: (defaultStyles) => ({
                        ...defaultStyles,
                        color: "#286881",
                      }),
                      container: (defaultProps) => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%",
                      }),

                      indicatorsContainer: (defaultStyles) => ({
                        ...defaultStyles,
                        padding: "0px",
                        marginBottom: "0",
                        marginTop: "0px",
                        height: "36px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px",
                      }),
                      indicatorContainer: (defaultStyles) => ({
                        ...defaultStyles,
                        padding: "9px",
                        marginBottom: "0",
                        marginTop: "1px",

                        borderRadius: "0 4px 4px 0",
                      }),
                      dropdownIndicator: () => ({
                        display: "none",
                      }),

                      input: (defaultStyles) => ({
                        ...defaultStyles,
                        margin: "0px",
                        padding: "0px",
                      }),
                      singleValue: (defaultStyles) => ({
                        ...defaultStyles,
                        fontSize: "16px",
                        transition: "opacity 300ms",
                      }),
                      control: (defaultStyles) => ({
                        ...defaultStyles,
                        minHeight: "33px",
                        height: "33px",
                        height: "33px",
                        paddingLeft: "10px",

                        borderColor: "#C6C6C6",
                        boxShadow: "none",
                        borderColor: "#C6C6C6",
                        "&:hover": {
                          borderColor: "#C6C6C6",
                        },
                      }),
                    }}
                  />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
            
                </div>
                <div class="col-md-3 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="entryDateTo">Provider</label>
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
                    onChange={(event) => this.handleProviderChange(event)}
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
                      clearIndicator: (defaultStyles) => ({
                        ...defaultStyles,
                        color: "#286881",
                      }),
                      container: (defaultProps) => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%",
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
                      dropdownIndicator: () => ({
                        display: "none",
                      }),
                      // dropdownIndicator: defaultStyles => ({
                      //   ...defaultStyles,
                      //   backgroundColor: "#d8ecf3",
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
                        // display:'none'
                      }),
                      control: (defaultStyles) => ({
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
                          borderColor: "#C6C6C6",
                        },
                        // display:'none'
                      }),
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
                    <label for="checkDateFrom">Check Date From</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="checkDateFrom"
                      id="checkDateFrom"
                      value={
                        this.state.searchModel.checkDateFrom == null
                          ? ""
                          : this.state.searchModel.checkDateFrom
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
                    <label for="checkDateTo">Check Date To</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="checkDateTo"
                      id="checkDateTo"
                      value={
                        this.state.searchModel.checkDateTo == null
                          ? ""
                          : this.state.searchModel.checkDateTo
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
                {/* saqib */}

                <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="checkNo">Check #</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="checkNo"
                      name="checkNo"
                      id="checkNo"
                      maxLength="35"
                      value={this.state.searchModel.checkNo}
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
                    <label for="checkNo">Ref Provider</label>
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
                    onChange={(event) => this.handleRefProviderChange(event)}
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
                      clearIndicator: (defaultStyles) => ({
                        ...defaultStyles,
                        color: "#286881",
                      }),
                      container: (defaultProps) => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%",
                      }),
                      // menu: styles => ({ ...styles,
                      //   width: '125px'
                      //  }),
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
                      dropdownIndicator: () => ({
                        display: "none",
                      }),
                      // dropdownIndicator: defaultStyles => ({
                      //   ...defaultStyles,
                      //   backgroundColor: "#d8ecf3",
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
                        // display:'none'
                      }),
                      control: (defaultStyles) => ({
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
                          borderColor: "#C6C6C6",
                        },
                        // display:'none'
                      }),
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
                    <label for="userPosted">User</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="User"
                      name="userPosted"
                      id="userPosted"
                      maxLength="35"
                      value={this.state.searchModel.userPosted}
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
                      <label for="collectionType">
                        Collection Type
                      </label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select name="state1" class="w-100" 
                       name="collectionType"
                       id="collectionType"
                       value={this.state.searchModel.collectionType}
                       onChange={this.handleChange}>
                         {collectionType.map(s => (
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
                  Heading="COLLECTION REPORT"
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
  connect(mapStateToProps, matchDispatchToProps)(CollectionReport)
);

// export default connect(mapStateToProps, matchDispatchToProps)(CollectionReport);
