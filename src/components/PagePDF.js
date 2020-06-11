import React, { Component } from "react";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import axios from "axios";
import { isNullOrUndefined } from "util";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import { Worker } from '@phuocng/react-pdf-viewer';

import Viewer , { RenderViewerProps, ScrollMode, SpecialZoomLevel, SelectionMode }from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import { defaultLayout } from '@phuocng/react-pdf-viewer';
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";


const renderToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {
   
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div style={{ padding: '0 5px' }} data-toggle="tooltip" title="Search">
            {toolbarSlot.searchPopover}
          </div>
          <div style={{ padding: '0 5px' }} data-toggle="tooltip" title="Previous">
            {toolbarSlot.previousPageButton}
          </div>
          <div style={{ padding: '0 5px' }}>
            {toolbarSlot.currentPageInput} / {toolbarSlot.numPages}
          </div>
          <div style={{ padding: '0 5px' }}  data-toggle="tooltip" title="Next">
            {toolbarSlot.nextPageButton}
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            flexShrink: 1,
            justifyContent: 'center',
          }}
        >
          <div style={{ padding: '0 5px' }} >
            {toolbarSlot.zoomOutButton}
          </div>
          <div style={{ padding: '0 5px' }}>
            {toolbarSlot.zoomPopover}
          </div>
          <div style={{ padding: '0 5px' }}>
            {toolbarSlot.zoomInButton}
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
          }}
        >
          <div style={{ padding: '0 5px' }} data-toggle="tooltip" title="Full Screen">
            {toolbarSlot.fullScreenButton}
          </div>
          {/* <div style={{ padding: '0 5px' }}>
            {toolbarSlot.openFileButton}
          </div> */}
          {/* <div style={{ padding: '0 5px', display: 'none' }}>
            {toolbarSlot.downloadButton}
          </div> */}
          <div style={{ padding: '0 5px' }} data-toggle="tooltip" title="Print">
            {toolbarSlot.printButton}
          </div>
  
          <div style={{ padding: '0 5px', position:"relative" }} data-toggle="tooltip" title="More">
            {toolbarSlot.moreActionsPopover}
          </div>
        </div>
      </div>
    );
  };
  
  const layout = (
    isSidebarOpened: boolean,
    container: Slot,
    main: Slot,
    toolbar: RenderToolbar,
    sidebar: Slot,
  ): React.ReactElement => {
    return defaultLayout(
      isSidebarOpened,
      container,
      main,
      toolbar(renderToolbar),
      sidebar,
    );
  };

  


class PagePDF extends Component {
    constructor(props) {
        super(props);
        // this.url = process.env.REACT_APP_URL + "/Patient/";

        //Authorization Token
        this.config = {
            headers: {
                Authorization: "Bearer  " + this.props.loginObject.token,
                Accept: "*/*"
            }
        };

        this.state = {
            pageNumber : this.props.pageNumber,

        };

    }


    render() {

      console.log("File Path :",this.props.fileURL);
      console.log("Page Number :", this.props.pageNumber);
      // var pageNumber = this.props.pageNumber.indexOf(",");
      
      var fileURL = this.props.fileURL.toString();
      
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
  //  style={{ margin: "8.8rem auto" }}
              class="modal-dialog"
              role="document"
            >
              <div
                id="modalContent"
                class="modal-content"
              style={{ minHeight: "300px", maxHeight: "700px" }}
              >
  
                <div
                  class="modal-header"
                  style={{ marginLeft: "0px" }}>
                  <div class="row ml-0 mr-0 w-100">
                    <div class="col-md-12 order-md-1 provider-form ">
                      <div class="header pt-1">
                        <h3>
                        Page
                        </h3>
  
                        <div class="float-lg-right text-right">
  
                        
  
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
            
            
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.worker.min.js">
                                    
                                    <div style={{ height: '750px' }} >
                                        <Viewer 
                                              fileUrl={fileURL}
                                                // fileUrl="https://arxiv.org/pdf/quant-ph/0410100.pdf" 
                                                layout={layout} 
                                                initialPage={this.props.pageNumber-1}
                                        />
                                    </div>

                                    </Worker>
            
            
            
            
              <br></br>
                      {/* Save ans Cancel Butons */}
                      <div class="col-12 text-center">
                       
  
                        <button
                          class="btn btn-primary mr-2"
                          type="submit"
                          onClick={
                            () => this.props.onClose()
                          }
                        >
                          OK
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
            : { userPractices: [], name: "", practiceID: null }
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

export default connect(mapStateToProps, matchDispatchToProps)(PagePDF);
