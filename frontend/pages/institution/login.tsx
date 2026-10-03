import React from 'react';
import InstitutionLoginView from '../../components/auth/InstitutionLoginView';

export default function InstitutionLoginPage() {
  return (
    <InstitutionLoginView
      onSuccess={() => {
        window.history.pushState({}, '', '/org-space');
        window.location.reload();
      }}
      onSwitchToStudent={() => {
        window.history.pushState({}, '', '/');
        window.location.reload();
      }}
    />
  );
}
