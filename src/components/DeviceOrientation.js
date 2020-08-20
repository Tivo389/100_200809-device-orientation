import React, { Component } from 'react';
import { throttle } from './Helper';

class DeviceOrientation extends Component {
  // LIFECYCLE METHODS
  componentDidMount() {
    this.handleUserAgentString();
    window.requestAnimationFrame(this.handleDeviceOrientation);
  }
  componentDidUpdate() {}
  componentWillUnmount() {}

  // RENDER OF COMPONENT
  render() {
    return (
      <div className="mainWrapper">
        {/* DEVICE STATUS */}
        <div className="deviceStatus">
          <p className="userAgent"></p>
          <p className="deviceOrientationAccess">Access Not Granted</p>
          <p className="coordinates">
            X / Pitch / Beta&ensp;: <span className="coordinatesX">–</span>
          </p>
          <p className="coordinates">
            Y / Roll&ensp;&ensp;/ Gamma: <span className="coordinatesY">–</span>
          </p>
          <p className="coordinates">
            Z / Yaw&ensp;&ensp;&ensp;/ Alpha: <span className="coordinatesZ">–</span>
          </p>
        </div>
        {/* ACTIVATION SECTION */}
        <div className="activationContainer">
          <p>Allow access to Device Orienation</p>
          <div
            className="activationButton"
            onClick={this.handleButtonClick}>
              Allow
          </div>
        </div>
        {/* 3D BOX */}
        <div className="cubeContainer">
          <div className="cube">
            <div className="cubeFace cubeFaceFront">front</div>
            <div className="cubeFace cubeFaceBack">back</div>
            <div className="cubeFace cubeFaceRight">right</div>
            <div className="cubeFace cubeFaceLeft">left</div>
            <div className="cubeFace cubeFaceTop">top</div>
            <div className="cubeFace cubeFaceBottom">bottom</div>
          </div>
        </div>
      </div>
    );
  }

  // FUNCTION: BASIC EXPLANATION HERE
  // -
  applyCoordinatesToCube = (xValue, yValue, zValue) => {
    console.log(`xValue: ${xValue}`);
    console.log(`yValue: ${yValue}`);
    console.log(`zValue: ${zValue}`);
    let domCube =  document.querySelector('.cube');
    domCube.style.transform = `translateZ(-100px) rotateX(${xValue}deg) rotateY(${yValue}deg) rotateZ(${zValue}deg)`;
  };
  // - On button click determine the device type and return a response
  handleButtonClick = () => {
    const likelyToBeMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    const iOSDevice = this.iOSDeviceDefine();
    if (iOSDevice && likelyToBeMobileDevice) {
      DeviceOrientationEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', throttle(this.handleDeviceOrientation, 10), true);
        }
      })
      .catch(console.error);
      this.updateDeviceStatus('Access Granted');
    } else if (likelyToBeMobileDevice) {
      window.addEventListener('deviceorientation', throttle(this.handleDeviceOrientation, 10), true);
      this.updateDeviceStatus('Access Granted');
    } else {
      this.updateDeviceStatus("Access Not Granted<br>This doesn't seem like a mobile device");
    }
  }
  // - Handle device orientation effect
  handleDeviceOrientation = (e) => {
    let domCoordinateX = document.querySelector('.coordinatesX');
    let domCoordinateY = document.querySelector('.coordinatesY');
    let domCoordinateZ = document.querySelector('.coordinatesZ');
    let domCoordinateXValue = this.returnRoundedCoordinate(e.beta);
    let domCoordinateYValue = this.returnRoundedCoordinate(e.gamma);
    let domCoordinateZValue = this.returnRoundedCoordinate(e.alpha);
    domCoordinateX.innerHTML = domCoordinateXValue;
    domCoordinateY.innerHTML = domCoordinateYValue;
    domCoordinateZ.innerHTML = domCoordinateZValue;
    this.applyCoordinatesToCube(domCoordinateXValue, domCoordinateYValue, domCoordinateZValue);
  };
  // - Display the user string with better line-breaks.
  handleUserAgentString = () => {
    const target = document.querySelector('.userAgent');
    const content = navigator.userAgent.replace(/[)]\s/g, ')<br>');
    target.insertAdjacentHTML('afterbegin', content);
  };
  // - Define the iOSDevice Variable with this function
  iOSDeviceDefine = () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      return false;
    } else {
      return typeof DeviceOrientationEvent.requestPermission === 'function';
    };
  }
  // - Return coordinate rounded to 2 decimal points.
  returnRoundedCoordinate = (axisType) => {
    return Math.round((axisType + Number.EPSILON) * 100) / 100;
  };
  // - Update the device status
  updateDeviceStatus = (string) => {
    document.querySelector('.deviceOrientationAccess').innerHTML = string;
  };
}

export default DeviceOrientation;
