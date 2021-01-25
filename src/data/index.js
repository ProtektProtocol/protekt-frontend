import production from "./kovanProtekt";
import test from "./kovanProtekt";
import development from "./kovanProtekt";

const env = process.env.APP_ENV || 'test'; // defaulting to after ||

const config = {
  development,
  production,
  test
};

export default config[env]; 