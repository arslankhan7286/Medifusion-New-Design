import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Table } from "reactstrap";
import "./SaveGeneral.css";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../../../src/actions/selectTabAction";
import { loginAction } from "../../../src/actions/LoginAction";
import { selectTabAction } from "../../../src/actions/selectTabAction";
import { eo, te } from "date-fns/locale";
import $ from "jquery";
import axios from "axios";
import Swal from "sweetalert2";
// import NewClinical from "./NewClinical";
import close from "../../images/close-icon.png";
import Eclips from "../../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import { Hidden } from "@material-ui/core";

class SaveGenralItems extends React.Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/Common/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.saveModel = {
      ID: 0,
      Name: "",
      Value: "",
      Description: "",
      Type: "",
      AddedBy: "",
      AddedDate: "",
      Inactive: false,
      position: "",
    };
    this.state = {
      loading: false,
      saveModel: this.saveModel,
      open: this.props.open,
      hideType: false,
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
        this.setState({
          TypeWithsearch: response.data,
        });
      })
      .catch((error) => {
        console.log("Error Here.....", error);
      });
  }
  toggle = () => {
    if (this.props.callingFrom == "GeneralItems") {
      this.props.callBack();
    }

    if (this.props.callingFrom == "GeneralItemsPlus") {
      this.props.callBack();
      this.setState({
        hideType: true,
      });
    }

    this.setState({
      open: false,
    });
  };

  componentWillMount() {
    if (this.props.Room) {
      this.setState({
        saveModel: {
          ...this.state.saveModel,
          Value: this.props.length + 1,
          Type: "rooms",
        },
      });
    }

    if (this.props.callingFrom == "GeneralItemsPlus") {
      this.setState({
        hideType: true,
        saveModel: {
          ...this.saveModel,
          Type: 0,
        },
      });
    }
  }

  saveData = () => {
    this.setState({ loading: true });
    axios
      .post(this.url + "SaveGeneralItems", this.state.saveModel, this.config)
      .then((response) => {
        Swal.fire("Record Saved Successfully", "", "success");
        this.setState({ loading: false });
        this.toggle();
      })
      .catch((error) => {
        console.log("Error Here.....", error);
      });
  };
  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      saveModel: {
        ...this.state.saveModel,
        [event.target.name]: event.target.value,
      },
    });
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
      <div className="cptModal">
        <Modal
          isOpen={this.state.open}
          aria-labelledby="contained-modal-title-vcenter"
          style={{ minHeight: "auto" }}
          centered
        >
          {this.props.Room ? (
            <div className="mainHeading mb-0">
              <div className="col-md-12 text-left">
                <h1>ROOM</h1>
              </div>
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "5px",
                }}
              >
                <img
                  onClick={this.toggle}
                  src={close}
                  style={{ cursor: "pointer" }}
                />
              </span>
            </div>
          ) : (
            <span style={{ position: "absolute", right: "10px", top: "5px" }}>
              <img
                onClick={this.toggle}
                src={close}
                style={{ cursor: "pointer" }}
              />
            </span>
          )}

          {spiner}
          <ModalBody className={this.props.Room ? "" : "mt-3"}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12 mt-2">
                  <label
                    htmlFor="name"
                    style={{
                      display: "inline-block",
                      width: "30%",
                      autoComplete: "off",
                    }}
                  >
                    Name :{" "}
                  </label>
                  <input
                    autocomplete="off"
                    type="text"
                    name="Name"
                    placeholder="Name"
                    value={this.state.saveModel.Name}
                    style={{
                      fontSize: "14px",
                      borderRadius: "10px solid #AAAAAA ",
                      width: "70%",
                      height: "30px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                    onChange={this.handleChange}
                  ></input>
                </div>
                {this.props.Room ? null : (
                  <div className="col-lg-12 mt-2">
                    <label
                      htmlFor="value"
                      style={{ display: "inline-block", width: "30%" }}
                    >
                      Value :
                    </label>
                    <input
                      readOnly={this.props.Room ? true : false}
                      type="text"
                      name="Value"
                      placeholder="Value"
                      style={{
                        fontSize: "14px",
                        padding: "10px",
                        width: "70%",
                        height: "30px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                      className={this.props.Room ? "readonly" : ""}
                      value={this.state.saveModel.Value}
                      onChange={this.props.Room ? null : this.handleChange}
                    ></input>
                  </div>
                )}

                <div className="col-lg-12 mt-2">
                  <label
                    htmlFor="description"
                    style={{
                      verticalAlign: "top",
                      marginTop: "17px",
                      width: "30%",
                    }}
                  >
                    Description :
                  </label>
                  <textarea
                    type="text"
                    style={{
                      fontSize: "14px",
                      width: "70%",
                      minHeight: "50px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                    name="Description"
                    placeholder="Description"
                    onChange={this.handleChange}
                  ></textarea>
                </div>
                <div
                  className="col-lg-12 mt-2"
                  style={{
                    visibility: this.state.hideType ? "hidden" : "",
                  }}
                >
                  <label
                    htmlFor="type"
                    style={{ width: "30%", display: "inline-block" }}
                  >
                    Type :{" "}
                  </label>
                  <select
                    disabled={this.props.Room ? true : false}
                    id="type"
                    type="text"
                    name="type"
                    className={this.props.Room ? "readonly" : ""}
                    style={{
                      width: "70%",
                      height: "30px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      fontSize: "14px",
                    }}
                    onChange={this.handleChange}
                    // value={this.state.saveModel.Type}
                  >
                    {this.props.Room ? (
                      <option value="rooms">ROOM</option>
                    ) : null}
                    <option value="">Please Select</option>
                    {this.state.TypeWithsearch.map((items) => {
                      return <option value={items.type}>{items.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-lg-12  mt-2 text-center">
                  <button onClick={this.saveData} className="btn-blue ml-5">
                    Save
                  </button>
                  <button onClick={this.toggle} className="btn-grey">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { token: "", isLogin: false },
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

export default connect(mapStateToProps, matchDispatchToProps)(SaveGenralItems);
