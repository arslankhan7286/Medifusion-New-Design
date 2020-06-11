import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import taxonomyIcon from "../images/code-search-icon.png";
import axios from "axios";
import Input from "./Input";
import leftNavMenusReducer from "../reducers/leftNavMenusReducer";
import Swal from "sweetalert2";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable
} from "mdbreact";
import GridHeading from "./GridHeading";
import { Tabs, Tab } from "react-tab-view";
import SearchHeading from "./SearchHeading";
import Label from "./Label";
import NewReceiver from "./NewReceiver";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { log } from "util";

export class Receiver extends Component {
  constructor(props) {
    super(props);

    // this.url = process.env.REACT_APP_URL + '/account/';
    this.url = process.env.REACT_APP_URL + "/Receiver/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      name: "",
      organizationName: "",
      address: "",
      receiverID: null
    };

    this.state = {
      searchModel: this.searchModel,
      id: 0,
      email: "",
      data: [],
      role: [],
      client: [],
      showPopup: false,
      loading: false
    };

    this.searchReceiver = this.searchReceiver.bind(this);
    this.closeUserPopup = this.closeUserPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openUserPopup = this.openUserPopup.bind(this);
  }
  componentWillMount() {
    var config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
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
      .then(response => {
        console.log("Get Profiles Response : ", response.data);
        this.setState({
          client: response.data.clients,
          role: response.data.roles
        });
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status) {
            //Swal.fire("Unauthorized Access" , "" , "error");
            console.log(error.response.status);
            return;
          }
        } else if (error.request) {
          console.log(error.request);
          return;
        } else {
          console.log("Error", error.message);
          console.log(JSON.stringify(error));
          //Swal.fire("Something went Wrong" , "" , "error");
          return;
        }

        console.log(error);
      });
  }
  //Search User
  searchReceiver = e => {
    e.preventDefault()
    this.setState({ loading: true });



    axios
      .post(this.url + "FindReceiver", this.state.searchModel, this.config)
      .then(response => {

        let newList = [];
        response.data.map((row, i) => {
          console.log(row);
          newList.push({

            name: (
              <a
                href=""
                onClick={(event) => this.openUserPopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            organizationName: row.organizationName,
            address: row.address,
            receiverId: row.receiverID
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire("Unauthorized Access", "", "error");
            return;
          } else {
            Swal.fire("Something Wrong", "Please Try Again", "error");
            return;
          }
        } else if (error.request) {
          console.log(error.request);
          return;
        } else {
          Swal.fire("Something went Wrong", "", "error");
          return;
        }
      });

    e.preventDefault();
  };
  handleChange = event => {
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase()
      }
    });
  };

  clearFields = event => {
    event.preventDefault()
    this.setState({
      searchModel: this.searchModel
    });
  };

  openUserPopup = (event, id) => {
    event.preventDefault()
    this.setState({ showPopup: true, id: id });
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
          label: "ORGANIZAATION NAME",
          field: "organizationName",
          sort: "asc",
          width: 150
        },
        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          width: 270
        },

        {
          label: "RECEIVER ID",
          field: "receiverId",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.data
    };

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      // var x = window.scrollX;
      // var y = window.scrollY;
      // window.onscroll = function () { window.scrollTo(x, y); };
      popup = (
        <NewReceiver
          onClose={this.closeUserPopup}
          receiverID={this.state.id}
        ></NewReceiver>
      );
    } else {
      popup = null;
      document.body.style.overflow = 'visible';
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
        <div >
          <div className="container-fluid">
            <div className="card mb-4 bg-info">
              <div className="card-body">
                <div className="table-responsive">
                  {spiner}
                  <h6 className="m-0 font-weight-bold text-primary th1 ">
                    RECEIVER SEARCH
                   <button
                      style={{ marginTop: "-6px" }}
                      class="float-right btn btn-primary mr-2"
                      type="submit"
                      onClick={(event) => this.openUserPopup(event, 0)}
                    >
                      Add New
                    </button>
                  </h6>
                  <div className="search-form">
                  <form onSubmit={(event) => this.searchReceiver(event)}>
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
                              
                              <label>Address:</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address"
                                id="address"
                                maxLength="60"
                                value={this.state.searchModel.address}
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
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
                              maxLength="20"
                              value={this.state.searchModel.organizationName}
                              onChange={this.handleChange}
                            />
                          </div>
                 
                          <div className="col-lg-12">
                            <label>Receiver ID:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="receiverID"
                              id="receiverID"
                              maxLength="60"
                              value={this.state.searchModel.receiverID}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="clearfix"></div>
                    <br></br>
                    <div className="col-lg-12 text-center">
                      <button
                        style={{ marginTop: "-6px" }}
                        class=" btn btn-primary mr-2"
                        type="submit"
                
                      >
                        Search
                        </button>
                      <button
                        style={{ marginTop: "-6px" }}
                        class=" btn btn-primary mr-2"
                        type="submit"
                        onClick={(event) => this.clearFields(event)}
                      >
                        Clear
                        </button>

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
                Heading="RECEIVER SEARCH RESULT"
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
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
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

export default connect(mapStateToProps, matchDispatchToProps)(Receiver);
