import PropTypes from 'prop-types';

const InputBox = ({
  inputTitle,
  autoComplete,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium mb-1">{inputTitle}</label>
      <input
        className="h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

InputBox.propTypes = {
  inputTitle: PropTypes.string.isRequired,
  autoComplete: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default InputBox;
