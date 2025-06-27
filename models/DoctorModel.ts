import { db } from '../firebaseConfig';
import firebase from 'firebase/compat/app';

export interface Doctor {
  id?: string;
  name: string;
  specialization: string;
  location: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  experience?: number;
  languages?: string[];
  rating?: number;
  reviewCount?: number;
  availability?: {
    [day: string]: {
      start: string;
      end: string;
    }[];
  };
  consultationFee?: number;
}

class DoctorService {
  private collection = db.collection('doctors');

  /**
   * Get all doctors
   */
  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Doctor));
    } catch (error) {
      console.error('Error getting doctors:', error);
      return [];
    }
  }

  /**
   * Get doctor by ID
   */
  async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      return {
        id: doc.id,
        ...doc.data()
      } as Doctor;
    } catch (error) {
      console.error('Error getting doctor:', error);
      return null;
    }
  }

  /**
   * Add a new doctor
   */
  async addDoctor(doctor: Doctor): Promise<string | null> {
    try {
      const docRef = await this.collection.add({
        ...doctor,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding doctor:', error);
      return null;
    }
  }

  /**
   * Update an existing doctor
   */
  async updateDoctor(id: string, data: Partial<Doctor>): Promise<boolean> {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating doctor:', error);
      return false;
    }
  }

  /**
   * Delete a doctor
   */
  async deleteDoctor(id: string): Promise<boolean> {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      return false;
    }
  }

  /**
   * Search doctors by specialization
   */
  async searchDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    try {
      const snapshot = await this.collection
        .where('specialization', '==', specialization)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Doctor));
    } catch (error) {
      console.error('Error searching doctors:', error);
      return [];
    }
  }
}

export const doctorService = new DoctorService(); 