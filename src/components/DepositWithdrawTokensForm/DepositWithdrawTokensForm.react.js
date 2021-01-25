// @flow

import React, { useState, useEffect } from 'react';
import numeral from 'numeral';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import { ethers } from "ethers";

import {
  Button,
} from "tabler-react";

import Form from "../tablerReactAlt/src/components/Form";

import { useGasPrice } from "../../hooks";
import { Transactor } from "../../utils";

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
  const gasPrice = useGasPrice("fast");
  const [balances, setBalances] = useState(accountBalances);

  useEffect(() => {
    setBalances(accountBalances);
  }, [accountBalances]);

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object().shape({
        numbers: Yup.number().required('Required'),
      })}
      onSubmit={ async (values, actions) => {
        console.log('here');
        handleSubmit(values.numbers);
        actions.resetForm();
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
                    RootComponent="a"
                    color="primary"
                    type="submit"
                    value="Submit"
                    className="color"
                    icon={ buttonIcon }
                    disabled={isSubmitting}
                    onClick={() => handleSubmit(values.numbers)}
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
