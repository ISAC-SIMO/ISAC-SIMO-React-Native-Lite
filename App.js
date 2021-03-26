/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, createRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ActionSheet from 'react-native-actions-sheet';
import {RNCamera} from 'react-native-camera';
import Modal from 'react-native-modal';
import {useCamera} from 'react-native-camera-hooks';
import ImagePicker from 'react-native-image-crop-picker';
import ImageEditor from '@react-native-community/image-editor';
import Slider from '@react-native-community/slider';
import AF from 'react-native-vector-icons/MaterialCommunityIcons';

const actionSheetRef = createRef();
const width = Dimensions.get('window').width - 40;
const maskLength = (width * 90) / 100;

const App = ({initialProps}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [cameraBoolean, setCameraBoolean] = useState(false);
  const [image, setImage] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [
    {cameraRef, type, ratio, autoFocus, autoFocusPoint},
    {toggleFacing, touchToFocus},
  ] = useCamera(initialProps);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: false,
      cropperStatusBarColor: '#000000',
    }).then(image => {
      setImage(image.path);
      setImageHeight(image.height / 3);
      setImageWidth(image.height / 3);
      setModalVisible(true);
    });
  };
  const takePicture = async function () {
    if (cameraRef) {
      Snackbar.show({
        text: 'Please wait Image is being cropped',
        duration: Snackbar.LENGTH_LONG,
      });

      cameraRef
        .takePictureAsync({
          forceUpOrientation: true,
          fixOrientation: true,
          quality: 1,
        })
        .then(data => {
          let strData = data;
          setCameraBoolean(false);
          let cropData = {
            offset: {x: yOff * 5, y: yOff * 5},
            size: {width: bH * 5, height: bH * 5},
            displaySize: {width: bH * 5, height: bH * 5},
            resizeMode: 'contain',
          };
          ImageEditor.cropImage(strData.uri, cropData).then(url => {
            this.setState({
              image: url,
              imgHeight: bH,
              imgWidth: bH,
              modalVisible: true,
            });
          });
        });
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {!cameraBoolean ? (
        <View>
          <TouchableOpacity
            onPress={() => {
              actionSheetRef.current?.setModalVisible();
            }}
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: 100,
              backgroundColor: '#87ceeb',
            }}>
            <Text>Press Me !</Text>
          </TouchableOpacity>

          <ActionSheet ref={actionSheetRef}>
            <View style={{height: Dimensions.get('window').height / 5}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 20,
                  textTransform: 'uppercase',
                }}>
                Select Images
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCameraBoolean(true);
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  borderBottomColor: '#D1D1D1',
                  borderBottomWidth: 1,
                }}>
                <Text>Take Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGallery()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',

                  marginTop: 20,
                  borderBottomColor: '#D1D1D1',
                  borderBottomWidth: 1,
                }}>
                <Text>Select from Gallery</Text>
              </TouchableOpacity>
            </View>
          </ActionSheet>
          <Modal
            animationType="slide"
            transparent={false}
            onRequestClose={() => setModalVisible(false)}
            visible={isModalVisible}
            style={{
              margin: 0,
              backgroundColor: '#171f24',
            }}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Captured Image </Text>
            </View>

            <View style={styles.modalView}>
              <View
                style={
                  {
                    // marginTop: 20,
                  }
                }>
                <View
                  style={{
                    alignSelf: 'center',
                    overflow: 'hidden',
                    borderRadius: 5,
                    height: Dimensions.get('window').width - 10,
                    width: Dimensions.get('window').width - 10,
                  }}>
                  <Image
                    style={{
                      height: undefined,
                      width: undefined,
                      resizeMode: 'stretch',
                      flex: 1,
                    }}
                    resizeMode={'contain'}
                    source={{uri: `${image}`}}
                  />
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <TouchableHighlight
                    style={{
                      borderRadius: 10,
                      elevation: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#2196F3',
                      padding: 10,
                      marginTop:
                        Dimensions.get('window').height <= 640 ? 10 : 20,
                    }}
                    onPress={() => {
                      this.handleSubmit();
                    }}>
                    <Text style={styles.textStyle}>Submit </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
          }}>
          <RNCamera
            ref={cameraRef}
            // ratio={this.state.ratio}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.auto}
            autoFocus={autoFocus}
            autoFocusPointOfInterest={autoFocusPoint.normalized}
            // exposure={this.state.exposure}
            // whiteBalance={this.state.wb}
          >
            <View style={styles.overlay} />
            <View style={styles.snapText}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                PLACE IMAGE INSIDE THE FRAME{' '}
              </Text>
            </View>
            <View
              onTouchStart={touchToFocus}
              style={[styles.contentRow, {height: maskLength}]}
              onLayout={event => {
                var {x, y, width, height} = event.nativeEvent.layout;
                console.log(x, y, width, height, 'consoleeeeeeeeeeee');
                // this.setState({yOff: y, bH: height});
              }}>
              <View style={styles.overlay} />

              <View
                style={[
                  styles.content,
                  {width: maskLength, height: maskLength},
                ]}>
                {autoFocus === 'off' ? (
                  <View style={drawFocusRingPosition}>
                    <View
                      style={{
                        postion: 'absolute',
                        height: 64,
                        width: 64,
                        borderRadius: 32,
                        borderWidth: 2,
                        borderColor: 'yellow',
                        opacity: 0.8,
                      }}
                    />
                  </View>
                ) : null}
              </View>
              <View style={styles.overlay} />
            </View>
            <View
              style={[
                styles.overlay,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  height: 100,
                },
              ]}>
              <Text style={{fontSize: 15, color: '#FFFFFF', marginTop: 10}}>
                Exposure :{' '}
              </Text>
              {/* <Slider
              style={{width: 200, height: 50}}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={num => this.onExposureChange(num)}
            /> */}
            </View>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                // onPress={this.toggleWhiteBalance.bind(this)}
                style={{
                  left: 20,
                  height: 30,
                  width: Dimensions.get('window').width / 2,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <AF name="white-balance-auto" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={this.toggleFocus.bind(this)}
                style={{
                  right: 20,
                  height: 30,
                  width: Dimensions.get('window').width / 2,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <AF
                  name="focus-auto"
                  size={30}
                  color={autoFocus === 'on' ? 'white' : 'yellow'}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 35,
                  borderWidth: 1,
                  borderColor: '#D1D1D1',
                  backgroundColor: 'white',
                }}
                onPress={() => takePicture()}></TouchableOpacity>
            </View>
            <View style={styles.overlay} />
          </RNCamera>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: 1,
    marginTop: 50,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F2F3F4',
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#F2F3F4',
    flexWrap: 'wrap',
    marginHorizontal: 50,
  },
  footer: {
    width: '100%',
    bottom: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F2F3F4',
  },
  modalView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#171f24',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textFilter: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  imagePreview: {
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
  },

  preview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentRow: {
    flexDirection: 'row',
  },
  content: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  snapText: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default App;
