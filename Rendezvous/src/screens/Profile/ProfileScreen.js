import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { signOut, userEmail } = useContext(AuthContext);

  const openUberLink = () => {
    Linking.openURL('https://www.uber.com/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.userName}>{userEmail || "Loading email..."}</Text>
        <View style={styles.profileImageWrapper}>
          <Image
            style={styles.profileImage}
            source={{
              uri: 'https://t3.ftcdn.net/jpg/06/24/78/30/360_F_624783008_Jw1knxdKFmi3epd522cxOgRFDTgXLNun.jpg',
            }}
          />
        </View>
      </View>


      <ScrollView
        style={styles.bottomContainer}
        contentContainerStyle={styles.bottomContent}
      >
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="time-outline" size={28} color="#4F46E5" />
            <Text style={styles.iconLabel}>Saved Dates</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="help-circle-outline" size={28} color="#4F46E5" />
            <Text style={styles.iconLabel}>Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.connectCard}>
          <Text style={styles.connectCardTitle}>Connect Uber Account</Text>
          <TouchableOpacity style={styles.connectButton} onPress={openUberLink}>
            <Text style={styles.connectButtonText}>Connect Now</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="paper-plane-outline" size={22} color="#fff" />
          <Text style={styles.shareButtonText}>Share app with friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Ionicons name="settings-outline" size={24} color="#4F46E5" />
          <Text style={styles.listItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={[styles.listItemText, { color: '#EF4444' }]}>
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFC79F',
  },
  headerContainer: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  profileImageWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 35,
  },
  iconButton: {
    alignItems: 'center',
    padding: 10,
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  connectCard: {
    backgroundColor: '#F9F5FF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  connectCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  connectButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 25,
    elevation: 3,
  },
  shareButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 15,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
});
