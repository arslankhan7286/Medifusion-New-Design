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
import NewPractice from "./NewPractice";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import $ from "jquery";
import Swal from "sweetalert2";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

class Practice extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Practice/";
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
      npi: "",
      taxid: "",
      address: "",
      officePhoneNum: "",
    };

    this.state = {
      searchModel: this.searchModel,
      id: 0,
      data: [],
      showPopup: false,
      loading: false,
    };

    this.searchPractices = this.searchPractices.bind(this);
    this.closePracticePopup = this.closePracticePopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openPracticePopup = this.openPracticePopup.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+n") {
      // alert("search key")
      this.openPracticePopup(0);
    } else if (keyName == "alt+s") {
      this.searchPractices(e);
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

  searchPractices = (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    axios
      .post(this.url + "FindPractices", this.state.searchModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            practice: (
              <a
                href=""
                onClick={(event) => this.openPracticePopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            organizationName: row.organizationName,
            npi: row.npi,
            taxid: row.taxID,
            address: row.address,
            officePhoneNum: row.officePhoneNum,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            Swal.fire("Unauthorized Access", "", "error");
          }
        } else if (error.request) {
        } else {
        }
      });
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
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  clearFields = (event) => {
    this.setState({
      searchModel: this.searchModel,
    });
  };

  openPracticePopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closePracticePopup = () => {
    $("#practiceModal").hide();
    this.setState({ showPopup: false });
  };

  handleNumericCheck(event) {
    console.log(event);
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else if (event.charCode ==13){
         console.log("Enter hit");
      this.searchPractices(event);
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
    // if (x.length > 10) {
    //   // if (x.length > 9) {
    //   x = x.trimRight();
    //   Swal.fire("Error", "Length of NPI Should be 10", "error");
    //   // }
    // } else
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
    }
  }

  render() {
    const data = {
      columns: [
        {
          label: "NAME",
          field: "practice",
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
          label: "NPI",
          field: "npi",
          sort: "asc",
          width: 200,
        },
        {
          label: "TAX ID",
          field: "taxid",
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
        <NewPractice
          onClose={this.closePracticePopup}
          practiceID={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
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
                  PRACTICE SEARCH
                  <Hotkeys
                    keyName="alt+n"
                    onKeyDown={this.onKeyDown.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                  >
                    <button
                      style={{ marginTop: "-6px" }}
                      class="float-right btn btn-primary mr-2"
                      type="submit"
                      onClick={(event) => this.openPracticePopup(event, 0)}
                    >
                      Add New
                    </button>
                  </Hotkeys>
                </h6>
                <div className="search-form">
                  <form onSubmit={this.searchPractices}>
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
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <br></br>
                          <label>NPI:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="npi"
                            id="npi"
                            maxLength="10"
                            value={this.state.searchModel.npi}
                            onChange={this.handleChange}
                            onKeyPress={(event) =>this.handleNumericCheck(event)
                            }
                            onInput={this.onPaste}
                          />
                        </div>
                        <div className="col-lg-12">
                          <label>Tax ID:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="taxid"
                            id="taxid"
                            maxLength="9"
                            value={this.state.searchModel.taxid}
                            onChange={() => this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
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
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Phone #:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="officePhoneNum"
                            id="officePhoneNum"
                            maxLength="10"
                            value={this.state.searchModel.officePhoneNum}
                            onChange={this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                          />
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
                        class=" btn btn-primary mr-2"
                        type="submit"
                        disabled={this.isDisabled(this.props.rights.search)}
                        // onClick={this.searchPractices}
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
              Heading="PRACTICE SEARCH RESULT"
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
          search: state.loginInfo.rights.practiceSearch,
          add: state.loginInfo.rights.practiceCreate,
          update: state.loginInfo.rights.practiceEdit,
          delete: state.loginInfo.rights.practiceDelete,
          export: state.loginInfo.rights.practiceExport,
          import: state.loginInfo.rights.practiceImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(Practice);
