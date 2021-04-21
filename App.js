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
  TextInput,
  ActivityIndicator,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ActionSheet from 'react-native-actions-sheet';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import AF from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
const actionSheetRef = createRef();
const width = Dimensions.get('window').width - 40;
const maskLength = (width * 90) / 100;

const App = () => {
  const [api, setApi] = useState('http://127.0.0.1:8000/api/test/');
  const [cameraBoolean, setCameraBoolean] = useState(false);
  const [image, setImage] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
  const takePicture = () => {
    ImagePicker.openCamera({
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
  const handleSubmit = () => {
    const splits = image.split('/');
    const name = splits[splits.length - 1];

    var tosend = [
      {
        name: 'image',
        filename: name,
        type:
          name.substr(name.length - 3) === 'png' ? 'image/png' : 'image/jpeg',
        data: RNFetchBlob.wrap(image),
      },
    ];

    setLoading(true);
    RNFetchBlob.fetch(
      'POST',
      api,
      {'Content-Type': 'multipart/form-data'},
      tosend,
    ).then(response => {
      alert(response.json().data);
      setLoading(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />

      <View>
        <TextInput
          style={{
            height: 40,
            width: Dimensions.get('window').width - 20,
            margin: 12,
            borderWidth: 1,
          }}
          onChangeText={setApi}
          value={api}
          placeholder={'Enter a test api to submit your image'}
        />
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
              onPress={() => takePicture()}
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
                    marginTop: Dimensions.get('window').height <= 640 ? 10 : 20,
                  }}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.textStyle}>Submit </Text>
                </TouchableHighlight>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="green"
                    style={{alignSelf: 'center', marginTop: 20}}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
