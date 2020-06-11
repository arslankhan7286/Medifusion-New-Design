import React, { Component } from 'react';
import Label from "./Label";
import Input from "./Input";
import $ from "jquery";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import { MDBBtn } from "mdbreact";
import Swal from "sweetalert2";
import settingIcon from "../images/setting-icon.png";
import { saveAs } from "file-saver";
import Eclips from '../images/loading_spinner.gif';
import GifLoader from 'react-gif-loader';
import SearchHeading from "./SearchHeading";
import NewDocumentType from './NewDocumentType'


//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import GridHeading from "./GridHeading";



class DocumentType extends Component {
  constructor(props) {
    super(props);

    // http://96.69.218.154:8020/api/DocumentType/FindDocumentTypes
    this.url = process.env.REACT_APP_URL + "/DocumentType/";


    this.searchModel = {
      name:"",
      description:""
    }

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.state = {
      searchModel:this.searchModel,
      data: [],
      showPopup: false,
      id: 0,
      loading: false
    };
    this.openNewDocumentTypePopup = this.openNewDocumentTypePopup.bind(this);
    this.closeNewDocumentTypePopup = this.closeNewDocumentTypePopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchDocumentType = this.searchDocumentType.bind(this);

  }

  //open facility popup
  openNewDocumentTypePopup = (event , id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  //close facility popup
  closeNewDocumentTypePopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  }

  handleChange = (event) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    })
  }
  handleSearch(event) {
    event.preventDefault();
    if (event) {
      this.searchDocumentType();
    } else {
      return true;
    }
  }
  exportPdf = () => {
    this.setState({ loading: true });
    var fileName = this.props.Heading;
    fileName = fileName.replace("SEARCH RESULT", "");
    if (this.state.data.length > 0) {
      axios
        .post(this.url + "ExportPdf", this.state.searchModel, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*"
          },
          responseType: "blob"
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type: "application/pdf"
          });

          saveAs(blob, fileName + ".pdf");
          this.setState({ loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("Perform The Search First", "", "error");
    }
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

          saveAs(blob, "Charges.pdf");
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
    if (this.state.gridData.length > 0) {
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

          saveAs(blob, "Charges.xlsx");
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

  searchDocumentType = (event) => {
    
    console.log("Search Document Type")


    this.setState({ loading: true });
    axios
      .post(this.url + "FindDocumentTypes", this.state.searchModel, this.config)
      .then(response => {
        console.log("Document Types Grid  Search Response : ", response.data);
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            // id: row.id,
            name: (
              <a
                href=""
                onClick={(event) => this.openNewDocumentTypePopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            // name: (
            //   <span>
            //     <MDBBtn
            //       className="gridBlueBtn"
            //       onClick={() => this.openNewDocumentTypePopup(row.id)}
            //     >
            //       {row.name}
            //     </MDBBtn>
            //   </span>
            // ),

            description: row.description
          }); //{console.log(row.dscription)}
        });
        this.setState({ data: newList, loading: false });

        //console.log("new data", response.data)
      })
      .catch(error => {
        this.setState({ loading: false });

        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
        let errorsList = [];
        if (error.response !== null && error.response.data !== null) {
          errorsList = error.response.data;
          console.log(errorsList);
        } else console.log(error);
      });
      // event.preventDefault();





  }
  clearFields = () =>{
    this.setState({searchModel:this.searchModel})
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
          width: 150
        }
      ],
      rows: this.state.data
    };

    //alert(this.state.id)

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <NewDocumentType
         onClose={this.closeNewDocumentTypePopup}
          id={this.state.id}
          >

          </NewDocumentType>
      );
    } else popup = <React.Fragment></React.Fragment>;


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
            heading="DOCUMENT TYPE"
            handler={(event) => this.openNewDocumentTypePopup(event,0)}
            // disabled={this.isDisabled(this.props.rights.add)}
          ></SearchHeading>
      

        <div
          class="clearfix"
          style={{ borderBottom: "1px solid #037592" }}
        ></div>

        <div class="row">
          <div class="col-md-12 col-sm-12 pt-3 provider-form">
          <form onSubmit={(event) => this.handleSearch(event)}>
              <div class="row">
                <div class="col-md-12 m-0 p-0 float-right">
              
                  <div class="row mt-3">
                    <div class="col-md-4 mb-6 col-sm-4">
                      <div class="col-md-4 float-left">
                        <label for="AppliedAmount">Name</label>
                      </div>
                      <div class="col-md-8 p-0 pl-1 m-0 float-left">
                        <input
                          type="text"
                          placeholder="Name"
                          class="provider-form w-100 form-control-user"
                          name="name"
                          id="name"
                          value={this.state.searchModel.name}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback"> </div>
                    </div>
                    <div class="col-md-4 mb-6 col-sm-4">
                      <div class="col-md-4 float-left">
                        <label for="UnAppliedAmount">Description</label>
                      </div>
                      <div class="col-md-8 p-0 m-0 float-left">
                        <input
                          type="text"
                          placeholder="Description"
                          class="provider-form w-100 form-control-user"
                          name="description"
                          id="description"
                          value={this.state.searchModel.description}
                          onChange={this.handleChange}
                        />
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
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary search-h">
                  DOCUMENT SEARCH RESULT
                </h6>
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
          search: state.loginInfo.rights.remarkCodesSearch,
          add: state.loginInfo.rights.remarkCodesCreate,
          update: state.loginInfo.rights.remarkCodesEdit,
          delete: state.loginInfo.rights.remarkCodesDelete,
          export: state.loginInfo.rights.remarkCodesExport,
          import: state.loginInfo.rights.remarkCodesImport
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

export default connect(mapStateToProps, matchDispatchToProps) (DocumentType);