import {
  ActivityIndicator,
  Button,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import backIcon from '../icons/backIcon/backIcon.png';
import {getPhoto} from '../api/makeRequest';
import {useQuery} from '../api/queries';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
  },
  photographer: {
    marginTop: 4,
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
  },
});

type PhotoScreenProps = {
  id: null | number;
  onGoBack: () => void;
};

export function PhotoScreen(props: PhotoScreenProps) {
  const {id, onGoBack} = props;

  const {data, status, refetch} = useQuery(`photo${id}`, () => {
    if (id === null) {
      throw new Error('no id in PhotoScreen');
    }
    return getPhoto(id);
  });

  const renderContent = () => {
    if (status === 'loading') {
      return <ActivityIndicator size={'large'} />;
    }

    if (data) {
      return (
        <View>
          <Image
            style={[{aspectRatio: data.width / data.height}, styles.image]}
            source={{uri: data.src.large}}
          />
          <Text style={styles.photographer}>
            photo by <Text style={styles.textBold}>{data.photographer}</Text>
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text>Error occurred when loading photo</Text>
        <Button onPress={refetch} title={'refetch data'} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onGoBack}>
          <Image source={backIcon} />
        </Pressable>
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
}
