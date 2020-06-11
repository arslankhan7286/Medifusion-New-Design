import React, { Component } from "react";
import axios from "axios";
import { MDBDataTable, MDBBtn } from "mdbreact";
import Input from "./Input";
import Label from "./Label";
import GridHeading from "./GridHeading";
import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";
import NewLocation from "./NewLocation.js";
import SearchHeading from "./SearchHeading";
import Swal from "sweetalert2";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import $ from "jquery";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import NewPractice from "./NewPractice";

import Hotkeys from "react-hot-keys";
export class Location extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Location/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      name: "",
      organizationName: "",
      practice: "",
      npi: "",
      posCode: "",
      address: "",
    };
    this.state = {
      searchModel: this.searchModel,
      id: 0,
      data: [],
      showPopup: false,
      showPracticePopup: false,
      loading: false,
    };

    this.searchLocation = this.searchLocation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.openLocationPopup = this.openLocationPopup.bind(this);
    this.closeLocationPopup = this.closeLocationPopup.bind(this);
    this.openPracticePopup = this.openPracticePopup.bind(this);
    this.closePracticePopup = this.closePracticePopup.bind(this);
  }
  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+n") {
      // alert("search key")
      this.openLocationPopup(0);
    } else if (keyName == "alt+s") {
      this.searchLocation(e);
    } else if (keyName == "alt+c") {
      // alert("clear skey")
      this.clearFields(e);
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }
  onKeyUp(keyName, e, handle) {
    if (e) {
      // this.onKeyDown(keyName, e , handle);
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  searchLocation = (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    axios
      .post(this.url + "FindLocations", this.state.searchModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            name: (
              <a
                href=""
                onClick={(event) => this.openLocationPopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            organizationName: row.organizationName,
            practice: (
              <a
                href=""
                onClick={(event) =>
                  this.openPracticePopup(event, row.practiceID)
                }
              >
                {row.practice}
              </a>
            ),
            npi: row.npi,
            posCode: row.posCode,
            address: row.address,
          });
        });
        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
    e.preventDefault();
  };

  handleChange = (event) => {
    console.log("handleChange")
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    event.preventDefault();
    this.setState({
      searchModel: { [event.target.name]: event.target.value.toUpperCase() },
    });
  };

  clearFields = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel,
    });
  };

  openLocationPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closeLocationPopup = () => {
    console.log("closeLocationPopup")
    $("#locationModal").hide();
    this.setState({ showPopup: false });
  };

  openPracticePopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPracticePopup: true, id: id });
  };

  closePracticePopup = () => {
    $("#practiceModal").hide();
    this.setState({ showPracticePopup: false });
  };

  handleNumericCheck(event) {
    console.log(event);
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else if (event.charCode ==13){
        //  console.log("Enter hit");
      this.searchLocation(event);
    }else {
      event.preventDefault();
      return false;
    }
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  onPaste(event) {
    var x = event.target.value;
    x = x.trim();
    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        searchModel: {
          ...this.state.searchModel,
          [event.target.name]: x,
        },
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("Error", "Should be Number", "error");
      return;
    } else {
      this.setState({
        searchModel: {
          ...this.state.searchModel,
          [event.target.name]: x,
        },
      });
      // this.setState({
      //   searchModel: { [event.target.name]: x }
      // });
    }
    return;
  }

  render() {
    const data = {
      columns: [
        {
          label: "NAME",
          field: "name",
          sort: "asc",
          // width: 250
        },
        {
          label: "ORGANIZATION NAME",
          field: "organizationName",
          sort: "asc",
          // width: 150
        },
        {
          label: "PRACTICE",
          field: "practice",
          sort: "asc",
          // width: 150
        },
        {
          label: "NPI",
          field: "npi",
          sort: "asc",
          // width: 150
        },
        {
          label: "POSCODE",
          field: "posCode",
          sort: "asc",
          // width: 150
        },
        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          // width: 150
        },
      ],
      rows: this.state.data,
    };
    let popup = "";

    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewLocation
          onClose={this.closeLocationPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewLocation>
      );
    } else if (this.state.showPracticePopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewPractice
          onClose={this.closePracticePopup}
          practiceID={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
        ></NewPractice>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = "visible";
    }

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
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                {popup}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  LOCATION SEARCH
                  <Hotkeys
                    keyName="alt+n"
                    onKeyDown={this.onKeyDown.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                  >
                    <button
                      style={{ marginTop: "-6px" }}
                      class="float-right btn btn-primary mr-2"
                      type="submit"
                      onClick={(event) => this.openLocationPopup(event, 0)}
                    >
                      Add New
                    </button>
                  </Hotkeys>
                </h6>
                <div className="search-form">
                  <form onSubmit={this.searchLocation}>


                  <div className="row">
                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            id="name"
                            maxLength="60"
                            value={this.state.searchModel.name}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">
                          <label>Practice:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="practice"
                            id="practice"
                            maxLength="20"
                            value={this.state.searchModel.practice}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <br></br>
                          <label>Organization Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="organizationName"
                            id="organizationName"
                            maxLength="60"
                            value={this.state.searchModel.organizationName}
                            onChange={this.handleChange}
                          />
                        </div>

                        <div className="col-lg-12">
                          <label>NPI:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="npi"
                            id="npi"
                            maxLength="10"
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                            value={this.state.searchModel.npi}
                            onChange={this.handleChange}
                            onInput={this.onPaste}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>POS Code:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="posCode"
                            id="posCode"
                            max="20"
                            value={this.state.searchModel.posCode}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6"></div>
                  </div>

                  <div className="clearfix"></div>
                  <br></br>
                  <div className="col-lg-10 text-center">
                    <Hotkeys
                      keyName="alt+s"
                      onKeyDown={this.onKeyDown.bind(this)}
                      onKeyUp={this.onKeyUp.bind(this)}
                    >
                      <button
                        class=" btn btn-primary mr-2"
                        type="submit"
                        disabled={this.isDisabled(this.props.rights.search)}
                        // onClick={this.searchLocation}
                      >
                        Search
                      </button>
                    </Hotkeys>
                    <Hotkeys
                      keyName="alt+c"
                      onKeyDown={this.onKeyDown.bind(this)}
                      onKeyUp={this.onKeyUp.bind(this)}
                    >
                      <button
                        class=" btn btn-primary mr-2"
                        type="button"
                        onClick={this.clearFields}
                      >
                        Clear
                      </button>
                    </Hotkeys>
                  </div>
                
                  </form>
                
                </div>
              </div>
            </div>
          </div>
        </div>

        <br></br>
        {/* Grid Data */}
        <div className="container-fluid">
          <div className="card mb-4">
            <GridHeading
              Heading="LOCATION SEARCH RESULT"
              disabled={this.isDisabled(this.props.rights.export)}
              dataObj={this.state.searchModel}
              url={this.url}
              methodName="Export"
              methodNamePdf="ExportPdf"
              length={this.state.data.length}
            ></GridHeading>
            <div className="card-body">
              <div className="table-responsive">
                <div
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
          search: state.loginInfo.rights.locationSearch,
          add: state.loginInfo.rights.locationCreate,
          update: state.loginInfo.rights.locationEdit,
          delete: state.loginInfo.rights.locationDelete,
          export: state.loginInfo.rights.locationExport,
          import: state.loginInfo.rights.locationImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(Location);
