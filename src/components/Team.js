import React, { Component } from "react";

import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import Swal from "sweetalert2";
import axios from "axios";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable
} from "mdbreact";
import GridHeading from "./GridHeading";
import NewPractice from "./NewPractice";
import NewTeam from "./NewTeam";

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

class Team extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/teams/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      name: ""
    };

    this.state = {
      searchModel: this.searchModel,
      id: 0,
      data: [],
      showPopup: false,
      loading: false
    };

    this.searchTeam = this.searchTeam.bind(this);
    this.closeTeamPopup = this.closeTeamPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openTeamPopup = this.openTeamPopup.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+n") {
      // alert("search key")
      this.openTeamPopup(0);
    } else if (keyName == "alt+s") {
      this.searchTeam(e);
    } else if (keyName == "alt+c") {
      // alert("clear skey")
      this.clearFields(e);
    }

    this.setState({
      output: `onKeyDown ${keyName}`
    });
  }

  onKeyUp(keyName, e, handle) {
    if (e) {
      // this.onKeyDown(keyName, e , handle);
    }
    this.setState({
      output: `onKeyUp ${keyName}`
    });
  }

  //Search Team
  searchTeam = e => {
    e.preventDefault();
    this.setState({ loading: true });

    try {
      axios
        .post(this.url + "findTeams", this.state.searchModel, this.config)
        .then(response => {
          let newList = [];
          response.data.map((row, i) => {
            newList.push({
              name: (
                <a
                  href=""
                  onClick={(event) => this.openTeamPopup(event, row.id)}
                >
                  {row.name}
                </a>
              ),
              details: row.details
            });
          });

          this.setState({ data: newList, loading: false });
        })
        .catch(error => {
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
    } catch { }


  };

  handleChange = event => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };

  clearFields = event => {
    event.preventDefault()
    this.setState({
      searchModel: this.searchModel
    });
  };

  openTeamPopup = (event, id) => {
    event.preventDefault()
    this.setState({ showPopup: true, id: id });
  };

  closeTeamPopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    const data = {
      columns: [

        {
          label: "NAME",
          field: "name",
          sort: "asc",
          width: 150
        },
        {
          label: "DETAILS",
          field: "details",
          sort: "asc",
          width: 270
        }
      ],
      rows: this.state.data
    };

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewTeam
          onClose={this.closeTeamPopup}
          teamID={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewTeam>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = 'visible';
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
                  TEAM SEARCH

                   <Hotkeys
                    keyName="alt+n"
                    onKeyDown={this.onKeyDown.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                  >
                    <button
                      style={{ marginTop: "-6px" }}
                      class="float-right btn btn-primary mr-2"
                      type="submit"
                      onClick={event => this.openTeamPopup(event, 0)}
                    >
                      Add New
                        </button>
                  </Hotkeys>


                </h6>
                <div className="search-form">

                  <form onSubmit={this.searchTeam}>
                  <div className="row">

                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Name:</label>
                          <input type="text" className="form-control"
                            maxLength="20"
                            name="name"
                            id="name"
                            value={this.state.searchModel.name}
                            onChange={this.handleChange} />
                        </div>
                        <div className="col-lg-12">


                        </div>
                      </div>
                    </div>





                  </div>




                  <br></br>
                  <div className="col-lg-10 text-center">
                    <Hotkeys
                      keyName="alt+s"
                      onKeyDown={this.onKeyDown.bind(this)}
                      onKeyUp={this.onKeyUp.bind(this)}
                    >
                      <button
                        class=" btn btn-primary mr-2 mb-2"
                        type="submit"
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
                        class=" btn btn-primary mr-2 mb-2"
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
              Heading="TEAM SEARCH RESULT"
              disabled={this.isDisabled(this.props.rights.export)}
              dataObj={this.state.searchModel}
              url={this.url} 
              methodNamePdf="ExportPdf"
              methodName="Export"
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
                    bordered={true}
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


      </React.Fragment>);

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
        import: state.loginInfo.rights.teamImport
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

export default connect(mapStateToProps, matchDispatchToProps)(Team);
