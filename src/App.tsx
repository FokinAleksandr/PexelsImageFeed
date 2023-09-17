import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {makeRequest} from './api/makeRequest';
import {CuratedPhotosResponseType, PhotoType} from './types/curated';

const SCREEN_HORIZONTAL_MARGIN = 12;
const GAP_BETWEEN_IMAGE_SNIPPETS = 12;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    marginHorizontal: SCREEN_HORIZONTAL_MARGIN,
    marginTop: 48,
  },
  flexGrow: {
    flex: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  gapStyle: {
    gap: GAP_BETWEEN_IMAGE_SNIPPETS,
  },
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  imageSnippet: {
    borderRadius: 24,
    aspectRatio: 1,
  },
});

export function App() {
  const [state, setState] = React.useState<PhotoType[]>([]);
  const window = useWindowDimensions();

  const imageSnippetWidth =
    (window.width -
      2 * SCREEN_HORIZONTAL_MARGIN -
      2 * GAP_BETWEEN_IMAGE_SNIPPETS) /
    3;

  React.useEffect(() => {
    makeRequest<CuratedPhotosResponseType>('/curated?page=2&per_page=40')
      .then(res => setState(res.photos))
      .catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <FlatList
        style={styles.flexGrow}
        contentContainerStyle={styles.gapStyle}
        columnWrapperStyle={{gap: GAP_BETWEEN_IMAGE_SNIPPETS}}
        keyExtractor={item => String(item.id)}
        data={state}
        numColumns={3}
        renderItem={({item}) => (
          <View
            style={[
              styles.flexShrink,
              {
                width: imageSnippetWidth,
              },
            ]}>
            <Image
              style={[
                styles.imageSnippet,
                {
                  width: imageSnippetWidth,
                },
              ]}
              source={{uri: item.src.medium}}
            />
            <Text style={styles.textCenter}>
              photo by <Text style={styles.textBold}>{item.photographer}</Text>
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
