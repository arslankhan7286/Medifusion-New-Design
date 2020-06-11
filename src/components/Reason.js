import React, { Component } from "react";

import Label from "./Label";
import Input from "./Input";
import settingIcon from "../images/setting-icon.png";
import SearchHeading from "./SearchHeading";
import { MDBDataTable } from "mdbreact";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";
import NewReason from "./NewReason";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import { MDBBtn } from "mdbreact";
import GridHeading from "./GridHeading";
import { saveAs } from "file-saver";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class Reason extends Component {
  constructor(props) {
    super(props);
    //  this.url = 'http://192.168.110.44/database/api/Reason/';

    this.url = process.env.REACT_APP_URL + "/Reason/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      name: "",
      description: "",
      user: "",

      isActive: true
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
    this.searchReason = this.searchReason.bind(this);
    this.openReasonPopup = this.openReasonPopup.bind(this);
    this.closeReasonPopup = this.closeReasonPopup.bind(this);
  }
  closeReasonPopup() {
    $("#reasonModal").hide();
    this.setState({ showPopup: false });
  }

  componentWillMount() {
    axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        console.log("GetProfiles", response.data )
        this.setState({
          usersData: response.data.users
        });
      })
      .catch(error => {});
  }

  openReasonPopup = (event , id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };
  exportPdf = () => {
    this.setState({ loading: true });
    console.log("Hello");
    if (this.state.data.length > 0) {
      console.log("Hello");
      axios
        .post(this.url + "ExportPdf", this.state.searchModel, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*",
          },
          responseType: "blob",
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type: "application/pdf",
          });

          saveAs(blob, "ExportedData.pdf");
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("Perform The Search First", "", "error");
    }
  };
  exportExcel = () => {
    this.setState({ loading: true });
    if (this.state.data.length > 0) {
      axios
        .post(this.url + "Export", this.state.searchModel, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*",
          },
          responseType: "blob",
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, "ExportedData.xlsx");
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("Perform The Search First", "", "error");
    }
  };

  searchReason = e => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post(this.url + "FindReasons", this.state.searchModel, this.config)
      .then(response => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({


            name: (
              <a
                href=""
                onClick={(event) => this.openReasonPopup(event, row.id)}
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

    e.preventDefault();
  };

  clearFields = event => {
    this.setState({
      searchModel: this.searchModel
    });
  };

  handleChange = event => {
    event.preventDefault();

     //Carret Position
     const caret = event.target.selectionStart
     const element = event.target
     window.requestAnimationFrame(() => {
       element.selectionStart = caret
       element.selectionEnd = caret
     })
     

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
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
        <NewReason
          onClose={this.closeReasonPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewReason>
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
            heading="REASON SEARCH"
            handler={(event) => this.openReasonPopup(event,0)}
            // disabled={this.isDisabled(this.props.rights.add)}
          ></SearchHeading>
      

        <div
          class="clearfix"
          style={{ borderBottom: "1px solid #037592" }}
        ></div>

        <div class="row">
          <div class="col-md-12 col-sm-12 pt-3 provider-form">
          <form onSubmit={(event) => this.searchReason(event)}>
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
                          placeholder=
                          "Name"
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
                            {s.description2 ? s.description2:"Please Select"}{" "}
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
                    disabled={this.isDisabled(this.props.rights.search)}
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
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary search-h">
                  REASON SEARCH RESULT
                


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
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
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
          import: state.loginInfo.rights.practiceImport
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

export default connect(mapStateToProps, matchDispatchToProps)(Reason);
