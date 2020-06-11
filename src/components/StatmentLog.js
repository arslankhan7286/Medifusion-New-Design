import React, { Component } from "react";
import Label from "./Label";
import Input from "./Input";
import { MDBDataTable, MDBBtn } from "mdbreact";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader"; 
import GridHeading from "./GridHeading";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import Select, { components } from "react-select";
import axios from "axios";  
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import GPopup from "./GPopup";
import { isNullOrUndefined } from "util";
import moment from "moment";
export class StatementLog extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientStatementHistory/";

    // https://localhost:44306/api/PatientStatementHistory/DownloadStatementCSV/73

 //Authorization Token
 this.config = {
  headers: {
    Authorization: "Bearer  " + this.props.loginObject.token,
    Accept: "*/*"
  }
};
    
    this.searchModel = {

      account: "",
      lastName: "",
      visitID: "",
      firstName: "",
      statementFromDate: null,
      statementToDate: null,

      dosFrom: null,
      dosTo: null,
      providerID: ""
     
    }

      //Validation Model
      this.validationModel = {
        dosFromFDValField: null,
        dosToFDValField: null,
        selectDOSFromValField: null,
        dosToGreaterValField: null,

        validation: false
      };

    this.state = {
      searchModel: this.searchModel,
      
      providerID: {},

      
      validationModel: this.validationModel,
      data: [],
      id: 0,
      accountId: 0,
      statementList:[],


      loading: false,

      patientPopup: false,
      visitPopup: false,

      table :[],
      Columns: [

        {
          label: "STATEMENT DATE",
          field: "statementDate",
          sort: "asc",
          width: 250,
        },
         {
          label: "VISIT ID",
          field: "visitID",
          sort: "asc",
          width: 250,
        },
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 250,
        },
        {
          label: "STATEMENT STATUS",
          field: "statmentStatus",
          sort: "asc",
          width: 250,
        },
        
        {
          label: "ACCOUNT #",
          field: "account",
          sort: "asc",
          width: 250,
        },
        {
          
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 250,
        },
         {
          label: "FILE PDF",
          field: "downloadPDF",
          sort: "asc",
          width: 250,
        }, {
          label: "FILE CSV",
          field: "downloadCSV",
          sort: "asc",
          width: 250,
        },
         
      ],
 
    }; 

    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.searchPatientStatementFollowup = this.searchPatientStatementFollowup.bind(this);

    
    this.handleSearch = this.handleSearch.bind(this);

    this.clearFields = this.clearFields.bind(this);

    
    this.openVisitPopup = this.openVisitPopup.bind(this);
    this.closeVisitPopUp = this.closeVisitPopUp.bind(this);

    

    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);

    
  }

   
  async componentWillMount() {
    
    await this.setState({ loading: true });
    this.setState({
      table: {
        columns: this.state.Columns,
        rows: this.state.data
      }
    });
    await this.setState({ loading: false });
  }

  handleProviderChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        providerID: event,
        searchModel: {
          ...this.state.searchModel,
          providerID: event.id
        }
      });
    } else {
      this.setState({
        providerID: null,
        searchModel: {
          ...this.state.searchModel,
          providerID: null
        }
      });
    }
  }



  handleDosFromChange = date => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        dosFrom: date
      }
    });
  };




  handleDosToChange = date => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        dosTo: date
      }
    });
  };

  handleDateChange(event) {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        dosFrom: event.target.value
      }
    });
  }

















  openVisitPopup(event,name, id) {
    event.preventDefault()
    this.setState({ popupName: name, visitPopup: true, id: id });
  }

  //Close Visit Popup
  closeVisitPopUp() {
    this.setState({ popupName: "", visitPopup: false });
  }

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }


  openPatientPopup(event,name, id) {
    event.preventDefault();
    this.setState({ popupName: name, patientPopup: true, id: id });
  }

  closePatientPopup() {
    this.setState({ popupName: "", patientPopup: false });
  }

  downloadCSVFile= id =>{
    console.log(id);
    this.setState({ loading: true });
    try {
    axios.get(
        this.url + 'DownloadStatementCSV/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer  " + this.props.loginObject.token , Accept: "*/*"
        },
        responseType: 'blob',
    })
        .then(function (res) {
          console.log(res);
            var blob = new Blob([res.data], {
              
                type: 'application/csv',
            });

            saveAs(blob, 'File.csv');
            this.setState({ loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });

          if (error.response) {
            if (error.response.status) {
              //Swal.fire("Unauthorized Access" , "" , "error");
              Swal.fire({
                type: "info",
                text: "File Not Found on server"
              });
              return;
            }
          } else if (error.request) {
            return;
          } else {
            return;
          }
        });
  } catch {}
}


  downloadPDFFile = id =>{
    console.log(id);
    this.setState({ loading: true });
    try {
    axios.get(
        this.url + 'DownloadStatementPDF/' + id, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer  " + this.props.loginObject.token , Accept: "*/*"
        },
        responseType: 'blob',
    })
        .then(function (res) {
          console.log(res);
            var blob = new Blob([res.data], {
              
                type: 'application/pdf',
            });

            saveAs(blob, 'File.pdf');
            this.setState({ loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });

          if (error.response) {
            if (error.response.status) {
              //Swal.fire("Unauthorized Access" , "" , "error");
              Swal.fire({
                type: "info",
                text: "File Not Found on server"
              });
              return;
            }
          } else if (error.request) {
            return;
          } else {
            return;
          }
        });
  } catch {}
}












  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  handleChange = event => { 

    // if (
    //   event.target.name === "dosFrom" ||
    //   event.target.name === "dosTo"      
    // ) {
    // } else {
    //   // const caret = event.target.selectionStart;
    //   // const element = event.target;
    //   // window.requestAnimationFrame(() => {
    //   //   element.selectionStart = caret;
    //   //   element.selectionEnd = caret;
    //   // });
    // }

    this.setState({
     
      searchModel:{
        ...this.state.searchModel,
        [event.target.name]:
        event.target.value == "null" ? null : event.target.value.toUpperCase()
      }
    });
  };

  handleNumericCheck(event) {
  
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

 


clearFields = event => {

  var myVal = { ...this.validationModel };
    myVal.dosFromValField = "";
    myVal.dosToFDValField = "";
    myVal.dosToGreaterValField = "";
    myVal.selectDOSFromValField = "";

  this.setState({
    searchModel: this.searchModel,
    
    validationModel: myVal,
    providerID: this.state.searchModel.providerID
  });
  
  this.handleSearch(event);
};

 
 handleSearch(event) {
  event.preventDefault();
  if (event) {
    this.searchPatientStatementFollowup();
  } else {
    return true;
  }
}

isNull = value => {
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    value === "Please Select" ||
    value === "Please Coverage" ||
    value === "Please Relationship"
  )
    return true;
  else return false;
};

  
 async searchPatientStatementFollowup()  {

  var myVal = this.validationModel;
  myVal.validation = false;


  if (
    this.isNull(this.state.searchModel.dosFrom) == true &&
    this.isNull(this.state.searchModel.dosTo) == false
  ) {
    myVal.selectDOSFromValField = (
      <span className="validationMsg">Select DOS From</span>
    );
    myVal.validation = true;
    if (myVal.validation == false) myVal.validation = false;
  } else {
    myVal.selectDOSFromValField = null;
    if (myVal.validation == false) myVal.validation = false;
  }



  if (
    this.isNull(this.state.searchModel.dosFrom) == false &&
    this.isNull(this.state.searchModel.dosTo) == false
  ) {
    if (
      new Date(
        moment(this.state.searchModel.dosFrom)
          .format()
          .slice(0, 10)
      ).getTime() >
      new Date(
        moment(this.state.searchModel.dosTo)
          .format()
          .slice(0, 10)
      ).getTime()
    ) {
      myVal.dosToGreaterValField = (
        <span className="validationMsg">
          DOS To must be greater than DOS From
        </span>
      );
      myVal.validation = true;
    } else {
      myVal.dosToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
  } else {
    myVal.dosToGreaterValField = null;
    if (myVal.validation == false) myVal.validation = false;
  }



 //DOS From Future Date Validation
 if (this.isNull(this.state.searchModel.dosFrom) == false) {
  if (
    new Date(
      moment(this.state.searchModel.dosFrom)
        .format()
        .slice(0, 10)
    ).getTime() >
    new Date(
      moment()
        .format()
        .slice(0, 10)
    ).getTime()
  ) {
    myVal.dosFromFDValField = (
      <span className="validationMsg">Future date can't be selected</span>
    );
    myVal.validation = true;
  } else {
    myVal.dosFromFDValField = null;
    if (myVal.validation == false) myVal.validation = false;
  }
} else {
  myVal.dosFromFDValField = null;
  if (myVal.validation == false) myVal.validation = false;
}

  //DOS To Future Date Validation
  if (this.isNull(this.state.searchModel.dosTo) == false) {
    if (
      new Date(
        moment(this.state.searchModel.dosTo)
          .format()
          .slice(0, 10)
      ).getTime() >
      new Date(
        moment()
          .format()
          .slice(0, 10)
      ).getTime()
    ) {
      myVal.dosToFDValField = (
        <span className="validationMsg">Future date can't be selected</span>
      );
      myVal.validation = true;
    } else {
      myVal.dosToFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
  } else {
    myVal.dosToFDValField = null;
    if (myVal.validation == false) myVal.validation = false;
  }















  
     
    console.log(this.state.searchModel);

    await this.setState({ loading: true });

    axios
      .post(this.url + "FindStatementLog", this.state.searchModel, this.config)
      .then(response => {
        console.log("response = ", response.data);
        this.state.accountId = response.data.account;
        console.log(this.state.accountId)

        console.log("searchModel = ",this.state.searchModel);
        let statementList = [];

        


        response.data.map((row, i) => {
 
          statementList.push({
          
              statementDate : row.statementDate ? row.statementDate.slice(0, 10) : "", 
               visitID: (
              <a
               href=""
                onClick={(event) => this.openVisitPopup(event,"visit", row.visitID)}
              >
                {" "}
                {this.val(row.visitID)}
              </a>
            ),
            dos : row.dos ? row.dos.slice(0, 10) : "",
            statmentStatus: row.statmentStatus, 

            account: (
              <a
                href=""
                onClick={(event) => this.openPatientPopup(event,"patient", row.patientID)}
              >
                {" "}
                {this.val(row.account)}
              </a>
            ),
            patientName: row.patientName, 
            
            downloadPDF: (
             
              <button
              type="button"   
              className=" btn-primary btn-user mr-2"
                onClick={() => this.downloadPDFFile(row.id)} 
              >
                   Download PDF
              </button>
          
            ),
            downloadCSV: (
             
              <button
              type="button"   
              className="btn-primary btn-user mr-2"
                onClick={() => this.downloadCSVFile(row.id)} 
              >
                   Download CSV
              </button> 
            ),
 
          });
        });

        this.setState({
          data: statementList,
          loading: false,
          table: {
            columns: this.state.Columns,
            rows: statementList
          }
          
        });
      })
      .catch(error => {
        
        this.setState({ loading: false });
        console.log(error);
      });
 
  }

  
  

  

  render() {




    
    console.log("props" , this.props.userProviders)

    var addDosFromDate = this.state.searchModel.dosFrom
    ? this.state.searchModel.dosFrom.slice(0, 10)
    : "";
  var addDosToDate = this.state.searchModel.dosTo
    ? this.state.searchModel.dosTo.slice(0, 10)
    : "";


    let popup = "";

     if (this.state.patientPopup) {
      popup = (
        <GPopup
          onClose={this.closePatientPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.visitPopup) {
      popup = (
        <GPopup
          onClose={this.closeVisitPopUp}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    }        else popup = <React.Fragment></React.Fragment>;
 
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

    
   
    var statementFromDate = this.state.searchModel.statementFromDate
    ? this.state.searchModel.statementFromDate.slice(0, 10)
    : "";
  var statementToDate = this.state.searchModel.statementToDate
    ? this.state.searchModel.statementToDate.slice(0, 10)
    : "";

    return (

<React.Fragment>
        {spiner}
        <div class="container-fluid">
          <div class="header pt-3">
            <h6>
              <span class="h4">STATEMENT LOG SEARCH</span>
            </h6>
          </div>

          <div
            class="clearfix"
            style={{ borderBottom: "1px solid #037592" }}
          ></div>

          <div class="row">
            <div class="col-md-12 col-sm-12 pt-3 provider-form">
              <form onSubmit={(event) => this.handleSearch(event)}>
                <div class="row">
                  <div class="col-md-12 m-0 p-0 float-right">
                    <div class="row">
                    <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">Account#</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Account#"
                            name="account"
                            id="account"
                            value={this.state.searchModel.account}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">Last Name</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Last Name"
                            name="lastName"
                            id="lastName"
                            value={this.state.searchModel.lastName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">First Name</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="First Name"
                            name="firstName"
                            id="firstName"
                            value={this.state.searchModel.firstName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                    </div>
                   
                    <div class="row mt-3">
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                          Statement From Date
                          </label>
                        </div>
                        <div class="col-md-8 pl-1 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="statementFromDate"
                            id="statementFromDate"
                            value={statementFromDate}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.fromDateFDValField}
                          {this.state.validationModel.fromDateFDValField}
                          {this.state.validationModel.selectFromDateValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="firstName">Statement To Date</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="statementToDate"
                            id="statementToDate"
                            value={statementToDate}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.toDateValField}
                          {this.state.validationModel.toDateFDValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">Visit#</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Visit#"
                            name="visitID"
                            id="visitID"
                            value={this.state.searchModel.visitID}
                            onChange={this.handleChange}
                            onKeyPress={event => this.handleNumericCheck(event)}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                    </div>
                    <div class="row mt-3">
                    <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                          DOS from
                          </label>
                        </div>
                        <div class="col-md-8 pl-1 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="dosFrom"
                            id="dosFrom"
                            value={addDosFromDate}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.fromDateFDValField}
                          {this.state.validationModel.fromDateFDValField}
                          {this.state.validationModel.selectFromDateValField} */}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="firstName">DOS To</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="dosTo"
                            id="dosTo"
                            value={addDosToDate}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.toDateValField}
                          {this.state.validationModel.toDateFDValField} */}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">Provider</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                        <Select
                          
                          type="text"
                          value={this.state.providerID}
                          name="providerID"
                          id="providerID"
                          max="10"
                          onChange={event => this.handleProviderChange(event)}
                          options={this.props.userProviders}

                          placeholder=""
                          isClearable={true}
                          isSearchable={true}

                          openMenuOnClick={false}
                          escapeClearsValue={true}
                          styles={{
                            indicatorSeparator: () => {},
                            clearIndicator: defaultStyles => ({
                              ...defaultStyles,
                              color: "#286881"
                            }),
                            container: defaultProps => ({
                              ...defaultProps,
                              position: "absolute",
                              width: "100%"
                            }),
                          
                            indicatorsContainer: defaultStyles => ({
                              ...defaultStyles,
                              padding: "0px",
                              marginBottom: "0",
                              marginTop: "0px",
                              height: "36px",
                              borderBottomRightRadius: "10px",
                              borderTopRightRadius: "10px"
                              // borderRadius:"0 6px 6px 0"
                            }),
                            indicatorContainer: defaultStyles => ({
                              ...defaultStyles,
                              padding: "9px",
                              marginBottom: "0",
                              marginTop: "1px",
                              // borderBottomRightRadius: "5px",
                              // borderTopRightRadius: "5px",
                              borderRadius: "0 4px 4px 0"
                            }),
                            dropdownIndicator: () => ({
                              display: "none"
                            }),
                            
                            input: defaultStyles => ({
                              ...defaultStyles,
                              margin: "0px",
                              padding: "0px"
                              // display:'none'
                            }),
                            singleValue: defaultStyles => ({
                              ...defaultStyles,
                              fontSize: "16px",
                              transition: "opacity 300ms"
                              // display:'none'
                            }),
                            control: defaultStyles => ({
                              ...defaultStyles,
                              minHeight: "33px",
                              height: "33px",
                              height: "33px",
                              paddingLeft: "10px",
                              //borderColor:"transparent",
                              borderColor: "#C6C6C6",
                              boxShadow: "none",
                              borderColor: "#C6C6C6",
                              "&:hover": {
                                borderColor: "#C6C6C6"
                              }
                              // display:'none'
                            })
                          }}
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
                      onClick={(event) => this.clearFields(event)}
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
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary search-h">
                STATEMENT LOG SEARCH RESULT
               
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
                    style={{ overflowX: "hidden" }}
                    id="dataTable_wrapper"
                    className="dataTables_wrapper dt-bootstrap4"
                  >
                    <MDBDataTable
                      responsive={true}
                      striped
                      bordered
                      searching={false}
                      data={this.state.table}
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

  console.log("state from Statement Log Page", state);
   console.log("state from Statement Log Page", state);
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
      userProviders: state.loginInfo
      ? state.loginInfo.userProviders
        ? state.loginInfo.userProviders
        : []
      : [],
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.statementlogSearch,
          add: state.loginInfo.rights.statementlogCreate,
          update: state.loginInfo.rights.statementlogUpdate,
          delete: state.loginInfo.rights.statementlogDelete,
          export: state.loginInfo.rights.statementlogExport,
          import: state.loginInfo.rights.statementlogImport
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

export default connect(mapStateToProps, matchDispatchToProps)(StatementLog);
