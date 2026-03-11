'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib';
import { sendDoctorApprovalEmail } from '../../lib/services';

interface PendingDoctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  location: string;
  experience: number;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export default function DoctorApproval() {
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<PendingDoctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [customMessage, setCustomMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const doctorsRef = collection(db, 'doctors');
      const snapshot = await getDocs(doctorsRef);
      
      const doctors: PendingDoctor[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        doctors.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          specialization: data.specialization,
          location: data.location,
          experience: data.experience || 0,
          phone: data.phone,
          status: data.status || 'pending',
          createdAt: data.createdAt,
        });
      });
      
      const pending = doctors.filter(doctor => doctor.status === 'pending');
      setPendingDoctors(pending);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setAlert({ type: 'error', message: 'Failed to fetch doctor applications' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (doctor: PendingDoctor, action: 'approve' | 'reject') => {
    setSelectedDoctor(doctor);
    setActionType(action);
    setCustomMessage('');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedDoctor) return;

    try {
      setProcessing(true);
      
      const doctorRef = doc(db, 'doctors', selectedDoctor.id);
      await updateDoc(doctorRef, {
        status: actionType === 'approve' ? 'approved' : 'rejected',
        updatedAt: new Date(),
      });

      const emailSent = await sendDoctorApprovalEmail({
        doctorName: selectedDoctor.name,
        doctorEmail: selectedDoctor.email,
        status: actionType === 'approve' ? 'approved' : 'rejected',
        message: customMessage,
      });

      setAlert({
        type: 'success',
        message: `Doctor ${actionType === 'approve' ? 'approved' : 'rejected'} ${emailSent ? 'and email sent' : 'but email failed'} successfully!`,
      });

      fetchPendingDoctors();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      setAlert({ type: 'error', message: 'Failed to update doctor status' });
    } finally {
      setProcessing(false);
      setShowModal(false);
      setSelectedDoctor(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-green-700 text-white p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Doctor Approval Management</h1>
          <a 
            href="/"
            className="bg-transparent border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-green-700 transition duration-200"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`p-4 rounded-lg mb-6 ${alert.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
          <div className="flex justify-between items-center">
            <span>{alert.message}</span>
            <button 
              onClick={() => setAlert(null)}
              className="ml-4 text-xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Pending Doctor Approvals ({pendingDoctors.length})</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingDoctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No pending doctor applications
                  </td>
                </tr>
              ) : (
                pendingDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.experience} years</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleAction(doctor, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleAction(doctor, 'reject')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        ✗ Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">
              📧 Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'} & Send Email
            </h3>
            
            <p className="mb-4">Are you sure you want to {actionType} Dr. {selectedDoctor?.name}?</p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Email that will be sent:</h4>
              <div className="bg-gray-100 p-3 rounded mb-4">
                <strong>Subject:</strong> Doctor Registration {actionType === 'approve' ? 'Approved' : 'Status'} - Ayurveda Wellness
              </div>
              
              <label className="block text-sm font-medium mb-2">
                Custom Message (Optional):
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={`Default ${actionType} message will be sent if left blank`}
                className="w-full h-24 p-3 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={processing}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={processing}
                className={`px-4 py-2 text-white rounded disabled:opacity-50 ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Processing...' : `${actionType === 'approve' ? 'Approve' : 'Reject'} & Send Email`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
