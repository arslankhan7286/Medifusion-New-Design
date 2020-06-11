import React, { Component } from "react";

import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import SearchInput2 from "./SearchInput2";

import axios from "axios";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";

import GridHeading from "./GridHeading";
import NewClient from "./NewClient";

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

class Client extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/client/";
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
      serviceLocation: "",
      taxID: "",
      address: "",
      officePhoneNo: "",
    };

    this.state = {
      searchModel: this.searchModel,
      id: 0,
      data: [],
      showPopup: false,
      loading: false,
    };

    this.searchClient = this.searchClient.bind(this);
    this.closePracticePopup = this.closePracticePopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openClientPopup = this.openClientPopup.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+n") {
      // alert("search key")
      this.openClientPopup(0);
    } else if (keyName == "alt+s") {
      this.searchClient(e);
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

  searchClient = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post(this.url + "FindClients", this.state.searchModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            name: (
              <a
                href=""
                onClick={(event) => this.openClientPopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            organizationName: row.organizationName,
            contactPerson: row.contactPerson,
            taxID: row.taxID,
            address: row.address,
            officePhoneNum: row.officePhoneNum,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
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
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  clearFields = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel,
    });
  };

  openClientPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closePracticePopup = () => {
    $("#clientModal").hide();
    this.setState({ showPopup: false });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }else if(event.charCode == 13){
      this.searchClient(event)      
    } else {
      event.preventDefault();
      return false;
    }
  }

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
          width: 150,
        },
        {
          label: "ORGANIZATION NAME",
          field: "organizationName",
          sort: "asc",
          width: 270,
        },
        {
          label: "CONTACT PERSON",
          field: "contactPerson",
          sort: "asc",
          width: 200,
        },
        {
          label: "TAX ID",
          field: "taxID",
          sort: "asc",
          width: 100,
        },
        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          width: 150,
        },
        {
          label: "OFFICE PHONE #",
          field: "officePhoneNum",
          sort: "asc",
          width: 100,
        },
      ],
      rows: this.state.data,
    };

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewClient
          onClose={this.closePracticePopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewClient>
      );
    } else {
      popup = null;
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
                  CLIENT SEARCH
                  <button
                    style={{ marginTop: "-6px" }}
                    class="float-right btn btn-primary mr-2"
                    type="submit"
                    onClick={(event) => this.openClientPopup(event, 0)}
                  >
                    Add New
                  </button>
                </h6>
                <div className="search-form">
                  <form onSubmit={this.searchClient}>
                  <div className="row">
                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            maxLength="60"
                            type="text"
                            name="name"
                            id="name"
                            value={this.state.searchModel.name}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">
                        
                          <label>Phone #:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="officePhoneNo"
                            id="officePhoneNo"
                            maxLength="10"
                            value={this.state.searchModel.officePhoneNo}
                            onChange={this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                          />
                        </div>
                      
                        </div>
                    </div>

                    <div className="col-lg-6">
                    <br></br>
                      <div className="row">
                      <div className="col-lg-12">
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
                          <label>Tax ID:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="taxID"
                            id="taxID"
                            maxLength="9"
                            value={this.state.searchModel.taxID}
                            onChange={this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Address:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            id="address"
                            maxLength="30"
                            value={this.state.searchModel.address}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6"></div>
                  </div>

                  <div className="clearfix"></div>
                  <br></br>
                  <div className="col-lg-12 text-center">
                    <button
                      class=" btn btn-primary mr-2"
                      type="submit"
                      // onClick={this.searchClient}
                    >
                      Search
                    </button>
                    <button
                      class=" btn btn-primary mr-2"
                      type="submit"
                      onClick={this.clearFields}
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
              Heading="CLIENT SEARCH RESULT"
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
          search: state.loginInfo.rights.clientSearch,
          add: state.loginInfo.rights.clientCreate,
          update: state.loginInfo.rights.clientEdit,
          delete: state.loginInfo.rights.clientDelete,
          export: state.loginInfo.rights.clientExport,
          import: state.loginInfo.rights.clientImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(Client);
