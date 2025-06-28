import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';

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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface DoctorNotification {
  id: string;
  doctorId: string;
  doctorEmail: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  notes: string;
  status: 'unread' | 'read';
  type: 'new_appointment' | 'appointment_cancelled' | 'appointment_confirmed';
  createdAt: Timestamp;
  readAt?: Timestamp;
}

class AppointmentService {
  private appointmentsCollection = collection(db, 'appointments');
  private doctorNotificationsCollection = collection(db, 'doctor_notifications');

  /**
   * 创建新预约
   */
  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(this.appointmentsCollection, {
        ...appointment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 创建医生通知
      await this.createDoctorNotification({
        doctorId: appointment.doctorId,
        doctorEmail: appointment.doctorEmail,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes || '',
        type: 'new_appointment'
      });

      return docRef.id;
    } catch (error) {
      console.error('创建预约时出错:', error);
      throw new Error('创建预约失败');
    }
  }

  /**
   * Get all appointments for a doctor without using indexes
   */
  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    try {
      console.log('Starting getDoctorAppointments with doctorId:', doctorId);
      
      // Simple query without ordering
      const q = query(
        this.appointmentsCollection,
        where('doctorId', '==', doctorId)
      );

      console.log('Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log('Query results count:', querySnapshot.size);
      
      const appointments = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Appointment data:', data);
        return {
          id: doc.id,
          ...data
        } as Appointment;
      });

      console.log('Mapped appointments:', appointments);

      // Sort in memory
        return appointments.sort((a, b) => {
        // Convert date strings to comparable format (assuming DD/MM/YYYY format)
        const [aDay, aMonth, aYear] = a.date.split('/').map(Number);
        const [bDay, bMonth, bYear] = b.date.split('/').map(Number);
        
        // Compare dates
        if (aYear !== bYear) return bYear - aYear;
        if (aMonth !== bMonth) return bMonth - aMonth;
        if (aDay !== bDay) return bDay - aDay;
        
        // If dates are equal, compare times (assuming HH:mm format)
        const [aHour, aMinute] = a.time.split(':').map(Number);
        const [bHour, bMinute] = b.time.split(':').map(Number);
        
        if (aHour !== bHour) return aHour - bHour;
        return aMinute - bMinute;
      });
    } catch (error) {
      console.error('Error in getDoctorAppointments:', error);
      throw new Error('Failed to load appointments');
    }
  }

  /**
   * 获取患者的所有预约
   */
  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      // Simple query without ordering
      const q = query(
        this.appointmentsCollection,
        where('patientId', '==', patientId)
      );

      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));

      // Sort in memory
      return appointments.sort((a, b) => {
        // Convert date strings to comparable format (assuming DD/MM/YYYY format)
        const [aDay, aMonth, aYear] = a.date.split('/').map(Number);
        const [bDay, bMonth, bYear] = b.date.split('/').map(Number);
        
        // Compare dates
        if (aYear !== bYear) return bYear - aYear;
        if (aMonth !== bMonth) return bMonth - aMonth;
        if (aDay !== bDay) return bDay - aDay;
        
        // If dates are equal, compare times (assuming HH:mm format)
        const [aHour, aMinute] = a.time.split(':').map(Number);
        const [bHour, bMinute] = b.time.split(':').map(Number);
        
        if (aHour !== bHour) return aHour - bHour;
        return aMinute - bMinute;
      });
    } catch (error) {
      console.error('Error in getPatientAppointments:', error);
      throw new Error('Failed to load appointments');
    }
  }

  /**
   * 更新预约状态
   */
  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
    try {
      const appointmentRef = doc(this.appointmentsCollection, id);
      await updateDoc(appointmentRef, {
        status,
        updatedAt: serverTimestamp()
      });

      // 如果状态改变，创建相应的通知
      const appointment = await this.getAppointmentById(id);
      if (appointment) {
        await this.createDoctorNotification({
          doctorId: appointment.doctorId,
          doctorEmail: appointment.doctorEmail,
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          patientPhone: appointment.patientPhone,
          date: appointment.date,
          time: appointment.time,
          notes: appointment.notes || '',
          type: status === 'cancelled' ? 'appointment_cancelled' : 'appointment_confirmed'
        });
      }

      return true;
    } catch (error) {
      console.error('更新预约状态时出错:', error);
      throw new Error('更新预约状态失败');
    }
  }

  /**
   * 更新预约详情
   */
  async updateAppointment(id: string, data: Partial<Appointment>): Promise<boolean> {
    try {
      const appointmentRef = doc(this.appointmentsCollection, id);
      await updateDoc(appointmentRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('更新预约详情时出错:', error);
      throw new Error('更新预约详情失败');
    }
  }

  /**
   * 删除预约
   */
  async deleteAppointment(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.appointmentsCollection, id));
      return true;
    } catch (error) {
      console.error('删除预约时出错:', error);
      throw new Error('删除预约失败');
    }
  }

  /**
   * Get all notifications for a doctor without using indexes
   */
  async getDoctorNotifications(doctorId: string): Promise<DoctorNotification[]> {
    try {
      // Simple query without ordering
      const q = query(
        this.doctorNotificationsCollection,
        where('doctorId', '==', doctorId)
      );

      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DoctorNotification));

      // Sort in memory by createdAt timestamp
      return notifications.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error getting doctor notifications:', error);
      throw new Error('Failed to load notifications');
    }
  }

  /**
   * 标记通知为已读
   */
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const notificationRef = doc(this.doctorNotificationsCollection, notificationId);
      await updateDoc(notificationRef, {
        status: 'read',
        readAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('标记通知已读时出错:', error);
      throw new Error('标记通知已读失败');
    }
  }

  private async createDoctorNotification(data: {
    doctorId: string;
    doctorEmail: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    date: string;
    time: string;
    notes: string;
    type: DoctorNotification['type'];
  }): Promise<void> {
    try {
      await addDoc(this.doctorNotificationsCollection, {
        ...data,
        status: 'unread',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('创建医生通知时出错:', error);
      // 不抛出错误，因为这是次要功能
    }
  }

  /**
   * 获取预约详情
   */
  private async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const appointmentRef = doc(this.appointmentsCollection, id);
      const appointmentDoc = await getDoc(appointmentRef);
      if (appointmentDoc.exists()) {
        return {
          id: appointmentDoc.id,
          ...appointmentDoc.data()
        } as Appointment;
      }
      return null;
    } catch (error) {
      console.error('获取预约详情时出错:', error);
      return null;
    }
  }

  /**
   * Check if there is any appointment conflict for the given time slot
   */
  async checkAppointmentConflict(
    doctorId: string,
    date: string,
    time: string,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    try {
      // Get all appointments for the doctor on the given date
      const q = query(
        this.appointmentsCollection,
        where('doctorId', '==', doctorId),
        where('date', '==', date)
      );

      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Appointment))
        .filter(appointment => 
          // Exclude cancelled appointments and the current appointment being edited
          appointment.status !== 'cancelled' &&
          (!excludeAppointmentId || appointment.id !== excludeAppointmentId)
        );

      // Convert time strings to minutes for easier comparison
      const requestedTimeInMinutes = this.convertTimeToMinutes(time);

      // Check for conflicts with existing appointments
      return appointments.some(appointment => {
        const existingTimeInMinutes = this.convertTimeToMinutes(appointment.time);
        
        // Consider appointments within 30 minutes of each other as conflicts
        const timeDifference = Math.abs(existingTimeInMinutes - requestedTimeInMinutes);
        return timeDifference < 30;
      });
    } catch (error) {
      console.error('Error checking appointment conflict:', error);
      throw new Error('Failed to check appointment availability');
    }
  }

  /**
   * Convert time string (HH:mm AM/PM) to minutes since midnight
   */
  private convertTimeToMinutes(time: string): number {
    const [timeStr, period] = time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  }
}

export const appointmentService = new AppointmentService(); 