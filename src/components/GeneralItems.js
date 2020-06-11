import React, { Component } from "react";
import SaveGenralItems from "./SaveGeneral/SaveGeneralItems";
import axios from "axios";

import SearchHeading from "./SearchHeading";
import { bindActionCreators } from "redux";
import Input from "./Input";
import Label from "./Label";

import { connect } from "react-redux";
import { loginAction } from "../actions/LoginAction";
import GridHeading from "./GridHeading";
import { MDBDataTable } from "mdbreact";
import GifLoader from "react-gif-loader";
import Eclips from "../images/loading_spinner.gif";

import plus from "../images/plus-icon.png";

class GeneralItems extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/Common/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.searchModel = {
      Name: "",
      Value: "",
      Description: "",
      Type: "",
      position: "",
    };

    this.state = {
      loading: false,
      searchModel: this.searchModel,
      openModel: false,
      GeneralItems: [],
      openTypeSave: false,
      testingName: "",
      TypeWithsearch: [],
    };
  }
  componentDidMount() {
    let Typesearch = {
      Name: "",
      Value: "",
      Description: "",
      Type: "0",
      position: "",
    };
    axios
      .post(this.url + "GeneralItems", Typesearch, this.config)
      .then((response) => {
        console.log("GeneralItems Typesearch", response);
        this.setState({
          TypeWithsearch: response.data,
        });
      })
      .catch((error) => {
        console.log("Error Here.....", error);
      });
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openSaveItemsModel = () => {
    this.setState({
      openModel: true,
    });
  };

  closeSaveItemModel = () => {
    this.setState({
      openModel: false,
    });
  };
  handleChange = (event) => {
    // if (
    //   event.target.name === "Name" ||
    //   event.target.name === "Name"
    // ) {
    // } else {
    //   const caret = event.target.selectionStart;
    //   const element = event.target;
    //   window.requestAnimationFrame(() => {
    //     element.selectionStart = caret;
    //     element.selectionEnd = caret;
    //   });
    // }

    this.setState({
      testingName: event.target.value,
    });

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value,
      },
    });
  };
  openTypeSave = () => {
    this.setState({
      openTypeSave: true,
    });
  };

  closeModel = () => {
    this.setState({
      openTypeSave: false,
    });
  };

  searchSavedItems = () => {
    this.setState({ loading: true });
    axios
      .post(this.url + "GeneralItems", this.state.searchModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row) => {
          newList.push({
            id: row.id,
            name: row.name,
            value: row.value,
            description: row.description,
            type: row.type,
          });
        });

        this.setState({
          GeneralItems: newList,
          loading: false,
        });
      })
      .catch((error) => {
        console.log("Error Here.....", error);
      });
  };

  clearFields = () => {
    this.setState({
      searchModel: this.searchModel,
    });
  };

  render() {
    const tableData = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 150,
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150,
        },
        {
          label: "Value",
          field: "value",
          sort: "asc",
          width: 150,
        },
        {
          label: "Description",
          field: "description",
          sort: "asc",
          width: 150,
        },
        {
          label: "Type",
          field: "type",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.GeneralItems,
    };

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
      // <div>
      //   <div className="row">
      //     <div className="col-lg-12">
      //       <SearchHeading
      //         heading="GENERAL ITEMS SEARCH"
      //         handler={() => this.openSaveItemsModel(0)}
      //         // handler1={() => this.processPatients(0)}
      //         disabled={this.isDisabled(this.props.rights.add)}
      //       ></SearchHeading>
      //       {/* <div style={{ float: "left", width: "100%" }}>
      //         <button
      //           className="btn-blue"
      //           style={{ float: "right" }}
      //           onClick={this.openSaveItemsModel}
      //         >
      //           Add New +
      //         </button>
      //       </div> */}
      //     </div>

      //     <div className="col-lg-12">
      //       <div className="row">
      //         <div className="col-lg-4 mt-2">
      //           <div style={{ float: "left", width: "100%" }}>
      //             <label
      //               style={{ width: "30%", float: "left", lineHeight: "50px" }}
      //             >
      //               Name :
      //             </label>
      //             <input
      //               type="text"
      //               onChange={this.handleChange}
      //               // value = {this.state.searchModel.Name}
      //               value={
      //                 this.state.searchModel.Name == null
      //                   ? ""
      //                   : this.state.searchModel.Name
      //               }
      //               name="Name"
      //               style={{
      //                 width: "70%",
      //                 float: "right",
      //                 display: "inline",
      //                 padding: "10px",
      //               }}
      //               className="form-control"
      //             />
      //           </div>
      //         </div>
      //         <div className="col-lg-4  mt-2">
      //           <div style={{ float: "left", width: "100%" }}>
      //             <label
      //               style={{ width: "30%", float: "left", lineHeight: "50px" }}
      //             >
      //               Value :
      //             </label>
      //             <input
      //               type="number"
      //               value={
      //                 this.state.searchModel.Value == null
      //                   ? ""
      //                   : this.state.searchModel.Value
      //               }
      //               name="Value"
      //               onChange={this.handleChange}
      //               style={{
      //                 width: "70%",
      //                 float: "right",
      //                 display: "inline",
      //                 padding: "10px",
      //               }}
      //               className="form-control"
      //             />
      //           </div>
      //         </div>
      //         <div className="col-lg-4  mt-2">
      //           <div style={{ float: "left", width: "100%" }}>
      //             <label
      //               style={{ width: "30%", float: "left", lineHeight: "50px" }}
      //             >
      //               Description :
      //             </label>
      //             <input
      //               type="text"
      //               onChange={this.handleChange}
      //               //  value = {this.state.searchModel.Description}

      //               value={
      //                 this.state.searchModel.Description == null
      //                   ? ""
      //                   : this.state.searchModel.Description
      //               }
      //               name="Description"
      //               style={{
      //                 width: "70%",
      //                 float: "right",
      //                 display: "inline",
      //                 padding: "10px",
      //               }}
      //               className="form-control"
      //             />
      //           </div>
      //         </div>

      //         <div className="col-lg-6 mt-2">
      //           <div style={{ float: "left", width: "100%" }}>
      //             <label
      //               style={{ width: "18%", float: "left", lineHeight: "50px" }}
      //             >
      //               Type :
      //             </label>

      //             <select
      //               onChange={this.handleChange}
      //               // value={
      //               //       this.state.searchModel.Type == null
      //               //         ? ""
      //               //         : this.state.searchModel.Type
      //               //     }
      //               name="Type"
      //               style={{
      //                 width: "46%",
      //                 float: "left",
      //                 height: "50px",
      //                 display: "inline",
      //                 padding: "10px",
      //               }}
      //               className="form-control ml-2"
      //             >
      //               <option value="">Please Select</option>
      //               {this.state.TypeWithsearch.map((items) => {
      //                 return <option value={items.type}>{items.name}</option>;
      //               })}
      //             </select>

      //             <span
      //               style={{
      //                 width: "10%",
      //                 marginLeft: "20px",
      //                 cursor: "pointer",
      //               }}
      //             >
      //               <img src={plus} alt="" onClick={this.openTypeSave} />
      //             </span>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //     <div className="col-lg-12">
      //       <div className="row">
      //         <div className="col-lg-12">
      //           <div style={{ float: "left", width: "100%" }}>
      //             <div style={{ textAlign: "center" }}>
      //               <input
      //                 type="submit"
      //                 name="search"
      //                 id="search"
      //                 className="btn-blue"
      //                 value="Search"
      //                 onClick={this.searchSavedItems}
      //               />

      //               <input
      //                 type="button"
      //                 name="clear"
      //                 id="clear"
      //                 value="Clear"
      //                 className="btn-grey"
      //               />
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="mf-12 table-grid mt-15">
      //       <GridHeading
      //         Heading="SEARCH GENERAL ITEMS RESULT"
      //         hideExportInSaveItems="false"
      //         length={this.state.GeneralItems.length}
      //       ></GridHeading>

      //       <div className="tableGridContainer text-nowrap">
      //         <MDBDataTable data={tableData} />
      //       </div>
      //     </div>
      //   </div>

      //   {this.state.openModel ? (
      //     <SaveGenralItems
      //       open="true"
      //       callingFrom="GeneralItems"
      //       callBack={this.closeSaveItemModel}
      //     />
      //   ) : null}

      //   {this.state.openTypeSave ? (
      //     <SaveGenralItems
      //       open="true"
      //       callingFrom="GeneralItemsPlus"
      //       callBack={this.closeModel}
      //     />
      //   ) : null}

      //   {spiner}
      // </div>

      <React.Fragment>
        {this.state.openModel ? (
          <SaveGenralItems
            open="true"
            callingFrom="GeneralItems"
            callBack={this.closeSaveItemModel}
          />
        ) : null}

        {this.state.openTypeSave ? (
          <SaveGenralItems
            open="true"
            callingFrom="GeneralItemsPlus"
            callBack={this.closeModel}
          />
        ) : null}
        {spiner}
        <SearchHeading
          heading="GENERAL ITEMS SEARCH"
          handler={() => this.openSaveItemsModel(0)}
          // handler1={() => this.processPatients(0)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></SearchHeading>

        <form onSubmit={this.searchReceiver}>
          <div className="mainTable">
            <div className="row-form">
              <div className="mf-6">
                <Label name="Name"></Label>
                <Input
                  max="20"
                  type="text"
                  name="Name"
                  id="Name"
                  value={
                    this.state.searchModel.Name == null
                      ? ""
                      : this.state.searchModel.Name
                  }
                  onChange={() => this.handleChange}
                />
              </div>
              <div className="mf-6">
                <Label name="Value"></Label>
                <Input
                  max="20"
                  type="text"
                  name="Value"
                  id="Value"
                  value={
                    this.state.searchModel.Value == null
                      ? ""
                      : this.state.searchModel.Value
                  }
                  onChange={() => this.handleChange}
                />
              </div>
            </div>

            <div className="row-form">
              <div className="mf-6">
                <Label name="Description"></Label>
                <Input
                  max="20"
                  type="text"
                  name="Description"
                  id="Description"
                  value={
                    this.state.searchModel.Description == null
                      ? ""
                      : this.state.searchModel.Description
                  }
                  onChange={() => this.handleChange}
                />
              </div>

              <div className="mf-6">
                <Label name="Type"></Label>
                <select
                  onChange={this.handleChange}
                  // value={
                  //       this.state.searchModel.Type == null
                  //         ? ""
                  //         : this.state.searchModel.Type
                  //     }
                  name="Type"
                  // style={{
                  //   width: "46%",
                  //   float: "left",
                  //   height: "50px",
                  //   display: "inline",
                  //   padding: "10px",
                  // }}
                  className="form-control ml-3 float-left"
                  style={{ width: "57%" }}
                >
                  <option value="">Please Select</option>
                  {this.state.TypeWithsearch.map((items) => {
                    return <option value={items.type}>{items.name}</option>;
                  })}
                </select>
                <span
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{ marginTop: "3px" }}
                    height="30px"
                    src={plus}
                    alt=""
                    onClick={this.openTypeSave}
                  />
                </span>
              </div>
            </div>

            <div className="row-form row-btn">
              <div className="mf-12">
                <Input
                  type="button"
                  name="name"
                  id="name"
                  className="btn-blue"
                  value="Search"
                  onClick={() => this.searchSavedItems()}
                />
                <Input
                  type="button"
                  name="name"
                  id="name"
                  className="btn-grey"
                  value="Clear"
                  onClick={this.clearFields}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="mf-12 table-grid mt-15">
          {/* <GridHeading
            Heading="SEARCH GENERAL ITEMS RESULT"
            hideExportInSaveItems="false"
            length={this.state.GeneralItems.length}
            disabled={true}
          ></GridHeading> */}
          <div className="row headingTable">
            <div className="mf-6">
              <h1>SEARCH GENERAL ITEMS RESULT</h1>
            </div>
            {/* <div className="mf-6 headingRightTable">
                <button className="btn-blue" onClick={this.addNewHeading}>
                  Add New +
                </button>
                <button className="btn-blue" onClick={this.applyIDs}>
                  Apply IDs
                </button>
              </div> */}
          </div>

          <div className="tableGridContainer text-nowrap">
            <MDBDataTable data={tableData} />
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
          search: state.loginInfo.rights.clientSearch,
          add: state.loginInfo.rights.clientCreate,
          update: state.loginInfo.rights.clientEdit,
          delete: state.loginInfo.rights.clientDelete,
          export: state.loginInfo.rights.clientExport,
          import: state.loginInfo.rights.clientImport,
        }
      : [],
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

export default connect(mapStateToProps, matchDispatchToProps)(GeneralItems);
