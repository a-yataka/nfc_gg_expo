import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';


// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {
  async function initNfc() {
    const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      }
      return supported;
   }
   
  // async function readNdef() {
  //   try {
  //     // register for the NFC tag with NDEF in it
  //     await NfcManager.requestTechnology(NfcTech.Ndef);
  //     // the resolved tag object will contain `ndefMessage` property
  //     const tag = await NfcManager.getTag();
  //     console.info('Tag found', tag);
  //   } catch (ex) {
  //     console.warn('Oops!', ex);
  //   } finally {
  //     // stop the nfc scanning
  //     NfcManager.cancelTechnologyRequest();
  //   }
  // }

  async function writeNdef({type, value}) {
    let result = false;
  
    try {
      // STEP 1
      // await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'NFCタグにタッチしてください',
      });
  
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(value)]);
  
      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
        result = true;
      }
    } catch (ex) {
      // console.warn(ex);
      console.warn('NFC writing error', ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }
  
    return result;
  }

  initNfc()
  const onPressGroup = (id) => {
    writeNdef({
      type: Ndef.RTD_BYTES_URI,
      value: `https://yahoo.co.jp`
    })
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onPressGroup}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;