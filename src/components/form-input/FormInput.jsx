import "./FormInput.css";
import { Form } from "react-bootstrap";

const FormInput = ({
  id,
  label,
  disabled,
  type,
  placeholder,
  setValue,
  error,
  resetSingleError,
  value,
}) => {
  const handleChange = (event) => {
    resetSingleError(id);
    setValue(event.target.value);
  };

  return (
    <Form.Group className="mx-4 mt-4">
      <Form.Label className="form-label">{label}</Form.Label>
      <Form.Control
        disabled={disabled}
        required
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        isInvalid={error ? true : false}
        value={value}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default FormInput;
