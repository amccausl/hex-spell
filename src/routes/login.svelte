<script context="module" lang="ts">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<script lang="ts">
  let email

  // function login( e ) {
  //   console.info( "login", email, e )
  //   e.preventDefault()
  //   var auth_link_settings = {
  //     // @todo env based
  //     url: 'http://localhost:5000/#verify',
  //     handleCodeInApp: true,
  //   }

  //   firebase.auth().sendSignInLinkToEmail( email, auth_link_settings )
  //     .then( () => {
  //       console.info('then', email)
  //       window.localStorage.setItem( 'emailForSignIn', email )
  //     })
  //     .catch( ( error ) => {
  //       console.info('catch', error)
  //       // Some error occurred, you can inspect the code: error.code
  //     })
  // }

  // console.info('running check')
  // if( firebase.auth().isSignInWithEmailLink( window.location.href ) ) {
  //   console.info('running verification')
  //   // Additional state parameters can also be passed via URL.
  //   // This can be used to continue the user's intended action before triggering
  //   // the sign-in operation.
  //   // Get the email if available. This should be available if the user completes
  //   // the flow on the same device where they started it.
  //   let email = window.localStorage.getItem('emailForSignIn')
  //   if( ! email ) {
  //     // User opened the link on a different device. To prevent session fixation
  //     // attacks, ask the user to provide the associated email again. For example:
  //     email = window.prompt('Please provide your email for confirmation')
  //   }
  //   // The client SDK will parse the code from the link for you.
  //   firebase.auth().signInWithEmailLink( email, window.location.href )
  //     .then( ( result ) => {
  //       console.info('authenticated', result)
  //       // Clear email from storage.
  //       window.localStorage.removeItem('emailForSignIn')
  //       // @todo redirect
  //       // You can access the new user via result.user
  //       // Additional user info profile not available via:
  //       // result.additionalUserInfo.profile == null
  //       // You can check if the user is new or existing:
  //       // result.additionalUserInfo.isNewUser
  //     })
  //     .catch( ( error ) => {
  //       console.info('error', error)
  //       // Some error occurred, you can inspect the code: error.code
  //       // Common errors could be invalid email and invalid or expired OTPs.
  //     })
  // }
</script>

<svelte:head>
	<title>Hex-Spell - Login</title>
</svelte:head>

<form>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/2">
      <label for="email" class="md:text-right md:mb-0 block text-black mb-1 pr-4">
        Email
      </label>
    </div>
    <div class="md:w-1/2">
      <input id="email" type="email" bind:value={ email } class="input-text"/>
    </div>
  </div>
  <button class="button button-primary" on:click={ login }>Send Login Link</button>
</form>

<style type="text/scss">
  .input-text {
    @apply
      bg-gray-200
      appearance-none
      border-2
      border-gray-200
      w-full
      py-2
      px-4
      text-gray-700
      leading-tight;

    &:focus {
      @apply
        outline-none
        bg-white
        border-selected;
    }
  }

  .button {
    @apply
      text-2xl
      py-2
      px-4
      border-2
      border-black;

    &-primary {
      @apply bg-primary;

      &:hover {
        @apply bg-selected;
      }

      &:focus {
        @apply border-selected;
      }
    }
  }
</style>
