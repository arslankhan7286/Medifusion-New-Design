import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import axios from "axios";
import Input from "./Input";
import leftNavMenusReducer from "../reducers/leftNavMenusReducer";
import Swal from "sweetalert2";
import { Tabs, Tab } from "react-tab-view";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";
import GridHeading from "./GridHeading";
import NewUser from "./NewUser";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import settingIcon from "../images/setting-icon.png";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

export class NewTeam extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/teams/";
    this.assignPracticesUrl = process.env.REACT_APP_URL + "/userPractices/";
    this.errorField = "errorField";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.saveTeamCount = 0;

    this.teamModel = {
      name: "",
      details: "",
      isActive: false,
    };

    this.validationModel = {
      nameValField: "",
      detailsValField: "",
      validation: false,
    };

    this.state = {
      editId: this.props.teamID,
      teamModel: this.teamModel,
      validationModel: this.validationModel,
      loading: false,
      showPopup: false,
      email: "",
      popupName: "",
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveTeam = this.saveTeam.bind(this);
    this.delete = this.delete.bind(this);
  }
  //Team

  // Search = alt + s
  // clear = alt + c
  //Add NEW = alt + n

  // New Team Nav tab

  // save = alt + s

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+s") {
      // alert("save key")
      this.saveTeam();
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
    await this.setState({ loading: true });
    await this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    try {
      if (this.state.editId > 0) {
        await axios
          .get(this.url + "getTeam/" + this.state.editId, this.config)
          .then((res) => {
            this.setState({
              teamModel: res.data,
            });
          });
        await axios
          .get(this.url + "FindTeamUsers/" + this.state.editId, this.config)
          .then((res) => {
            let pushToUsers = [];
            //Push data to Table Colums
            res.data.map((row, i) => {
              pushToUsers.push({
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
                reporting: row.reportTo,
              });
            });
            this.setState({ teamData: pushToUsers });
          })
          .catch((error) => {
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
      }
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  openUserPopup = (event, email) => {
    event.preventDefault();
    this.setState({ showPopup: true, email: email });
  };

  closeUserPopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  };

  openhistorypopup = (name, id) => {
    this.setState({ popupName: name, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ popupName: "", showPopup: false });
  };

  handleChange = (event) => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    event.preventDefault();
    this.setState({
      teamModel: {
        ...this.state.teamModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  handleCheck = () => {
    this.setState({
      teamModel: {
        ...this.state.teamModel,
        isActive: !this.state.teamModel.isActive,
      },
    });
  }

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value == "Please Select"
    )
      return true;
    else return false;
  }

  saveTeam = (e) => {
    if (this.saveTeamCount == 1) {
      return;
    }
    this.saveTeamCount = 1;
    this.setState({ loading: true });
    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.teamModel.name)) {
      myVal.nameValField = <span>Name is Required</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      Swal.fire("Please Select All Fields Properly", "", "error");
      this.saveTeamCount = 0;
      return;
    }

    try {
      axios
        .post(this.url + "saveTeam", this.state.teamModel, this.config)
        .then((response) => {
          this.saveTeamCount = 0;

          this.setState({
            teamModel: response.data,
            editId: response.data.id,
            loading: false,
          });
          Swal.fire("Team Created Successfully", "", "success");
        })
        .catch((error) => {
          this.saveTeamCount = 0;
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
    } catch {}
    // this.setState({ loading: false });
    // e.preventDefault();
  };

  delete = (e) => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(this.url + "deleteTeam/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({ loading: false });
            Swal.fire("Record Deleted Successfully", "", "success");
            this.props.onClose();
          })
          .catch((error) => {
            this.setState({ loading: false });
            if (error.response) {
              if (error.response.upaStatus) {
                // Swal.fire("Unauthorized Access" , "" , "error");
                return;
              }
            } else if (error.request) {
              return;
            } else {
            }

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
          });
      }
    });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    const teamData = {
      columns: [
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
          width: 150,
        },
        {
          label: "REPORTING TO",
          field: "reporting",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.teamData,
    };

    const isActive = this.state.teamModel.isActive;

    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingIcon} width="17px" />
      </div>
    );

    var dropdown;
    dropdown = (
      <div style={{ width: "32px" }}>
        <Dropdown
          className=""
          options={options}
          onChange={() => this.openhistorypopup("NewHistoryPractice", 0)}
          placeholder={Imag}
        />
      </div>
    );

    let popup = "";
    if (this.state.popupName == "NewHistoryPractice") {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
        ></NewHistoryPractice>
      );
    } else if (this.state.showPopup) {
      popup = (
        <NewUser
          onClose={this.closeUserPopup}
          email={this.state.email}
        ></NewUser>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    // SPINNER
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
          <div class="modal-dialog" role="document">
            <div class="modal-content ">
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.teamModel.name
                            ? this.state.teamModel.name.toUpperCase()
                            : ""
                          : "NEW TEAM"}
                      </h3>

                      <div class="float-right col-md-0 p-0">
                          <button
                            class="close"
                            type="button"
                            // data-dismiss="modal"
                            // aria-label="Close"
                          >
                            <span
                              aria-hidden="true"
                              onClick={() => this.props.onClose()}
                            >
                              ×
                            </span>
                          </button>
                        </div>
                     
                        <div class="float-right col-md-0 p-0">
                          {this.state.editId > 0 ? dropdown : ""}
                        </div>
                   

                        <div class="float-right col-md-0 p-0">
                          <button
                            class="btn btn-primary float-right mb-1 mr-2"
                            type="submit"
                            disabled={this.isDisabled(this.props.rights.delete)}
                            onClick={this.delete}
                          >
                            Delete
                          </button>
                        </div>
                        <div class="float-right col-md-0 p-0" style ={{marginRight:"10px" , marginTop:"5px"}}>
                          <input
                            class="checkbox mr-2"
                            type="checkbox"
                            checked={isActive}
                            onClick={this.handleCheck}
                          />
                          Mark Inactive
                        </div>

                  
                       
                        {/* {this.state.editId > 0 ?
                          (<img src={settingIcon} alt="" style={{ width: "17px" }} />) : null} */}
                       
                   
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
                          <label for="organizationName">
                            Name <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Name"
                            value={this.state.teamModel.name}
                            name="name"
                            id="name"
                            maxLength="20"
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

                    <div class="row">
                      <div class="col-md-11 mb-2">
                        <div class="col-md-1 float-left">
                          <label>Notes</label>
                        </div>
                        <div class="col-md-11 pl-5 float-left">
                          <textarea
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Notes"
                            required=""
                            name="details"
                            id="details"
                            value={this.state.teamModel.details}
                            onChange={this.handleChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <Hotkeys
                        keyName="alt+s"
                        onKeyDown={this.onKeyDown.bind(this)}
                        onKeyUp={this.onKeyUp.bind(this)}
                      >
                        <button
                          class="btn btn-primary mr-2"
                          type="submit"
                          onClick={this.saveTeam}
                          disabled={this.isDisabled(
                            this.state.editId > 0
                              ? this.props.rights.update
                              : this.props.rights.add
                          )}
                        >
                          Save
                        </button>
                      </Hotkeys>

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

                    {/* Grid */}
                    <br></br>
                    {/* Grid Data */}
                    <div className="container-fluid">
                      <div className="card mb-4">
                        <div className="card-body">
                          <div className="table-responsive">
                            <div
                              id="dataTable_wrapper"
                              className="dataTables_wrapper dt-bootstrap4"
                            >
                              <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary search-h">
                                  USERS
                                </h6>
                              </div>
                              <MDBDataTable
                                responsive={true}
                                striped
                                bordered={true}
                                searching={false}
                                data={teamData}
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
          search: state.loginInfo.rights.teamSearch,
          add: state.loginInfo.rights.teamCreate,
          update: state.loginInfo.rights.teamupdate,
          delete: state.loginInfo.rights.teamDelete,
          export: state.loginInfo.rights.teamExport,
          import: state.loginInfo.rights.teamImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(NewTeam);
