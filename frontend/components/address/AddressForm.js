'use client';

import { cn } from '@/utils/cn';

const LABELS = ['Home', 'Work', 'Other'];

export default function AddressForm({ value, onChange, className, idPrefix = 'addr' }) {
  const set = (field, fieldValue) => onChange({ ...value, [field]: fieldValue });

  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor={`${idPrefix}-label`}>
          Address label
        </label>
        <select
          id={`${idPrefix}-label`}
          className="input-field"
          value={value.label || 'Home'}
          onChange={(e) => set('label', e.target.value)}
        >
          {LABELS.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-house`}>
          House / flat no.
        </label>
        <input
          id={`${idPrefix}-house`}
          className="input-field"
          placeholder="e.g. 12B"
          value={value.houseNumber || ''}
          onChange={(e) => set('houseNumber', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-society`}>
          Society / building
        </label>
        <input
          id={`${idPrefix}-society`}
          className="input-field"
          placeholder="e.g. Green Valley"
          value={value.society || ''}
          onChange={(e) => set('society', e.target.value)}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor={`${idPrefix}-street`}>
          Street / area line
        </label>
        <input
          id={`${idPrefix}-street`}
          className="input-field"
          placeholder="Road, landmark, area"
          value={value.streetLine || ''}
          onChange={(e) => set('streetLine', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-city`}>
          City
        </label>
        <input
          id={`${idPrefix}-city`}
          className="input-field"
          placeholder="City"
          value={value.city || ''}
          onChange={(e) => set('city', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-state`}>
          State
        </label>
        <input
          id={`${idPrefix}-state`}
          className="input-field"
          placeholder="State"
          value={value.state || ''}
          onChange={(e) => set('state', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-pin`}>
          Pincode
        </label>
        <input
          id={`${idPrefix}-pin`}
          className="input-field"
          placeholder="6-digit pincode"
          inputMode="numeric"
          maxLength={6}
          value={value.pinCode || ''}
          onChange={(e) => set('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor={`${idPrefix}-country`}>
          Country
        </label>
        <input
          id={`${idPrefix}-country`}
          className="input-field"
          value={value.country || 'India'}
          onChange={(e) => set('country', e.target.value)}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-600 sm:col-span-2">
        <input
          type="checkbox"
          checked={!!value.isDefault}
          onChange={(e) => set('isDefault', e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Set as default delivery address
      </label>
    </div>
  );
}
