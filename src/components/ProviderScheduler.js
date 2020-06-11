import React, { Component } from "react";

import axios from "axios";

import SearchHeading from "./SearchHeading";

import $ from "jquery";

import Label from "./Label";
import Input from "./Input";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import { MDBDataTable, MDBBtn } from "mdbreact";

import GridHeading from "./GridHeading";
import Swal from "sweetalert2";

import NewProviderScheduler from "./NewProviderScheduler";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class ProviderScheduler extends Component {
  constructor(props) {
    super(props);
    //http://192.168.110.44/Database/api/ProviderSchedule/FindProviderSchedule
    //http://192.168.110.44/Database/api/ProviderSchedule/FindProviderSchedule

    this.url = process.env.REACT_APP_URL + "/ProviderSchedule/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      providerID: null,
      locationID: null,
      fromDate: null,
      toDate: null
    };

    this.state = {
      searchModel: this.searchModel,
      // proData: [],
      pracData: [],
      resData: [],
      data: [],

      // locData: [],
      showPopup: false,
      loading: false,

      providerData: [],
      locationData: []
    };
    this.handleChange = this.handleChange.bind(this);

    this.searchProviderScheduler = this.searchProviderScheduler.bind(this);

    this.closeProSchedPopup = this.closeProSchedPopup.bind(this);
    this.openProviderSchedulerPopup = this.openProviderSchedulerPopup.bind(
      this
    );
  }
  componentWillMount() {
    //    http://192.168.110.44/Database/api/BatchDocument/GetProfiles
    axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        console.log(response.data);

        this.setState({
          pracData: response.data.practice,
          resData: response.data.visitReason

          // locData: this.props.loginInfo.userLocations
          // proData: response.data.provider
        });

        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  searchProviderScheduler = e => {
    this.setState({ loading: true });
    console.log("Search Model", this.state.searchModel);
    axios
      .post(
        this.url + "FindProviderSchedules",
        this.state.searchModel,
        this.config
      )
      .then(response => {
        console.log("Schedule Grid Response : ", response.data);
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            id: "row.id",
            fromDate: row.appointmentDate,
            toDate: row.appointmentStatus,
            provider: row.provider,
            location: row.location,
            timeInterval: row.timeInterval,
            fromTime: row.fromTime ? row.fromTime.slice(10, 19) : "",
            toTime: row.toTime ? row.toTime.slice(10, 19) : ""
          });
        });
        this.setState({ data: newList, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });

        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
        let errorsList = [];
        if (error.response) {
          errorsList = error.response;
          console.log(errorsList);
        } else console.log(error);
      });

    e.preventDefault();
  };

  clearFields = event => {
    console.log(this.searchModel);
    this.setState({
      searchModel: this.searchModel
    });
  };

  closeProSchedPopup() {
    $("#proschModal").hide();
    this.setState({ showPopup: false });
  }

  openProviderSchedulerPopup = id => {
    this.setState({ showPopup: true, id: id });
  };

  handleChange = event => {
    console.log(event.target);
    event.preventDefault();

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "Please Select" ? null : event.target.value
      }
    });
  };

  render() {
    console.log("Data", this.state.data);
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 150
        },
        {
          label: "FROM DATE",
          field: "fromDate",
          sort: "asc",
          width: 150
        },
        {
          label: "TO DATE",
          field: "toDate",
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
          label: "LOCATION",
          field: "location",
          sort: "asc",
          width: 150
        },
        {
          label: "TIME INTERVAL",
          field: "timeInterval",
          sort: "asc",
          width: 150
        },
        {
          label: "FROM TIME",
          field: "fromTime",
          sort: "asc",
          width: 150
        },
        {
          label: "TO TIME",
          field: "toTime",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.data
    };

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

    var providerFromDate = this.state.searchModel.fromDate
      ? this.state.searchModel.fromDate.replace("T00:00:00", "")
      : "";
    var providerToDate = this.state.searchModel.toDate
      ? this.state.searchModel.toDate.replace("T00:00:00", "")
      : "";

    let popup = "";

    if (this.state.showPopup) {
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
          heading="PROVIDER SCHEDULER SEARCH"
          handler={() => this.openProviderSchedulerPopup(0)}
        ></SearchHeading>

        <form onSubmit={event => this.searchProviderScheduler(event)}>
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
          <GridHeading
            Heading="PROVIDER SCHEDULER SEARCH RESULT"
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
  console.log("state from Provider Scheduler Page", state);
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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(ProviderScheduler);
