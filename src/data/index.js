import production from "./defiTrainProd";
import test from "./kovanProtekt";
import development from "./kovanProtekt";

const env = process.env.REACT_APP_APP_ENV || 'test'; // defaulting to after ||

console.log(env)

const config = {
  development,
  production,
  test
};

export default config[env]; 