'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../lib';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  location: string;
  phone: string;
  experience: number;
  bio: string;
  status: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  createdAt: any;
  updatedAt: any;
}

export default function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('approved');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Doctor>>({});
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    loadDoctors();
  }, [filter]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      let q;
      
      if (filter === 'all') {
        q = collection(db, 'doctors');
      } else {
        q = query(collection(db, 'doctors'), where('status', '==', filter));
      }
      
      const snapshot = await getDocs(q);
      const doctorsList: Doctor[] = [];
      
      snapshot.forEach((doc) => {
        doctorsList.push({
          id: doc.id,
          ...doc.data()
        } as Doctor);
      });

      // Sort by name
      doctorsList.sort((a, b) => a.name.localeCompare(b.name));
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
      showAlert('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setEditForm(doctor);
    setShowEditModal(true);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const saveEditedDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      const doctorRef = doc(db, 'doctors', selectedDoctor.id);
      await updateDoc(doctorRef, {
        ...editForm,
        updatedAt: new Date()
      });

      showAlert('Doctor updated successfully!', 'success');
      setShowEditModal(false);
      loadDoctors();
    } catch (error) {
      console.error('Error updating doctor:', error);
      showAlert('Failed to update doctor', 'error');
    }
  };

  const confirmDeleteDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      await deleteDoc(doc(db, 'doctors', selectedDoctor.id));
      showAlert('Doctor deleted successfully!', 'success');
      setShowDeleteModal(false);
      loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showAlert('Failed to delete doctor', 'error');
    }
  };

  const changeStatus = async (doctorId: string, newStatus: string) => {
    try {
      const doctorRef = doc(db, 'doctors', doctorId);
      await updateDoc(doctorRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      showAlert(`Doctor status changed to ${newStatus}!`, 'success');
      loadDoctors();
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('Failed to update status', 'error');
    }
  };

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">👨‍⚕️ Doctors Management</h1>
          <a 
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            ← Back to Dashboard
          </a>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ✅ Approved ({doctors.filter(d => d.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ❌ Rejected ({doctors.filter(d => d.status === 'rejected').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 All ({doctors.length})
            </button>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`mb-6 p-4 rounded-lg ${
          alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {alert.message}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        /* Doctors Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Dr. {doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.status === 'approved' ? 'bg-green-100 text-green-800' :
                    doctor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctor.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-medium">📧 Email:</span> {doctor.email}</p>
                  <p className="text-sm"><span className="font-medium">📱 Phone:</span> {doctor.phone || 'Not provided'}</p>
                  <p className="text-sm"><span className="font-medium">📍 Location:</span> {doctor.location}</p>
                  <p className="text-sm"><span className="font-medium">⏱️ Experience:</span> {doctor.experience} years</p>
                  <p className="text-sm"><span className="font-medium">💰 Fee:</span> Rs. {doctor.consultationFee}</p>
                  <p className="text-sm"><span className="font-medium">⭐ Rating:</span> {doctor.rating}/5 ({doctor.reviewCount} reviews)</p>
                </div>

                {doctor.bio && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{doctor.bio}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditDoctor(doctor)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    ✏️ Edit
                  </button>
                  
                  {doctor.status === 'approved' && (
                    <button
                      onClick={() => changeStatus(doctor.id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      ❌ Reject
                    </button>
                  )}
                  
                  {doctor.status === 'rejected' && (
                    <button
                      onClick={() => changeStatus(doctor.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      ✅ Approve
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteDoctor(doctor)}
                    className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded text-sm transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDoctors.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">✏️ Edit Doctor: {selectedDoctor.name}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={editForm.specialization || ''}
                    onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={editForm.experience || 0}
                      onChange={(e) => setEditForm({...editForm, experience: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                    <input
                      type="number"
                      value={editForm.consultationFee || 0}
                      onChange={(e) => setEditForm({...editForm, consultationFee: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedDoctor}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-red-600 mb-4">🗑️ Delete Doctor</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete <strong>Dr. {selectedDoctor.name}</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteDoctor}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                >
                  🗑️ Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}