<script lang="ts">
  import Header from '$lib/Header/index.svelte';
  import '../app.css';
</script>

<Header />

<main class="page text-center my-0 mx-auto p-4">
  <slot />
</main>

<style type="text/scss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @media (min-width: 640px) {
    .page {
      max-width: none;
    }
  }
</style>
