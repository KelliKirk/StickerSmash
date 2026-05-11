import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ImageSourcePropType, View } from 'react-native';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panOriginX = useSharedValue(0);
  const panOriginY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
      }
    });

  const drag = Gesture.Pan()
    .onStart(() => {
      panOriginX.value = translateX.value;
      panOriginY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = panOriginX.value + e.translationX;
      translateY.value = panOriginY.value + e.translationY;
    });

  const composed = Gesture.Simultaneous(drag, doubleTap);

  const imageStyle = useAnimatedStyle(() => ({
    width: withSpring(scaleImage.value),
    height: withSpring(scaleImage.value),
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={{ top: -350 }}>
      <GestureDetector gesture={composed}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={imageStyle}
        />
      </GestureDetector>
    </View>
  );
}
