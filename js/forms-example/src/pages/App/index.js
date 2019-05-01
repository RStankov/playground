import React from 'react';
import Debug from 'components/Debug';
import Form from 'components/FormFinalBootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

export default function App() {
  const debug = window.location.search === '?debug'
  return (
    <div className="container mt-5 mb-2" as="main">
      <Form onSubmit={onSubmit}>
        <div className="row justify-content-md-center">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">Submit a talk</h1>
                <Form.Field name="title" />
                <Form.Field name="description" input="textarea" />
                <Form.Field name="email" input="email" />
                <Form.Field name="length" input="select" options={LENGTHS} />
                <Form.Field name="level" input="radioGroup" options={LEVELS} />
                <Form.Field name="speakers" input={SpeakersInput} />
                <div className="mt-2 pt-4 border-top">
                  <Form.SubmitButton />
                  <Form.Status />
                </div>
              </div>
            </div>
          </div>
          {debug && (
            <div className="col-6">
              <Form.State>{state => <Debug value={state} />}</Form.State>
            </div>

          )}
        </div>
      </Form>
    </div>
  );
}

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

function SpeakersInput({ fields }) {
  return (
    <React.Fragment>
      {fields.map((name, index) => (
        <div class="form-row" key={name}>
          <div class="form-group mr-1">
            <div span class="badge badge-secondary">
              {index + 1}
            </div>
          </div>
          <div class="form-group mr-1">
            <Form.Input
              name={`${name}.firstName`}
              placeholder="First Name"
              className="form-control form-control-sm"
            />
          </div>
          <div class="form-group mr-1">
            <Form.Input
              name={`${name}.lastName`}
              placeholder="Last Name"
              className="form-control form-control-sm"
            />
          </div>
          <div class="form-group ">
            <button
              class="btn btn-danger btn-sm"
              onClick={e => {
                e.preventDefault();
                fields.remove(index);
              }}
              style={{ cursor: 'pointer' }}>
              remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={e => {
          e.preventDefault();
          fields.push(undefined);
        }}
        className="btn btn-link p-0">
        add speaker
      </button>
    </React.Fragment>
  );
}

SpeakersInput.isArray = true;
SpeakersInput.noLabelWrap = true;

function onSubmit(values) {
  const errors = {};

  if (!values.title) {
    errors.title = 'required';
  }

  if (!values.description) {
    errors.description = 'required';
  }

  if (!values.level) {
    errors.level = 'required';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }
}
