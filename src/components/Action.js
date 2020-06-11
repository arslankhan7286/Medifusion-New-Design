import React, { Component } from "react";

import NewAction from "./NewAction";

import Label from "./Label";
import Input from "./Input";

import settingIcon from "../images/setting-icon.png";

import SearchHeading from "./SearchHeading";
import { MDBDataTable, MDBBtn } from "mdbreact";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import GridHeading from "./GridHeading";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import $ from "jquery";
import axios from "axios";

class Action extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Action/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      name: "",
      description: "",
      user: ""
    };

    this.state = {
      searchModel: this.searchModel,
      data: [],
      usersData: [],
      id: 0,
      showPopup: false,
      loading: false,
      isActive: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.searchAction = this.searchAction.bind(this);
    this.openActionPopup = this.openActionPopup.bind(this);
    this.closeActionPopup = this.closeActionPopup.bind(this);
  }

  openActionPopup =(event , id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closeActionPopup() {
    $("#actionModal").hide();
    this.setState({ showPopup: false });
  }

  searchAction = e => {
    e.preventDefault();

    this.setState({ loading: true });
    axios
      .post(this.url + "FindActions", this.state.searchModel, this.config)
      .then(response => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
         
            name: (
              <a
                href=""
                onClick={(event) => this.openActionPopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            description: row.description,
            user: row.user
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };

  clearFields = event => {
    this.setState({
      searchModel: this.searchModel
    });
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

  componentWillMount() {
    axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        this.setState({
          usersData: response.data.users
        });
      })
      .catch(error => {});
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
          label: "DESCRIPTION",
          field: "description",
          sort: "asc",
          width: 270
        },
        {
          label: "USER",
          field: "user",
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
        <NewAction
          onClose={this.closeActionPopup}
          id={this.state.id}
        ></NewAction>
      );
    } else 
    {popup = <React.Fragment></React.Fragment>;
    document.body.style.overflow ='visible';
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
      {spiner}
      <div class="container-fluid">
  
          <SearchHeading
            heading="ACTION SEARCH"
            handler={(event) => this.openActionPopup(event,0)}
            // disabled={this.isDisabled(this.props.rights.add)}
          ></SearchHeading>
      

        <div
          class="clearfix"
          style={{ borderBottom: "1px solid #037592" }}
        ></div>

        <div class="row">
          <div class="col-md-12 col-sm-12 pt-3 provider-form">
          <form onSubmit={(event) => this.searchAction(event)}>
              <div class="row">
                <div class="col-md-12 m-0 p-0 float-right">
              
                  <div class="row mt-3">
                    <div class="col-md-4 mb-4 col-sm-4">
                      <div class="col-md-4 float-left">
                        <label for="AppliedAmount">Name</label>
                      </div>
                      <div class="col-md-8 p-0 pl-1 m-0 float-left">
                        <input
                          type="text"
                          class="provider-form w-100 form-control-user"
                          placeholder="Name"
                          name="name"
                          id="name"
                          value={this.state.searchModel.name}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback"> </div>
                    </div>
                    <div class="col-md-4 mb-4 col-sm-4">
                      <div class="col-md-4 float-left">
                        <label for="UnAppliedAmount">Description</label>
                      </div>
                      <div class="col-md-8 p-0 m-0 float-left">
                        <input
                          type="text"
                          class="provider-form w-100 form-control-user"
                          placeholder="Description"
                          name="description"
                          id="description"
                          value={this.state.searchModel.description}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback"> </div>
                    </div>
                    <div class="col-md-4 mb-4 col-sm-4">
                      <div class="col-md-4 float-left">
                        <label for="PostedAmount">User ID</label>
                      </div>
                      <div class="col-md-8 p-0 m-0 float-left">
                        <select
                          name="status"
                          style={{padding:"6px" , fontSize:"12px"}}
                          class="provider-form w-100 form-control-user"
                          name="user"
                          id="user"
                          value={this.state.searchModel.user}
                          onChange={this.handleChange}
                        >
                        {this.state.usersData.map(s => (
                          <option key={s.id} value={s.description}>
                            {" "}
                            {s.description2}{" "}
                          </option>
                        ))}{" "}
                        </select>
                      </div>
                      <div class="invalid-feedback"> </div>
                    </div>
                  </div>
               
                </div>

                <div class="col-lg-12 mt-4 text-center">
                  <button
                    class="btn btn-primary mr-2 mb-3"
                    type="submit"
                    // disabled={this.isDisabled(this.props.rights.search)}
                  >
                    Search
                  </button>
                  <button
                    class="btn btn-primary mr-2 mb-3"
                    onClick={this.clearFields}
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
              <div className="card-header ">
                <h6 className="m-0 font-weight-bold text-primary search-h">
                  ACTION SEARCH RESULT
         

                <input
                  type="button"
                  name="name"
                  id="0"
                  className="export-btn-pdf"
                  value="Export PDF"
                  length={this.state.data.length}
                  onClick={this.exportPdf}
                />

                <input
                  type="button"
                  name="name"
                  id="0"
                  className="export-btn"
                  value="Export Excel"
                  length={this.state.data.length}
                  onClick={this.exportExcel}
                />

</h6>
         
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <div
                     style={{overflowX:"hidden"}}
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
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    //id: state.selectedTab !== null ? state.selectedTab.id : 0,
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

export default connect(mapStateToProps, matchDispatchToProps)(Action);
