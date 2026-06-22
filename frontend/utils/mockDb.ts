export interface Tenant {
  id: string;
  email: string;
  passkey: string;
  password?: string;
  status: 'pending' | 'active';
}

const MOCK_KEY = 'stephen_mock_tenants';

const defaultTenant: Tenant = {
  id: 'org_du_72cb1a',
  email: 'admin@du.ac.bd',
  passkey: 'STPH-DHAKA-2026-X9',
  status: 'pending',
};

export function initMockDb(): void {
  const existing = localStorage.getItem(MOCK_KEY);
  if (!existing) {
    localStorage.setItem(MOCK_KEY, JSON.stringify([defaultTenant]));
  }
}

function getTenants(): Tenant[] {
  const raw = localStorage.getItem(MOCK_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTenants(tenants: Tenant[]): void {
  localStorage.setItem(MOCK_KEY, JSON.stringify(tenants));
}

export function getTenantByPasskey(passkey: string): Tenant | undefined {
  return getTenants().find(t => t.passkey === passkey);
}

export function activateTenant(passkey: string, password: string): boolean {
  const tenants = getTenants();
  const idx = tenants.findIndex(t => t.passkey === passkey && t.status === 'pending');
  if (idx === -1) return false;
  tenants[idx].password = password;
  tenants[idx].status = 'active';
  saveTenants(tenants);
  return true;
}

export function validateTenantLogin(email: string, password: string, passkey: string): boolean {
  const tenant = getTenants().find(
    t => t.email === email && t.passkey === passkey && t.status === 'active'
  );
  if (!tenant) return false;
  return tenant.password === password;
}
