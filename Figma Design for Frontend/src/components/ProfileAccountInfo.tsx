import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveUserToFirestore } from '../database-firebase-postgresql';

const API_BASE = 'http://localhost:8000';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_verified: boolean;
  created_at: string;
}

export default function ProfileAccountInfo() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setProfile(data);
        setName(data.name ?? '');
        setPhone(data.phone ?? '');
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
    setSaving(true);
    setMessage(null);
    const firebaseUpdate =
      user?.id &&
      saveUserToFirestore({
        uid: user.id,
        email: user.email,
        displayName: name.trim() || user.name,
        role: 'user',
        phone: phone.trim(),
      });
    const djangoUpdate = token
      ? fetch(`${API_BASE}/api/auth/profile/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
        }).then((res) => (res.ok ? res.json() : Promise.reject()))
      : Promise.resolve(null);
    Promise.all([firebaseUpdate ?? Promise.resolve(), djangoUpdate])
      .then(([, data]) => {
        if (data) {
          setProfile(data);
          setName(data.name ?? '');
          setPhone(data.phone ?? '');
        } else if (user) {
          setName(name.trim());
          setPhone(phone.trim());
        }
        setEditing(false);
        setMessage('success');
        refreshProfile();
      })
      .catch(() => setMessage('error'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }
  if (!profile && !user) {
    return null;
  }

  const displayName = profile?.name || user?.name || '';
  const displayEmail = profile?.email || user?.email || '';

  return (
    <div className="p-6 mb-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-[#111827] mb-4">Your account</h2>
      {message === 'success' && (
        <p className="mb-3 text-sm text-green-600">Profile updated successfully.</p>
      )}
      {message === 'error' && (
        <p className="mb-3 text-sm text-red-600">Failed to update. Try again.</p>
      )}
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b4f3f] focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b4f3f] focus:border-transparent"
              placeholder="Phone number"
            />
          </div>
          <p className="text-sm text-gray-500">Email: {displayEmail} (cannot be changed here)</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#6b4f3f] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setName(profile?.name ?? ''); setPhone(profile?.phone ?? ''); setMessage(null); }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><span className="text-gray-500">Name:</span> <strong>{displayName || '—'}</strong></p>
          <p><span className="text-gray-500">Email:</span> <strong>{displayEmail || '—'}</strong></p>
          <p><span className="text-gray-500">Phone:</span> <strong>{profile?.phone || '—'}</strong></p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-3 px-4 py-2 border border-[#6b4f3f] text-[#6b4f3f] rounded-lg hover:bg-[#f7f5f3]"
          >
            Edit info
          </button>
        </div>
      )}
    </div>
  );
}
