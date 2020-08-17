import React, { Component } from 'react';
import { throttle } from './Helper';

class DeviceOrientation extends Component {
  // LIFECYCLE METHODS
  componentDidMount() {
    this.handleUserAgentString();
    window.requestAnimationFrame(this.logCoordinates);
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
        {/* 3D BOX */}
        <div class="cubeContainer">
          <div class="cube">
            <div class="cube__face cube__face--front">front</div>
            <div class="cube__face cube__face--back">back</div>
            <div class="cube__face cube__face--right">right</div>
            <div class="cube__face cube__face--left">left</div>
            <div class="cube__face cube__face--top">top</div>
            <div class="cube__face cube__face--bottom">bottom</div>
          </div>
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
      </div>
    );
  }

  // FUNCTION: BASIC EXPLANATION HERE
  // - Display the user string with better line-breaks.
  handleUserAgentString = () => {
    const target = document.querySelector('.userAgent');
    const content = navigator.userAgent.replace(/[)]\s/g, ')<br>');
    target.insertAdjacentHTML('afterbegin', content);
  };
  // - On button click determine the device type and return a response
  handleButtonClick = () => {
    const likelyToBeMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    const iOSDevice = this.iOSDeviceDefine();
    if (iOSDevice && likelyToBeMobileDevice) {
      DeviceOrientationEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', throttle(this.logCoordinates, 500), true);
        }
      })
      .catch(console.error);
      this.updateDeviceStatus('Access Granted');
    } else if (likelyToBeMobileDevice) {
      window.addEventListener('deviceorientation', throttle(this.logCoordinates, 500), true);
      this.updateDeviceStatus('Access Granted');
    } else {
      this.updateDeviceStatus("Access Not Granted<br>This doesn't seem like a mobile device");
    }
  }
  // - Define the iOSDevice Variable with this function
  iOSDeviceDefine = () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      return false;
    } else {
      return typeof DeviceOrientationEvent.requestPermission === 'function';
    };
  }
  // - Update the device status
  updateDeviceStatus = (string) => {
    document.querySelector('.deviceOrientationAccess').innerHTML = string;
  };
  // Display the coordinates
  logCoordinates = (e) => {
    document.querySelector('.coordinatesX').innerHTML = Math.round((e.beta + Number.EPSILON) * 100) / 100;
    document.querySelector('.coordinatesY').innerHTML = Math.round((e.gamma + Number.EPSILON) * 100) / 100;
    document.querySelector('.coordinatesZ').innerHTML = Math.round((e.alpha + Number.EPSILON) * 100) / 100;
  };
}

export default DeviceOrientation;
