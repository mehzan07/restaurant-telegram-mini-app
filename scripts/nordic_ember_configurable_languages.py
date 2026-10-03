from pathlib import Path
import sys

ROOT = Path.cwd()
SERVER = ROOT / 'server' / 'index.ts'
HEADER = ROOT / 'src' / 'components' / 'Header.tsx'
ADMIN = ROOT / 'src' / 'views' / 'AdminView.tsx'

required = [SERVER, HEADER, ADMIN]
missing = [str(p.relative_to(ROOT)) for p in required if not p.is_file()]
if missing:
    print('ERROR: Run this script from the Nordic Ember project root.')
    for item in missing:
        print(f'  - {item}')
    sys.exit(1)


def read(path):
    return path.read_text(encoding='utf-8-sig')


def write(path, text):
    path.write_text(text, encoding='utf-8', newline='')


def patch(path, transforms):
    original = read(path)
    text = original
    for old, new, label in transforms:
        if new in text:
            print(f'Already applied: {path.relative_to(ROOT)} — {label}')
            continue
        if old not in text:
            raise RuntimeError(
                f'Could not safely apply {label} in {path.relative_to(ROOT)}. '
                'The file differs from the expected version; no changes were written to this file.'
            )
        if text.count(old) != 1:
            raise RuntimeError(
                f'Expected exactly one match for {label} in {path.relative_to(ROOT)}, '
                f'found {text.count(old)}. No changes were written to this file.'
            )
        text = text.replace(old, new, 1)

    if text != original:
        backup = path.with_name(path.name + '.before-language-configuration.bak')
        if not backup.exists():
            write(backup, original)
            print(f'Backup created: {backup.relative_to(ROOT)}')
        write(path, text)
        print(f'Updated: {path.relative_to(ROOT)}')


# -----------------------------------------------------------------------------
# 1. server/index.ts
# -----------------------------------------------------------------------------
server_insert = """\n// ---------------------------------------------------------\n// Configurable UI languages\n// ---------------------------------------------------------\n\nconst ALLOWED_UI_LANGUAGES = ['EN', 'SV', 'FA', 'TR'] as const;\ntype UiLanguage = typeof ALLOWED_UI_LANGUAGES[number];\nconst DEFAULT_UI_LANGUAGES: UiLanguage[] = ['EN', 'SV'];\n\ndb.exec(`\n  CREATE TABLE IF NOT EXISTS app_settings (\n    key TEXT PRIMARY KEY,\n    value TEXT NOT NULL\n  )\n`);\n\nconst readVisibleLanguages = (): UiLanguage[] => {\n  const row = db\n    .prepare('SELECT value FROM app_settings WHERE key = ?')\n    .get('visible_languages') as { value?: string } | undefined;\n\n  if (!row?.value) {\n    db.prepare(\n      'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)'\n    ).run('visible_languages', JSON.stringify(DEFAULT_UI_LANGUAGES));\n    return [...DEFAULT_UI_LANGUAGES];\n  }\n\n  try {\n    const parsed = JSON.parse(row.value);\n    if (!Array.isArray(parsed)) return [...DEFAULT_UI_LANGUAGES];\n\n    const languages = parsed.filter(\n      (value): value is UiLanguage =>\n        typeof value === 'string' &&\n        (ALLOWED_UI_LANGUAGES as readonly string[]).includes(value)\n    );\n\n    return languages.length > 0 ? languages : [...DEFAULT_UI_LANGUAGES];\n  } catch {\n    return [...DEFAULT_UI_LANGUAGES];\n  }\n};\n\nconst saveVisibleLanguages = (languages: UiLanguage[]) => {\n  db.prepare(\n    'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)'\n  ).run('visible_languages', JSON.stringify(languages));\n};\n"""

patch(
    SERVER,
    [
        (
            "app.use(express.json());",
            "app.use(express.json());" + server_insert,
            'add persistent UI-language configuration storage',
        ),
        (
            "app.get('/api/health', (_req, res) => {",
            """app.get('/api/config/languages', (_req, res) => {\n  return res.json({\n    success: true,\n    languages: readVisibleLanguages(),\n  });\n});\n\napp.get('/api/health', (_req, res) => {""",
            'add public language configuration endpoint',
        ),
        (
            "app.post('/api/admin/login', (req, res) => {",
            """app.get('/api/admin/languages', requireAdmin, (_req, res) => {\n  return res.json({\n    success: true,\n    languages: readVisibleLanguages(),\n  });\n});\n\napp.put('/api/admin/languages', requireAdmin, (req, res) => {\n  const requested = req.body?.languages;\n\n  if (!Array.isArray(requested)) {\n    return res.status(400).json({ error: 'Languages must be an array' });\n  }\n\n  const languages = requested.filter(\n    (value: unknown): value is UiLanguage =>\n      typeof value === 'string' &&\n      (ALLOWED_UI_LANGUAGES as readonly string[]).includes(value)\n  );\n\n  const uniqueLanguages = ALLOWED_UI_LANGUAGES.filter(language =>\n    languages.includes(language)\n  );\n\n  if (uniqueLanguages.length === 0) {\n    return res.status(400).json({\n      error: 'At least one language must remain visible',\n    });\n  }\n\n  saveVisibleLanguages(uniqueLanguages);\n\n  return res.json({\n    success: true,\n    languages: uniqueLanguages,\n  });\n});\n\napp.post('/api/admin/login', (req, res) => {""",
            'add authenticated admin language configuration endpoints',
        ),
    ],
)


# -----------------------------------------------------------------------------
# 2. src/components/Header.tsx
# -----------------------------------------------------------------------------
header_options = """\nconst LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [\n  { value: 'EN', label: 'English' },\n  { value: 'SV', label: 'Svenska' },\n  { value: 'FA', label: 'فارسی' },\n  { value: 'TR', label: 'Türkçe' },\n];\n"""

patch(
    HEADER,
    [
        (
            "import React from 'react';",
            "import React, { useEffect, useState } from 'react';",
            'enable language configuration loading',
        ),
        (
            "import { RESTAURANT_IMAGES } from '../data/restaurantData';",
            "import { RESTAURANT_IMAGES } from '../data/restaurantData';" + header_options,
            'define supported language labels',
        ),
        (
            "}) => {\n  const getSubTitle = () => {",
            """}) => {\n  const [visibleLanguages, setVisibleLanguages] = useState<Language[]>(['EN', 'SV']);\n\n  useEffect(() => {\n    let active = true;\n\n    fetch('/api/config/languages')\n      .then(response => response.ok ? response.json() : null)\n      .then(data => {\n        if (!active || !Array.isArray(data?.languages)) return;\n\n        const allowed = data.languages.filter((value: unknown): value is Language =>\n          LANGUAGE_OPTIONS.some(option => option.value === value)\n        );\n\n        if (allowed.length > 0) {\n          setVisibleLanguages(allowed);\n\n          if (!allowed.includes(language)) {\n            onLanguageChange(allowed[0]);\n          }\n        }\n      })\n      .catch(() => {\n        // Keep the safe default: English + Swedish.\n      });\n\n    return () => {\n      active = false;\n    };\n  }, []);\n\n  const getSubTitle = () => {""",
            'load visible languages from server',
        ),
        (
            "    <option value=\"EN\">English</option>\n    <option value=\"SV\">Svenska</option>\n    <option value=\"FA\">فارسی</option>\n    <option value=\"TR\">Türkçe</option>",
            """    {visibleLanguages.map(code => {\n      const option = LANGUAGE_OPTIONS.find(item => item.value === code);\n      return option ? (\n        <option key={option.value} value={option.value}>\n          {option.label}\n        </option>\n      ) : null;\n    })}""",
            'show only configured languages in dropdown',
        ),
    ],
)


# -----------------------------------------------------------------------------
# 3. src/views/AdminView.tsx
# -----------------------------------------------------------------------------
admin_types = """\ntype UiLanguage = 'EN' | 'SV' | 'FA' | 'TR';\n\nconst LANGUAGE_OPTIONS: Array<{ value: UiLanguage; label: string; description: string }> = [\n  { value: 'EN', label: 'English', description: 'English interface' },\n  { value: 'SV', label: 'Swedish', description: 'Svenskt gränssnitt' },\n  { value: 'FA', label: 'Farsi', description: 'Persian interface' },\n  { value: 'TR', label: 'Turkish', description: 'Türkçe arayüz' },\n];\n"""

language_state = """\n  const [visibleLanguages, setVisibleLanguages] = useState<UiLanguage[]>(['EN', 'SV']);\n  const [languageBusy, setLanguageBusy] = useState(false);\n"""

load_language = """\n  const loadLanguageSettings = async () => {\n    if (!token) return;\n\n    try {\n      const data = await api('/api/admin/languages');\n      if (Array.isArray(data.languages) && data.languages.length > 0) {\n        setVisibleLanguages(data.languages);\n      }\n    } catch (e) {\n      setMessage(\n        e instanceof Error ? e.message : 'Unable to load language settings'\n      );\n    }\n  };\n\n  const toggleLanguage = (language: UiLanguage) => {\n    setVisibleLanguages(current => {\n      if (current.includes(language)) {\n        if (current.length === 1) {\n          setMessage('At least one language must remain visible.');\n          return current;\n        }\n        return current.filter(item => item !== language);\n      }\n\n      return [...current, language];\n    });\n  };\n\n  const saveLanguageSettings = async () => {\n    if (visibleLanguages.length === 0) {\n      setMessage('At least one language must remain visible.');\n      return;\n    }\n\n    setLanguageBusy(true);\n    setMessage('');\n\n    try {\n      const data = await api('/api/admin/languages', {\n        method: 'PUT',\n        body: JSON.stringify({ languages: visibleLanguages }),\n      });\n\n      setVisibleLanguages(data.languages || visibleLanguages);\n      setMessage('Language settings saved.');\n    } catch (e) {\n      setMessage(\n        e instanceof Error ? e.message : 'Unable to save language settings'\n      );\n    } finally {\n      setLanguageBusy(false);\n    }\n  };\n"""

language_section = """\n        {/* Visible languages */}\n        <section className=\"bg-white rounded-2xl p-4 md:p-6 mb-5 border border-[#c3c8c3]/60\">\n          <div className=\"flex items-start justify-between gap-4 mb-4\">\n            <div>\n              <h2 className=\"font-serif text-2xl\">Visible languages</h2>\n              <p className=\"text-sm text-[#737874] mt-1\">\n                Choose which languages customers can see in the Language dropdown.\n                English and Swedish are enabled by default.\n              </p>\n            </div>\n\n            <span className=\"text-xs text-[#737874] whitespace-nowrap\">\n              {visibleLanguages.length} enabled\n            </span>\n          </div>\n\n          <div className=\"grid sm:grid-cols-2 lg:grid-cols-4 gap-3\">\n            {LANGUAGE_OPTIONS.map(option => {\n              const checked = visibleLanguages.includes(option.value);\n\n              return (\n                <label\n                  key={option.value}\n                  className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${\n                    checked\n                      ? 'border-[#725b38] bg-[#faf7f2]'\n                      : 'border-[#c3c8c3] bg-white'\n                  }`}\n                >\n                  <input\n                    type=\"checkbox\"\n                    checked={checked}\n                    onChange={() => toggleLanguage(option.value)}\n                    className=\"w-4 h-4 accent-[#725b38]\"\n                  />\n\n                  <span className=\"min-w-0\">\n                    <span className=\"block font-semibold text-sm\">\n                      {option.label}\n                    </span>\n                    <span className=\"block text-xs text-[#737874] mt-0.5\">\n                      {option.description}\n                    </span>\n                  </span>\n                </label>\n              );\n            })}\n          </div>\n\n          <div className=\"mt-4 flex flex-col sm:flex-row sm:items-center gap-3\">\n            <button\n              type=\"button\"\n              disabled={languageBusy}\n              onClick={() => void saveLanguageSettings()}\n              className=\"bg-[#091510] text-white rounded-xl px-5 py-3 font-semibold disabled:opacity-50\"\n            >\n              {languageBusy ? 'Saving…' : 'Save language settings'}\n            </button>\n\n            <span className=\"text-xs text-[#737874]\">\n              At least one language must remain enabled.\n            </span>\n          </div>\n        </section>\n"""

patch(
    ADMIN,
    [
        (
            "type FormState = Omit<\n  Reservation,\n  'id' | 'createdAt' | 'status' | 'source' | 'updatedAt' | 'arrivedAt'\n>;",
            """type FormState = Omit<\n  Reservation,\n  'id' | 'createdAt' | 'status' | 'source' | 'updatedAt' | 'arrivedAt'\n>;""" + admin_types,
            'add language setting types',
        ),
        (
            "  const [busy, setBusy] = useState(false);",
            "  const [busy, setBusy] = useState(false);" + language_state,
            'add language settings state',
        ),
        (
            "  const load = async () => {",
            load_language + "\n  const load = async () => {",
            'add language settings API functions',
        ),
        (
            "  useEffect(() => {\n    void load();\n  }, [token, statusFilter, dateFilter]);",
            """  useEffect(() => {\n    void load();\n  }, [token, statusFilter, dateFilter]);\n\n  useEffect(() => {\n    if (token) {\n      void loadLanguageSettings();\n    }\n  }, [token]);""",
            'load language settings after admin login',
        ),
        (
            "        {/* New reservation */}",
            language_section + "\n        {/* New reservation */}",
            'add admin language configuration panel',
        ),
    ],
)

print('')
print('Language configuration is now implemented.')
print('Default visible languages: English + Swedish')
print('Optional languages: Farsi + Turkish')
print('The restaurant admin can change the selection without editing code.')
