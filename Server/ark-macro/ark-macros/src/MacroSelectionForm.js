import React, { Component } from "react";
import { Form, Field } from "@progress/kendo-react-form";
import countries from "./Macros";

const Input = (fieldProps) => {
    const {
        fieldType, label, value, visited, touched, valid,
        onChange, onBlur, onFocus, validationMessage,
    } = fieldProps;
    const invalid = !valid && visited;
    return (
        <div onBlur={onBlur} onFocus={onFocus}>
            <label>
                {label}
                <input
                    type={fieldType}
                    className={invalid ? "invalid" : ""}
                    value={value}
                    onChange={onChange} />
            </label>
            { invalid &&
                (<div className="required">{validationMessage}</div>)}
        </div>
    );
};

const DropDown = ({ label, value, valid, visited, options,
    onChange, onBlur, onFocus, validationMessage, }) => {
    const invalid = !valid && visited;
    return (
        <div onBlur={onBlur} onFocus={onFocus}>
            <label>
                {label}
                <select
                    className={invalid ? "invalid" : ""}
                    value={value}
                    onChange={onChange}>
                    <option key=""></option>
                    {options.map(option => (
                        <option key={option}>{option}</option>
                    ))}
                </select>
            </label>
            { invalid &&
                (<div className="required">{validationMessage}</div>)}
        </div>
    )
}

const Checkbox = ({ label, visited, valid, onChange, value,
    validationMessage }) => {
    const onValueChange = React.useCallback(
        () => {
            onChange({ value: !value });
        },
        [onChange, value]
    );
    const invalid = !valid && visited;

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    className={invalid ? "invalid" : ""}
                    onChange={onValueChange}
                    value={value} />
                {label}
            </label>
            { invalid &&
                (<div className="required">{validationMessage}</div>)}
        </div>
    );
};

const emailValidator = (value) => (
    new RegExp(/\S+@\S+\.\S+/).test(value) ? "" : "Please enter a valid email."
);
const requiredValidator = (value) => {
    return value ? "" : "This field is required";
}

export default function App() {
    const handleSubmit = (data, event) => {
        console.log(`
      Email: ${data.email}
      Password: ${data.password}
      Country: ${data.country}
      Accepted Terms: ${data.acceptedTerms}
    `);

        event.preventDefault();
    }

    return (
        <Form
            onSubmit={handleSubmit}
            initialValues={{
                email: "", password: "", country: "", acceptedTerms: false
            }}
            render={(formRenderProps) => (
                <form onSubmit={formRenderProps.onSubmit}>
                    <h1>Create Account</h1>

                    <Field
                        label="Email:"
                        name="email"
                        fieldType="email"
                        component={Input}
                        validator={[requiredValidator, emailValidator]} />

                    <Field
                        label="Password:"
                        name="password"
                        fieldType="password"
                        component={Input}
                        validator={requiredValidator} />

                    <Field
                        label="Country:"
                        name="country"
                        component={DropDown}
                        options={countries}
                        validator={requiredValidator} />

                    <Field
                        label="I accept the terms of service"
                        name="acceptedTerms"
                        component={Checkbox}
                        validator={requiredValidator} />

                    <button disabled={!formRenderProps.allowSubmit}>
                        Submit
          </button>
                </form>
            )}>
        </Form>
    );
}
