import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [appLock, setAppLock] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '로그아웃',
          onPress: () => {
            // 로그아웃 처리 로직
            // 여기서는 예시로 로그인 페이지로 이동
            router.replace('/login');
          }
        }
      ]
    );
  };
  
  // 계정 탈퇴 모달
  const DeleteAccountModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>계정 탈퇴</Text>
            <Text style={styles.modalText}>
              계정을 탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다. 정말로 탈퇴하시겠습니까?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => {
                  // 탈퇴 처리 로직
                  setShowDeleteModal(false);
                  router.replace('/login');
                }}
              >
                <Text style={styles.deleteButtonText}>탈퇴하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <DeleteAccountModal />
      
      <View style={styles.header}>
        <Text style={styles.title}>설정</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* 알림 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol
                style={styles.icon}
                name="bell"
                color="#8F9BB3"
                size={24}
              />
              <Text>일반 푸시 알림</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#D9D9D9", true: "#8DABD3" }}
            />
          </View>
        </View>
        
        {/* 앱 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 설정</Text>
          
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
                name="lock"
                color="#8F9BB3"
                size={24}
              />
              <Text>앱 잠금</Text>
            </View>
            <Switch
              value={appLock}
              onValueChange={setAppLock}
              trackColor={{ false: "#D9D9D9", true: "#8DABD3" }}
            />
          </View>
        </View>
        
        {/* 계정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={handleLogout}
          >
            <View style={styles.settingInfo}>
              <IconSymbol
                style={styles.icon}
                name="rectangle.portrait.and.arrow.right"
                color="#8F9BB3"
                size={24}
              />
              <Text>로그아웃</Text>
            </View>
            <IconSymbol
              name="chevron.right"
              color="#8F9BB3"
              size={20}
            />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <View style={styles.settingInfo}>
              <IconSymbol
                style={styles.icon}
                name="trash"
                color="#E73D57"
                size={24}
              />
              <Text style={styles.dangerText}>계정 탈퇴</Text>
            </View>
            <IconSymbol
              name="chevron.right"
              color="#8F9BB3"
              size={20}
            />
          </TouchableOpacity>
        </View>
        
        {/* 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => Linking.openURL('https://example.com/privacy')}
          >
            <View style={styles.settingInfo}>
              <IconSymbol
                style={styles.icon}
                name="doc.text"
                color="#8F9BB3"
                size={24}
              />
              <Text>개인정보 처리방침</Text>
            </View>
            <IconSymbol
              name="chevron.right"
              color="#8F9BB3"
              size={20}
            />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => Linking.openURL('https://example.com/terms')}
          >
            <View style={styles.settingInfo}>
              <IconSymbol
                style={styles.icon}
                name="doc.text"
                color="#8F9BB3"
                size={24}
              />
              <Text>이용약관</Text>
            </View>
            <IconSymbol
              name="chevron.right"
              color="#8F9BB3"
              size={20}
            />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol
                style={styles.icon}
                name="info.circle"
                color="#8F9BB3"
                size={24}
              />
              <Text>버전</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 감정 일기 앱</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8DABD3',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
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
    backgroundColor: '#F5F5F5',
  },
  dangerText: {
    color: '#E73D57',
  },
  versionText: {
    color: '#8F9BB3',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#8F9BB3',
    fontSize: 12,
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2E3A59',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#2E3A59',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2E3A59',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E73D57',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 