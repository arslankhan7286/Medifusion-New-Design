import React, { Component } from "react";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "../../Tables/Table.module.css";
import Eclips from "../../../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

class ICDPickList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      ICDdata: [],
    };

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.icd = process.env.REACT_APP_URL + "/Icd/";

    this.checkHandler = this.checkHandler.bind(this);
    this.selectChecked = this.selectChecked.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(this.icd + "FindMostFavouriteICD", this.config)
      .then((response) => {
        console.log("FindMostFavouriteICD", response);
        this.setState({ ICDdata: response.data });
        this.state.ICDdata.map((row1) => {
          this.props.Rows.map((row2) => {
            if (row1.id == row2.icdMostFavouriteID) {
              if (!row2.inactive) {
                row1.chk = !row1.chk;
              }
            }
          });
        });
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkHandler(e) {
    console.log("chkEvent", e.target.id);
    let array = this.state.ICDdata;
    array.map((row) => {
      if (row.id == e.target.id) {
        row.chk = !row.chk;
      }
    });
    this.setState({
      ICDdata: array,
    });

    console.log("chkEvent", this.state.ICDdata);
  }

  selectChecked() {
    let checkedData = this.state.ICDdata.filter((row) => row.chk == true);
    this.props.getCheckedPicklistData(checkedData, "ICD");
    this.props.onRequestClose();
  }

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
      <div style={{ margin: "0 10px", height: "100%" }}>
        {spiner}
        <div style={{ position: "relative", display: "flex" }}>
          <strong className="Headerheader float-left w-100">
            ICD Pick List
          </strong>
          <i
            name="ICDpopup"
            onClick={(e) => this.props.onRequestClose(e)}
            class="fas fa-times"
          ></i>
        </div>
        <div style={{ marginTop: "20px", overflowY: "scroll", height: "75%" }}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeadings}>
                <td className="font-weight-bold"></td>
                <td className="font-weight-bold">ICD</td>
                <td className="font-weight-bold">Description</td>
                <td className="font-weight-bold">Type</td>
                <td className="font-weight-bold"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.ICDdata
                ? this.state.ICDdata.map((row) => (
                    <tr className={styles.tableRow}>
                      <td className={styles.tableData}>
                        <input
                          checked={row.chk}
                          className="schedularpicklistCHKS"
                          id={row.id}
                          onChange={(e) => this.checkHandler(e)}
                          type="checkbox"
                        ></input>
                      </td>
                      <td className={styles.tableData}>{row.icdCode}</td>
                      <td className={styles.tableData}>{row.description}</td>
                      <td className={styles.tableData}>{row.type}</td>
                      <td className={styles.tableData}></td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            textAlign: "center",
            width: "100%",
            margin: "10px",
          }}
        >
          <button
            // className="SchedularAppointmentButtons text-white w-auto px-3 mr-2 Schedularsave"
            className="btn-blue"
            onClick={() => this.selectChecked()}
          >
            Select{" "}
          </button>
          <button
            // className="SchedularAppointmentButtons text-white w-auto px-3 mr-2 Schedularcancel mt-2 mt-lg-0"
            className="btn-grey"
            name="ICDpopup"
            onClick={(e) => this.props.onRequestClose(e)}
          >
            Cancel{" "}
          </button>
        </div>
      </div>
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
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
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
      // selectTabPageAction: selectTabPageAction,
      // loginAction: loginAction,
      // selectTabAction: selectTabAction
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(ICDPickList);
