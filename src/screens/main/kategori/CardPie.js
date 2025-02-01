const { View, Text } = require("react-native");
import PieChart from 'react-native-pie-chart'

CardPie = ({data}) => {
  return (
    <View className="">
      <PieChart widthAndHeight={225} series={data} cover={0.45} />
    </View>
  );
};

export default CardPie;