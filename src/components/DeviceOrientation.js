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
        <div className="deviceStatus">
          <p className="userAgent"></p>
          <p className="deviceOrientationAccess">Access Not Granted</p>
          <p className="coordinates">
            X / Pitch / Beta:<br/><span className="coordinatesX">–</span>
          </p>
          <p className="coordinates">
            Y / Roll / Gamma:<br/><span className="coordinatesY">–</span>
          </p>
          <p className="coordinates">
            Z / Yaw / Alpha:<br/><span className="coordinatesZ">–</span>
          </p>
        </div>
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
    const iOSDevice = typeof DeviceOrientationEvent.requestPermission === 'function';
    const likelyToBeMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
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
  // - Update the device status
  updateDeviceStatus = (string) => {
    document.querySelector('.deviceOrientationAccess').innerHTML = string;
  };
  logCoordinates = (e) => {
    // 999 CONTINUE HERE SHORTEN THE STRING
    document.querySelector('.coordinatesX').innerHTML = e.beta;
    document.querySelector('.coordinatesY').innerHTML = e.gamma;
    document.querySelector('.coordinatesZ').innerHTML = e.alpha;
  };
}

export default DeviceOrientation;
