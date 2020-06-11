import React, { Component } from "react";
import GifLoader from "react-gif-loader";
import Eclips from "../images/loading_spinner.gif";
import $ from "jquery";
import Input from "./Input";
import { isNull, isNullOrUndefined } from "util";
import { saveAs } from "file-saver";
import axios from "axios";
import { MDBDataTable, MDBBtn, MDBCollapse } from "mdbreact";
import GridHeading from "./GridHeading";
import Swal from "sweetalert2";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import plusImage from "../images/plus-ico.png";
import { Tabs, Tab } from "react-tab-view";
import NewDocumentType from "./NewDocumentType";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import plusSrc from "../images/plus-icon.png";
import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";

export class BatchDocumentPopup extends Component {
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
      name: "",
      batchNum: "",
      responsibleParty: "B",
      documentTypeID: null,
      practiceID: null,
      locationID: null,
      ProviderID: null,
      noOfDemographic: "",
      noOfDemographicEntered: "",
      status: "N",
      addedBy: "",
      updatedBy: "",
      startDate: "",
      endDate: "",
      updatedDate: null,
      documentInfo: this.documentInfo,
      chargeRowData: [], // ptAuth
      batchDocumentCharges: [], // ptPlans
      paymentRowData: [],
      batchDocumentPayment: [],
      note: [],
    };
    this.documentInfo = {
      content: "",
      name: "",
      size: "",
      type: "",
      clientID: 0,
    };
    this.errorField = "errorField";

    this.batchdocumentCharges = {
      // batchDocumentNoID: 0,
      dos: "",
      noOfVisits: "",
      copay: "",
      otherPatientAmount: "",
    };
    this.batchDocumentPayment = {
      // batchDocumentNoID: 0,
      checkNo: "",
      checkDate: "",
      checkAmount: "",
      applied: "",
      unApplied: "",
      remarks: "",
    };

    this.validationModel = {
      fileUploadVal: "",
      responsiblePartyValField: "",
      documentTypeIDValField: "",
    };

    this.state = {
      editId: this.props.id,

      // logSubmitId: this.props.data.submissionLogID,
      id: 0,

      validationModel: this.validationModel,
      searchModel: this.searchModel,
      batchdocumentCharges: this.batchdocumentCharges,
      batchDocumentPayment: this.batchDocumentPayment,
      popupName: "",
      showLPopup: false,
      showPPopup: false,
      practice: [],
      location: [],
      provider: [],
      filePath: "",
      floading: false,
      batchDocumentCharges: [],
      batchDocumentPayment: [],
      maxHeight: "361",
      facData: [],
      cateData: [],
      billData: [],
      practicesData: [],
      locData: [],
      proData: [],
      isActive: true,
      loading: false,
    };

    this.closeNewDocument = this.closeNewDocument.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.downloadDocument = this.downloadDocument.bind(this);
    this.addChargeRow = this.addChargeRow.bind(this);
    this.addPaymentRow = this.addPaymentRow.bind(this);
    this.handleChargeChange = this.handleChargeChange.bind(this);
    this.handlePaymentChange = this.handlePaymentChange.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.openProviderPopup = this.openProviderPopup.bind(this);
    this.closeProviderPopup = this.closeProviderPopup.bind(this);
    this.openLocationPopup = this.openLocationPopup.bind(this);
    this.closeLocationPopup = this.closeLocationPopup.bind(this);
    this.openDocumentPopup = this.openDocumentPopup.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.addRowNotes = this.addRowNotes.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  async componentWillMount() {
    await this.setState({ loading: true });
    await this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    //alert(this.props.id);
    //alert(this.state.editId);
this.props.selectTabPageAction("BATCHDOCUMENT")
    try {
      if (this.state.editId > 0) {
        await axios
          .get(this.url + "FindBatchDocument/" + this.state.editId, this.config)
          .then((response) => {
            console.log("find open data", response);
            this.setState({ searchModel: response.data });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      await axios
        .get(this.url + "GetProfiles", this.config)
        .then((response) => {
          this.setState({
            cateData: response.data.category,
          });

          console.log("category data ", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {
      
    }
    this.setState({ loading: false });
  }

  async addRowNotes(event) {
    const note = { ...this.notesModel };
    var len = this.state.searchModel.note
      ? this.state.searchModel.note.length
      : 0;
    if (len == 0) {
      await this.setState({
        searchModel: {
          ...this.state.searchModel,
          note: this.state.searchModel.note.concat(note),
        },
      });
      return;
    } else {
      len = len - 1;
      if (this.isNull(this.state.searchModel.note[len].note)) {
        Swal.fire("First Enter Previous Notes", "", "error");
        return;
      } else {
        await this.setState({
          searchModel: {
            ...this.state.searchModel,
            note: this.state.searchModel.note.concat(note),
          },
        });
      }
    }
    if (this.state.searchModel.note) {
    }
  }
  removeChargeRow = (event, index, chaID) => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        if (chaID > 0) {
          axios
            .delete(
              this.url + "DeleteBatchDocumentCharge/" + chaID,
              this.config
            )
            .then((response) => {
              Swal.fire(
                "Record Deleted!",
                "Record has been deleted.",
                "success"
              );
              let batchDocumentCharges = [
                ...this.state.searchModel.batchDocumentCharges,
              ];
              batchDocumentCharges.splice(index, 1);
              this.setState({
                searchModel: {
                  ...this.state.searchModel,
                  batchDocumentCharges: batchDocumentCharges,
                },
              });
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status) {
                  if (error.response.status == 400) {
                    Swal.fire("Error", error.response.data, "error");
                  } else {
                    Swal.fire(
                      "Record Not Deleted!",
                      "Record can not be delete, as it is being referenced in other screens.",
                      "error"
                    );
                  }
                }
              } else {
                Swal.fire(
                  "Record Not Deleted!",
                  "Record can not be delete, as it is being referenced in other screens.",
                  "error"
                );
              }
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          let batchDocumentCharges = [
            ...this.state.searchModel.batchDocumentCharges,
          ];
          batchDocumentCharges.splice(index, 1);
          this.setState({
            searchModel: {
              ...this.state.searchModel,
              batchDocumentCharges: batchDocumentCharges,
            },
          });
        }
      }
    });
  };

  async deleteRowNotes(event, index, NoteRowId) {
    console.log("deleting the row");
    const NoteRowID = NoteRowId;
    const id = event.target.id;
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        if (NoteRowID > 0) {
          axios
            .delete(this.url + "DeleteNotes/" + NoteRowID, this.config)
            .then((response) => {
              Swal.fire("Record Deleted Successfully", "", "success");
              let note = [...this.state.searchModel.note];
              note.splice(id, 1);
              this.setState({
                searchModel: {
                  ...this.state.searchModel,
                  note: note,
                },
              });
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status) {
                  if (error.response.status == 400) {
                    Swal.fire("Error", error.response.data, "error");
                  } else {
                    Swal.fire(
                      "Record Not Deleted!",
                      "Record can not be delete, as it is being referenced in other screens.",
                      "error"
                    );
                  }
                }
              } else {
                Swal.fire(
                  "Record Not Deleted!",
                  "Record can not be delete, as it is being referenced in other screens.",
                  "error"
                );
              }
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          let note = [...this.state.searchModel.note];
          note.splice(id, 1);
          this.setState({
            searchModel: {
              ...this.state.searchModel,
              note: note,
            },
          });
        }
      }
    });
  }
  componentDidMount() {
    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });
  }
  async downloadFile() {
    this.setState({ loading: true });
    await axios
      .get(this.url + "DownloadBatchDocument/" + this.state.editId, {
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
      });
      this.setState({ loading: false });
  }

  async handleNoteChange(event) {
    var value = event.target.value;
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    if (caret == 0 || caret <= 1) {
      value = value.trim();
    }
    let newNotesList = this.state.searchModel.note;
    const index = event.target.id;
    const name = event.target.name;
    newNotesList[index][name] = value.toUpperCase();

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        note: newNotesList,
      },
    });
  }

  async handleChange(event) {
    // event.preventDefault();

    var eventName = event.target.name;
    var eventValue = event.target.value;

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });

    if (eventName == "practiceID") {
      var userLocation = await this.props.userInfo1.userLocations.filter(
        (location) => location.iD2 == this.props.userInfo1.practiceID
      );
      var userProvider = await this.props.userInfo1.userProviders.filter(
        (provider) => provider.iD2 == this.props.userInfo1.practiceID
      );
      console.log(userLocation);
      console.log("---");
      console.log(userProvider);

      await this.setState({
        location: userLocation,
        provider: userProvider,
      });

      if (this.isNull(this.state.searchModel.locationID) == true) {
        await this.setState({
          searchModel: {
            ...this.state.searchModel,
            locationID: userLocation[0].id,
          },
        });
      }
      if (this.isNull(this.state.searchModel.ProviderID) == true) {
        await this.setState({
          searchModel: {
            ...this.state.searchModel,
            ProviderID: userProvider[0].id,
          },
        });
      }
    }
  }

  closeNewDocument() {
    console.log("clicked");
    this.props.selectTabAction("Documents");
  }

  setModalMaxHeight(element) {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
  }
  openProviderPopup = (id) => {
    this.setState({ showPPopup: true, id: id });
  };

  //close facility popup
  closeProviderPopup = () => {
    $("#providerModal").hide();
    this.setState({ showPPopup: false });
  };

  openLocationPopup = (id) => {
    this.setState({ showLPopup: true, id: id });
  };

  closeLocationPopup = () => {
    $("#locationModal").hide();
    this.setState({ showLPopup: false });
  };

  downloadDocument = (id) => {
    let contentType = "";
    let outputfile = "";

    this.fileURl = this.url + "DownloadBatchDocument/" + id;

    //console.log(this.fileURl)
    alert(this.fileURl);

    axios
      .get(this.fileURl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
        responseType: "blob",
      })
      .then(function (res) {
        var blob = new Blob([res.data], {
          type: contentType,
        });

        saveAs(blob, outputfile);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          console.log(error.response.status);
          Swal.fire({
            type: "info",
            text: "File Not Found on server",
          });
        }
      });
  };

  ProcessFileLoad(e) {
    e.preventDefault();

    console.log("file process method");

    try {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      let file = e.target.files[0];

      console.log("File : ", file);

      reader.onloadend = (e) => {
        try {
          this.setState({
            searchModel: {
              ...this.state.searchModel,
              documentInfo: {
                ...this.state.searchModel.documentInfo,
                content: reader.result,
                name: file.name,
                size: file.size,
                type: file.type,
              },
            },
          });
        } catch {}

        console.log("Content", this.state.searchModel.documentInfo.content);

        var Filetype = this.state.searchModel.documentInfo.name.substr(
          this.state.searchModel.documentInfo.name.indexOf(".")
        );
        console.log("file type", Filetype);
        if (Filetype == ".pdf") {
          this.setState({
            filePath: file.name,
          });
        } else {
          Swal.fire("Error", "Invalid File", "error");
        }
      };
    } catch {}
  }

  openPopup = (event, name, id) => {
    console.log("Popup Name : ", name, id);
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  saveBatchDocuments = () => {
    console.log(this.state.searchModel);
    this.setState({ loading: false });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.searchModel.responsibleParty)) {
      myVal.responsiblePartyValField = (
        <span className="validationMsg">Select Responsibility Party</span>
      );
      myVal.validation = true;
    } else {
      myVal.responsiblePartyValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.searchModel.documentTypeID) === true) {
      myVal.documentTypeIDValField = (
        <span className="validationMsg">Document Type Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.documentTypeIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.filePath) === true) {
      myVal.fileUploadVal = (
        <span className="validationMsg">File required</span>
      );
      myVal.validation = true;
    } else {
      myVal.fileUploadVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });

      return;
    }

    axios
      .post(this.url + "SaveBatchDocument", this.state.searchModel, this.config)
      .then((response) => {
        this.setState({ searchModel: response.data, loading: false });
        Swal.fire("Record Saved Successfully", "", "success");
        console.log("response of API", response);
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 400) {
              Swal.fire("400 Bad Request", "Please Enter Valid Data", "error");
            } else {
              Swal.fire("Bad Request", "Please Enter Valid Data", "error");
            }
          }
        }
      });

    // e.preventDefault();
  };
  saveBatchDocumentSearch = e => {
    // e.preventDefault();

    if(!(this.state.editId > 0)){
      if (this.state.filePath  === "" ||
      this.state.filePath  === null ||
      this.state.filePath  === undefined
        ) {

      Swal.fire({
        type: "error",
        text: "Please Attach File"
      });
      return;
    }
  }

    this.setState({ loading: true });
    this.saveBatchDocuments();
    // e.preventDefault();
  };
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = (id) => {
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
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
  openDocumentPopup = (id) => {
    this.setState({ showDPopup: true, id: id });
  };
  closeDocumentPopup = () => {
    $("#myModal1").hide();
    this.setState({ showDPopup: false });
    this.componentWillMount();
  };

  onPaste = (event) => {
    var x = event.target.value;
    x = x.trim();
    var regex = /^[0-9]+$/;
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
      Swal.fire("", "Should be Number", "error");
      return;
    } else {
      this.setState({
        searchModel: {
          ...this.state.searchModel,
          [event.target.name]: x,
        },
      });
    }

    return;
  };

  addPaymentRow(){

    console.log("add Payment row ")
    const batchdocumentPayment = { ...this.batchdocumentPayment };
    var paymentRowModelList = [];
 if(this.isNull(this.state.searchModel.batchDocumentPayment)){
  paymentRowModelList = paymentRowModelList.concat(batchdocumentPayment);
 } else {
  paymentRowModelList = this.state.searchModel.batchDocumentPayment.concat(
    batchdocumentPayment
   );
 }
 this.setState({
   searchModel: {
       ...this.state.searchModel,
       batchDocumentPayment : paymentRowModelList, 
   }
 });   

  }

  addChargeRow(){
    console.log("add charge row ")
   const batchdocumentCharges = { ...this.batchdocumentCharges };
   var chargeRowModelList = [];

if(this.isNull(this.state.searchModel.batchDocumentCharges)){
  chargeRowModelList = chargeRowModelList.concat(batchdocumentCharges);
} else {
  chargeRowModelList = this.state.searchModel.batchDocumentCharges.concat(
    batchdocumentCharges
  );
}

this.setState({
  searchModel: {
      ...this.state.searchModel,
      batchDocumentCharges : chargeRowModelList, 
  }
});   
}

  handleChargeChange = (event) => {
    let newList = [...this.state.searchModel.batchDocumentCharges];
    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;

    newList[index][name] =
      value == "Please Select" ? null : value.toUpperCase();

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        batchDocumentCharges: newList,
      },
    });
  };

  handlePaymentChange = (event) => {
    let newPList = [...this.state.searchModel.batchDocumentPayment];
    const index = event.target.id;
    const name = event.target.name;
    const value = event.target.value;

    newPList[index][name] =
      value == "Please Select" ? null : value.toUpperCase();

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        batchDocumentPayment: newPList,
      },
    });
  };

  removePaymentRow = (event, index, paymentID) => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        //KHIZER CODE-------------------------DeleteNote
        if (paymentID > 0) {
          axios
            .delete(
              this.patientPlanUrl + "DeletePatientPlan/" + paymentID,
              this.config
            )
            .then((response) => {
              Swal.fire(
                "Record Deleted!",
                "Record has been deleted.",
                "success"
              );
              let patientPlans = [...this.state.patientModel.patientPlans];
              patientPlans.splice(index, 1);
              this.setState({
                patientModel: {
                  ...this.state.patientModel,
                  patientPlans: patientPlans,
                },
              });
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status) {
                  if (error.response.status == 400) {
                    Swal.fire("Error", error.response.data, "error");
                  } else {
                    Swal.fire(
                      "Record Not Deleted!",
                      "Record can not be delete, as it is being referenced in other screens.",
                      "error"
                    );
                  }
                }
              } else {
                Swal.fire(
                  "Record Not Deleted!",
                  "Record can not be delete, as it is being referenced in other screens.",
                  "error"
                );
              }
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          let patientPlans = [...this.state.patientModel.patientPlans];
          patientPlans.splice(index, 1);
          this.setState({
            patientModel: {
              ...this.state.patientModel,
              patientPlans: patientPlans,
            },
          });
        }
      }
    });
  };

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value.length == 0
    )
      return true;
    else return false;
  }

  render() {
    const statusID = [
      { value: "", display: "Please Select" },
      { value: "N", display: "NOT STARTED" },
      { value: "C", display: "CLOSED" },
      { value: "I", display: "IN PROCESS" },
    ];
    let notesList = [];
    var noteTableData = {};
    let Note = [];

    if (this.state.searchModel.note)
      this.state.searchModel.note.map((row, index) => {
        var notesDate = this.isNull(row.notesDate)
          ? ""
          : row.notesDate.slice(0, 10);

        if (notesDate != "") {
          var YY = notesDate.slice(0, 4);
          var DD = notesDate.slice(5, 7);
          var MM = notesDate.slice(8, 10);
        }

        notesList.push({
          notesDate: (
            <div style={{ width: "86px" }}>
              <span>{notesDate != "" ? MM + "/" + DD + "/" + YY : ""}</span>
            </div>
          ),

          note: (
            <div style={{ width: "100%" }}>
              <textarea
                data-toggle="tooltip"
          
                title={this.state.searchModel.note[index].note}
                className="Note-textarea provider-form w-100 form-control-user"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "10px",
                }}
                rows="1"
                cols="60"
                name="note"
                value={this.state.searchModel.note[index].note}
                id={index}
                onChange={this.handleNoteChange}
              ></textarea>
              {this.state.searchModel.note[index].noteValField}
            </div>
          ),

          addedBy: (
            <div style={{ width: "150px" }}>
              <span>{this.state.searchModel.note[index].addedBy}</span>
            </div>
          ),

          remove: (
            <div
              style={{
                width: "50px",
                paddingRight: "15px",
                marginLeft: "10px",
                marginTop: "-10px",
              }}
            >
              <button
                class="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                style={{paddingTop:"30px"}}
              >
                <span
                  aria-hidden="true"
                  id={index}
                  onClick={(event, index) =>
                    this.deleteRowNotes(event, index, row.id)
                  }
                >
                  ×
                </span>
              </button>
            </div>
          ),
        });
      });
    noteTableData = {
      columns: [
        {
          label: "DATE",
          field: "notesDate",
          sort: "asc",
          // width: 400
        },
        {
          label: "NOTES",
          field: "note",
          sort: "asc",
          // width: 200
        },
        {
          label: "ADDED BY",
          field: "addedBy",
          sort: "asc",
          // width: 50
        },

        {
          label: "",
          field: "remove",
          sort: "asc",
          // width: 0
        },
      ],
      rows: notesList,
    };

    const isActive = this.state.searchModel.isActive;
    const headers = ["Demographics Info", "Charges", "Payment", "Notes"];

    let popup = "";

    if (this.state.popupName === "practice") {
      popup = (
        <NewPractice
          onClose={this.closePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.popupName === "location") {
      popup = (
        <NewLocation onClose={this.closePopup} id={this.state.id}></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      popup = (
        <NewProvider onClose={this.closePopup} id={this.state.id}></NewProvider>
      );
    } else if (this.state.showLPopup) {
      popup = (
        <NewLocation
          onClose={this.closeLocationPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewLocation>
      );
    } else if (this.state.showDPopup) {
      popup = (
        <NewDocumentType
          onClose={this.closeDocumentPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewDocumentType>
      );
    } else if (this.state.showPPopup) {
      popup = (
        <NewProvider
          onClose={this.closeProviderPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        >
          >
        </NewProvider>
      );
    } else if (this.state.showPopup) {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else popup = <React.Fragment></React.Fragment>;

    try {
      if (this.props.userInfo1.userPractices.length > 0) {
        if (this.state.practice.length == 0) {
          if (this.state.editId == 0) {
            let locID =
              this.props.userInfo1.userLocations.length > 1
                ? this.props.userInfo1.userLocations[1].id
                : null;
            let provID =
              this.props.userInfo1.userProviders.length > 1
                ? this.props.userInfo1.userProviders[1].id
                : null;

            console.log(locID);
            console.log("second");
            console.log(provID);

            this.setState({
              searchModel: {
                ...this.state.searchModel,
                practiceID: this.props.userInfo1.practiceID,
                locationID: locID,
                ProviderID: provID,
              },
              practice: this.props.userInfo1.userPractices,
              location: this.props.userInfo1.userLocations,
              provider: this.props.userInfo1.userProviders,
            });
          } else {
            this.setState({
              searchModel: {
                ...this.state.searchModel,
                practiceID: this.props.userInfo1.practiceID,
              },
              practice: this.props.userInfo1.userPractices,
              location: this.props.userInfo1.userLocations,
              provider: this.props.userInfo1.userProviders,
            });
          }
        }
      }
    } catch {}

    let newChargeList = [];

    var chargeData = {};

    var batchCharge = [];

    if (this.isNull(this.state.searchModel.batchDocumentCharges)) {
      batchCharge = [];
    } else {
      batchCharge = this.state.searchModel.batchDocumentCharges;
    }

    batchCharge.map((row, index) => {
      var dos = row.dos ? row.dos.slice(0, 10) : "";

      newChargeList.push({
        dos: (
          <div className="textBoxValidate" style={{ width: "150px" }}>
            <input
              type="date"
              class="provider-form w-100 form-control-user"
              min="1900-01-01"
              max="9999-12-31"
              name="dos"
              id={index}
              value={dos}
              onChange={this.handleChargeChange}
            ></input>
          </div>
        ),
        noOfVisits: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="noOfVisits"
              id={index}
              maxLength="20"
              value={
                this.state.searchModel.batchDocumentCharges[index].noOfVisits
              }
              onChange={this.handleChargeChange}
              onKeyPress={this.handleNumericCheck}
            ></input>

            {/* {row.subscriberIDValField} */}
          </div>
        ),
        copay: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="copay"
              id={index}
              maxLength="20"
              value={this.state.searchModel.batchDocumentCharges[index].copay}
              onChange={this.handleChargeChange}
              onKeyPress={this.handleNumericCheck}
            ></input>
            {/* {row.subscriberIDValField} */}
          </div>
        ),

        otherPatientAmount: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="otherPatientAmount"
              id={index}
              maxLength="20"
              value={
                this.state.searchModel.batchDocumentCharges[index]
                  .otherPatientAmount
              }
              onChange={this.handleChargeChange}
              onKeyPress={this.handleNumericCheck}
            ></input>
            {/* {row.subscriberIDValField} */}
          </div>
        ),
        remove: (
          <div
            style={{
              width: "50px",
              paddingRight: "15px",
              marginLeft: "10px",
              marginTop: "-10px",
            }}
          >
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
              style={{paddingTop:"25px"}}
            >
              <span
                aria-hidden="true"
                id={index}
                onClick={(event, index) =>
                  this.removeChargeRow(event, index, row.id)
                }
              >
                ×
              </span>
            </button>
          </div>
        ),
      });
    });

    chargeData = {
      columns: [
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 150,
        },
        {
          label: "# OF VISITS",
          field: "noOfVisits",
          sort: "asc",
          width: 150,
        },
        {
          label: "COPAY",
          field: "copay",
          sort: "asc",
          width: 150,
        },
        {
          label: "OTHER PATIENT AMOUNT",
          field: "otherPatientAmount",
          sort: "asc",
          width: 150,
        },

        {
          label: "",
          field: "remove",
          sort: "asc",
          // width: 0
        },
      ],
      rows: newChargeList,
    };

    let newPaymentList = [];

    var paymentData = {};

    var batchPayment = [];

    if (this.isNull(this.state.searchModel.batchDocumentPayment)) {
      batchPayment = [];
    } else {
      batchPayment = this.state.searchModel.batchDocumentPayment;
    }

    batchPayment.map((row, index) => {
      var checkDate = row.checkDate ? row.checkDate.slice(0, 10) : "";

      newPaymentList.push({
   

        checkNo: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="checkNo"
              id={index}
              maxLength="20"
              value={this.state.searchModel.batchDocumentPayment[index].checkNo}
              onChange={this.handlePaymentChange}
              onKeyPress={this.handleNumericCheck}
            ></input>

            {/* {row.subscriberIDValField} */}
          </div>
        ),
        checkDate: (
          <div className="textBoxValidate" style={{ width: "150px" }}>
            <input
              type="date"
              class="provider-form w-100 form-control-user"
              min="1900-01-01"
              max="9999-12-31"
              name="checkDate"
              id={index}
              value={checkDate}
              onChange={this.handlePaymentChange}
            ></input>
          </div>
        ),

        checkAmount: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="checkAmount"
              id={index}
              maxLength="20"
              value={
                this.state.searchModel.batchDocumentPayment[index].checkAmount
              }
              onChange={this.handlePaymentChange}
              onKeyPress={this.handleNumericCheck}
            ></input>
            {/* {row.subscriberIDValField} */}
          </div>
        ),

        applied: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="applied"
              readOnly
              disabled
              id={index}
              maxLength="20"
              value={this.state.searchModel.batchDocumentPayment[index].applied}
              onChange={this.handlePaymentChange}
              onKeyPress={this.handleNumericCheck}
            ></input>
            {/* {row.subscriberIDValField} */}
          </div>
        ),

        unApplied: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="unApplied"
              id={index}
              readOnly
              disabled
              maxLength="20"
              value={
                this.state.searchModel.batchDocumentPayment[index].unApplied
              }
              onChange={this.handlePaymentChange}
              onKeyPress={this.handleNumericCheck}
            ></input>
            {/* {row.subscriberIDValField} */}
          </div>
        ),

        remarks: (
          <div style={{ width: "160px" }} className="textBoxValidate">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              name="remarks"
              id={index}
              maxLength="20"
              value={this.state.searchModel.batchDocumentPayment[index].remarks}
              onChange={this.handlePaymentChange}
              // onKeyPress={this.handleNumericCheck}
            ></input>
            {/* {row.subscriberIDValField} */}
          </div>
        ),
        remove: (
          <div style={{ width: "50px", textAlign: "center" }}>
            <button
              className="removeBtn"
              name="deleteCPTBtn"
              id={index}
              onClick={(event) => this.removePaymentRow(event, index, row.id)}
            ></button>
          </div>
        ),
      });
    });

    paymentData = {
      columns: [
        {
          label: "CHECK #",
          field: "checkNo",
          sort: "asc",
          width: 150,
        },
        {
          label: "CHECK DATE",
          field: "checkDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "AMOUNT",
          field: "checkAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "APPLIED",
          field: "applied",
          sort: "asc",
          width: 150,
        },
        {
          label: "UNAPPLIED",
          field: "unApplied",
          sort: "asc",
          width: 150,
        },
        {
          label: "REMARKS",
          field: "remarks",
          sort: "asc",
          width: 150,
        },
        {
          label: "",
          field: "remove",
          sort: "asc",
          // width: 0
        },
      ],
      rows: newPaymentList,
    };

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

    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];
    var Imag;
    Imag = (
      <div>
        <img src={settingsIcon} width="17px" />
      </div>
    );

    var dropdown;

    if (this.state.editId > 0) {
      dropdown = (
        <Dropdown
          className=""
          options={options}
          onChange={() => this.openhistorypopup(0)}
          //  value={options}
          // placeholder={"Select an option"}

          placeholder={Imag}
        />
      );
    }

    var inputShow;
    if (this.state.searchModel.id > 0) {
      inputShow = (
        <React.Fragment>
          <div class="col-md-4 float-left">
            <label for="name">
              <span className={this.state.numberOfPages ? "txtUnderline" : ""}>
                # of Pages
              </span>
              /Size
            </label>
          </div>
          <div class="col-md-4 float-left">
            <input
              type="text"
              disabled="disabled"
              class="provider-form w-100 form-control-user"
              // placeholder="Payer Name"
              readOnly
              value={this.state.searchModel.numberOfPages}
              name="numberOfPages"
              id="numberOfPages"
            />
          </div>
          <div class="col-md-3 float-left">
            <input
              type="text"
              disabled="disabled"
              class="provider-form w-100 form-control-user"
              // placeholder="Payer Name"
              readOnly
              value={this.state.searchModel.fileSize}
              name="fileSize"
              id="fileSize"
            />
          </div>
          <div class="col-md-1 float-left">
            <span
              style={{
                float: "left",
                marginTop: "2px",
                marginLeft: "-20px",
              }}
            >
              KB
            </span>
          </div>
        </React.Fragment>
      );
    }

    let chargegrid = "";
    chargegrid = (
      <div class="card mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary search-h">CHARGES</h6>
          <div class="float-lg-right text-right">
            <button
              style={{ marginTop: "-6px" }}
              class="float-right btn btn-primary mr-2"
              onClick={this.addChargeRow}
            >
              Add Charge{" "}
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="table-responsive">
            <div
              style={{ overflowX: "hidden" }}
              id="dataTable_wrapper"
              class="dataTables_wrapper dt-bootstrap4"
            >
              <MDBDataTable
                responsive={true}
                striped
                searching={false}
                data={chargeData}
                displayEntries={false}
                sortable={true}
                scrollX={false}
                scrollY={false}
              />
            </div>
          </div>
        </div>
      </div>
      // <div className="mainTable fullWidthTable">
      //   <div className="table-grid mt-15">
      //     <div className="row headingTable">
      //       <div className="mf-6">
      //         <h1>CHARGES</h1>
      //       </div>
      //       <div className="mf-6 headingRightTable">
      //         <button className="btn-blue" onClick={this.addChargeRow}>
      //           Add charge{" "}
      //         </button>
      //       </div>
      //     </div>

      //     <div className="tableGridContainer text-nowrap">
      //       <div className="tableGridContainer">

      //         <MDBDataTable
      //           responsive={true}
      //           striped
      //           bordered
      //           searching={false}
      //           data={chargeData}
      //           displayEntries={false}
      //           sortable={true}
      //           scrollX={false}
      //           scrollY={false}
      //         />
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
    let paymentgrid = "";
    paymentgrid = (
      <div className="mainTable fullWidthTable">
        <div className="table-grid mt-15">
          <div className="row headingTable">
            <div className="mf-6">
              <h1>PAYMENT</h1>
            </div>
            <div className="mf-6 headingRightTable">
              <button className="btn-blue" onClick={this.addPaymentRow}>
                Add Payment{" "}
              </button>
            </div>
          </div>

          <div className="tableGridContainer text-nowrap">
            <div className="tableGridContainer">
              <MDBDataTable
                responsive={true}
                striped
                bordered
                searching={false}
                data={paymentData}
                displayEntries={false}
                sortable={true}
                scrollX={false}
                scrollY={false}
              />
            </div>
          </div>
        </div>
      </div>
    );

    const resPID = [
      { value: "", display: "Please Select" },
      { value: "B", display: "BELLMEDEX" },
      { value: "C", display: "CLIENT" },
    ];

    var providerFromDate = this.state.searchModel.startDate
      ? this.state.searchModel.startDate.slice(0, 10)
      : "";
    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="clientModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "200px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? "BATCH #  " + this.state.editId
                          : //  +
                            // "-" +
                            // this.state.STATUS
                            "NEW BATCH DOCUMENT"}
                      </h3>

                      <div class="float-lg-right text-right">
                        {this.state.editId > 0 ? (
                          <button
                          style={{marginTop:"-2px"}}
                            class=" btn btn-primary mr-2"
                            type="button"
                            onClick={() => this.downloadFile()}
                            // disabled={this.isDisabled(this.props.rights.delete)}
                          >
                            {" "}
                            Download File
                          </button>
                        ) : (
                          <React.Fragment >
                            <div class="col-md-4 float-left" style={{marginRight:"-13px", marginTop:"3px"}}>
                              <label
                                style={{
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                  paddingBottom: "5px",
                                  paddingTop: "7px",
                                  marginTop: "-7px",
                                  whiteSpace:"nowrap"
                                }}
                                for="file-upload"
                                id="file-upload-style"
                                className=" btn btn-primary mr-2 labelFileUpload"
                              >
                                Attach Document
                                <input
                                  id="file-upload"
                                  type="file"
                                  className="InputUploaderDisNone"
                                  onChange={(e) => this.ProcessFileLoad(e)}
                                />
                              </label>
                              <div class="invalid-feedback" style={{whiteSpace:"nowrap" , paddingLeft:"0px"  ,color:"#0086c9"}}>
                            {this.state.filePath}
                            {this.state.validationModel.fileUploadVal}
                        </div>
                            </div>
                            
                        </React.Fragment >
                        )}
                        <button
                         style={{marginTop:"-4px"}}
                          class=" btn btn-primary mr-2"
                          type="submit"
                          onClick={this.delete}
                          // disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          {" "}
                          Delete
                        </button>

                        {this.state.editId > 0 ? dropdown : null}
                        {/* {this.state.editId > 0 ?
                        (<img src={settingIcon} alt="" style={{ width: "17px" }} />) : null} */}
                        {/* {this.state.editId > 0 ? dropdown : ""} */}

                        <button
                          class="close"
                          type="button"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span
                            aria-hidden="true"
                            onClick={() => this.props.onClose()}
                          >
                            ×
                          </span>
                        </button>
                      </div>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    {/* Main Content */}

                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">Batch #</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            disabled="disabled"
                            class="provider-form w-100 form-control-user"
                            // placeholder="Payer Name"
                            value={this.state.searchModel.id}
                            name="id"
                            id="id"
                            maxLength="30"
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Reponsible Party <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="responsibleParty"
                            id="responsibleParty"
                            value={this.state.searchModel.responsibleParty}
                            onChange={this.handleChange}
                          >
                            {resPID.map((s) => (
                              <option key={s.value} value={s.value}>
                                {" "}
                                {s.display}
                                {""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.responsiblePartyValField}
                        </div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-3 float-left">
                          <label for="firstName">
                            Doc Type <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{
                              width: "78%",
                              padding: "8px",
                              marginLeft: "12%",
                            }}
                            class="provider-form form-control-user"
                            name="documentTypeID"
                            id="documentTypeID"
                            value={this.state.searchModel.documentTypeID}
                            onChange={this.handleChange}
                          >
                            {this.state.cateData.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                          <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            <img
                              class="float-right pt-1"
                              id="myModal"
                              src={plusImage}
                              style={{ width: "25px" }}
                              onClick={() => this.openDocumentPopup(0)}
                              // disabled={this.isDisabled(
                              //   this.props.rights.add
                              // )}
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.documentTypeIDValField}
                        </div>
                      </div>

                      <div class="col-md-6 mb-2">
                        <div class="col-md-3 float-left">
                          <label for="firstName">
                            {this.state.searchModel.practiceID > 0 ? (
                              <a
                                href="#"
                                onClick={(event) =>
                                  this.openPopup(
                                    event,
                                    "practice",
                                    this.state.searchModel.practiceID
                                  )
                                }
                              >
                                Practice
                              </a>
                            ) : (
                              <span>Practice</span>
                            )}
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{
                              width: "88% ",
                              padding: "8px",
                              marginLeft: "12%",
                            }}
                            class="provider-form form-control-user"
                            name="practiceID"
                            id="practiceID"
                            disabled
                            value={this.state.searchModel.practiceID}
                            onChange={this.handleChange}
                          >
                            {this.state.practice.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                          {/* <a
                          href="popup-provider.html"
                          data-toggle="modal"
                          data-target="#logoutModal"
                        >
                          <img
                            class="float-right pt-1"
                            id="myModal"
                            src="img/plus-ico.png"
                            alt=""
                          />
                        </a> */}
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.practiceIDValField}
                        </div>
                      </div>

                      <div class="col-md-6 mb-2">
                        <div class="col-md-3 float-left">
                          <label for="location">
                            {this.state.searchModel.locationID > 0 ? (
                              <a
                                href="#"
                                onClick={(event) =>
                                  this.openPopup(
                                    event,
                                    "location",
                                    this.state.searchModel.locationID
                                  )
                                }
                              >
                                Location
                              </a>
                            ) : (
                              <span>Location</span>
                            )}
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{
                              width: "78%",
                              padding: "8px",
                              marginLeft: "12%",
                            }}
                            class="provider-form form-control-user"
                            name="locationID"
                            id="locationID"
                            value={this.state.searchModel.locationID}
                            onChange={this.handleChange}
                          >
                            {this.props.userLocations.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                          <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            <img
                              class="float-right pt-1"
                              id="myModal"
                              src={plusImage}
                              style={{ width: "25px" }}
                              onClick={() => this.openLocationPopup(0)}
                              // disabled={this.isDisabled(
                              //   this.props.rights.add
                              // )}
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.locData} */}
                        </div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-3 float-left">
                          <label for="location">
                            {this.state.searchModel.ProviderID > 0 ? (
                              <a
                                href="#"
                                onClick={(event) =>
                                  this.openPopup(
                                    event,
                                    "provider",
                                    this.state.searchModel.ProviderID
                                  )
                                }
                              >
                                Provider
                              </a>
                            ) : (
                              <span>Provider</span>
                            )}
                          </label>
                        </div>
                        <div class="col-md-9 float-left">
                          <select
                            style={{
                              width: "78%",
                              padding: "8px",
                              marginLeft: "12%",
                            }}
                            class="provider-form form-control-user"
                            name="ProviderID"
                            id="ProviderID"
                            value={this.state.searchModel.ProviderID}
                            onChange={this.handleChange}
                          >
                            {this.props.userProviders.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                          <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            <img
                              class="float-right pt-1"
                              id="myModal"
                              src={plusImage}
                              style={{ width: "25px" }}
                              onClick={() => this.openProviderPopup(0)}
                              disabled={this.isDisabled(this.props.rights.add)}
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.documentTypeIDValField} */}
                        </div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Status</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="status"
                            id="status"
                            value={this.state.searchModel.status}
                            onChange={this.handleChange}
                            disabled={this.props.id > 0 ? true : false}
                          >
                            {statusID.map((s) => (
                              <option key={s.value} value={s.value}>
                                {" "}
                                {s.display}
                                {""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.responsiblePartyValField} */}
                        </div>
                      </div>
                      <div class="col-md-6 mb-2">{inputShow}</div>

                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="dateOfServiceFrom">Start Date</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            min="1900-01-01"
                            max="9999-12-31"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="startDate"
                            id="startDate"
                            value={providerFromDate}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {" "}
                          {/* Valid first name is required.{" "} */}
                        </div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="dateOfServiceFrom">End Date</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            min="1900-01-01"
                            max="9999-12-31"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="endDate"
                            id="endDate"
                            value={
                              this.state.searchModel.endDate == null
                                ? ""
                                : this.state.searchModel.endDate
                            }
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {" "}
                          {/* Valid first name is required.{" "} */}
                        </div>
                      </div>
                    </div>

                    <Tabs headers={headers} style={{ cursor: "default" }}>
                      <Tab className="userTab">
                        <br></br>
                        <br></br>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">Demographics #</label>
                            </div>
                            <div class="col-md-8 float-left">
                            <input
                              class="provider-form w-100 form-control-user"
                              type="text"
                              value={this.state.searchModel.noOfDemographics}
                              name="noOfDemographics"
                              id="noOfDemographics"
                              onChange={() => this.handleChange}
                              onKeyPress={event => this.handleNumericCheck(event)}
                              onInput={this.onPaste}
                            ></input>
                      
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.lastNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">Demographics Entered #</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                disabled="disabled"
                                class="provider-form w-100 form-control-user"
                                placeholder="Demographic Entered"
                                value={
                                  this.state.searchModel.noOfDemographicsEntered
                                }
                                name="noOfDemographicsEntered"
                                id="noOfDemographicsEntered"
                                maxLength="20"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.firstNameValField} */}
                            </div>
                          </div>
                        </div>
                      </Tab>

                      <Tab>
                        <br></br>
                        <br></br>

                        <div class="card mb-4">
                          <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary search-h">
                              CHARGES
                            </h6>
                            <div class="float-lg-right text-right">
                              <button
                                style={{ marginTop: "-6px" }}
                                class="float-right btn btn-primary mr-2"
                                onClick={this.addChargeRow}
                              >
                                Add Charges{" "}
                              </button>
                            </div>
                          </div>

                          <div class="card-body">
                            <div class="table-responsive">
                              <div
                                style={{ overflowX: "hidden" }}
                                id="dataTable_wrapper"
                                class="dataTables_wrapper dt-bootstrap4"
                              >
                                <MDBDataTable
                                  responsive={true}
                                  striped
                                  searching={false}
                                  data={chargeData}
                                  displayEntries={false}
                                  sortable={true}
                                  scrollX={false}
                                  scrollY={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <br></br>

       
                      </Tab>

                      <Tab>
                        <br></br>
                        <br></br>
                        <div class="card mb-4">
                          <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary search-h">
                              PAYMENT
                            </h6>
                            <div class="float-lg-right text-right">
                              <button
                                style={{ marginTop: "-6px" }}
                                class="float-right btn btn-primary mr-2"
                                onClick={this.addPaymentRow}
                              >
                                Add Payment{" "}
                              </button>
                            </div>
                          </div>

                          <div class="card-body">
                            <div class="table-responsive">
                              <div
                                style={{ overflowX: "hidden" }}
                                id="dataTable_wrapper"
                                class="dataTables_wrapper dt-bootstrap4"
                              >
                                <MDBDataTable
                                  responsive={true}
                                  striped
                                  searching={false}
                                  data={paymentData}
                                  displayEntries={false}
                                  sortable={true}
                                  scrollX={false}
                                  scrollY={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab>
                        <br></br>
                        <br></br>
                        <div class="card mb-4">
                          <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary search-h">
                              NOTES
                            </h6>
                            <div class="float-lg-right text-right">
                              <button
                                style={{ marginTop: "-6px" }}
                                class="float-right btn btn-primary mr-2"
                                onClick={this.addRowNotes}
                              >
                                Add Note{" "}
                              </button>
                            </div>
                          </div>

                          <div class="card-body">
                            <div class="table-responsive">
                              <div
                                style={{ overflowX: "hidden" }}
                                id="dataTable_wrapper"
                                class="dataTables_wrapper dt-bootstrap4"
                              >
                                <MDBDataTable
                                  responsive={true}
                                  striped
                                  searching={false}
                                  data={noteTableData}
                                  displayEntries={false}
                                  sortable={true}
                                  scrollX={false}
                                  scrollY={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.saveBatchDocumentSearch}
                        disabled={this.isDisabled(
                          this.state.editId > 0
                            ? this.props.rights.update
                            : this.props.rights.add
                        )}
                      >
                        Save
                      </button>

                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={
                          this.props.onClose
                            ? () => this.props.onClose()
                            : () => this.props.onClose()
                        }
                      >
                        Cancel
                      </button>
                    </div>

                    {/* End of Main Content */}
                  </div>
                </div>

                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
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
    userLocations: state.loginInfo
      ? state.loginInfo.userLocations
        ? state.loginInfo.userLocations
        : []
      : [],

    userProviders: state.loginInfo
      ? state.loginInfo.userProviders
        ? state.loginInfo.userProviders
        : []
      : [],

    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    //id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },

    userInfo1: state.loginInfo
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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(BatchDocumentPopup);
