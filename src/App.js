import 'regenerator-runtime/runtime';
import React from 'react';
import { login, logout } from './utils';
import './global.css';

import getConfig from './config';
const { networkId } = getConfig(process.env.NODE_ENV || 'development');

export default function App() {
  // use React Hooks to store greeting in component state
  const [greeting, set_greeting] = React.useState();

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>

        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    );
  }

  function show_greeting(name) {
    if (name) return Hello + name;
    return 'Hi!';
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className='link' style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>

      <button className='link' style={{ float: 'right' }} onClick={() => {}}>
        {window.accountId}
      </button>
      <main>
        <h1>
          <label
            htmlFor='greeting'
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)',
            }}
          >
            Hello{greeting ? ' ' + greeting + '!' : '!'}
          </label>
          {
            ' ' /* React trims whitespace around tags; insert literal space character when needed */
          }
        </h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            // get elements from the form using their id attribute
            const { fieldset, greeting } = event.target.elements;

            // hold onto new user-entered value from React's SynthenticEvent for use after `await` call
            const newGreeting = greeting.value;

            // disable the form while the value gets updated on-chain
            fieldset.disabled = true;

            try {
              // make an update call to the smart contract
              await window.contract.greeting({
                // pass the value that the user entered in the greeting field
                name: newGreeting,
              });
            } catch (e) {
              alert(
                'Something went wrong! ' +
                  'Maybe you need to sign out and back in? ' +
                  'Check your browser console for more info.'
              );
              throw e;
            } finally {
              // re-enable the form, whether the call succeeded or failed
              fieldset.disabled = false;
            }

            // update local `greeting` variable to match persisted value
            set_greeting(newGreeting);

            // show Notification
            setShowNotification(true);

            // remove Notification again after css animation completes
            // this allows it to be shown again next time the form is submitted
            setTimeout(() => {
              setShowNotification(false);
            }, 11000);
          }}
        >
          <fieldset id='fieldset'>
            <label
              htmlFor='greeting'
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em',
              }}
            >
              What is your name?
            </label>
            <div style={{ display: 'flex' }}>
              <input
                autoComplete='off'
                defaultValue={greeting}
                id='greeting'
                onChange={(e) => setButtonDisabled(e.target.value === greeting)}
                style={{ flex: 1 }}
              />
              <button
                disabled={buttonDisabled}
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                Save
              </button>
            </div>
          </fieldset>
        </form>
      </main>
      {showNotification && <Notification />}
    </>
  );
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target='_blank'
        rel='noreferrer'
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      {
        ' ' /* React trims whitespace around tags; insert literal space character when needed */
      }
      called method: 'greeting' in contract:{' '}
      <a
        target='_blank'
        rel='noreferrer'
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
