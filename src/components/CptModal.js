import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table } from "reactstrap";

//Redux Actions
import "../css/style.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { eo, te } from "date-fns/locale";
import Clinical from "./Clinical";
import $ from "jquery";
import Axios from "axios";
import Swal from "sweetalert2";
import { Checkbox } from '@material-ui/core';
import NewClinical from './NewClinical/NewClinical'
import close from "../images/close-icon.png";

let data;

class CptModal extends React.Component {
  constructor(props) {
    super(props)
    this.url = process.env.REACT_APP_URL + "/Cpt/";
    this.tempList = [];
    this.state = {
      modal: this.props.open,
      list: [],
      dataList: [],
      checked: false,
      dataProp: [],
      popup: false
    }
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };



  }
  toggle = () => this.setState({

    modal: !this.state.modal
  }
  )

  componentDidMount() {
    Axios.get(this.url + "FindMostFavouriteCPT", this.config)
      .then(response => {
        // console.log("component response", response);
        this.setState({

          list: response.data
          // list: [
          //   {
          //     cptCode: 'code1',
          //     description: 'discription 1',
          //     amount: 'amonyut 1',
          //     type: 'type 1'
          //   },
          //   {
          //     cptCode: 'code2',
          //     description: 'discription 2',
          //     amount: 'amonyut 2',
          //     type: 'type 2'
          //   }
          // ]

        });
      })

      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  }
  checkHandler(e) {
    console.log("chkEvent", e.target.id);
    this.state.list.map(row => {
      if (row.id == e.target.id) {
        row.chk = !row.chk;
      }
    });

    console.log("chkEvent", this.state.list);
  }


  // var id = row.id;

  // console.log(id)



  // this.state.list[index][row.chk] = !this.state.list[index][row.chk];

  // this.setState({
  //   checked: !this.state.checked
  // })

  // console.log("Onclicked Checked ::", this.state.checked)

  // if (this.state.checked) {
  //   console.log("temp list 1 ", this.tempList)
  //   let tempList = this.tempList.push(row);
  //   console.log("temp list 2 ", this.tempList)
  //   console.log(tempList);
  // }



  // setTimeout(() => {
  //   console.log("Checking.........", this.state.dataProp);

  // }, 1000)


  selectChecked() {
    let checkedData = this.state.list.filter(row => row.chk == true);
    // this.props.getCheckedCPTData(checkedData);
    // this.props.onRequestClose();
    this.props.pickList(checkedData);

    this.toggle()
  }


  render() {

    // let popup = "";

    // if (this.state.popup) {
    //   console.log("fawad", this.state.dataProp)
    //   popup = (
    //     this.props.pickList(this.tempList)
    //     // <NewClinical
    //     //   dataProp={this.state.dataProp}
    //     // ></NewClinical>
    //   );
    // }

    return (

      <div>



        <Modal isOpen={this.state.modal} size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered>

          <ModalBody >
            <div>
              <span style={{ float: "left", color: "#227398", fontSize: "20px" }}> <strong>CPT Pick List</strong></span>
              <span style={{ float: "right", fontSize: "30px", color: "#F5788F" }} onClick={this.toggle}><img src = {close}/></span>


            </div>
            <Table>
              <thead>

                <tr>
                  <th>ID</th>
                  <th style={{ padding: "10px" }}></th>


                  <th style={{ padding: "10px", width: "10%" }}>CPT</th>
                  <th style={{ padding: "10px", width: "70%" }}>Description</th>
                  <th style={{ padding: "10px", width: "10%" }}>Price</th>
                  <th style={{ padding: "10px", width: "10%" }}>Type</th>


                </tr>
              </thead>

              <tbody>
                {this.state.list.map((row) => (
                  < tr >
                    <td id={row.id}>{row.id}</td>
                    <td id={row.id} style={{ padding: "10px" }} >
                      <input type="checkbox" id={row.id} name="name1" onChange={(e) => this.checkHandler(e)} />&nbsp; </td>
                    {/* <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}></td> */}
                    < td id={row.id} value={row.cptCode} style={{ width: "10%", padding: "10px" }}>{row.cptCode}</td>
                    <td id={row.id} value={row.description} style={{ padding: "10px", width: "70%" }}> {row.description}</td>
                    <td id={row.id} value={row.amount} style={{ padding: "10px", width: "10%" }}>{row.amount}</td>
                    <td id={row.id} value={row.type} style={{ padding: "10px", width: "10%" }}>{row.type}</td>

                  </tr>
                ))}


              </tbody>
            </Table>


          </ModalBody>


          <ModalFooter>
            <div style={{ textAlign: "center", float: "left", width: "100%" }}>
              <button className = "text-white btn-blue" onClick={() => this.selectChecked()}>Select</button>
              <button className = "text-white btn-grey" style={{ marginLeft: "10px" }} onClick={this.toggle}>Cancel</button>

            </div>

          </ModalFooter>
        </Modal >
        {/* {popup} */}
      </div >
    )

  }




}

function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { token: "", isLogin: false }
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction: loginAction
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(CptModal);