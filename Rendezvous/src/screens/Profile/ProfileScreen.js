import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import styles from './ProfileStyle';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { signOut, userEmail, userName, userPhone } = useContext(AuthContext);

  const openUberLink = () => {
    Linking.openURL('https://www.uber.com/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileCard}>
        <Image
          style={styles.profileImage}
          source={{
            uri: 'https://t3.ftcdn.net/jpg/06/24/78/30/360_F_624783008_Jw1knxdKFmi3epd522cxOgRFDTgXLNun.jpg',
          }}
        />
        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name: </Text>
            <Text style={styles.infoValue}>{userName || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email: </Text>
            <Text style={styles.infoValue}>{userEmail || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone: </Text>
            <Text style={styles.infoValue}>{userPhone || "N/A"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="time-outline" size={22} color="#6A0DAD" />
          </View>
          <Text style={styles.menuItemText}>Saved Dates</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="help-circle-outline" size={22} color="#6A0DAD" />
          </View>
          <Text style={styles.menuItemText}>Help</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#999" />
        </TouchableOpacity>

        <View style={[styles.menuItem, styles.uberCard]}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="car-outline" size={22} color="#6A0DAD" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.uberTitle}>Connect Uber Account</Text>
            <TouchableOpacity style={styles.connectButton} onPress={openUberLink}>
              <Text style={styles.connectButtonText}>Connect Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="paper-plane-outline" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Share app with friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="settings-outline" size={22} color="#6A0DAD" />
          </View>
          <Text style={styles.menuItemText}>Settings</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={signOut}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          </View>
          <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
