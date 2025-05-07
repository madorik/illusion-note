import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Layout, Text, Button, Icon, TopNavigation, TopNavigationAction, Card } from '@ui-kitten/components';
import { LineChart } from 'react-native-chart-kit';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const RecordsScreen = ({ navigation }) => {
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const chartData = {
    labels: ["20/4", "5/5", "20", "18", "18", "30"],
    datasets: [
      {
        data: [3, 2, 4, 3, 5, 4],
        color: (opacity = 1) => `rgba(141, 171, 211, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(141, 171, 211, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#8DABD3"
    }
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title='Records'
        alignment='center'
      />
      
      <View style={styles.content}>
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <Icon
              style={styles.userIcon}
              fill='#8F9BB3'
              name='person-outline'
            />
            <View>
              <Text>user@example.com</Text>
              <Text appearance='hint'>email</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text category='h6' style={styles.cardTitle}>로그인옷</Text>
        </Card>
        
        <Card style={styles.card}>
          <Text category='h6' style={styles.cardTitle}>데이터 저장하</Text>
        </Card>
        
        <Card style={styles.card}>
          <Text category='h6' style={styles.cardTitle}>주간 감정정 변화</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 60}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  card: {
    marginBottom: 16,
    padding: 8,
  },
  cardTitle: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default RecordsScreen;