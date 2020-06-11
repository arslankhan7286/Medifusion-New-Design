import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import close from "../../../src/images/close-icon.png";
import Eclips from "../../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import SaveGeneralItems from "../SaveGeneral/SaveGeneralItems";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import $ from "jquery";
import Swal from "sweetalert2";
import { show } from "react-tooltip";

let showReason;
let showType;
let showProviders;
let showIcd;
let idNew;

class FAVOURITEICD extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Icd/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.state = {
      loading: false,
      currentRow: {},
      Mode: "",
      data: [],
      dataModel: this.dataModel,
      providers: [],
      providerID: 0,
      visitReasonID: 0,
      icdid: 0,
      type: "",
      searchIcd: "",
      list: [],
      searchedList: [],
      FormICDList: [], // bound to table ICD...
      currentFocus: 0,
      array: [],
      visitReason: [],
      icdType: [],
      modal: false,
      sendRow: [],
      showNewDescription: false,
      delete: false,
      isOpen: false,
    };
  }
  openModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      showNewDescription: false,
      providerID: "",
      visitReasonID: "",
      type: "",
      searchIcd: "",
      delete: false,
    });
  };

  saveValue = (e) => {
    this.callSave();
    this.setState({ modal: false });
  };
  callSave = (e) => {
    const { type, providerID, visitReasonID, icdid } = this.state;
    let dataModel = {};
    console.log("Mode: ", this.state.Mode);
    if (this.state.Mode == "delete") {
      dataModel = this.state.currentRow;
      dataModel.inActive = true;
    } else if (this.state.Mode == "edit") {
      console.log("currentRow: ", this.state.currentRow);
      dataModel = this.state.currentRow;
      dataModel.type = type;
      dataModel.providerID = providerID;
      dataModel.visitReasonID = visitReasonID;
      dataModel.icdid = icdid;
      console.log("DataModel: ", dataModel);
    } else {
      dataModel = {
        id: 0,
        practiceID: 0,
        inactive: false,
        addedBy: "",
        addedDate: new Date(),
        updatedBy: "",
        updatedDate: new Date(),
        type: type,
        providerID: providerID,
        visitReasonID: visitReasonID,
        icdid: icdid,
      };
    }

    console.log("DataModel final: ", dataModel);
    // e.preventDefault();
    axios
      .post(this.url + "SaveMostFavouriteICD", dataModel, this.config)
      .then((response) => {
        console.log("show response", response.data);
        if (
          response.data ==
          "ICD Code with same Provider,Visit Reason and Type , already exist."
        ) {
          Swal.fire(
            "ICD Already Exist",
            "ICD Already Exists In Favourite ICD List",
            "error"
          );
        }
        if (response.data.id > 0 && this.state.Mode == "delete")
          Swal.fire("ICD Deleted Successfully", "", "success");
      })
      .catch((error) => {
        Swal.fire("Something Went Wrong", "", "error");
        console.log(error);
      });
    axios
      .get(this.url + "FindMostFavouriteICD/", this.config)
      .then((response) => {
        console.log("get response=======", response);
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ showNewDescription: false });
  };
  refreshHandler = () => {
    axios
      .get(this.url + "FindMostFavouriteICD/", this.config)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  async componentDidMount() {
    await this.setState({ loading: true });
    axios
      .get(this.url + "FindMostFavouriteICD/", this.config)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
    axios.get(this.url + "GetProfiles/", this.config).then((response) =>
      this.setState({
        visitReason: response.data.visitReason,
        icdType: response.data.icdType,
        loading: false,
      })
    );
    if (this.props.userInfo.userPractices.length > 0) {
      this.setState({
        providers: this.props.userInfo.userProviders,
      });
    }
    console.log("Locations", this.props.userInfo.userLocations);
    document.addEventListener("click", function (elmnt, e) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != e) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    });
  }
  isNull(value) {
    if (
      value === null ||
      value === "" ||
      value === undefined ||
      value === -1 ||
      value === "Please Select"
    ) {
      return true;
    } else {
      return false;
    }
  }
  async KeyDown(e) {
    var x = document.getElementById(e.target.id + "autocomplete-list");
    console.log("X KeyDown", x);
    console.log("E", e.keyCode);
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
                      increase the currentFocus variable:*/

      await this.setState({ currentFocus: this.state.currentFocus + 1 });

      /*and and make the current item more visible:*/
      this.addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
                      decrease the currentFocus variable:*/
      await this.setState({ currentFocus: this.state.currentFocus - 1 });
      /*and and make the current item more visible:*/
      this.addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (this.state.currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[this.state.currentFocus].click();
      }
    }
  }
  async addEventListener(e) {
    this.setState({
      searchIcd: e.target.value.toUpperCase(),
    });

    var arr = [];
    var a,
      b,
      i,
      val = e.target.value;
    // creating AutoComplete
    await axios
      .get(
        this.url + "FindICDByCode?ICD=" + e.target.value.toUpperCase(),
        this.config
      )
      .then((response) => {
        console.log("Search response", response);
        response.data.map((row) => {
          arr.push({
            name: row.icdCode + " : " + row.description,
            id: 0,
            icdid: row.icdid,
            icdCode: row.icdCode,
            description: row.description,
            amount: row.amount,
            modifier1: row.modifier1,
            modifier2: row.modifier2,
            units: row.units,
            NDCUnits: row.ndcUnits,
            ClinicalFormID: 0,
            AddedBy: "",
            AddedDate: "",
            UpdatedBy: "",
            UpdatedDate: "",
          });
          this.setState({ array: arr });
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    /*close any already open lists of autocompleted values*/
    this.closeAllLists(e);
    if (!val) {
      return false;
    }
    await this.setState({ currentFocus: -1 });
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", /*e.target.id +*/ "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    console.log("A", a);
    /*append the DIV element as a child of the autocomplete container:*/

    document.getElementById("parent").appendChild(a);
    /*for each item in the array...*/

    arr.map((row) => {
      /*check if the item starts with the same letters as the text field value:*/

      var start = row.name.toUpperCase().indexOf(val.toUpperCase());
      if (start > -1) {
        //if (row.name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        b.onclick = (event) => this.optionSelected(event);

        /*make the matching letters bold:*/
        b.innerHTML = row.name.substr(0, start);
        b.innerHTML +=
          "<strong>" + row.name.substr(start, val.length) + "</strong>";
        b.innerHTML += row.name.substr(start + val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + row.value + "'  >";
        /*execute a function when someone clicks on the item value (DIV element):*/
        // b.setAttribute("title", row.value);
        b.setAttribute("id", row.icdid);
        b.setAttribute("title", row.icdCode);
        b.setAttribute("description", row.description);
        console.log("B", b);
        a.appendChild(b);
      }
    });
  }
  addActive(x) {
    var crrFocus = this.state.currentFocus;
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    this.removeActive(x);

    if (crrFocus >= x.length) {
      crrFocus = 0;
    }

    if (crrFocus < 0) {
      crrFocus = x.length - 1;
    }

    this.setState({ currentFocus: crrFocus });
    /*add class "autocomplete-active":*/
    x[crrFocus].classList.add("autocomplete-active");
  }

  removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  closeAllLists(elmnt, e) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != e) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  // changeHandler(e) {
  //   this.setState({
  //     dataModel: {
  //       ...this.state.dataModel,
  //       [e.target.name]: e.target.value
  //     }
  //   });
  //   showProviders = e.currentTarget.value;
  // }
  optionSelected(e) {
    var arr = this.state.FormICDList;
    var id = e.target.id;
    //arr= this.state.FormICDList;
    //  var value=e.target.title;//document.getElementById(e.target.id+'P').getAttribute("name")
    // var value = arr.filter(o => o.id == e.target.id);//arr["id"][e.target.id+'P'];
    // adding row to FormICDList(ICD table)
    this.state.array.map((row) => {
      if (row.icdid == e.target.id) {
        arr.push(row);
      }
    });
    // console.log("selected V: ", value);
    // arr.push(value);

    this.setState({
      FormICDList: arr,
      icdid: arr[0].icdid,
      searchIcd: e.target.title,
      dataModel: {
        ...this.state.dataModel,
        icdid: id,
      },
    });
    this.closeAllLists(e);
  }
  deleteData = (row) => {
    let dataModel = [];
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
        // dataModel =row;// this.state.data;
        // dataModel.map((row1) => {
        //   if (row1.id == row.id) {
        //     row1.inActive = true;
        //   }
        // });
        this.setState({
          currentRow: row,
          Mode: "delete",
        });
        console.log("Yes Clicked: ", this.state.currentRow);
        this.saveValue();
      }
    });
    // this.callSave(row);
  };
  showData = (row) => {
    console.log(row, "==========================");
    idNew = row.id;
    showIcd = row.icdCode;
    showProviders = row.providerID;
    showType = row.type;
    showReason = row.visitReason;
    this.setState({
      Mode: "edit",
      providerID: row.providerID,
      type: row.type,
      visitReasonID: row.visitReasonID,
      showNewDescription: !this.state.showNewDescription,
      currentRow: row,
      icdid: row.icdid,
      modal: true,
      delete: false,
    });
    // this.setState({

    // });
  };
  edit = () => {
    this.setState({ showNewDescription: false });
  };
  render() {
    //Spinner
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }
    return (
      <div>
        {this.state.isOpen ? <SaveGeneralItems open={this.state.isOpen}  toggle={this.openModal} /> : ""}
        <div className="row">
          {spiner}
          <div className="col-lg-12">
            <div className="mainHeading row">
              <div className="col-md-12 text-left">
                <h1>FAVOURITE ICD</h1>
              </div>
            </div>
            <button onClick={this.toggle} className="btn-blue">
              Add New +
            </button>
            <span className="float-right">
              <i
                class="fas fa-sync-alt"
                onClick={this.refreshHandler}
                style={{ fontSize: "20px", lineHeight: "65px" }}
              ></i>
            </span>
            <Table responsive>
              <thead className="cpt-heading">
                <tr>
                  <th className="d-block">ICD code</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Provider</th>
                  <th style={{ borderRight: "0px" }}>Visit Reason</th>
                  <th className="border-0"></th>
                </tr>
              </thead>
              <tbody className="cpt">
                {this.state.data.map((row, i) =>
                  row.inActive ? null : (
                    <tr key={i} style={{ cursor: "pointer" }}>
                      <td
                        className="d-block"
                        onClick={() => this.showData(row)}
                        style={{ padding: "5px 0px" }}
                      >
                        {row.icdCode}
                      </td>
                      <td style={{ padding: "5px 0px!important" }}>
                        {row.amount}
                      </td>
                      <td style={{ padding: "5px 0px" }}>{row.type}</td>
                      <td style={{ padding: "5px 0px" }}>{row.pName}</td>
                      <td style={{ padding: "5px 0px" }}>{row.visitReason}</td>
                      <td
                        className="text-center"
                        style={{ padding: "5px 0px" }}
                      >
                        <img src={close} onClick={() => this.deleteData(row)} />
                        {/* <i
                          class="far fa-times-circle mr-0"
                          style={{ color: "#ed5051" }}
                          onClick={() => this.deleteData(row)}
                        ></i> */}
                        {/* <button onClick={() => this.deleteData(row)}>
                        delete
                      </button> */}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalBody className="modalBody">
              <div className="col-lg-12 text-center">
                {this.state.showNewDescription ? (
                  <div className="mainHeading row">
                    <div className="col-md-12 text-left">
                      <h1>EDIT ICD</h1>
                    </div>
                  </div>
                ) : (
                  <div className="mainHeading row">
                    <div className="col-md-12 text-left">
                      <h1>ADD NEW ICD</h1>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-lg-6">
                    <label className="mr-2 float-left w-100 text-left">
                      Provider:
                    </label>
                    <select
                      className="w-100 mb-2 h-50"
                      name="providerID"
                      onChange={(e) =>
                        this.setState({ providerID: e.target.value })
                      }
                      value={this.state.providerID}
                    >
                      {this.state.providers
                        ? this.state.providers.map((row) => (
                            <option
                              key={row.id}
                              value={row.id}
                              id={row.id}
                              // selected={
                              //   this.state.showNewDescription
                              //     ? row.description === showProviders
                              //     : null
                              // }
                            >
                              {row.description}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label className="mr-2 float-left w-100 text-left">
                      Visit Reason:
                    </label>
                    <select
                      className="w-100 mb-2 h-50"
                      name="visitReasonID"
                      onChange={(e) =>
                        this.setState({ visitReasonID: e.target.value })
                      }
                      value={this.state.visitReasonID}
                    >
                      {this.state.visitReason.map((row) => (
                        <option
                          key={row.id}
                          value={row.id}
                          id={row.id}
                          // selected={
                          //   this.state.showNewDescription
                          //     ? row.description === showReason
                          //     : null
                          // }
                        >
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label className="mr-2 mt-2 float-left w-100 text-left">
                      ICD:
                    </label>
                    <div
                      id="parent"
                      class="autocomplete w-100 h-50 bg-white"
                      style={{ border: "1px solid #ccc" }}
                    >
                      <input
                        value={
                          this.state.showNewDescription
                            ? showIcd
                            : this.state.searchIcd
                        }
                        type="text"
                        placeholder="Find ICD / HCPCS"
                        className="pl-1 search-icon border-0 w-100 pt-0 h-100"
                        onChange={(e) => this.addEventListener(e)}
                        onKeyDown={(e) => this.KeyDown(e)}
                      />
                      {this.isNull(this.state.searchValue) ? (
                        <i class="search-icon"></i>
                      ) : (
                        <i
                          onClick={this.clearField}
                          id="cross"
                          class="fas fa-times"
                        ></i>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <label className="mr-2 mt-2 float-left w-100  text-left">
                      Type:
                    </label>
                    <select
                      type="text"
                      className="float-left w-75 h-50 mb-2"
                      name="type"
                      onChange={(e) => this.setState({ type: e.target.value })}
                      value={this.state.type}
                    >
                      {this.state.icdType.map((type) => (
                        <option
                          key={type.id}
                          value={type.description}
                          id={type.id}
                          selected={
                            this.state.showNewDescription
                              ? type.description === showType
                              : null
                          }
                        >
                          {type.description}
                        </option>
                      ))}
                    </select>
                    <i
                      class="fas fa-plus"
                      onClick={this.openModal}
                      style={{
                        fontSize: "25px",
                        float: "right",
                        margin: "0px",
                        lineHeight: "25px",
                        color: "#037592",
                      }}
                    ></i>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <span className="float-left w-100 text-center">
                <button onClick={this.saveValue} className="btn-blue mr-2">
                  Save
                </button>
                <button onClick={this.toggle} className="btn-grey">
                  Cancel
                </button>
              </span>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction: loginAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(FAVOURITEICD);
