import React, { Component } from 'react';

class DeviceOrientation extends Component {
  // LIFECYCLE METHODS
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}

  // RENDER OF COMPONENT
  render() {
    return (
      <div className="mainWrapper">
        <div className="deviceStatus">
        <p>{navigator.userAgent}</p>
        </div>
        <div className="activationContainer">
          <p>Allow access to Device Orienation</p>
          <div
            className="activationButton"
            onClick={this.handleButtonClick}>
              Allow
          </div>
        </div>
        <p className="deviceOrientationDetectionStatus">–</p>
      </div>
    );
  }

  // FUNCTION: BASIC EXPLANATION HERE
  handleButtonClick = () => {
    const iOSDevice = typeof DeviceOrientationEvent.requestPermission === 'function';
    const likelyToBeMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    if (iOSDevice && likelyToBeMobileDevice) {
      console.log('if (iOSDevice && likelyToBeMobileDevice)');
      DeviceOrientationEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', this.logCoordinates, true);
        }
      })
      .catch(console.error);;
    } else if (likelyToBeMobileDevice) {
      console.log('} else if (likelyToBeMobileDevice) {');
      window.addEventListener('deviceorientation', this.logCoordinates, true);
    } else {
      console.log("I don't think you're on a mobile device");
      // 111 Do something to the content to say we're not sure....
    }
  }
  logCoordinates = (e) => {
    console.log(`e.alpha: ${e.alpha}`);
    console.log(`e.beta: ${e.beta}`);
    console.log(`e.gamma: ${e.gamma}`);
  };
}

export default DeviceOrientation;
