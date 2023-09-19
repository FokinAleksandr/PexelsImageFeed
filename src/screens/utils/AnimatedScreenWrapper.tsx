import React from 'react';
import {Animated, Dimensions, StyleSheet} from 'react-native';

export function AnimatedScreenWrapper(props: {
  isShown: boolean;
  children: React.ReactNode;
}) {
  const {isShown, children} = props;
  const [isScreenRendered, setIsScreenRendered] = React.useState(isShown);
  const animatedValue = React.useRef(new Animated.Value(0));

  const animate = (toValue: number, cb?: () => void) => {
    Animated.timing(animatedValue.current, {
      duration: 200,
      toValue,
      useNativeDriver: true,
    }).start(cb);
  };

  React.useEffect(() => {
    if (isShown) {
      setIsScreenRendered(true);
    } else {
      animate(0, () => setIsScreenRendered(false));
    }
  }, [isShown]);

  React.useEffect(() => {
    if (isScreenRendered) {
      animate(1);
    }
  }, [isScreenRendered]);

  if (!isScreenRendered) {
    return null;
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 1,
          transform: [
            {
              translateX: animatedValue.current.interpolate({
                inputRange: [0, 1],
                outputRange: [Dimensions.get('window').width, 0],
              }),
            },
          ],
        },
      ]}>
      {children}
    </Animated.View>
  );
}
