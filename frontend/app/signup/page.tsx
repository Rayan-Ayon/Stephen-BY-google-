'use client';

import React from 'react';
import StudentAuthCanvas from '../../components/auth/StudentAuthCanvas';

export default function SignUpPage() {
  return (
    <StudentAuthCanvas
      initialMode="signup"
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
