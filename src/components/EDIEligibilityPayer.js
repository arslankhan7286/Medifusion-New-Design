import React, { Component } from "react";
import NewEDIEligibility from "./NewEDIEligibility";
import Label from "./Label";
import Input from "./Input";
import axios from "axios";
import { MDBDataTable, MDBBtn } from "mdbreact";
import GridHeading from "./GridHeading";
import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import $ from "jquery";
import SearchHeading from "./SearchHeading";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

export class EDIEligibilityPayer extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Edi270Payer/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      payerID: "",
      payerName: "",
      receiverID: 0
    };

    this.state = {
      searchModel: this.searchModel,
      data: [],
      revData: [],
      id: 0,
      showPopup: false,
      loading: false
    };

    this.searchEligibilityPayer = this.searchEligibilityPayer.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.closeEligibilityPopup = this.closeEligibilityPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openEligibilityPopup = this.openEligibilityPopup.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+n") {
      // alert("search key")
      this.openEligibilityPopup(0);
      console.log(e.which);
    } else if (keyName == "alt+s") {
      this.searchEligibilityPayer(e);
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

  searchEligibilityPayer = e => {
    e.preventDefault();
    this.setState({ loading: true });
    console.log(this.state);
    axios
      .post(this.url + "FindEdi270Payers", this.state.searchModel, this.config)
      .then(response => {
        let newList = [];
        response.data.map((row, i) => {
          console.log(row);
          newList.push({
           
            payerID: (
              <div style={{ minWidth: "50px", maxWidth: "150px" }}>
                <a
                href=""
                onClick={(event) => this.openEligibilityPopup(event , row.id)}
                >
                  {row.payerId}
                </a>
              </div>
            ),
            payerName: row.payerName,
            receiverName: row.receiverName
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });

        console.log(error);
      });

    e.preventDefault();
  };

  componentWillMount() {
    axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        this.setState({
          revData: response.data.receiverName
        });

        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  openEligibilityPopup =(event , id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };
  clearFields = event => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel
    });
  };
  handleChange = event => {
    // console.log(event.target.value);
    this.setState({
      searchModel: { [event.target.name]: event.target.value.toUpperCase() }
    });
  };

  closeEligibilityPopup() {
    $("#myModal").hide();
    this.setState({ showPopup: false});
  }
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    const data = {
      columns: [
      
        {
          label: "PAYER ID ",
          field: "payerID",
          sort: "asc",
          width: 150
        },
        {
          label: "PAYER NAME",
          field: "payerName",
          sort: "asc",
          width: 150
        },

        {
          label: "RECEIVER Name",
          field: "receiverName",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.data
    };
    const receiverID = [
      { value: "", display: "Select Title" },
      { value: "P", display: "Paper" },
      { value: "E", display: "Electronic" }
    ];
    let popup = "";

    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewEDIEligibility
          onClose={this.closeEligibilityPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewEDIEligibility>
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
                EDI ELIGIBILITY PAYER SEARCH
                   <button
                    href=""
                    style={{ marginTop: "-6px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={event => this.openEligibilityPopup(event)}

                  >
                    Add New
                    </button>
                </h6>
                <div className="search-form">
                <form onSubmit={event => this.searchEligibilityPayer(event)}>
                  <div className="row">

                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                        <label>Payer ID:</label>
                        <input type="text"
                           className="form-control"
                            name="payerID"
                            id="payerID"
                            value={this.state.searchModel.payerID}
                            onChange={this.handleChange} 
                            />
                
                        </div>
                        <div className="col-lg-12">
                        <label> Receiver:</label>
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
                              onChange={this.handleChange}
                              name="receiverID"
                              id="receiverID"
                              className="form-control"
                              value={this.state.searchModel.receiverID}
                              
                              
                          >
                              {this.state.revData.map(s => (
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
                        <br></br>
                        <label>Payer Name:</label>
                        <input type="text"
                           className="form-control"
                            name="payerName"
                            id="payerName"
                            value={this.state.searchModel.payerName}
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
          
                    
                      className="btn-search btn-primary btn-user mr-2"
                    >
                      Search
                    </button>

                    <button
                      
                      onClick={this.clearFields}
                      className="btn-search btn-primary btn-user mr-2"
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
              Heading="EDI ELIGIBILITY SEARCH RESULT"
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
          search: state.loginInfo.rights.ediEligiBilitySearch,
          add: state.loginInfo.rights.ediEligiBilityCreate,
          update: state.loginInfo.rights.ediEligiBilityEdit,
          delete: state.loginInfo.rights.ediEligiBilityDelete,
          export: state.loginInfo.rights.ediEligiBilityExport,
          import: state.loginInfo.rights.ediEligiBilityImport
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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(EDIEligibilityPayer);
