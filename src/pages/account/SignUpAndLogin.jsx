import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { Form } from 'common/components/form/Form';
import { Input } from 'common/components/form/Input';
import SubmitButton from 'common/components/form/SubmitButton';
import { useUser } from 'common/contexts/UserContext';

import {
  LeftSide,
  RightSide,
  StyledPage,
  ToggleContainer,
  ToggleTab,
} from './styles';

const LoginInputError = ({ error }) => {
  if (error && error.includes('Invalid credentials')) {
    return <p className='errorMessage'>* Invalid email or password *</p>;
  }
  return;
};

LoginInputError.propTypes = {
  error: PropTypes.string,
};

const InputError = ({ error }) => {
  if (error && error.includes('Email') && error.includes('are required')) {
    return <p className='errorMessage'>* All fields are required *</p>;
  }
  return;
};

InputError.propTypes = {
  error: PropTypes.string,
};

export default function SignUp() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const [formState, setFormState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    username: '',
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.email,
            password: formState.password,
            username: formState.username || undefined,
            firstname: formState.firstname || undefined,
            lastname: formState.lastname || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      alert(
        'Account created successfully! Please check your email to verify your account.'
      );
      navigate('/', {
        state: {
          message:
            'Account created successfully! Please check your email to verify your account.',
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formState.email, formState.password);
      navigate('/volunteer-home');
      //navigate('/', { replace: true });
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
      !error && navigate('/volunteer-home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledPage>
      <LeftSide>
        <div className='Logo'></div>
        <div className='BigText'>
          Welcome to our volunteer scheduling website!
        </div>
        <div className='BigText'>
          If this is your first time here, please create a new account to
          continue. For returning volunteers, please sign in using your existing
          account.
        </div>
      </LeftSide>
      <RightSide>
        <ToggleContainer>
          <ToggleTab active={isSignIn} onClick={() => setIsSignIn(true)}>
            Sign in
          </ToggleTab>
          <ToggleTab active={!isSignIn} onClick={() => setIsSignIn(false)}>
            Create account
          </ToggleTab>
        </ToggleContainer>

        <Form onSubmit={handleSignIn}>
          {isSignIn ? (
            // Sign-in Form
            <>
              <InputError error={error} />
              <LoginInputError error={error} />
              <Input.Text
                title='Email'
                placeholder='example@mail.com'
                name='email'
                value={formState.email}
                onChange={handleChange}
              />
              <Input.Password
                title='Password'
                placeholder='password'
                name='password'
                value={formState.password}
                onChange={handleChange}
              />
              <SubmitButton onClick={handleSignIn}>Sign in</SubmitButton>
            </>
          ) : (
            // Sign-up Form
            <>
              <InputError error={error} />
              <Input.Text
                title='First Name'
                placeholder='John'
                name='firstname'
                value={formState.firstname}
                onChange={handleChange}
              />

              <Input.Text
                title='Last Name'
                placeholder='Doe'
                name='lastname'
                value={formState.lastname}
                onChange={handleChange}
              />

              <Input.Text
                title='Email'
                placeholder='example@mail.com'
                name='email'
                value={formState.email}
                onChange={handleChange}
              />

              <Input.Password
                title='Password'
                placeholder='password'
                name='password'
                value={formState.password}
                onChange={handleChange}
              />

              <SubmitButton onClick={handleSignUp}>Create Account</SubmitButton>
            </>
          )}
        </Form>
      </RightSide>
    </StyledPage>
  );
}
