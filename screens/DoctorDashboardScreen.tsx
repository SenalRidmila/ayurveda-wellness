import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  FlatList
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth, db } from '../firebaseConfig';
import { Doctor, doctorService } from '../models/DoctorModel';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Home: undefined;
  AISymptomChecker: undefined;
  Doctors: undefined;
  KeyFeatures: undefined;
  Remedies: undefined;
  HealthInfo: undefined;
  DoctorLogin: undefined;
  DoctorRegister: undefined;
  DoctorDashboard: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

// Define the appointment type
interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: any;
  updatedAt?: any;
}

const specializations = [
  'Ayurvedic Physician',
  'Panchakarma Specialist',
  'Marma Therapy Expert',
  'Herbal Medicine Specialist',
  'Nadi Pariksha Expert',
  'Ayurvedic Nutritionist',
  'Ayurvedic Dermatologist',
  'Yoga Therapist',
  'Ayurvedic Gynecologist',
  'Ayurvedic Pediatrician'
];

const CustomSafeAreaView = Platform.OS === 'web' ? View : SafeAreaView;

const DoctorDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState<Doctor | null>(null);
  const [showSpecializationOptions, setShowSpecializationOptions] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDoctorData();
    loadAppointments();
  }, []);

  useEffect(() => {
    // Filter appointments when appointments or filter changes
    filterAppointments(activeFilter);
  }, [appointments, activeFilter]);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'Not logged in');
        navigation.navigate('DoctorLogin');
        return;
      }

      // Get user data to find doctorId
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data();
      
      if (!userData || !userData.doctorId) {
        Alert.alert('Error', 'Doctor profile not found');
        return;
      }

      // Get doctor data using doctorId
      const doctorData = await doctorService.getDoctorById(userData.doctorId);
      if (doctorData) {
        setDoctor(doctorData);
        setEditedDoctor(doctorData);
      } else {
        Alert.alert('Error', 'Doctor profile not found');
      }
    } catch (error) {
      console.error('Error loading doctor data:', error);
      Alert.alert('Error', 'Failed to load doctor data');
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    setRefreshing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setRefreshing(false);
        return;
      }

      // Get user data to find doctorId
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data();
      
      if (!userData || !userData.doctorId) {
        setRefreshing(false);
        return;
      }

      // Get appointments for this doctor
      // Removed the orderBy to avoid requiring a composite index
      const appointmentsSnapshot = await db.collection('appointments')
        .where('doctorId', '==', userData.doctorId)
        .get();
      
      const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      // Sort the appointments by date client-side instead
      appointmentsData.sort((a, b) => {
        // Convert string dates to Date objects for comparison if needed
        const dateA = a.date;
        const dateB = b.date;
        
        // Sort in descending order (newest first)
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        
        // If dates are equal, sort by time
        const timeA = a.time;
        const timeB = b.time;
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;
        
        return 0;
      });
      
      setAppointments(appointmentsData);
      filterAppointments(activeFilter, appointmentsData);
    } catch (error) {
      console.error('Error loading appointments:', error);
      Alert.alert('Error', 'Failed to load appointments. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const filterAppointments = (filter: string, appointmentsData = appointments) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredAppointments(appointmentsData);
      return;
    }
    
    const filtered = appointmentsData.filter(appointment => appointment.status === filter);
    setFilteredAppointments(filtered);
  };

  const handleSaveChanges = async () => {
    if (!editedDoctor || !editedDoctor.id) return;
    
    setLoading(true);
    try {
      await doctorService.updateDoctor(editedDoctor.id, editedDoctor);
      setDoctor(editedDoctor);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating doctor:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!doctor || !doctor.id) return;
    
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Delete doctor profile
      await doctorService.deleteDoctor(doctor.id);
      
      // Delete user account
      await db.collection('users').doc(currentUser.uid).delete();
      await currentUser.delete();
      
      Alert.alert('Success', 'Account deleted successfully');
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const renderSpecializationDropdown = () => {
    if (!editedDoctor) return null;
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setShowSpecializationOptions(!showSpecializationOptions)}
        >
          <Text style={styles.dropdownText}>
            {editedDoctor.specialization || 'Select Specialization'}
          </Text>
          <Ionicons
            name={showSpecializationOptions ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {showSpecializationOptions && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
              {specializations.map((spec, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setEditedDoctor({...editedDoctor, specialization: spec});
                    setShowSpecializationOptions(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{spec}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderAppointmentItem = (appointment: Appointment) => {
    const statusColor = {
      pending: '#F59E0B',
      confirmed: '#10B981',
      cancelled: '#EF4444',
      completed: '#6366F1'
    };
    
    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.appointmentDate}>
            {appointment.date} at {appointment.time}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: statusColor[appointment.status as keyof typeof statusColor] || '#F59E0B' }
          ]}>
            <Text style={styles.statusText}>{appointment.status}</Text>
          </View>
        </View>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={18} color="#2E8B57" />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Patient: </Text>
              {appointment.patientName}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="mail" size={18} color="#2E8B57" />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Email: </Text>
              {appointment.patientEmail}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="call" size={18} color="#2E8B57" />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Phone: </Text>
              {appointment.patientPhone}
            </Text>
          </View>
          
          {appointment.notes && (
            <View style={styles.detailRow}>
              <Ionicons name="document-text" size={18} color="#2E8B57" />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Notes: </Text>
                {appointment.notes}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.appointmentActions}>
          {appointment.status === 'pending' && (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.confirmButton]}
                onPress={() => updateAppointmentStatus(appointment.id, 'confirmed')}
              >
                <Text style={styles.actionButtonText}>Confirm</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => updateAppointmentStatus(appointment.id, 'cancelled')}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          
          {appointment.status === 'confirmed' && (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => updateAppointmentStatus(appointment.id, 'completed')}
              >
                <Text style={styles.actionButtonText}>Mark Complete</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => updateAppointmentStatus(appointment.id, 'cancelled')}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          
          {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => Alert.alert('Coming Soon', 'Reschedule functionality will be available soon.')}
            >
              <Text style={styles.actionButtonText}>Reschedule</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await db.collection('appointments').doc(appointmentId).update({
        status,
        updatedAt: new Date()
      });
      
      // Refresh appointments
      loadAppointments();
      
      Alert.alert('Success', `Appointment ${status} successfully`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      Alert.alert('Error', 'Failed to update appointment status');
    }
  };

  if (loading) {
    return (
      <CustomSafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.loadingText}>Loading...</Text>
      </CustomSafeAreaView>
    );
  }

  return (
    <CustomSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctor Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#2E8B57" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {doctor ? (
          <>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                  <Text style={styles.specialization}>{doctor.specialization}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditing(true)}
                >
                  <Ionicons name="pencil" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={18} color="#2E8B57" />
                <Text style={styles.infoText}>{doctor.email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color="#2E8B57" />
                <Text style={styles.infoText}>{doctor.phone}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#2E8B57" />
                <Text style={styles.infoText}>{doctor.location}</Text>
              </View>
            </View>

            <View style={styles.appointmentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Appointments</Text>
                <TouchableOpacity onPress={loadAppointments} disabled={refreshing}>
                  {refreshing ? (
                    <ActivityIndicator size="small" color="#2E8B57" />
                  ) : (
                    <Ionicons name="refresh" size={20} color="#2E8B57" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      activeFilter === 'all' && styles.activeFilterButton
                    ]}
                    onPress={() => filterAppointments('all')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      activeFilter === 'all' && styles.activeFilterText
                    ]}>All</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      activeFilter === 'pending' && styles.activeFilterButton
                    ]}
                    onPress={() => filterAppointments('pending')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      activeFilter === 'pending' && styles.activeFilterText
                    ]}>Pending</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      activeFilter === 'confirmed' && styles.activeFilterButton
                    ]}
                    onPress={() => filterAppointments('confirmed')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      activeFilter === 'confirmed' && styles.activeFilterText
                    ]}>Confirmed</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      activeFilter === 'completed' && styles.activeFilterButton
                    ]}
                    onPress={() => filterAppointments('completed')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      activeFilter === 'completed' && styles.activeFilterText
                    ]}>Completed</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      activeFilter === 'cancelled' && styles.activeFilterButton
                    ]}
                    onPress={() => filterAppointments('cancelled')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      activeFilter === 'cancelled' && styles.activeFilterText
                    ]}>Cancelled</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appointment => renderAppointmentItem(appointment))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="calendar" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>
                    {activeFilter === 'all' 
                      ? 'No appointments yet' 
                      : `No ${activeFilter} appointments`}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.deleteAccountButton}
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.errorState}>
            <Text style={styles.errorText}>Failed to load doctor profile</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadDoctorData}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editing}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedDoctor?.name}
                onChangeText={(text) => setEditedDoctor(prev => prev ? {...prev, name: text} : null)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Specialization</Text>
              {renderSpecializationDropdown()}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={editedDoctor?.location}
                onChangeText={(text) => setEditedDoctor(prev => prev ? {...prev, location: text} : null)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editedDoctor?.phone}
                onChangeText={(text) => setEditedDoctor(prev => prev ? {...prev, phone: text} : null)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Experience (Years)</Text>
              <TextInput
                style={styles.input}
                value={String(editedDoctor?.experience || '')}
                onChangeText={(text) => {
                  const exp = parseInt(text) || 0;
                  setEditedDoctor(prev => prev ? {...prev, experience: exp} : null);
                }}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedDoctor?.bio}
                onChangeText={(text) => setEditedDoctor(prev => prev ? {...prev, bio: text} : null)}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Consultation Fee (LKR)</Text>
              <TextInput
                style={styles.input}
                value={String(editedDoctor?.consultationFee || '')}
                onChangeText={(text) => {
                  const fee = parseInt(text) || 0;
                  setEditedDoctor(prev => prev ? {...prev, consultationFee: fee} : null);
                }}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditing(false);
                  setEditedDoctor(doctor);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_500Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  specialization: {
    fontSize: 14,
    color: '#2E8B57',
    marginTop: 4,
    fontFamily: 'Poppins_500Medium',
  },
  editButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 8,
    padding: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    fontFamily: 'Poppins_400Regular',
  },
  appointmentSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#2E8B57',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Poppins_500Medium',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
    fontFamily: 'Poppins_500Medium',
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
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontFamily: 'Poppins_400Regular',
  },
  detailLabel: {
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  completeButton: {
    backgroundColor: '#6366F1',
  },
  rescheduleButton: {
    backgroundColor: '#8B5CF6',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    fontFamily: 'Poppins_400Regular',
  },
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular',
  },
  retryButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  deleteAccountButton: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  deleteAccountText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  modalCancelText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  modalDeleteButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default DoctorDashboardScreen; 