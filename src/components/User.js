import React, { Component } from "react";

import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import SearchInput2 from "./SearchInput2";
import Swal from "sweetalert2";
import axios from "axios";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";

import GridHeading from "./GridHeading";
import NewPractice from "./NewPractice";
import NewUser from "./NewUser";

import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";

// import ReactDataGrid from 'react-data-grid';

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import $ from "jquery";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

class User extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/account/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.columns = [
      {
        label: "NAME",
        field: "name",
        sort: "asc",
        width: 150,
      },
      {
        label: "EMAIL",
        field: "email",
        sort: "asc",
        width: 270,
      },

      {
        label: "ROLE",
        field: "role",
        sort: "asc",
        width: 100,
      },
    ];

    this.searchModel = {
      firstName: "",
      lastName: "",
      email: "",
      clientID: null,
    };

    this.state = {
      searchModel: this.searchModel,
      id: 0,
      email: "",
      // data: [],
      data: {
        columns: this.columns,
        rows: [],
      },
      role: [],
      client: [],
      teams: [],
      showPopup: false,
      loading: false,
    };

    this.searchUser = this.searchUser.bind(this);
    this.closeUserPopup = this.closeUserPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openUserPopup = this.openUserPopup.bind(this);
  }
  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+n") {
      // alert("search key")
      this.openUserPopup(0);
    } else if (keyName == "alt+s") {
      this.searchUser(e);
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
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  componentWillMount() {
    var config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    // Account Get Profiles
    //  axios({
    //      method : "get",
    //      url:this.url + 'getProfiles' ,
    //     //  headers : {Authorization: "Bearer  " + this.props.loginObject.token ,
    //     //  Accept: "*/*"}
    //  })

    axios
      .get(this.url + "getProfiles", this.config)
      .then((response) => {
        this.setState({
          client: response.data.clients,
          role: response.data.roles,
          teams: response.data.teams,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            //Swal.fire("Unauthorized Access" , "" , "error");
            return;
          }
        } else if (error.request) {
          return;
        } else {
          //Swal.fire("Something went Wrong" , "" , "error");
          return;
        }
      });
  }

  //Search User
  searchUser = (e) => {
    e.preventDefault()
    this.setState({ loading: true });

    axios
      .post(this.url + "findUsers", this.state.searchModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            name: (
              <a
                href=""
                onClick={(event) => this.openUserPopup(event, row.email)}
              >
                {row.name}
              </a>
            ),
            email: row.email,
            role: row.role,
          });
        });
        var data = {
          columns: this.columns,
          rows: newList,
        };
        //setTimeout(function () {
        this.setState({
          loading: false,
          data: data,
        });

        // this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            Swal.fire("Unauthorized Access", "", "error");
            return;
          }
        } else if (error.request) {
          return;
        } else {
          Swal.fire("Something went Wrong", "", "error");
          return;
        }
      });

    e.preventDefault();
  };

  handleChange = (event) => {
    event.preventDefault();

    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
  };

  clearFields = (event) => {
    this.setState({
      searchModel: this.searchModel,
    });
  };

  openUserPopup = (event, email) => {
    event.preventDefault();
    this.setState({ showPopup: true, email: email });
  };

  closeUserPopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewUser
          onClose={this.closeUserPopup}
          email={this.state.email}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewUser>
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
        {popup}

        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                 USER SEARCH
                  <Hotkeys
                    keyName="alt+n"
                    onKeyDown={this.onKeyDown.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                  >
                    <button
                      style={{ marginTop: "-6px" }}
                      class="float-right btn btn-primary mr-2"
                      type="submit"
                      onClick={(event) => this.openUserPopup(event, 0)}
                    >
                      Add New
                    </button>
                  </Hotkeys>
                </h6>
                <div className="search-form">
                  <form onSubmit={this.searchUser}>
                  <div className="row">
                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Last Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength="60"
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={this.state.searchModel.lastName}
                            onChange={this.handleChange}
                          />
                        </div>
                       </div>
                    </div>
                    <div className="col-lg-6">
                    <br></br>
                      <div className="row">
                      <div className="col-lg-12">
                          <label>First Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            id="firstName"
                            maxLength="20"
                            value={this.state.searchModel.firstName}
                            onChange={this.handleChange}
                          />
                        </div>
                      
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Client:</label>
                          <select
                            style={{
                              borderRadius: "3px",
                              border: "1px solid rgb(250, 194, 205)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "36px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "98%",
                              paddingLeft: "2px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="clientID"
                            id="clientID"
                            value={
                              this.state.searchModel.clientID == null
                                ? ""
                                : this.state.searchModel.clientID
                            }
                            onChange={this.handleChange}
                          >
                            {this.state.client.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                      <div className="col-lg-12">
                          <label>Email:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            id="email"
                            maxLength="60"
                            value={this.state.searchModel.email}
                            onChange={this.handleChange}
                          />
                        </div>
                     
                      </div>
                    </div>
                  </div>

                  
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                      <div className="col-lg-12">
                          <label>Team:</label>
                          <select
                            style={{
                              borderRadius: "3px",
                              border: "1px solid rgb(250, 194, 205)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "36px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "98%",
                              paddingLeft: "2px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="teamID"
                            id="teamID"
                            value={
                              this.state.searchModel.teamID == null
                                ? ""
                                : this.state.searchModel.teamID
                            }
                            onChange={this.handleChange}
                          >
                             {this.state.teams.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.description}
                      </option>
                    ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  <br></br>
                  <div className="col-lg-12 text-center">
                    <Hotkeys
                      keyName="alt+s"
                      onKeyDown={this.onKeyDown.bind(this)}
                      onKeyUp={this.onKeyUp.bind(this)}
                    >
                      <button
                        class=" btn btn-primary mr-2"
                        type="submit"
                        // onClick={this.searchUser}
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
                        type="submit"
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
              Heading="USER SEARCH RESULT"
              disabled={this.isDisabled(this.props.rights.export)}
              dataObj={this.state.searchModel}
              url={this.url}
              methodName="Export"
              methodNamePdf="ExportPdf"
              length={this.state.data.rows.length}
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
                    bordered={true}
                    searching={false}
                    data={this.state.data}
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
          search: state.loginInfo.rights.userSearch,
          add: state.loginInfo.rights.userCreate,
          update: state.loginInfo.rights.userEdit,
          delete: state.loginInfo.rights.userDelete,
          export: state.loginInfo.rights.userExport,
          import: state.loginInfo.rights.userImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(User);
