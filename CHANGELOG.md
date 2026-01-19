### 2026-01-29

- Fixed: Combo box lost the selected value when autoFocus was used.
- ListBox supports double-click.
- Tab style for classical tabs optimized
- Styles for alert dialog optimized
- PDF-Container dependency for rect-use removed
- Extended dialog changed property bodyClass to bodyClassName
- Added file trigger component
- New className property for FormErrors
- New errorClassName property for Form
- Fixed: DateRangePicker now properly handles partial date input without resetting the field. Changed validation behavior from 'native' to 'aria' and added internal state management to prevent value loss while typing dates.

### 2025-12-22

#### Components
- Refactored dialog component in (Base-) Dialog and ExtendedDialog

### 2025-12-21

#### Components
- Added SplitButton component
- Register functions in useTwcUiForm supports now array syntax für nested fields.
- Refactored RadioGroup
- FormErrors title in English and German
- Separated Form* components for all input fields (e. g. form-text-field.tsx)

### 2025-12-20

#### Components
- Added Alert, DateTimeField, SearchField components

### 2025-12-19

#### Components:
- Refactoring Calendar and RangeCalendar
- Refactoring DateField, DatePicker, DateRangePicker, TimeField; useDateConversion-Hook
- Refactoring TextField/FormTextField and TextArea/FormTextArea; useFieldChange-Hook

#### Infrastructure and docs
- Refactoring and automatic creation of clearer instructions for components and hooks.
