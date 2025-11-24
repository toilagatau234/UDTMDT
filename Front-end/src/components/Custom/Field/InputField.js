import { Input } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

// SỬA: Dùng React.forwardRef để component nhận được ref từ cha
const InputField = React.forwardRef((props, ref) => {
  // SỬA: Đưa defaultProps vào tham số mặc định
  const {
    field,
    form,
    type = 'text',
    placeholder = '',
    size = 'large',
    suffix = null,
    className,
    autocomplete = 'on',
    autofocus = false,
    maxLength = 1000,
    ...rest
  } = props;

  const { name } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];
  
  //Input or Input.Password
  const InputOption = type === 'password' ? Input.Password : Input;
  return (
    <>
      <InputOption
        ref={ref} // Truyền ref vào Input của AntD
        className={showError ? className + ' error-input' : className}
        name={name}
        {...field}
        {...rest}
        placeholder={placeholder}
        size={size}
        suffix={suffix}
        autoComplete={autocomplete}
        maxLength={maxLength}
        autoFocus={autofocus}
      />
      {showError && <div className="show-error-input">{errors[name]}</div>}
    </>
  );
});

// XÓA: InputField.defaultProps

InputField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.string,
  suffix: PropTypes.object,
  autocomplete: PropTypes.string,
  autofocus: PropTypes.bool,
  ref: PropTypes.any,
  maxLength: PropTypes.number,
};

export default InputField;