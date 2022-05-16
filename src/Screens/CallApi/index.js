import { StyleSheet, Text, View , SafeAreaView,
    Animated,  Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity} from 'react-native'
import React,{ useState,useEffect } from 'react'
const Height_IMG=100;
const iPadding=10;
const ibottom=20;
const ITEM_SIZE=Height_IMG+ iPadding*2+ibottom;

export default function CallApi() {
    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(true);
    const scollY=React.useRef(new Animated.Value(0)).current;
    useEffect(() => {
        getListPhotos();
        return () => {};
      }, []);

  
      getListPhotos = () => {
        const api = "https://62810fe71020d8520584fe66.mockapi.io/Title";
        fetch(api)
          .then((res) => res.json())
          .then((resJson) => setdata(resJson))
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setloading(false));
      };

      
  renderItem = ({index, item}) => {
    const scale=scollY.interpolate({
      inputRange:[
        -1,0,
        ITEM_SIZE*index,
        ITEM_SIZE*(index+2)
      ],
      outputRange:[1,1,1,0]
    });
   
    
    return (
        <TouchableOpacity>
      <Animated.View style={[styles.item,
      {transform:[{scale}],
    }
      ]}>
        <Image
          style={styles.img}
          source={{
            uri: item.avatar
          }}
        />
        <View style={styles.Text}>
          <Text style={styles.iText}>{index + ". " + item.name}</Text>
          <Text style={styles.iTitle}>{ item.title}</Text>
        </View>
      </Animated.View>
      </TouchableOpacity>
    );
  };


  return (
     <SafeAreaView style={styles.container}>
     <Image
     style={StyleSheet.absoluteFillObject}
     blurRadius={70}
     />
     
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Animated.FlatList
          data={data}
          renderItem={renderItem}
          onScroll={Animated.event(
            [{nativeEvent:{contentOffset:{y:scollY}}}],
            {useNativeDriver:true}
          )}
          keyExtractor={(item) => `key-${item.id}`}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical:50
      },
      img: {
        width: Height_IMG,
        height: 100,
      },
      Text: {
        flex: 1,
        marginLeft: 20,
        justifyContent: "center",
      },
      iText: {
        fontSize: 18,
        color:'red'
      },
      iTitle:{
          fontSize:24,
          color:'#000'
      },
      item: {
        flexDirection: "row",
        marginBottom: ibottom,
        borderWidth:2,
        borderRadius: 10,
        borderColor:'blue',
        backgroundColor: "#fff",
        shadowColor:"blue",
        shadowOpacity: .3,
        shadowRadius: 20,
        padding: iPadding,
        marginHorizontal:15,
        shadowOffset: {
          width: 0,
          height: 10,
        }
      },
})