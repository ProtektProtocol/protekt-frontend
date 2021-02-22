// @flow

import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';

import {
  Button,
} from "tabler-react";

import Form from "../tablerReactAlt/src/components/Form";

type Props = {|
  +item: Object,
  +accountBalances: Object,
  +web3Context: Object,
  +lendingMarketMetrics: Object,
  +tokenPrices: Object,
  +contracts: Object,
  +handleSubmit: Function,
  +label: string
|};

function DepositWithdrawTokensForm({
  item,
  accountBalances,
  web3Context,
  tokenPrices,
  contracts,
  handleSubmit,
  label,
  buttonIcon,
  buttonLabel
}: Props): React.Node {
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={{ numbers: '' }}
      validationSchema={Yup.object().shape({
        numbers: Yup.number().required('Required'),
      })}
      onSubmit={ async (values, actions) => {
        setLoading(true);
        const successCb = () => {
          actions.resetForm({
             values: { numbers: '' }
          });
          setLoading(false);
        }
        const failedCb = () => {
          setLoading(false);
        }
        handleSubmit(values.numbers, successCb, failedCb);
      }}
    >
      {props => {
        const {
          values,
          setFieldValue,
          handleSubmit,
          isSubmitting
        } = props;
        return (
          <Form onSubmit={handleSubmit}> 
            <Form.Group label={label}>
              <Form.InputGroup>
                <NumberFormat
                  placeholder="0.00"
                  isNumericString={true}
                  thousandSeparator={true}
                  value={values.numbers}
                  className={"form-control"}
                  onValueChange={val => setFieldValue('numbers', val.floatValue)}
                />
                <Form.InputGroupAppend>
                  <Button
                    color="primary"
                    type="submit"
                    value="Submit"
                    className="color"
                    icon={ buttonIcon }
                    disabled={isSubmitting}
                    loading={loading}
                  >
                    { buttonLabel }
                  </Button>
                </Form.InputGroupAppend>
              </Form.InputGroup>
            </Form.Group>
          </Form>
        );
      }}
    </Formik>
  )
}

/** @component */
export default DepositWithdrawTokensForm;
