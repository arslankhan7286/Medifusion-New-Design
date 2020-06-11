import React, { Component, Fragment } from "react";
import Label from "./Label";
import Input from "./Input";
import { withRouter } from "react-router-dom";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";
import Select, { components } from "react-select";
import GridHeading from "./GridHeading";
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

class PatientpendingClaim extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/RPatient/";
    this.visitUrl = process.env.REACT_APP_URL + "/visit/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      patientID: null,
      providerID: null,
      locationID: null,
      appointmentDateFrom: "",
      appointmentDateTo: "",
    };

    //Validation Model
    this.validationModel = {
      appointmentFromFDValField: "",
      appointmentDateToValField: "",
      appointmentDateToGreaterValField: "",
      selectappointmentFromValField: "",
      validation: false,
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      isChecked: false,
      data: [],
      providerID: {},
      locationID: {},
      patientID: {},
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
        .then((response) => {
          console.log("patientDropDown", response.data);
          this.setState({
            supProvider: response.data.refProvider,
            patientDropDown: response.data.patientInfo,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {}
  }

  //search Creteria
  searchPendingClaims = (e) => {
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
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.appointmentDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.appointmentDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.appointmentDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //DOS To Future Date Validation
    if (this.isNull(this.state.searchModel.appointmentDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.appointmentDateTo).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
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
          moment(this.state.searchModel.appointmentDateTo).format().slice(0, 10)
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
        this.url + "GetPatientPendingClaimsReport",
        this.state.searchModel,
        this.config
      )
      .then((response) => {
        console.log("Unit Report Search Response Object : ", response);
        let newList = [];
        if (response.data) {
          console.log("Unit Report Search Response : ", response.data);

          response.data.map((row, i) => {
            newList.push({
              id: row.id,
              appointmentDate: row.appointmentDate,
              providerName: row.providerName,
              location: row.location,
              patient: row.patient,
              accountNo: row.accountNo,
              dob: row.dob,
            });
          });
        }

        this.setState({
          data: newList,
          loading: false,
        });
        //  else{
        //   this.setState({
        //     data: newList,
        //     loading: false
        //   });
        //  }
        // console.log("new data", response.data);
      })
      .catch((error) => {
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
  handleChange = (event) => {
    console.log(event.target.value);
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  //clear fields button
  clearFields = (event) => {
    var myVal = { ...this.validationModel };
    myVal.appointmentDateFromValField = "";
    myVal.appointmentDateToValField = "";
    myVal.appointmentDateToGreaterValField = "";
    myVal.selectappointmentFromValField = "";

    myVal.validation = false;

    this.setState({
      validationModel: myVal,
      searchModel: this.searchModel,
      providerID: this.state.searchModel.providerID,
      locationID: this.state.searchModel.locationID,
      patientID: this.state.searchModel.patientID,
    });
  };
  handleProviderChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        providerID: event,
        searchModel: {
          ...this.state.searchModel,
          providerID: event.id,
        },
      });
    } else {
      this.setState({
        providerID: null,
        searchModel: {
          ...this.state.searchModel,
          providerID: null,
        },
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
          locationID: event.id,
        },
      });
    } else {
      this.setState({
        locationID: null,
        searchModel: {
          ...this.state.searchModel,
          locationID: null,
        },
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
          patientID: event.patientID,
        },
      });
    } else {
      this.setState({
        patientID: null,
        searchModel: {
          ...this.state.searchModel,
          patientID: null,
        },
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
          locationID: event.id,
        },
      });
    } else {
      this.setState({
        locationID: null,
        searchModel: {
          ...this.state.searchModel,
          locationID: null,
        },
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
          providerID: event.id,
        },
      });
    } else {
      this.setState({
        providerID: null,
        searchModel: {
          ...this.state.searchModel,
          providerID: null,
        },
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
          label: "APPOINTMENT DATE",
          field: "appointmentDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "PROVIDER",
          field: "providerName",
          sort: "asc",
          width: 270,
        },
        {
          label: "LOCATION",
          field: "location",
          sort: "asc",
          width: 200,
        },
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          width: 100,
        },
        {
          label: "ACCOUNT #",
          field: "accountNo",
          sort: "asc",
          width: 150,
        },
        {
          label: "Date Of Service",
          field: "dob",
          sort: "asc",
          width: 100,
        },
      ],
      rows: this.state.data,
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
              <span class="h4">PATIENT PENDING CLAIMS</span>
            </h6>
          </div>

          <div
            class="clearfix"
            style={{ borderBottom: "1px solid #037592" }}
          ></div>

          <div class="row">
            <div class="col-md-12 col-sm-12 pt-3 provider-form">
              <form
                class="needs-validation form-group"
                onSubmit={(event) => {
                  this.searchPendingClaims(event);
                }}
              >
                <div class="row">
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="appoinmentDateFrom">
                        Appointment Date From
                      </label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        min="1900-01-01"
                        max="9999-12-31"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="appointmentDateFrom"
                        id="appointmentDateFrom"
                        value={
                          this.state.searchModel.appointmentDateFrom == null
                            ? ""
                            : this.state.searchModel.appointmentDateFrom
                        }
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback"> </div>
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
                        name="appointmentDateTo"
                        id="appointmentDateTo"
                        value={
                          this.state.searchModel.appointmentDateTo == null
                            ? ""
                            : this.state.searchModel.appointmentDateTo
                        }
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback"> </div>
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
                        onChange={(event) =>
                          this.handlePatientDropDownChange(event)
                        }
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
                </div>

                <div class="row">
                  <div class="col-12 pt-2 text-center">
                    <button class="btn btn-primary mr-2" type="submit">
                      Search
                    </button>
                    <button
                      class="btn btn-primary mr-2"
                      type="button"
                      onClick={(event) => this.clearFields(event)}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div class="clearfix"></div>
              </form>
            </div>
          </div>

          <div className="row">
            <div className="card mb-4" style={{ width: "100%" }}>
              <GridHeading
                Heading="PATIENT PENDING CLAIMS"
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
                    style={{ width: "98%" }}
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
  connect(mapStateToProps, matchDispatchToProps)(PatientpendingClaim)
);

// export default connect(mapStateToProps, matchDispatchToProps)(PatientpendingClaim);
