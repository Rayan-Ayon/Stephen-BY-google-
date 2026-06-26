export interface Tenant {
  id: string;
  email: string;
  passkey: string;
  password?: string;
  status: 'pending' | 'active';
}

export interface Space {
  id: string;
  title: string;
  isInstitutional?: boolean;
  institutionName?: string;
  logoColor?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  fileSize: string;
  status: 'processing' | 'ready';
  currentStep: 'idle' | 'parsing' | 'vectorizing' | 'synthesizing' | 'complete';
  audioUrl?: string;
  flashcardCount: number;
  timestamp: string;
}

export interface PartnershipRequest {
  id: string;
  name: string;
  email: string;
  orgName: string;
  phone: string;
  status: 'pending' | 'approved';
}

const MOCK_KEY = 'stephen_mock_tenants';
const PARTNERSHIP_KEY = 'stephen_partnership_requests';
const LIBRARY_KEY = 'stephen_mock_library';
const SPACES_KEY = 'stephen_mock_spaces';

const defaultTenant: Tenant = {
  id: 'org_du_72cb1a',
  email: 'admin@du.ac.bd',
  passkey: 'STPH-DHAKA-2026-X9',
  status: 'pending',
};

const defaultInstitutionalSpace: Space = {
  id: 'space_buet_001',
  title: 'BUET Portal',
  isInstitutional: true,
  institutionName: 'BUET',
  logoColor: 'emerald',
};

const defaultLibraryItem: LibraryItem = {
  id: 'lib_default_001',
  title: 'Attention Is All You Need.pdf',
  fileSize: '2.4 MB',
  status: 'ready',
  currentStep: 'complete',
  flashcardCount: 12,
  timestamp: new Date().toISOString(),
};

const defaultPartnershipRequest: PartnershipRequest = {
  id: 'pr_001',
  name: 'Sayed Rahman',
  email: 'speakbangla.always@gmail.com',
  orgName: 'University',
  phone: '+8801712345678',
  status: 'pending',
};

export function initMockDb(): void {
  const existing = localStorage.getItem(MOCK_KEY);
  if (!existing) {
    localStorage.setItem(MOCK_KEY, JSON.stringify([defaultTenant]));
  }
  const existingPartnerships = localStorage.getItem(PARTNERSHIP_KEY);
  if (!existingPartnerships) {
    localStorage.setItem(PARTNERSHIP_KEY, JSON.stringify([defaultPartnershipRequest]));
  }
  const existingLib = localStorage.getItem(LIBRARY_KEY);
  if (!existingLib) {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify([defaultLibraryItem]));
  }
  const existingSpaces = localStorage.getItem(SPACES_KEY);
  const parsedSpaces = existingSpaces ? JSON.parse(existingSpaces) : [];
  if (parsedSpaces.length === 0) {
    localStorage.setItem(SPACES_KEY, JSON.stringify([defaultInstitutionalSpace]));
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
  const cleanPasskey = passkey.trim().toUpperCase();
  return getTenants().find(t => t.passkey === cleanPasskey);
}

export function activateTenant(passkey: string, password: string): boolean {
  const cleanPasskey = passkey.trim().toUpperCase();
  const tenants = getTenants();
  const idx = tenants.findIndex(t => t.passkey === cleanPasskey && t.status === 'pending');
  if (idx === -1) return false;
  tenants[idx].password = password;
  tenants[idx].status = 'active';
  saveTenants(tenants);
  return true;
}

export function validateTenantLogin(email: string, password: string, passkey: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPasskey = passkey.trim().toUpperCase();
  const cleanPassword = password.trim();

  const allTenants = getTenants();

  let tenant = allTenants.find(
    t => t.email === cleanEmail && t.passkey === cleanPasskey && t.status === 'active'
  );

  if (!tenant) {
    const pendingIdx = allTenants.findIndex(
      t => t.email === cleanEmail && t.passkey === cleanPasskey && t.status === 'pending'
    );
    if (pendingIdx !== -1) {
      console.log("MockDB Debug: Auto-activating pending tenant for", cleanEmail);
      allTenants[pendingIdx].password = cleanPassword;
      allTenants[pendingIdx].status = 'active';
      saveTenants(allTenants);
      tenant = allTenants[pendingIdx];
    }
  }

  if (!tenant) {
    console.log("MockDB Debug: No tenant found for email=", cleanEmail, "passkey=", cleanPasskey);
    console.log("MockDB Debug: Available tenants:", JSON.stringify(allTenants));
    return false;
  }

  const passwordMatch = tenant.password === cleanPassword;
  console.log("MockDB Debug: Login result for", cleanEmail, "- password match:", passwordMatch);
  return passwordMatch;
}

export function addPartnershipRequest(
  request: Omit<PartnershipRequest, 'id' | 'status'>
): PartnershipRequest {
  const requests = getPartnershipRequests();
  const newRequest: PartnershipRequest = {
    ...request,
    id: `pr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    status: 'pending',
  };
  requests.push(newRequest);
  localStorage.setItem(PARTNERSHIP_KEY, JSON.stringify(requests));
  return newRequest;
}

export function getPendingRequests(): PartnershipRequest[] {
  const raw = localStorage.getItem(PARTNERSHIP_KEY);
  const requests: PartnershipRequest[] = raw ? JSON.parse(raw) : [];
  return requests.filter(r => r.status === 'pending');
}

function getPartnershipRequests(): PartnershipRequest[] {
  const raw = localStorage.getItem(PARTNERSHIP_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getLibraryItems(): LibraryItem[] {
  const raw = localStorage.getItem(LIBRARY_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLibraryItems(items: LibraryItem[]): void {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
}

export function addLibraryItem(item: LibraryItem): void {
  const items = getLibraryItems();
  items.push(item);
  saveLibraryItems(items);
}

export function updateLibraryItemStatus(
  id: string,
  step: LibraryItem['currentStep'],
  status: LibraryItem['status']
): void {
  const items = getLibraryItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) {
    items[idx].currentStep = step;
    items[idx].status = status;
    saveLibraryItems(items);
  }
}

export function removeLibraryItem(id: string): void {
  const items = getLibraryItems().filter(i => i.id !== id);
  saveLibraryItems(items);
}

export function getSpaces(): Space[] {
  const raw = localStorage.getItem(SPACES_KEY);
  if (!raw) {
    const seed = [defaultInstitutionalSpace];
    localStorage.setItem(SPACES_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seed = [defaultInstitutionalSpace];
      localStorage.setItem(SPACES_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch {
    const seed = [defaultInstitutionalSpace];
    localStorage.setItem(SPACES_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveSpaces(items: Space[]): void {
  localStorage.setItem(SPACES_KEY, JSON.stringify(items));
}

export function addSpace(space: Space): void {
  const items = getSpaces();
  items.push(space);
  saveSpaces(items);
}

export function updateSpace(id: string, updates: Partial<Space>): void {
  const items = getSpaces();
  const idx = items.findIndex(s => s.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    saveSpaces(items);
  }
}

export function deleteSpace(id: string): void {
  const items = getSpaces().filter(s => s.id !== id);
  saveSpaces(items);
}

export function approvePartnershipRequest(id: string): string | null {
  const requests = getPartnershipRequests();
  const idx = requests.findIndex(r => r.id === id && r.status === 'pending');
  if (idx === -1) return null;

  requests[idx].status = 'approved';
  localStorage.setItem(PARTNERSHIP_KEY, JSON.stringify(requests));

  const orgSlug = requests[idx].orgName.replace(/\s+/g, '_').toUpperCase();
  const passkey = `STPH-${orgSlug}-2026`;
  const tenants = getTenants();
  const newTenant: Tenant = {
    id: `org_${orgSlug.toLowerCase()}_${Date.now().toString(36)}`,
    email: requests[idx].email.trim().toLowerCase(),
    passkey,
    status: 'pending',
  };
  tenants.push(newTenant);
  saveTenants(tenants);

  return passkey;
}
