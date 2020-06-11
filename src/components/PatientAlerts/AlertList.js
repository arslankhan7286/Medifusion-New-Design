import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import close from "../../images/icons/AddpatientAlert/close-icon.png";
import AlertListData from "./AlertListData";
import axios from "axios";
import "./Alert.css";

// import Eclips from "../../images/icons/AddPatientAlert/loading_spinner.gif"
import Eclips from "../../images/icons/AddpatientAlert/loading_spinner.gif";
import GifLoader from "react-gif-loader";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import AddPatientAlert from "./AddPatientAlert";
import Plus from "../../images/icons/AddpatientAlert/plus-icon2.jpg";

class AlertList extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PatientAlerts/";
    this.state = {
      modal: this.props.open,
      list: [],
      openNewModal: false,
      loading: false,
      data: this.props.Alert,
    };

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
  }
  
  toggle = () => {
    console.log("props", this.props);
    if (this.props.callingFrom == "patient") {
      console.log("callBackMoreItems", this.props);
      try {
        this.props.closeMoreItems();
      } catch (error) {}
      try {
        this.props.callBackMoreItems();
      } catch (error) {}
    }

    if (this.props.callingFrom == "Header") {
      console.log("callBackHeader", this.props);
      this.props.callBackHeader();
    }
    this.setState({
      modal: false,
    });
  };

  componentDidMount() {
    let patientid = this.props.patientId;
    console.log("PatientID propsssss", patientid);
    this.setState({ loading: true });
    if (patientid == "" || patientid == null) {
      axios
        .get(this.url + "PatientAlerts", this.config)
        .then((response) => {
          console.log("PatientAlerts Response : ", response.data);
          this.setState({
            list: response.data,
            loading: false,
          });
        })

        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    } else {
      axios
        .get(this.url + `PatientAlerts?patientId=${patientid}`, this.config)
        .then((response) => {
          console.log(
            "PatientAlerts Response with patientID : ",
            response.data
          );
          this.setState({
            list: this.props.arrData,
            loading: false,
          });
        })

        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    }
  }

  openNewModal = () => {
    this.setState({
      openNewModal: !this.state.openNewModal,
    });
  };

  // callBack = () => {

  //   axios.get(this.url+ 'PatientAlerts' , this.config)
  //   .then(response => {
  //     console.log("PatientAlerts Response : " ,response.data)
  //     this.setState({
  //       list: response.data,
  //       loading: false

  //     });
  //   })

  //   .catch(error => {
  //     this.setState({ loading: false });
  //     console.log(error);
  //   });

  // }

  callBackAlertListData = () => {
    let patientid = this.props.patientId;
    console.log("AlertListPropss PatientID", patientid);
    this.setState({ loading: true });
    if (patientid == "" || patientid == null) {
      axios
        .get(this.url + "PatientAlerts", this.config)
        .then((response) => {
          console.log("PatientAlerts Response : ", response.data);
          this.setState({
            list: response.data,
            loading: false,
          });
        })

        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    } else {
      axios
        .get(this.url + `PatientAlerts?patientId=${patientid}`, this.config)
        .then((response) => {
          console.log(
            "PatientAlerts Response with patientID : ",
            response.data
          );
          this.setState({
            list: this.props.arrData,
            loading: false,
          });
        })

        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    }
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
        <Modal
          isOpen={this.state.modal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          initHeight={440}
        >
          <span
            style={{ float: "right", marginTop: "10px", cursor: "pointer" }}
            onClick={this.toggle}
          >
            <img src={close} />
          </span>
          <ModalHeader
            style={{ backgroundColor: "#186790", marginTop: "50px" }}
          >
            <strong style={{ color: "white" }}>ALERT LIST</strong>
            {/* <strong style = {{float : "right", color : "white"}}>+</strong> */}
            <span style={{ float: "right", cursor: "pointer" }}>
              <img src={Plus} alt="" onClick={this.openNewModal} />
            </span>
          </ModalHeader>
          <ModalBody>
            {spiner}
            {this.state.list.map((row) => {
              return (
                <AlertListData
                  Alert={row}
                  callingFrom="ResolvedComments"
                  callBack={this.callBackAlertListData}
                  showResolve={false}
                />
              );
            })}

            {console.log("Form Propsss", this.props.Alert)}
          </ModalBody>
        </Modal>
        {this.state.openNewModal ? (
          <AddPatientAlert
            open={true}
            callingFrom="AlertList"
            callBack={this.callBackAlertListData}
          />
        ) : (
          ""
        )}
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

export default connect(mapStateToProps, matchDispatchToProps)(AlertList);
