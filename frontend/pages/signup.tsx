import React from 'react';
import StudentAuthCanvas from '../components/auth/StudentAuthCanvas';

export default function SignUpPage() {
  return (
    <StudentAuthCanvas
      initialMode="signup"
      onSuccess={() => {
        window.history.pushState({}, '', '/');
        window.location.reload();
      }}
      onExit={() => {
        window.history.pushState({}, '', '/');
        window.location.reload();
      }}
      onSwitchToInstitution={() => {
        window.history.pushState({}, '', '/institution/login');
        window.location.reload();
      }}
    />
  );
}
