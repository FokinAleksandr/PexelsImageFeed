import React from 'react';
import {PhotosFeedScreen} from './screens/PhotosFeedScreen';
import {AnimatedScreenWrapper} from './screens/utils/AnimatedScreenWrapper';
import {PhotoScreen} from './screens/PhotoScreen';
import {QueriesProvider} from './api/queries';

type NavigationStateType = {
  isShown: boolean;
  photoId: number | null;
};

export function App() {
  const [navigationState, setNavigationState] =
    React.useState<NavigationStateType>({
      isShown: false,
      photoId: null,
    });

  const openScreen = (id: number) => {
    setNavigationState({
      isShown: true,
      photoId: id,
    });
  };

  const goBack = () => {
    setNavigationState(prevState => ({
      ...prevState,
      isShown: false,
    }));
  };

  return (
    <QueriesProvider>
      <AnimatedScreenWrapper isShown={true}>
        <PhotosFeedScreen navigateToPhotoScreen={openScreen} />
      </AnimatedScreenWrapper>
      <AnimatedScreenWrapper isShown={navigationState.isShown}>
        <PhotoScreen id={navigationState.photoId} onGoBack={goBack} />
      </AnimatedScreenWrapper>
    </QueriesProvider>
  );
}
