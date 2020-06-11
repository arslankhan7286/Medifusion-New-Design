import React, { Component, Fragment } from "react";
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
import { withRouter } from "react-router-dom";
import Select, { components } from "react-select";
import GridHeading from "./GridHeading";
import axios from "axios";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class PatientAppointmentStatus extends Component {
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
      patientID: null,
      providerID: null,
      locationID: null,
      appoinmentDateFrom: null,
      appoinmentDateTo: null,
      patientAccountNumber: null,
      providerName: null,
      dateOfServiceFrom: null,
      dateOfServiceTo: null,
      entryDateFrom: null,
      entryDateTo: null,
      submittedDateTo: null,
      submittedDateFrom: null
    };

    //Validation Model
    this.validationModel = {
      appointmentFromFDValField: "",
      appointmentDateToValField: "",
      appointmentDateToGreaterValField: "",
      selectappointmentFromValField: "",
      validation: false
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      isChecked: false,
      patientDropDown: [],
      providerID: {},
      locationID: {},
      data: [],
      patientID: {}
    };
    this.handleProviderChange = this.handleProviderChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handlePatientDropDownChange = this.handlePatientDropDownChange.bind(
      this
    );
  }

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
  searchUnitReports = e => {
    this.setState({ loading: true });
    e.preventDefault();

    var myVal = this.validationModel;
    myVal.validation = false;

    //DOS From Future Date Validation
    if (this.isNull(this.state.searchModel.appointmentDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.appointmentDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.appointmentFromFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.appointmentFromFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.appointmentFromFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //appointmentDate To Future Date Validation
    if (this.isNull(this.state.searchModel.appointmentDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.appointmentDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.appointmentDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.appointmentDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.appointmentDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Appointment Date To must be greater than Appointment Date From Validation

    if (
      this.isNull(this.state.searchModel.appointmentDateFrom) == false &&
      this.isNull(this.state.searchModel.appointmentDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.appointmentDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.appointmentDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.appointmentDateToGreaterValField = (
          <span className="validationMsg">
            DOS To must be greater than DOS From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.appointmentDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.appointmentDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if Appointment Date To is selected Then Make sure that Appointment date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.appointmentDateFrom) == true &&
      this.isNull(this.state.searchModel.appointmentDateTo) == false
    ) {
      console.log("Select Appointment From");
      myVal.selectappointmentFromValField = (
        <span className="validationMsg">Select Appointment Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectappointmentFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    // //appointmentDate  To must be greater than appointmentDate From Validation
    // if (
    //   this.isNull(this.state.searchModel.appointmentDateFrom) == false &&
    //   this.isNull(this.state.searchModel.appointmentDateTo) == false
    // ) {
    //   if (
    //     new Date(
    //       moment(this.state.searchModel.appointmentDateFrom)
    //         .format()
    //         .slice(0, 10)
    //     ).getTime() >
    //     new Date(
    //       moment(this.state.searchModel.appointmentDateTo)
    //         .format()
    //         .slice(0, 10)
    //     ).getTime()
    //   ) {
    //     myVal.appointmentDateToGreaterValField = (
    //       <span className="validationMsg">
    //         DOS To must be greater than DOS From
    //       </span>
    //     );
    //     myVal.validation = true;
    //   } else {
    //     myVal.appointmentDateToGreaterValField = null;
    //     if (myVal.validation == false) myVal.validation = false;
    //   }
    // } else {
    //   myVal.appointmentDateToGreaterValField = null;
    //   if (myVal.validation == false) myVal.validation = false;
    // }

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
      .post(this.url + "GetPatientAppointmentReport", {}, this.config)
      .then(response => {
        console.log("GetPatientAppointmentReport0".response.data)
        let newList = [];
        this.setState({
          data: newList,
          loading: false
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
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

  //handle Change
  handleChange = event => {
    // console.log(event.target.value);
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
    console.log("event.target.name", event.target.value);
  };

  //clear fields button
  clearFields = event => {
    var myVal = { ...this.validationModel };
    myVal.appointmentFromFDValField = "";
    myVal.appointmentDateToValField = "";
    myVal.appointmentDateToGreaterValField = "";
    myVal.selectappointmentFromValField = "";

    myVal.validation = false;

    this.setState({
      validationModel: myVal,
      searchModel: this.searchModel,
      providerID: this.state.searchModel.providerID,
      locationID: this.state.searchModel.locationID,
      patientID: this.state.searchModel.patientID
    });
  };
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

  render() {
    console.log("this.props.userLocations", this.props.userLocations);
    console.log("this.props.userProviders", this.props.userProviders);
    console.log("this.props.userRefProviders", this.props.userRefProviders);

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
    var appointmentDateFrom = this.state.searchModel.appointmentDateFrom
      ? this.state.searchModel.appointmentDateFrom.slice(0, 10)
      : "";
    var appointmentDateTo = this.state.searchModel.appointmentDateTo
      ? this.state.searchModel.appointmentDateTo.slice(0, 10)
      : "";

    const data = {
      columns: [
  
        {
          label: "SCHEDULED",
          field: "scheduled",
          sort: "asc",
          width: 150
        },
        {
          label: "SEEN",
          field: "seen",
          sort: "asc",
          width: 270
        },
        {
          label: "NO SHOW",
          field: "noShow",
          sort: "asc",
          width: 200
        },
        {
          label: "CANCELLED",
          field: "cancelled",
          sort: "asc",
          width: 100
        },
        {
          label: "RESCHEDULED",
          field: "rescheduled",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.data
    };

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
      <span class="h4">PATIENT APPOINTMENT BY STATUS</span>
    </h6>
  </div>

        <div
          class="clearfix"
          style={{ borderBottom: "1px solid #037592" }}
        ></div>

        <div class="row">
          <div class="col-md-12 col-sm-12 pt-3 provider-form">
            <form class="needs-validation form-group" 
             onSubmit={(event) => {this.searchUnitReports(event);
                }}>
              <div class="row">


              <div class="col-md-3 mb-2">
                <div class="col-md-4 float-left">
                    <label for="appoinmentDateFrom">Appointment Date From</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="appoinmentDateFrom"
                      id="appoinmentDateFrom"
                      value={
                        this.state.searchModel.appoinmentDateFrom == null
                          ? ""
                          : this.state.searchModel.appoinmentDateFrom
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
                    <label for="appoinmentDateTo">Appointment Date To</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="appoinmentDateTo"
                      id="appoinmentDateTo"
                      value={
                        this.state.searchModel.appoinmentDateTo == null
                          ? ""
                          : this.state.searchModel.appoinmentDateTo
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
        
          
              </div>

              <div class="row">
              <div class="col-md-3 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="entryDateTo">Patient</label>
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
                  Heading="PATIENT STATUS"
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
  connect(mapStateToProps, matchDispatchToProps)(PatientAppointmentStatus)
);

// export default connect(mapStateToProps, matchDispatchToProps)(PatientAppointmentStatus);
