import React, { Component } from "react";

import SearchHeading from "./SearchHeading";
import $ from "jquery";

import Input from "./Input";

import axios from "axios";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Label from "./Label";

import { MDBDataTable, MDBBtn } from "mdbreact";

import GridHeading from "./GridHeading";

import Swal from "sweetalert2";
import NewDaySheet from "./NewDaySheet";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import NewProviderScheduler from "./NewProviderScheduler";

export class DaySheet extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/patientappointment/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      fromDate: null,
      toDate: null,
      fromTime: null,
      toTime: null,
      providerID: null,
      locationID: null,
      visitReasonID: null,
      status: null

      // "fromDate": null,
      // "toDate": null,
      // "fromTime": null,
      // "toTime": null,
      // "provider": null,
      // "location": null,
      // "visitReason": null,
      // // "status": ""
    };

    this.state = {
      searchModel: this.searchModel,
      pracData: [],
      data: [],
      resData: [],
      proData: [],
      locData: [],
      statusData: [],

      showPopup: false,

      showproPopup: false,

      providerData: [],
      locationData: [],

      id: 0,
      loading: false
    };
    this.clearFields = this.clearFields.bind(this);
    this.closedaySheetPopup = this.closedaySheetPopup.bind(this);
    this.searchDaySheet = this.searchDaySheet.bind(this);

    this.openProviderSchedulerPopup = this.openProviderSchedulerPopup.bind(
      this
    );

    this.closeProSchedPopup = this.closeProSchedPopup.bind(this);
  }
  componentWillMount() {
    //    http://192.168.110.44/Database/api/patientappointment/GetProfiles
    axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        this.setState({
          resData: response.data.visitReason,
          pracData: response.data.practice

          // locData: response.data.location,
          // proData: response.data.provider

          // locData: this.props.loginInfo.userLocations
        });

        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  openProviderSchedulerPopup = id => {
    this.setState({ showproPopup: true, id: id });
  };

  closeProSchedPopup() {
    $("#proschModal").hide();
    this.setState({ showproPopup: false });
  }

  searchDaySheet = e => {
    this.setState({ loading: true });
    e.preventDefault();
    console.log(this.state);
    //http://192.168.110.44/Database/api/patientappointment/FindPatientAppointments
    axios
      .post(
        this.url + "FindPatientAppointments",
        this.state.searchModel,
        this.config
      )
      .then(response => {
        let newList = [];
        response.data.map((row, i) => {
          console.log(row);
          newList.push({
            id: row.id,
            appointmentDate: (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openProviderDaysheetPopup(row.id)}
              >
                {row.appointmentDate}
              </MDBBtn>
            ),
            providerID: (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openProviderSchedulerPopup(row.id)}
              >
                {row.provider}
              </MDBBtn>
            ),

            patient: row.patient,
            plan: row.plan,
            location: row.location,
            visitReason: row.visitReason,
            status: row.status,
            timeInterval: row.timeInterval
            // accountNum: row.accountNum,

            // provider: row.provider,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });

    e.preventDefault();
  };

  clearFields = event => {
    event.preventDefault();
    console.log("Serch Model : ", this.searchModel);
    this.setState({
      searchModel: this.searchModel
    });
  };

  closedaySheetPopup() {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  }

  openProviderDaysheetPopup = id => {
    this.setState({ showPopup: true, id: id });
  };

  handleChange = event => {
    event.preventDefault();
    console.log("Event : ", event.target.value);
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "Please Select" ? null : event.target.value
      }
    });
  };

  render() {
    const statusData = [
      { value: "", display: "Select Type" },
      { value: "A", display: "Available" },
      { value: "S", display: "Scheduled" },
      { value: "R", display: "Re-Scheduled" },
      { value: "C", display: "Canceled" },
      { value: "N", display: "No Show" }
    ];

    try {
      if (this.props.userInfo.userProviders.length > 0) {
        if (this.state.providerData.length == 0) {
          this.setState({
            providerData: this.props.userInfo.userProviders
          });
        }
      }

      if (this.props.userInfo.userLocations.length > 0) {
        if (this.state.locationData.length == 0) {
          this.setState({
            locationData: this.props.userInfo.userLocations
          });
        }
      }
    } catch {}

    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 150
        },
        {
          label: "APPOINTMENT DATE",
          field: "appointmentDate",
          sort: "asc",
          width: 150
        },
        {
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          width: 150
        },
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          width: 150
        },
        {
          label: "PLAN",
          field: "plan",
          sort: "asc",
          width: 150
        },
        {
          label: "LOCATION",
          field: "location",
          sort: "asc",
          width: 150
        },
        {
          label: "VISIT REASON ",
          field: "visitReason",
          sort: "asc",
          width: 150
        },
        {
          label: "STATUS ",
          field: "status",
          sort: "asc",
          width: 150
        },
        ,
        {
          label: "TIME INTERVAL ",
          field: "timeInterval",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.data
    };

    var providerFromDate = this.state.searchModel.fromDate
      ? this.state.searchModel.fromDate.replace("T00:00:00", "")
      : "";
    var providerToDate = this.state.searchModel.toDate
      ? this.state.searchModel.toDate.replace("T00:00:00", "")
      : "";

    let popup = "";

    if (this.state.showPopup) {
      popup = (
        <NewDaySheet
          onClose={() => this.closedaySheetPopup}
          id={this.state.id}
        ></NewDaySheet>
      );
    } else if (this.state.showproPopup) {
      popup = (
        <NewProviderScheduler
          onClose={() => this.closeProSchedPopup}
          id={this.state.id}
        ></NewProviderScheduler>
      );
    } else popup = <React.Fragment></React.Fragment>;

    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    return (
      <React.Fragment>
        {spiner}
        <SearchHeading
          heading="DAY SHEET SEARCH"
          handler={() => this.openProviderDaysheetPopup(0)}
        ></SearchHeading>

        <form onSubmit={event => this.searchDaySheet(event)}>
          <div className="mainTable">
            <div className="row-form">
              <div className="mf-6">
                <label>Provider</label>
                <select
                  name="providerID"
                  id="providerID"
                  value={
                    this.state.searchModel.providerID == null
                      ? "Please Select"
                      : this.state.searchModel.providerID
                  }
                  onChange={this.handleChange}
                >
                  {this.state.providerData.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mf-6">
                <label>Location</label>

                <select
                  name="locationID"
                  id="locationID"
                  value={
                    this.state.searchModel.locationID == null
                      ? "Please Select"
                      : this.state.searchModel.locationID
                  }
                  onChange={this.handleChange}
                >
                  {this.state.locationData.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row-form">
              <div className="mf-6">
                <label>From Date</label>
                <div className="textBoxValidate">
                  <input
                    style={{
                      width: "215px",
                      marginLeft: "0px"
                    }}
                    className="myInput"
                    type="date"
                    name="fromDate"
                    id="fromDate"
                    value={providerFromDate}
                    onChange={this.handleChange}
                  ></input>
                </div>
              </div>
              <div className="mf-6">
                <label>To Date</label>
                <div className="textBoxValidate">
                  <input
                    style={{
                      width: "215px",
                      marginLeft: "0px"
                    }}
                    className="myInput"
                    type="date"
                    name="toDate"
                    id="toDate"
                    value={providerToDate}
                    onChange={this.handleChange}
                  ></input>
                </div>
              </div>
            </div>

            <div className="row-form">
              <div className="mf-6">
                <label>From Time</label>
                <div className="textBoxTwoField">
                  <select
                    name="fromTime"
                    id="fromTime"
                    onChange={this.handleChange}
                  >
                    <option>01:00 AM</option>
                    <option>02:00 AM</option>
                    <option>03:00 AM</option>
                    <option>04:00 AM</option>
                    <option>05:00 AM</option>
                    <option>06:00 AM</option>
                    <option>07:00 AM</option>
                    <option selected="">08:00 AM</option>
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 AM</option>
                    <option>01:00 PM</option>
                    <option>02:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                    <option>05:00 PM</option>
                    <option>06:00 PM</option>
                    <option>07:00 PM</option>
                    <option>08:00 PM</option>
                    <option>09:00 PM</option>
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                    <option>12:00 PM</option>
                    {/* </select>
                                                <select name="" id=""> */}
                    <option>01:00 AM</option>
                    <option>02:00 AM</option>
                    <option>03:00 AM</option>
                    <option>04:00 AM</option>
                    <option>05:00 AM</option>
                    <option>06:00 AM</option>
                    <option>07:00 AM</option>
                    <option>08:00 AM</option>
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 AM</option>
                    <option>01:00 PM</option>
                    <option>02:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                    <option selected="">05:00 PM</option>
                    <option>06:00 PM</option>
                    <option>07:00 PM</option>
                    <option>08:00 PM</option>
                    <option>09:00 PM</option>
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                    <option>12:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="mf-6">
                <label>To Time</label>
                <div className="textBoxTwoField">
                  <select
                    name="toTime"
                    id="toTime"
                    onChange={this.handleChange}
                  >
                    <option>01:00 AM</option>
                    <option>02:00 AM</option>
                    <option>03:00 AM</option>
                    <option>04:00 AM</option>
                    <option>05:00 AM</option>
                    <option>06:00 AM</option>
                    <option>07:00 AM</option>
                    <option selected="">08:00 AM</option>
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 AM</option>
                    <option>01:00 PM</option>
                    <option>02:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                    <option>05:00 PM</option>
                    <option>06:00 PM</option>
                    <option>07:00 PM</option>
                    <option>08:00 PM</option>
                    <option>09:00 PM</option>
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                    <option>12:00 PM</option>
                    {/* </select>
                                                <select name="" id=""> */}
                    <option>01:00 AM</option>
                    <option>02:00 AM</option>
                    <option>03:00 AM</option>
                    <option>04:00 AM</option>
                    <option>05:00 AM</option>
                    <option>06:00 AM</option>
                    <option>07:00 AM</option>
                    <option>08:00 AM</option>
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 AM</option>
                    <option>01:00 PM</option>
                    <option>02:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                    <option selected="">05:00 PM</option>
                    <option>06:00 PM</option>
                    <option>07:00 PM</option>
                    <option>08:00 PM</option>
                    <option>09:00 PM</option>
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                    <option>12:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row-form">
              <div className="mf-6">
                <label>Reason</label>
                <select
                  name="visitReasonID"
                  id="visitReasonID"
                  value={
                    this.state.searchModel.visitReasonID == null
                      ? "Please Select"
                      : this.state.searchModel.visitReasonID
                  }
                  onChange={this.handleChange}
                >
                  {this.state.resData.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mf-6">
                <Label name="Status"></Label>
                <select
                  name="status"
                  id="status"
                  value={
                    this.state.searchModel.status == null
                      ? "Please Select"
                      : this.state.searchModel.status
                  }
                  onChange={this.handleChange}
                >
                  {statusData.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.display}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row-form row-btn">
              <div className="mf-12">
                <Input
                  type="submit"
                  name="name"
                  id="name"
                  className="btn-blue"
                  value="Search"
                />
                <Input
                  type="button"
                  name="name"
                  id="name"
                  className="btn-grey"
                  value="Clear"
                  onClick={event => this.clearFields(event)}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="mf-12 table-grid mt-15">
          <GridHeading Heading="DAY SHEET SCHEDULER SEARCH RESULT"
            dataObj={this.state.searchModel}
            url={this.url}
            methodName="Export"
            methodNamePdf="ExportPdf"
            length={this.state.data.length}
          ></GridHeading>

          <div className="tableGridContainer">
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

        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("state from  Day sheet Page", state);
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
      : { userPractices: [], name: "", practiceID: null }
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

export default connect(mapStateToProps, matchDispatchToProps)(DaySheet);
