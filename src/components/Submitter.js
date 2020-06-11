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
import NewSubmitter from "./NewSubmitter";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

class Submitter extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/submitter/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      name: "",
      submitterName: ""
    };

    this.state = {
      searchModel: this.searchModel,
      id: 0,
      data: [],
      showPopup: false,
      loading: false
    };

    this.searchSubmitter = this.searchSubmitter.bind(this);
    this.closeSubmitterPopup = this.closeSubmitterPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openSubmitterPopup = this.openSubmitterPopup.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+n") {
      // alert("search key")
      this.openSubmitterPopup(0);
      console.log(e.which);
    } else if (keyName == "alt+s") {
      this.searchSubmitter(e);
      console.log(e.which);
    } else if (keyName == "alt+c") {
      // alert("clear skey")
      this.clearFields(e);
      console.log(e.which);
    }

    this.setState({
      output: `onKeyDown ${keyName}`
    });
  }

  onKeyUp(keyName, e, handle) {
    console.log("test:onKeyUp", e, handle);
    if (e) {
      console.log("event has been called", e);

      // this.onKeyDown(keyName, e , handle);
    }
    this.setState({
      output: `onKeyUp ${keyName}`
    });
  }

  //Search Team
  searchSubmitter = e => {
    e.preventDefault();
    this.setState({ loading: true });

    try {
      axios
        .post(this.url + "FindSubmitters", this.state.searchModel, this.config)
        .then(response => {
          let newList = [];
          response.data.map((row, i) => {
            newList.push({
              name: (
                <a
                  href=""
                  onClick={(event) => this.openSubmitterPopup(event, row.id)}
                >
                  {row.name}
                </a>
              ),
              submitterName: row.name,
              address: row.address,
              receiverName: row.receiverName
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
            console.log(error.request);
            return;
          } else {
            console.log("Error", error.message);
            console.log(JSON.stringify(error));
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
        });
    } catch { }

    e.preventDefault();
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };

  clearFields = event => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel
    });
  };

  openSubmitterPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closeSubmitterPopup = () => {
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
          label: "SUBMITTER NAME",
          field: "submitterName",
          sort: "asc",
          width: 270
        },
        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          width: 270
        },
        {
          label: "RECEIVER NAME",
          field: "receiverName",
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
        <NewSubmitter
          onClose={this.closeSubmitterPopup}
          SubmitterID={this.state.id}
        ></NewSubmitter>
      );
      // console.log("SUBMITTERID",this.props.SubmitterID)
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
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  SUBMITTER SEARCH
                   <button
                    style={{ marginTop: "-6px" }}
                    class="float-right btn btn-primary mr-2"
                    type="submit"
                    onClick={(event) => this.openSubmitterPopup(event, 0)}
                  >
                    Add New
                    </button>
                </h6>
                <div className="search-form">
                  <div className="row">
                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength="20"
                            type="text"
                            name="name"
                            id="name"
                            value={this.state.searchModel.name}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">

                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <br></br>
                          <label>Submitter Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength="20"
                            name="submitterName"
                            id="submitterName"
                            value={this.state.searchModel.submitterName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="clearfix"></div>
                  <br></br>
                  <div className="col-lg-12 text-center">
                    <Hotkeys
                      keyName="alt+s"
                      onKeyDown={this.onKeyDown.bind(this)}
                      onKeyUp={this.onKeyUp.bind(this)}
                    >
                      <button
                        style={{ marginTop: "-6px" }}
                        class=" btn btn-primary mr-2"
                        type="submit"
                        onClick={(event) => this.searchSubmitter(event)}
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
                        style={{ marginTop: "-6px" }}
                        class=" btn btn-primary mr-2"
                        type="submit"
                        onClick={(event) => this.clearFields(event)}
                      >
                        Clear
                        </button>
                    </Hotkeys>

                  </div>
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
              Heading="SUBMITTER SEARCH RESULT"
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
        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("state from Header Page", state);
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

export default connect(mapStateToProps, matchDispatchToProps)(Submitter);
