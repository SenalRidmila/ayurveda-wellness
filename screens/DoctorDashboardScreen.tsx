import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../firebaseConfig';
import { appointmentService, Appointment, DoctorNotification } from '../models/AppointmentModel';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

type RootStackParamList = {
  Login: undefined;
  DoctorDashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DoctorDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'appointments' | 'notifications'>('appointments');
  const user = auth.currentUser;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not logged in');
      }

      // Get the user's data from Firestore to get the doctorId
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      const doctorId = userData?.doctorId;

      if (!doctorId) {
        throw new Error('Doctor ID not found');
      }

      console.log('Current user ID:', user.uid);
      console.log('Doctor ID:', doctorId);
      
      const [appointmentsData, notificationsData] = await Promise.all([
        appointmentService.getDoctorAppointments(doctorId),
        appointmentService.getDoctorNotifications(doctorId)
      ]);

      console.log('Fetched appointments:', appointmentsData);
      console.log('Fetched notifications:', notificationsData);

      setAppointments(appointmentsData);
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  }, [loadData]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status);
      setAppointments(prev =>
        prev.map(a => a.id === appointmentId ? { ...a, status } : a)
      );
      Alert.alert('Success', 'Appointment status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update appointment status');
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#3b82f6';
      default: return '#666666';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => (
                  <View key={appointment.id} style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <Text style={styles.patientName}>{appointment.patientName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentDetails}>
                      <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
                        <Text style={styles.detailText}>{appointment.date}</Text>
                      </View>
                      <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#666" />
                        <Text style={styles.detailText}>{appointment.time}</Text>
                      </View>
                      <View style={styles.detailRow}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.detailText}>{appointment.patientPhone}</Text>
                      </View>
                      {appointment.notes && (
                        <View style={styles.detailRow}>
            <Ionicons name="document-text" size={16} color="#666" />
                          <Text style={styles.detailText}>{appointment.notes}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.appointmentActions}>
        {appointment.status === 'pending' && (
                      <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => updateAppointmentStatus(appointment.id!, 'confirmed')}
          >
            <Text style={styles.actionButtonText}>Confirm</Text>
                      </TouchableOpacity>
        )}
        
        {appointment.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => updateAppointmentStatus(appointment.id!, 'completed')}
          >
            <Text style={styles.actionButtonText}>Complete</Text>
              </TouchableOpacity>
        )}
        
        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => updateAppointmentStatus(appointment.id!, 'cancelled')}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
            )}
          </View>
        </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="calendar-outline" size={64} color="#666" />
      <Text style={styles.emptyStateText}>No Appointments</Text>
      <Text style={styles.emptyStateSubText}>New appointments will appear here</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadData}>
        <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4a90e2" />
      <Text style={styles.loadingText}>Loading...</Text>
              </View>
  );

  const renderContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    if (!appointments.length) return renderEmptyState();

    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.content}
      >
        {appointments.map(renderAppointmentCard)}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctor Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4a90e2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  confirmButton: {
    backgroundColor: '#10b981',
  },
  completeButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default DoctorDashboardScreen; 