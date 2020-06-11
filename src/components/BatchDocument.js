import React, { Component } from "react";

import BatchDocumentPopup from "./BatchDocumentPopup";
import Label from "./Label";
import Input from "./Input";
import GifLoader from "react-gif-loader";
import Eclips from "../images/loading_spinner.gif";
import $ from "jquery";
import axios from "axios";
import { MDBDataTable, MDBBtn } from "mdbreact";
import GridHeading from "./GridHeading";
import SearchHeading from "./SearchHeading";
import Select, { components } from "react-select";
import Swal from "sweetalert2";

import { saveAs } from "file-saver";

import { isNullOrUndefined } from "util";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect, batch } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class BatchDocument extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/BatchDocument/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      batchNumber: "",
      responsibleParty: "",
      documentType: "",
      providerID: "",
      locationID: "",
      status: "",
    };

    this.state = {
      searchModel: this.searchModel,
      batchId: [],
      id: 0,
      data: [],
      showPopup: false,
      facData: [],

      cateData: [],
      locData: [],
      provData: [],

      billData: [],
      batchList: [],
      showPopup: false,
      loading: false,
      batchDocNum: null,
      initialData: [],
      selectedAll: false,

      table: [],
      Columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 150,
        },
        {
          label: "BATCH #",
          field: "batchNumber",
          sort: "asc",
          width: 150,
        },
        {
          label: "ENTRY DATE",
          field: "entryDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "RESPONSIBLE_PARTY",
          field: "responsibleParty",
          sort: "asc",
          width: 150,
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
          width: 150,
        },
        {
          label: "# OF PAGES",
          field: "numOfPages",
          sort: "asc",
          width: 150,
        },
        {
          label: "# OF DEMOGRAPHICS",
          field: "numOfDemographics",
          sort: "asc",
          width: 150,
        },
        {
          label: "# OF VISITS",
          field: "numOfVisits",
          sort: "asc",
          width: 150,
        },
        {
          label: "# OF CHECK",
          field: "numOfCheck",
          sort: "asc",
          width: 150,
        },
        {
          label: "START DATE",
          field: "startDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "END DATE",
          field: "endDate",
          sort: "asc",
          width: 150,
        },

        {
          label: "FILE",
          field: "downloadBu",
          sort: "asc",
          width: 250,
        },
      ],
    };
    this.selectedbatch = [];
    this.openBatchPopup = this.openBatchPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.searchBatchDocuments = this.searchBatchDocuments.bind(this);

    this.handleSearch = this.handleSearch.bind(this);
    this.clearFields = this.clearFields.bind(this);

    this.downloadFile = this.downloadFile.bind(this);
    this.selectBatch = this.selectBatch.bind(this);
  }
  componentWillMount() {
    this.props.selectTabPageAction("BATCHDOCUMENT");

    axios
      .get(this.url + "GetProfiles", this.config)
      .then((response) => {
        console.log("get API RESPO", response);
        this.setState({
          cateData: response.data.category,
          locData: response.data.location,
          provData: response.data.provider,
          facData: response.data.practice,
        });

        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    this.setState({
      table: {
        columns: this.state.Columns,
        rows: this.state.data,
      },
    });
  }

  downloadFile = (id) => {
    console.log(id);
    this.setState({ loading: true });
    try {
      axios
        .get(this.url + "DownloadBatchDocument/" + id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*",
          },
          responseType: "blob",
        })
        .then(function (res) {
          console.log(res);
          var blob = new Blob([res.data], {
            type: "application/pdf",
          });

          saveAs(blob, "File.pdf");
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });

          if (error.response) {
            if (error.response.status) {
              //Swal.fire("Unauthorized Access" , "" , "error");
              Swal.fire({
                type: "info",
                text: "File Not Found on server",
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
  };

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  };

  handleChange = (event) => {
    console.log(event.target.value);
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  openBatchPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  async clearFields(event) {
    await this.setState({ searchModel: this.searchModel });

    this.handleSearch(event);
  }

  handleSearch(event) {
    event.preventDefault();
    if (event) {
      this.searchBatchDocuments();
    } else {
      return true;
    }
  }

  async searchBatchDocuments() {
    console.log(this.state.searchModel);

    await this.setState({ loading: true });

    axios
      .post(this.url + "FindBatchDocument", this.state.searchModel, this.config)
      .then((response) => {
        console.log("response = ", response.data);
        this.state.batchId = response.data.batchNumber;
        console.log(this.state.batchId);

        console.log("searchModel = ", this.state.searchModel);
        let newList = [];

        if (this.isNull(this.props.batchPopupID) == false) {
          response.data.map((row, i) => {
            console.log("ifBatch");
            newList.push({
              //
              ischeck: (
                <input
                  style={{ width: "20px", height: "20px" }}
                  type="checkbox"
                  id={row.batchNumber}
                  name={row.batchNumber}
                  onChange={this.toggleCheck}
                  checked={this.isChecked(row.batchNumber)}
                />
              ),
              batchNumber: (
                <a
                  href=""
                  onClick={(event) =>
                    this.openBatchPopup(event, row.batchNumber)
                  }
                >
                  {row.batchNumber}
                </a>
              ),
              entryDate: row.entryDate ? row.entryDate.slice(0, 10) : "",
              responsibleParty: row.responsibleParty,
              status: row.status,
              numOfPages: row.numOfPages,
              numOfDemographics: row.numOfDemographics,
              numOfVisits: row.numOfVisits,
              numOfCheck: row.numOfCheck,

              startDate: row.startDate ? row.startDate.slice(0, 10) : "",
              endDate: row.endDate ? row.endDate.slice(0, 10) : "",
              downloadBu: (
                <button
                  class=" btn btn-primary mr-2"
                  type="button"
                  onClick={() => this.downloadFile(row.batchNumber)}
                >
                  Download
                </button>
              ),
            });
          });
        } else {
          response.data.map((row, i) => {
            console.log("else Batch");
            newList.push({
              //

              batchNumber: (
                <a
                  href=""
                  onClick={(event) =>
                    this.openBatchPopup(event, row.batchNumber)
                  }
                >
                  {row.batchNumber}
                </a>
              ),

              entryDate: row.entryDate ? row.entryDate.slice(0, 10) : "",
              responsibleParty: row.responsibleParty,
              status: row.status,
              numOfPages: row.numOfPages,
              numOfDemographics: row.numOfDemographics,
              numOfVisits: row.numOfVisits,
              numOfCheck: row.numOfCheck,

              startDate: row.startDate ? row.startDate.slice(0, 10) : "",
              endDate: row.endDate ? row.endDate.slice(0, 10) : "",

              downloadBu: (
                <button
                  class=" btn btn-primary mr-2"
                  type="button"
                  onClick={() => this.downloadFile(row.batchNumber)}
                >
                  Download
                </button>
              ),
            });
          });
        }

        this.setState({
          data: newList,
          loading: false,
          initialData: response.data,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  isChecked = (id) => {
    console.log(id);
    console.log(this.selectedbatch.filter((name) => name == id)[0]);
    var checked = this.selectedbatch.filter((name) => name == id)[0]
      ? true
      : false;
    return checked;
  };

  toggleCheck = (e) => {
    console.log(e.target.value);
    let checkedArr = this.selectedbatch;
    let newList = [];

    checkedArr.filter((name) => name === Number(e.target.id))[0]
      ? (checkedArr = checkedArr.filter((name) => name !== Number(e.target.id)))
      : checkedArr.push(Number(e.target.id));
    this.selectedbatch = checkedArr;
    if (this.selectedbatch.length > 1) {
      for (var listArr = 0; listArr < this.selectedbatch.length; listArr++) {
        this.selectedbatch = this.selectedbatch.splice(listArr);
      }
      console.log("Selected Batch Inside If:", this.selectedbatch);
    }
    console.log("Selected Batch :", this.selectedbatch);

    this.state.initialData.map((row, i) => {
      newList.push({
        ischeck: (
          <input
            style={{ width: "20px", height: "20px" }}
            type="checkbox"
            id={row.batchNumber}
            name={row.batchNumber}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.batchNumber)}
          />
        ),
        batchNumber: (
          <a
            href=""
            onClick={(event) => this.openBatchPopup(event, row.batchNumber)}
          >
            {row.batchNumber}
          </a>
        ),
        entryDate: row.entryDate ? row.entryDate.slice(0, 10) : "",
        responsibleParty: row.responsibleParty,
        status: row.status,
        numOfPages: row.numOfPages,
        numOfDemographics: row.numOfDemographics,
        numOfVisits: row.numOfVisits,
        numOfCheck: row.numOfCheck,

        startDate: row.startDate ? row.startDate.slice(0, 10) : "",
        endDate: row.endDate ? row.endDate.slice(0, 10) : "",
        downloadBu: (
          <button
            class=" btn btn-primary mr-2"
            type="button"
            onClick={() => this.downloadFile(row.batchNumber)}
          >
            Download
          </button>
        ),
      });
    });

    this.setState({
      data: newList,
      batchDocNum: this.selectedbatch,
    });
  };

  selectALL = (e) => {
    Swal.fire("Something Wrong", "Please Select Only One Batch #", "warning");

    let newValue = !this.state.selectedAll;
    this.setState({ ...this.state, selectedAll: newValue });

    let newList = [];
    this.selectedbatch = [];
    this.state.initialData.map((row, i) => {
      if (newValue === true) this.selectedbatch.push(Number(row.batchNumber));
      newList.push({
        ischeck: (
          <input
            style={{ width: "20px", height: "20px" }}
            type="checkbox"
            id={row.batchNumber}
            name={row.batchNumber}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.batchNumber)}
          />
        ),
        batchNumber: (
          <a
            href=""
            onClick={(event) => this.openBatchPopup(event, row.batchNumber)}
          >
            {row.batchNumber}
          </a>
        ),
        entryDate: row.entryDate ? row.entryDate.slice(0, 10) : "",
        responsibleParty: row.responsibleParty,
        status: row.status,
        numOfPages: row.numOfPages,
        numOfDemographics: row.numOfDemographics,
        numOfVisits: row.numOfVisits,
        numOfCheck: row.numOfCheck,

        startDate: row.startDate ? row.startDate.slice(0, 10) : "",
        endDate: row.endDate ? row.endDate.slice(0, 10) : "",
        downloadBu: (
          <button
            class=" btn btn-primary mr-2"
            type="button"
            onClick={() => this.downloadFile(row.batchNumber)}
          >
            Download
          </button>
        ),
      });
    });

    this.setState({
      data: newList,
      batchDocNum: this.selectedbatch,
    });
  };

  selectBatch() {
    if (this.selectedbatch.length == 0) {
      Swal.fire("Something Wrong", "Please Select Batch #", "error");
      return;
    } else if (this.selectedbatch.length < 2) {
      this.props.getbatchID(this.selectedbatch);
    } else {
      Swal.fire("Something Wrong", "Please Select One Batch #", "error");
      this.selectedbatch = [];
      this.selectedAll = false;
      return;
    }
  }

  isNull = (value) => {
    if (value === undefined) return true;
    else return false;
  };

  exportExcel = () => {
    this.setState({ loading: true });
    if (this.state.initialData.length > 0) {
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

  exportPdf = () => {
    this.setState({ loading: true });
    if (this.state.initialData.length > 0) {
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

  render() {
    var data;
    console.log("Batch id ", this.props.batchPopupID);

    if (this.isNull(this.props.batchPopupID) == false) {
      data = {
        columns: [
          {
            label: (
              <input
                style={{ width: "20px", height: "20px" }}
                type="checkbox"
                id="selectAll"
                name="selectAll"
                checked={this.state.selectedAll == true ? true : false}
                onChange={this.selectALL}
              />
            ),
            field: "ischeck",
            sort: "",
            width: 50,
          },
          {
            label: "BATCH #",
            field: "batchNumber",
            sort: "asc",
            width: 150,
          },
          {
            label: "ENTRY DATE",
            field: "entryDate",
            sort: "asc",
            width: 150,
          },
          {
            label: "RESPONSIBLE_PARTY",
            field: "responsibleParty",
            sort: "asc",
            width: 150,
          },
          {
            label: "STATUS",
            field: "status",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF PAGES",
            field: "numOfPages",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF DEMOGRAPHICS",
            field: "numOfDemographics",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF VISITS",
            field: "numOfVisits",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF CHECK",
            field: "numOfCheck",
            sort: "asc",
            width: 150,
          },
          {
            label: "START DATE",
            field: "startDate",
            sort: "asc",
            width: 150,
          },
          {
            label: "END DATE",
            field: "endDate",
            sort: "asc",
            width: 150,
          },

          {
            label: "FILE",
            field: "downloadBu",
            sort: "asc",
            width: 250,
          },
        ],
        rows: this.state.data,
      };
    } else {
      data = {
        columns: [
          {
            label: "BATCH #",
            field: "batchNumber",
            sort: "asc",
            width: 150,
          },
          {
            label: "ENTRY DATE",
            field: "entryDate",
            sort: "asc",
            width: 150,
          },
          {
            label: "RESPONSIBLE_PARTY",
            field: "responsibleParty",
            sort: "asc",
            width: 150,
          },
          {
            label: "STATUS",
            field: "status",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF PAGES",
            field: "numOfPages",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF DEMOGRAPHICS",
            field: "numOfDemographics",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF VISITS",
            field: "numOfVisits",
            sort: "asc",
            width: 150,
          },
          {
            label: "# OF CHECK",
            field: "numOfCheck",
            sort: "asc",
            width: 150,
          },
          {
            label: "START DATE",
            field: "startDate",
            sort: "asc",
            width: 150,
          },
          {
            label: "END DATE",
            field: "endDate",
            sort: "asc",
            width: 150,
          },

          {
            label: "FILE",
            field: "downloadBu",
            sort: "asc",
            width: 250,
          },
        ],
        rows: this.state.data,
      };
    }

    const statusID = [
      { value: "", display: "Please Select" },
      { value: "N", display: "NOT STARTED" },
      { value: "C", display: "CLOSED" },
      { value: "I", display: "IN PROCESS" },
    ];

    let popup = "";

    if (this.state.showPopup) {
      popup = (
        <BatchDocumentPopup
          onClose={this.closePopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></BatchDocumentPopup>
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

    const resPID = [
      { value: "", display: "Please Select" },
      { value: "B", display: "BELLMEDEX" },
      { value: "C", display: "CLIENT" },
    ];

    return (
      <React.Fragment>
        {spiner}
        <div class="container-fluid">
          <div class="header pt-3">
            <SearchHeading
              heading="BATCH DOCUMENTS SEARCH"
              handler={(event) => this.openBatchPopup(event, 0)}
              disabled={this.isDisabled(this.props.rights.add)}
            ></SearchHeading>
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
                          <label for="AppliedAmount">Batch</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Batch"
                            name="batchNumber"
                            id="planName"
                            value={this.state.searchModel.batchNumber}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="mm/dd/yyyy">Reponsible Party</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <select
                            style={{ padding: "6px", fontSize: "12px" }}
                            class="provider-form w-100 form-control-user"
                            name="responsibleParty"
                            id="responsibleParty"
                            value={this.state.searchModel.responsibleParty}
                            onChange={this.handleChange}
                          >
                            {resPID.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Document Type</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <select
                            style={{ padding: "6px", fontSize: "12px" }}
                            class="provider-form w-100 form-control-user"
                            name="documentType"
                            id="documentType"
                            value={this.state.searchModel.documentType}
                            onChange={this.handleChange}
                          >
                            {this.state.cateData.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                    </div>
                    <div class="row mt-3">
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">Provider</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <select
                            style={{ padding: "6px", fontSize: "12px" }}
                            class="provider-form w-100 form-control-user"
                            name="providerID"
                            id="providerID"
                            value={this.state.searchModel.providerID}
                            onChange={this.handleChange}
                          >
                            {this.state.provData.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">Location</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <select
                            style={{ padding: "6px", fontSize: "12px" }}
                            class="provider-form w-100 form-control-user"
                            name="locationID"
                            id="locationID"
                            value={this.state.searchModel.locationID}
                            onChange={this.handleChange}
                          >
                            {this.state.locData.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Status</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <select
                            style={{ padding: "6px", fontSize: "12px" }}
                            class="provider-form w-100 form-control-user"
                            name="status"
                            id="status"
                            value={this.state.searchModel.status}
                            onChange={this.handleChange}
                          >
                            {statusID.map((s) => (
                              <option key={s.value} value={s.value}>
                                {" "}
                                {s.display}{" "}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"></div>
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
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary search-h">
                  BATCH DOCUMENTS SEARCH RESULT
                  <input
                    type="button"
                    name="name"
                    id="0"
                    className="export-btn-pdf"
                    value="Export PDF"
                    // length={this.state.initialData.length}
                    onClick={this.exportPdf}
                  />
                  <input
                    type="button"
                    name="name"
                    id="0"
                    className="export-btn"
                    value="Export Excel"
                    // length={this.state.initialData.length}
                    onClick={this.exportExcel}
                  />
                  {this.isNull(this.props.batchPopupID) == false ? (
                    <button
                      class="float-right btn btn-primary mr-2"
                      type="button"
                      onClick={() => this.selectBatch()}
                    >
                      Select
                    </button>
                  ) : (
                    ""
                  )}
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
  console.log("State from Appointment Status PAge : ", state);
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
          search: state.loginInfo.rights.batchdocumentSearch,
          add: state.loginInfo.rights.batchdocumentCreate,
          update: state.loginInfo.rights.batchdocumentUpdate,
          delete: state.loginInfo.rights.batchdocumentDelete,
          export: state.loginInfo.rights.batchdocumentExport,
          import: state.loginInfo.rights.batchdocumentImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(BatchDocument);
