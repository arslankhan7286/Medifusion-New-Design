import React, { Component } from "react";

import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Input from "./Input";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";
import { MDBDataTable, MDBBtn } from "mdbreact";
import NewProvider from "./NewProvider";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import settingIcon from "../images/setting-icon.png";
import { rootCertificates } from "tls";
import NewCPT from "./NewCPT";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import GridHeading from "./GridHeading";

import Hotkeys from "react-hot-keys";

class CPT extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/cpt/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      cptCode: "",
      description: "",
      modifiers: "",
      ndcNumber: "",
      ndcDescription: "",
    };

    this.state = {
      searchModel: this.searchModel,
      data: [],
      showPopup: false,
      id: 0,
      loading: false,
    };

    //binding functions to this class
    this.searchCPTCodes = this.searchCPTCodes.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.openCPTPopup = this.openCPTPopup.bind(this);
    this.closeCPTPopup = this.closeCPTPopup.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+n") {
      // alert("search key")
      this.openCPTPopup(0);
      console.log(e.which);
    } else if (keyName == "alt+s") {
      this.searchCPTCodes(e);
      console.log(e.which);
    } else if (keyName == "alt+c") {
      // alert("clear skey")
      this.clearFields(e);
      console.log(e.which);
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  onKeyUp(keyName, e, handle) {
    console.log("test:onKeyUp", e, handle);
    if (e) {
      console.log("event has been called", e);

      // this.onKeyDown(keyName, e , handle);
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  searchCPTCodes = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post(this.url + "findcpts", this.state.searchModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            cptCode: (
              <a
                href=""
                onClick={(event) => this.openCPTPopup(event, row.id)}
              >
                {row.cptCode}
              </a>
            ),
            description: row.description,
            amount: row.amount,
            typeOfService: row.typeOfService,
            modifiers: row.modifiers,
            ndcNumber: row.ndcNumber,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");

      });


  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  //clear fields button
  clearFields = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel,
    });
  };

  //open facility popup
  openCPTPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  //close facility popup
  closeCPTPopup = () => {
    $("#myModal1").hide();
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

  //Render Method
  render() {
    const data = {
      columns: [

        {
          label: "CPT CODE",
          field: "cptCode",
          sort: "asc",
          width: 150,
        },
        {
          label: "DESCRIPTION",
          field: "description",
          sort: "asc",
          width: 270,
        },
        {
          label: "AMOUNT",
          field: "amount",
          sort: "asc",
          width: 200,
        },
        {
          label: "TYPE OF SERVICE",
          field: "typeOfService",
          sort: "asc",
          width: 100,
        },
        {
          label: "MODIFIERS",
          field: "modifiers",
          sort: "asc",
          width: 150,
        },
        {
          label: "NDC NUMBER",
          field: "ndcNumber",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.data,
    };

    let popup = "";

    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewCPT
          onClose={this.closeCPTPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewCPT>
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
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  CPT SEARCH
                  <Hotkeys
                    keyName="alt+n"
                    onKeyDown={this.onKeyDown.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                  >
                    <button
                      style={{ marginTop: "-6px" }}
                      class="float-right btn btn-primary mr-2"
                      type="submit"
                      onClick={(event) => this.openCPTPopup(event, 0)}
                    >
                      Add New
                    </button>
                  </Hotkeys>
                </h6>
                <div className="search-form">
                <form onSubmit ={(event) => this.searchCPTCodes(event)}>
                  <div className="row">
                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>CPT Code:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="cptCode"
                            id="cptCode"
                            maxLength="5"
                            value={this.state.searchModel.cptCode}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">
                        <label>NDC Number:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ndcNumber"
                          id="ndcNumber"
                          maxLength="11"
                          value={this.state.searchModel.ndcNumber}
                          onChange={this.handleChange}
                          onKeyPress={event => this.handleNumericCheck(event)}
                        />
                      </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row">
                      <div className="col-lg-12">
                      <br></br>
                          <label>Description:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            id="description"
                            value={this.state.searchModel.description}
                            onChange={this.handleChange}
                          />
                        </div>
                 
                        <div className="col-lg-12">
                          <label>NDC Description:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="ndcDescription"
                            id="ndcDescription"
                            maxLength="100"
                            value={this.state.searchModel.ndcDescription}
                            onChange={this.handleChange}
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
                        style={{ marginTop: "-6px" }}
                        class=" btn btn-primary mr-2"
                        type="submit"
              
                      >
                        Search
                        </button>
                    </Hotkeys>
                    <Hotkeys
                      keyName="alt+s"
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
              Heading="CPT SEARCH RESULT"
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
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
        search: state.loginInfo.rights.cptSearch,
        add: state.loginInfo.rights.cptCreate,
        update: state.loginInfo.rights.cptEdit,
        delete: state.loginInfo.rights.cptDelete,
        export: state.loginInfo.rights.cptExport,
        import: state.loginInfo.rights.cptImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(CPT);
