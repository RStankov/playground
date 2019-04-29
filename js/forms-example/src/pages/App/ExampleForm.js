import * as React from 'react';
import Debug from 'components/Debug';
import Form from 'components/FormFinal';

const LENGTHS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
];

const LEVELS = [
  { value: 'beginner' },
  { value: 'intermediate' },
  { value: 'expert' },
];

export default function ExampleForm() {
  return (
    <Form onSubmit={onSubmit}>
      <div className="grid">
        <div>
          <Form.Field name="title" />
          <Form.Field name="description" input="textarea" />
          <Form.Field name="email" input="email" />
          <Form.Field name="length" input="select" options={LENGTHS} />
          <Form.Field name="level" input="radioGroup" options={LEVELS} />
          <Form.Field name="speakers" input={SpeakersInput} />
          <Form.SubmitButton />
          <Form.Status />
        </div>
        <div>
          <Form.State>
            {state => <Debug value={state} />}
          </Form.State>
        </div>
      </div>
    </Form>
  );
}

function SpeakersInput({ fields }) {
  return (
    <React.Fragment>
      {fields.map((name, index) => (
        <div key={name}>
          {index + 1}:
          <Form.Input name={`${name}.firstName`} placeholder="First Name" />
          <Form.Input name={`${name}.lastName`} placeholder="Last Name" />
          <span
            onClick={() => fields.remove(index)}
            style={{ cursor: 'pointer' }}>
            x
          </span>
        </div>
      ))}
      <button type="button" onClick={() => fields.push(undefined)}>
        Add Customer
      </button>
    </React.Fragment>
  );
}

SpeakersInput.isArray = true;
SpeakersInput.noLabelWrap = true;

function onSubmit(values) {
  console.log(values);
  const errors = {};

  if (!values.title) {
    errors.title = 'required';
  }

  if (!values.description) {
    errors.description = 'required';
  }

  if (!values.notifyVia) {
    errors.notifyVia = 'required';
  }

  return errors;
}
