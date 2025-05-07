import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [dataSync, setDataSync] = React.useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>설정</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <IconSymbol
              style={styles.icon}
              name="bell"
              color="#8F9BB3"
              size={24}
            />
            <Text>알림</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#D9D9D9", true: "#8DABD3" }}
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <IconSymbol
              style={styles.icon}
              name="moon"
              color="#8F9BB3"
              size={24}
            />
            <Text>다크 모드</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#D9D9D9", true: "#8DABD3" }}
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <IconSymbol
              style={styles.icon}
              name="arrow.clockwise"
              color="#8F9BB3"
              size={24}
            />
            <Text>데이터 동기화</Text>
          </View>
          <Switch
            value={dataSync}
            onValueChange={setDataSync}
            trackColor={{ false: "#D9D9D9", true: "#8DABD3" }}
          />
        </View>
        
        <View style={styles.divider} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    marginRight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
}); 