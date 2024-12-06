import { Formik, Form, Field } from "formik";

function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log("Form Values:", values);
        }}
      >
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field id="username" name="username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field id="password" name="password" type="password" />
          </div>
          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginPage;
