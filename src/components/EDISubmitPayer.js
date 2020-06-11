import React, { Component } from "react";
import NewEDISubmit from "./NewEDISubmit";
import SearchHeading from "./SearchHeading";
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

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

export class EDISubmitPayer extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Edi837Payer/";

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

    this.searchSubmitPayer = this.searchSubmitPayer.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.closeSubmitPopup = this.closeSubmitPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openSubmitPopup = this.openSubmitPopup.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+n") {
      // alert("search key")
      this.openSubmitPopup(0);
      console.log(e.which);
    } else if (keyName == "alt+s") {
      this.searchSubmitPayer(e);
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
  handleChange = event => {
    console.log(event.target.value);
    this.setState({
      searchModel: { [event.target.name]: event.target.value.toUpperCase() }
    });
  };
  clearFields = event => {
    this.setState({
      searchModel: this.searchModel
    });
  };
  searchSubmitPayer = e => {
    this.setState({ loading: true });
    e.preventDefault();
    console.log(this.state);
    axios
      .post(this.url + "FindEdi837Payers", this.state.searchModel, this.config)
      .then(response => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            payerID: (
                <a
                href=""
                onClick={(event) => this.openSubmitPopup(event, row.id)}
                >
                  {row.payerId}
                </a>
         
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
  closeSubmitPopup() {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  }
  openSubmitPopup = (event , id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };
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
          label: "RECEIVER NAME",
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
        <NewEDISubmit
          onClose={ this.closeSubmitPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewEDISubmit>
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



      <div className="container-fluid">
        <div className="card mb-4 bg-info">
          <div className="card-body">
            <div className="table-responsive">
              {spiner}
              <h6 className="m-0 font-weight-bold text-primary th1 ">
              EDI SUBMIT PAYER SEARCH
                 <button
                  href=""
                  style={{ marginTop: "-6px" }}
                  className="float-right btn-search btn-primary btn-user"
                  onClick={event => this.openSubmitPopup(event)}

                >
                  Add New
                  </button>
              </h6>
              <div className="search-form">
              <form onSubmit ={this.searchSubmitPayer}>
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
                          <label>  Receiver:</label>
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
                            name="receiverID"
                            id="receiverID"
                            value={this.state.searchModel.receiverID}
                            onChange={this.handleChange}
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
                                        class=" btn btn-primary mr-2 mb-2"
                                        type="submit"
                                    >
                                        Search
                                        </button>
                                        <button
                                        class=" btn btn-primary mr-2 mb-2"
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
            Heading="EDI SUBMIT SEARCH RESULT"
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
          search: state.loginInfo.rights.ediSubmitSearch,
          add: state.loginInfo.rights.ediSubmitCreate,
          update: state.loginInfo.rights.ediSubmitEdit,
          delete: state.loginInfo.rights.ediSubmitDelete,
          export: state.loginInfo.rights.ediSubmitExport,
          import: state.loginInfo.rights.ediSubmitImport
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

export default connect(mapStateToProps, matchDispatchToProps)(EDISubmitPayer);
