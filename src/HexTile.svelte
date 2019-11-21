<script>
  export let is_selected
  export let tile
</script>

<div class="hex" class:hex--selected={ is_selected }
  on:selectstart|preventDefault
  on:mousedown|preventDefault
  on:mouseover|preventDefault
  on:selectstart|preventDefault
>
  <div class="hex__body">
    <div class="hex__text">{ tile }</div>
  </div>
</div>

<style type="text/scss">
$hex__color: yellow;
$hex__color--selected: red;
$hex__size: 60px;

.hex {
  margin-bottom: 4px;
  clip-path: polygon(93px 0%, 100% 50%, 93px 100%, 29px 100%, 0% 50%, 29px 0%);
  user-select: none;

  &::before {
    content: " ";
    float: left;
    width: 0;
    border-right: 30px solid $hex__color;
    border-top: 52px solid transparent;
    border-bottom: 52px solid transparent;
  }

  &::after {
    content: " ";
    float: left;
    width: 0;
    border-left: 30px solid $hex__color;
    border-top: 52px solid transparent;
    border-bottom: 52px solid transparent;
  }

  &__body {
    float: left;
    width: $hex__size;
    height: 104px;
    background: $hex__color;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--selected {
    &::before {
      border-right-color: $hex__color--selected;
    }

    &::after {
      border-left-color: $hex__color--selected;
    }
  }

  &--selected &__body {
    background: $hex__color--selected;
  }
}
</style>
