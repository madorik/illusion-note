import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Toggle, Icon, Divider } from '@ui-kitten/components';

const SettingsScreen = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [dataSync, setDataSync] = React.useState(true);

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Text category='h5' style={styles.title}>설정</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon
              style={styles.icon}
              fill='#8F9BB3'
              name='bell-outline'
            />
            <Text>알림</Text>
          </View>
          <Toggle
            checked={notifications}
            onChange={setNotifications}
          />
        </View>
        
        <Divider />
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon
              style={styles.icon}
              fill='#8F9BB3'
              name='moon-outline'
            />
            <Text>다크 모드</Text>
          </View>
          <Toggle
            checked={darkMode}
            onChange={setDarkMode}
          />
        </View>
        
        <Divider />
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon
              style={styles.icon}
              fill='#8F9BB3'
              name='sync-outline'
            />
            <Text>데이터 동기화</Text>
          </View>
          <Toggle
            checked={dataSync}
            onChange={setDataSync}
          />
        </View>
        
        <Divider />
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
  title: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
});

export default SettingsScreen;