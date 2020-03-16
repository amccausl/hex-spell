<script>
  let is_checking = true
  let error_message = null

  console.info('running check', window.location.href)
  if( firebase.auth().isSignInWithEmailLink( window.location.href ) ) {
    console.info('running verification')
    firebase.auth().setPersistence( firebase.auth.Auth.Persistence.LOCAL )
      .then( () => {
        console.info('set persistence')
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
        if( ! email ) {
          error_message = "Email is required"
          return null
        }
        // The client SDK will parse the code from the link for you.
        return firebase.auth().signInWithEmailLink( email, window.location.href )
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
            is_expired = true
            error_message = "Your verification link has already been used."
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
            return null
          })
      })
      .catch( ( error ) => {
        console.info('error setting persistence', error)
      })
      .then( () => {
        is_checking = false
      })
  }
</script>

{#if is_checking}
Checking verification
{:else if error_message}
  { error_message }
{:else}
Success
{/if}
