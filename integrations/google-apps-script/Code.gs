const SPREADSHEET_ID = '1NEZlKRjns4bnNAd4pQ1qHLAlQtcgZ6wOSoIfDMsZ8js';
const SHEET_NAME = 'Pré-cadastros';

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || '{}');
    const validation = validatePayload(data);
    if (!validation.ok) {
      cacheResult(data.submission_id, { ok: false, found: true, code: validation.code });
      return json({ ok: false, code: validation.code });
    }

    const sheet = getSheet();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const lastRow = sheet.getLastRow();
      const contacts = lastRow > 1 ? sheet.getRange(2, 7, lastRow - 1, 1).getDisplayValues().flat() : [];
      const duplicateIndex = contacts.findIndex(value => normalizeContact(value, data.contact_type) === validation.contact);
      if (duplicateIndex >= 0) {
        const existingId = sheet.getRange(duplicateIndex + 2, 1).getDisplayValue();
        cacheResult(data.submission_id, { ok: false, found: true, code: 'duplicate' });
        return json({ ok: false, found: true, code: 'duplicate', id: existingId });
      }

      sheet.appendRow([
        clean(data.submission_id, 100),
        new Date(),
        clean(data.full_name, 120),
        clean(data.city, 80),
        clean(data.state, 2),
        clean(data.contact_type, 20),
        validation.contact,
        clean(data.participation_type, 40),
        clean(data.category, 100),
        Boolean(data.support_interest),
        Boolean(data.contact_consent),
        Boolean(data.privacy_consent),
        clean(data.source, 50),
        clean(data.referral_code, 80),
        'novo',
        ''
      ]);
      cacheResult(data.submission_id, { ok: true, found: true });
      return json({ ok: true, found: true, id: data.submission_id });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json({ ok: false, code: 'server_error' });
  }
}

function doGet(event) {
  const action = event.parameter.action || 'count';
  const callback = safeCallback(event.parameter.callback);
  let result;

  if (action === 'status') {
    const id = clean(event.parameter.id, 100);
    const cached = CacheService.getScriptCache().get(`submission:${id}`);
    if (cached) {
      result = JSON.parse(cached);
      return ContentService
        .createTextOutput(`${callback}(${JSON.stringify(result)});`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const ids = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues().flat() : [];
    const rowIndex = ids.indexOf(id);
    result = rowIndex >= 0
      ? { ok: true, found: true }
      : { ok: false, found: false };
  } else {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const statuses = lastRow > 1 ? sheet.getRange(2, 15, lastRow - 1, 1).getDisplayValues().flat() : [];
    result = { count: statuses.filter(status => status !== 'removido').length };
  }

  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify(result)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function validatePayload(data) {
  const contactTypes = ['whatsapp', 'email'];
  const participationTypes = ['member', 'professional', 'company', 'supplier', 'personal_brand'];
  if (!data.submission_id || !data.full_name || !data.city || !data.state) return { ok: false, code: 'missing_fields' };
  if (!contactTypes.includes(data.contact_type)) return { ok: false, code: 'invalid_contact_type' };
  if (!participationTypes.includes(data.participation_type)) return { ok: false, code: 'invalid_participation' };
  if (data.contact_consent !== true || data.privacy_consent !== true) return { ok: false, code: 'consent_required' };
  const contact = normalizeContact(data.contact_value, data.contact_type);
  if (data.contact_type === 'whatsapp' && (contact.length < 10 || contact.length > 15)) return { ok: false, code: 'invalid_contact' };
  if (data.contact_type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return { ok: false, code: 'invalid_contact' };
  return { ok: true, contact };
}

function normalizeContact(value, type) {
  const text = String(value || '').trim();
  return type === 'whatsapp' ? text.replace(/\D/g, '') : text.toLowerCase();
}

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function safeCallback(value) {
  const callback = String(value || 'callback');
  return /^[A-Za-z_$][0-9A-Za-z_$]{0,100}$/.test(callback) ? callback : 'callback';
}

function getSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found');
  return sheet;
}

function cacheResult(id, value) {
  const safeId = clean(id, 100);
  if (safeId) CacheService.getScriptCache().put(`submission:${safeId}`, JSON.stringify(value), 300);
}

function json(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
