import * as React from 'react';
import Debug from 'components/Debug';
import Form from 'components/FormPlain';

const LENGTH_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
];

const VIA_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'push', label: 'Push notification' },
  { value: 'phone', label: 'Phone' },
];

export default function ExampleForm() {
  return (
    <Form>
      <Form.Field name="title" />
      <Form.Field name="description" input="textarea" />
      <Form.Field name="email" input="email" />
      <Form.Field name="length" input="select" options={LENGTH_OPTIONS} />
      <Form.Field
        name="notifyVia"
        label="Notify me via"
        input="radioGroup"
        options={VIA_OPTIONS}
      />
      <input type="submit" value="submit" />
      <Form.WithValues>
        {formValues => <Debug value={formValues} />}
      </Form.WithValues>
    </Form>
  );
}
