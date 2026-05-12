import type { RefObject } from 'react';
import { Alert, Platform, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import domtoimage from 'dom-to-image';

/**
 * Saves the composed image to the device photo library (gallery).
 * Web: captures with dom-to-image and triggers a download (or a helper tab if pop-ups are used).
 * Expo Go on Android cannot use MediaLibrary — a dev build is required there.
 */
export async function saveComposedImageAsync(imageRef: RefObject<View | null>): Promise<void> {
  if (Platform.OS === 'web') {
    await saveComposedImageWeb(imageRef);
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

async function saveComposedImageWeb(imageRef: RefObject<View | null>): Promise<void> {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  const node = imageRef.current;
  if (!node) {
    Alert.alert('Could not save', 'Nothing to capture yet.');
    return;
  }

  // Open synchronously on the Save click so the browser still treats this as a user gesture
  // after the async PNG capture (needed for downloads / helper tab in strict browsers).
  const popup = window.open('about:blank', '_blank');

  try {
    const dataUrl = await domtoimage.toPng(node as unknown as HTMLElement);

    if (popup && !popup.closed) {
      popup.document.open();
      popup.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>StickerSmash</title></head>
<body style="margin:0;background:#25292e;color:#eee;font-family:system-ui,sans-serif;text-align:center;padding:24px;">
<p style="max-width:420px;margin:0 auto 16px">If your download did not start automatically, use the button below or right‑click the image and choose <strong>Save image as</strong>.</p>
<img src="${dataUrl}" width="320" height="440" alt="Your sticker" style="border-radius:8px;max-width:100%;height:auto;display:block;margin:0 auto"/>
<p style="margin-top:16px"><a id="dl" download="stickersmash.png" href="${dataUrl}" style="color:#ffd33d;font-weight:600">Download stickersmash.png</a></p>
<script>
(function(){
  var a = document.getElementById('dl');
  if (a) { a.click(); }
})();
</script>
</body></html>`);
      popup.document.close();
      return;
    }

    const link = document.createElement('a');
    link.download = 'stickersmash.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Alert.alert(
      'Saved or blocked',
      'If no file appeared, allow pop-ups for this site and tap Save again so we can open a small helper tab for the download.',
    );
  } catch (e) {
    popup?.close();
    console.error(e);
    Alert.alert(
      'Could not save',
      'Something went wrong (for example a browser security limit on images). Try another photo or browser.',
    );
  }
}
