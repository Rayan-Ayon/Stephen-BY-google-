'use client';

import React from 'react';
import StudentAuthCanvas from '../../components/auth/StudentAuthCanvas';

export default function LoginPage() {
  return (
    <StudentAuthCanvas
      initialMode="login"
      onSuccess={() => {
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }
      }}
      onExit={() => {
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }
      }}
      onSwitchToInstitution={() => {
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/institution/login');
          window.location.reload();
        }
      }}
    />
  );
}
