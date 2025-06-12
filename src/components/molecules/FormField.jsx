import Input from '@/components/atoms/Input';

const FormField = ({ label, id, children, className = '', required = false, ...inputProps }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
        {label} {required && '*'}
      </label>
      {children || <Input id={id} required={required} {...inputProps} />}
    </div>
  );
};

export default FormField;