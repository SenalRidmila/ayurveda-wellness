import { db } from '../firebaseConfig';
import firebase from 'firebase/compat/app';

export interface Appointment {
  id?: string;
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
  createdAt?: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
}

class AppointmentService {
  private collection = db.collection('appointments');

  /**
   * Create a new appointment
   */
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await this.collection.add({
        ...appointment,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      return null;
    }
  }

  /**
   * Get all appointments for a patient
   */
  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      const snapshot = await this.collection
        .where('patientId', '==', patientId)
        .orderBy('date', 'desc')
        .orderBy('time', 'asc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      return [];
    }
  }

  /**
   * Get all appointments for a doctor
   */
  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    try {
      const snapshot = await this.collection
        .where('doctorId', '==', doctorId)
        .orderBy('date', 'desc')
        .orderBy('time', 'asc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));
    } catch (error) {
      console.error('Error getting doctor appointments:', error);
      return [];
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      
      return {
        id: doc.id,
        ...doc.data()
      } as Appointment;
    } catch (error) {
      console.error('Error getting appointment:', error);
      return null;
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
    try {
      await this.collection.doc(id).update({
        status,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      return false;
    }
  }

  /**
   * Update appointment details
   */
  async updateAppointment(id: string, data: Partial<Appointment>): Promise<boolean> {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating appointment:', error);
      return false;
    }
  }

  /**
   * Delete appointment
   */
  async deleteAppointment(id: string): Promise<boolean> {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }
  }
}

export const appointmentService = new AppointmentService(); 