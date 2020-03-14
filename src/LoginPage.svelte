<script>
  let email

  function login( e ) {
    console.info( "login", email, e )
    e.preventDefault()
    var actionCodeSettings = {
      url: 'http://localhost:5000/#login',
      handleCodeInApp: true,
    }

    firebase.auth().sendSignInLinkToEmail( email, actionCodeSettings )
      .then( () => {
        console.info('then', email)
        window.localStorage.setItem( 'emailForSignIn', email )
      })
      .catch( ( error ) => {
        console.info('catch', error)
        // Some error occurred, you can inspect the code: error.code
      })
  }

  console.info('running check')
  if( firebase.auth().isSignInWithEmailLink( window.location.href ) ) {
    console.info('running verification')
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem('emailForSignIn')
    if( ! email ) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation')
    }
    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink( email, window.location.href )
      .then( ( result ) => {
        console.info('authenticated', result)
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn')
        // @todo redirect
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch( ( error ) => {
        console.info('error', error)
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      })
  }
</script>
<form>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/2">
      <label class="input-label md:text-right md:mb-0" for="email">
        Email
      </label>
    </div>
    <div class="md:w-1/2">
      <input type="email" bind:value={ email } id="email" />
    </div>
  </div>
  <button class="button button-primary" on:click={ login }>Login</button>
</form>
