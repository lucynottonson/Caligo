'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';  

interface User {
  id: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, bio, avatar_url, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  const timeAgo = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diff = Math.abs(now.getTime() - createdDate.getTime());
    const days = Math.floor(diff / (1000 * 3600 * 24));

    if (days < 1) return 'Joined today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

    if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1>Friends</h1>
      <div style={styles.grid}>
        {users.map((user) => (
          <div key={user.id} style={styles.card}>
            <div style={styles.avatarWrapper}>
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={100}  
                  height={100}
                  style={{ ...styles.avatar, objectFit: 'cover' }} 
                />
              ) : (
                <div style={styles.avatarFallback}>{user.username[0]}</div>
              )}
            </div>
            <div style={styles.userInfo}>
              <h3>{user.username}</h3>
              <p>{user.bio}</p>
              <p>{timeAgo(user.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    background: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
  },
  avatarWrapper: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto',
    marginBottom: '10px',
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: '#fff',
  },
  userInfo: {
    paddingTop: '10px',
  },
};
