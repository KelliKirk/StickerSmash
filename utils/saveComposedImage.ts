import type { RefObject } from 'react';
import { Alert, Platform, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';

/**
 * Saves the composed image to the device photo library (gallery).
 * Expo Go on Android cannot use MediaLibrary — a dev build is required there.
 */
export async function saveComposedImageAsync(imageRef: RefObject<View | null>): Promise<void> {
  if (Platform.OS === 'web') {
    Alert.alert('Not available', 'Saving is not supported on web.');
    return;
  }

  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  if (isExpoGo && Platform.OS === 'android') {
    Alert.alert(
      'Use your own app build',
      'Expo Go on Android cannot save to the gallery. Run npm run android:build once to install this app on your phone, then use npm run start:dev and open that app (not Expo Go). Save will write to your gallery.',
    );
    return;
  }

  try {
    const localUri = await captureRef(imageRef, {
      format: 'png',
      quality: 1,
      width: 320,
      height: 440,
    });

    const { status } = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access so we can save your image.');
      return;
    }
    await MediaLibrary.saveToLibraryAsync(localUri);
    Alert.alert('Saved', 'Your image was saved to the photo library.');
  } catch (e) {
    console.error(e);
    Alert.alert('Could not save', 'Something went wrong. Please try again.');
  }
}
